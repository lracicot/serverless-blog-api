// const AWS = require('aws-sdk');
//
// const uploadBucket = process.env.UPLOAD_BUCKET;
// const backupBucket = process.env.BACKUP_BUCKET;

module.exports = (exporter, exportTable, postTable, assetTable) => async () => {
  // const filename = `${(new Date()).toISOString()}.tar`;
  // const s3 = new AWS.S3();
  //
  // exporter.launchExport(
  //   Promise.all([
  //     exporter.getPosts(() => postTable.findAll()),
  //     exporter.getAssets(
  //       () => assetTable.findAll(),
  //       exporter.createAssetFileGetter(s3, uploadBucket),
  //     ),
  //   ]),
  //   filename,
  //   exporter.createStreamUploader(s3, backupBucket),
  // ).then(() => {
  //   exportMeta.status = 'completed';
  //   exportMeta.file = filename;
  // }).catch((err) => {
  //   exportMeta.status = 'error';
  //   exportMeta.error = err;
  // }).finally(() => {
  //   exportMeta.updated_at = (new Date()).toISOString();
  //   exportTable.put(exportMeta);
  // });
  //
  // return {
  //   statusCode: 201,
  //   body: JSON.stringify(exportMeta),
  // };
};
