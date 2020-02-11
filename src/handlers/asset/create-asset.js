const dynamodb = require('aws-sdk/clients/dynamodb');
const uuid = require('uuid/v4');

const dbTable = new dynamodb.DocumentClient();

const tableName = process.env.ASSET_TABLE;

module.exports = async (event) => {
  if (event.httpMethod !== 'POST') {
    throw new Error(`createAsset only accepts POST method, you tried: ${event.httpMethod} method.`);
  }
  // All log statements are written to CloudWatch
  console.info('received:', event);

  // Get slug and name from the body of the request
  const body = JSON.parse(event.body);

  body.uuid = uuid();
  body.created_at = (new Date()).toISOString();
  body.updated_at = (new Date()).toISOString();
  body.status = 'created';

  // Creates a new item, or replaces an old item with a new item
  await dbTable.put({
    TableName: tableName,
    Item: body,
  }).promise();

  const response = {
    statusCode: 201,
    body: JSON.stringify(body),
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${JSON.stringify(response.body)}`);
  return response;
};
