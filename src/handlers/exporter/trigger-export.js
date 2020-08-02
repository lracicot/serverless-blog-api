const AWS = require('aws-sdk');
const uuid = require('uuid/v4');

const uploadBucket = process.env.UPLOAD_BUCKET;
const backupBucket = process.env.BACKUP_BUCKET;

module.exports = (exporter, exportTable, postTable, assetTable) => async () => {
  const exportMeta = {
    uuid: uuid(),
    created_at: (new Date()).toISOString(),
    updated_at: (new Date()).toISOString(),
    status: 'pending',
  };

  await exportTable.put(exportMeta);

  const filename = `${(new Date()).toISOString()}.tar`;
  const s3 = new AWS.S3();

  exporter.launchExport(
    exporter.createStreamUploader(s3, backupBucket),
    Promise.all([
      exporter.getPosts(postTable.findAll),
      exporter.getAssets(assetTable.findAll, exporter.createAssetFileGetter(s3, uploadBucket)),
    ]),
    filename,
  ).then(() => {
    exportMeta.updated_at = (new Date()).toISOString();
    exportMeta.status = 'completed';
    exportMeta.file = filename;
    exportTable.put(exportMeta);
  }).catch((err) => {
    exportMeta.updated_at = (new Date()).toISOString();
    exportMeta.status = 'error';
    exportMeta.error = err;
    exportTable.put(exportMeta);
  });

  return {
    statusCode: 201,
    body: JSON.stringify(exportMeta),
  };
};
