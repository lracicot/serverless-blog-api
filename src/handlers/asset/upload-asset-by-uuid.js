const AWS = require('aws-sdk');
const mime = require('mime-type/with-db');
const DynamoDbClient = require('../../dynamodb/client');

const assetsUrl = process.env.ASSETS_URL;
const tableName = process.env.ASSET_TABLE;

module.exports = async (event) => {
  const uploadBucket = process.env.UPLOAD_BUCKET;
  const { uuid } = event.pathParameters;
  const fileExt = mime.extension(event.headers['content-type']);

  const table = new DynamoDbClient(tableName);
  const item = await table.findOneByKey('uuid', uuid);

  if (item) {
    const s3 = new AWS.S3();
    await s3.putObject({
      ACL: 'public-read',
      Body: Buffer.from(event.body, 'base64'),
      Bucket: uploadBucket,
      Key: `${uuid}.${fileExt}`,
    }).promise();

    item.updated_at = (new Date()).toISOString();
    item.status = 'uploaded';
    item.public_url = `${assetsUrl}/${uuid}.${fileExt}`;

    await table.put(item);

    return {
      statusCode: 200,
      body: JSON.stringify(item),
    };
  }

  return {
    statusCode: 404,
  };
};
