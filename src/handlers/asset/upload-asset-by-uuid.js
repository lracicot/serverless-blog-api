const AWS = require('aws-sdk');
const mime = require('mime-type/with-db');
const logger = require('../../logger');

const tableName = process.env.ASSET_TABLE;
const uploadBucket = process.env.UPLOAD_BUCKET;
const assetsUrl = process.env.ASSETS_URL;

module.exports = async (event) => {
  if (event.httpMethod !== 'POST') {
    throw new Error(`uploadAsset only accepts POST method, you tried: ${event.httpMethod} method.`);
  }

  logger.info('received:', event);

  const { uuid } = event.pathParameters;
  const fileExt = mime.extension(event.headers['content-type']);

  // Get existing post if any
  const dbTable = new AWS.DynamoDB.DocumentClient();
  const data = await dbTable.get({
    TableName: tableName,
    Key: { uuid },
  }).promise();

  let response = {
    statusCode: 404,
  };

  if (data.Item) {
    const s3 = new AWS.S3();
    await s3.putObject({
      ACL: 'public-read',
      Body: Buffer.from(event.body, 'base64'),
      Bucket: uploadBucket,
      Key: `${uuid}.${fileExt}`,
    }).promise();

    data.Item.updated_at = (new Date()).toISOString();
    data.Item.status = 'uploaded';
    data.Item.public_url = `${assetsUrl}/${uuid}.${fileExt}`;

    // Creates a new item, or replaces an old item with a new item
    await dbTable.put({
      TableName: tableName,
      Item: data.Item,
    }).promise();

    response = {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
  }

  logger.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${JSON.stringify(response.body)}`);
  return response;
};