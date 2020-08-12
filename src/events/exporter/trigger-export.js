const AWS = require('aws-sdk');

const uploadBucket = process.env.UPLOAD_BUCKET;
const backupBucket = process.env.BACKUP_BUCKET;

module.exports = (exporter, exportTable, postTable, assetTable) => async (event) => {
  const s3 = new AWS.S3();
  const workers = event.Records
    .filter(record => record.eventName === 'INSERT' && record.eventSource === 'aws:dynamodb')
    .map(record => exportTable.findOneByKey('uuid', record.dynamodb.Keys.uuid.S).then((exportMeta) => {
      const filename = `${(new Date()).toISOString()}-${exportMeta.uuid}.tar`;

      return exporter.launchExport(
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
        exportTable.put({
          ...exportMeta,
          status: 'completed',
          file: filename,
          updated_at: (new Date()).toISOString(),
        });
      }).catch((err) => {
        exportTable.put({
          ...exportMeta,
          status: 'error',
          error: err,
          updated_at: (new Date()).toISOString(),
        });
      });
    }));


  await Promise.all(workers);
};
