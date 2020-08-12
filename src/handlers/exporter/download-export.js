const AWS = require('aws-sdk');

module.exports = table => async (event) => {
  const backupBucket = process.env.BACKUP_BUCKET;
  const { uuid } = event.pathParameters;
  const item = await table.findOneByKey('uuid', uuid);
  console.log(item);//eslint-disable-line

  const s3 = new AWS.S3();
  return {
    statusCode: 200,
    body: (await s3.getObject({
      Bucket: backupBucket,
      Key: item.file,
    }).promise()).Body,
    headers: {
      'Content-Type': 'application/tar+gzip',
      'Content-Disposition': `attachment; filename="${item.file}"`,
    },
  };
};
