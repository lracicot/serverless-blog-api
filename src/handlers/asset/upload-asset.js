const AWS = require('aws-sdk');
const logger = require('../../logger');

const tableName = process.env.ASSET_TABLE;
const uploadBucket = process.env.UPLOAD_BUCKET;

module.exports = async (event) => {
  if (event.httpMethod !== 'POST') {
    throw new Error(`uploadAsset only accepts POST method, you tried: ${event.httpMethod} method.`);
  }

  logger.info('received:', event);

  const { uuid } = event.pathParameters;
  const body = JSON.parse(event.body);

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
    // @todo: Upload to S3
    const s3 = new AWS.S3();
    await s3.putObject({
      ACL: 'public-read',
      Body: event.content,
      Bucket: uploadBucket,
      Key: uuid,
    }).promise();

    body.updated_at = body.updated_at || (new Date()).toISOString();
    data.status = 'uploaded';
    data.public_url = '';

    // Creates a new item, or replaces an old item with a new item
    await dbTable.put({
      TableName: tableName,
      Item: body,
    }).promise();

    response = {
      statusCode: 200,
      body: JSON.stringify(body),
    };
  }

  logger.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${JSON.stringify(response.body)}`);
  return response;
};
