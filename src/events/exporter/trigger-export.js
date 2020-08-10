const AWS = require('aws-sdk');

const uploadBucket = process.env.UPLOAD_BUCKET;
const backupBucket = process.env.BACKUP_BUCKET;

module.exports = (exporter, exportTable, postTable, assetTable) => async (event) => {
  const workers = [];
  for (const record of event.Records) {
    if (record.eventName === 'INSERT' && record.eventSource === 'aws:dynamodb') {
      const exportMeta = exportTable.findOneByKey(record.dynamodb.Keys.uuid.S);

      const filename = `${(new Date()).toISOString()}.tar`;
      const s3 = new AWS.S3();

      workers.push(exporter.launchExport(
        Promise.all([
          exporter.getPosts(() => postTable.findAll()),
          exporter.getAssets(
            () => assetTable.findAll(),
            exporter.createAssetFileGetter(s3, uploadBucket),
          ),
        ]),
        filename,
        exporter.createStreamUploader(s3, backupBucket),
      ).then(() => {
        exportMeta.status = 'completed';
        exportMeta.file = filename;
      }).catch((err) => {
        exportMeta.status = 'error';
        exportMeta.error = err;
      }).finally(() => {
        exportMeta.updated_at = (new Date()).toISOString();
        exportTable.put(exportMeta);
      }));
    }
  }

  await Promise.all(workers);
};
