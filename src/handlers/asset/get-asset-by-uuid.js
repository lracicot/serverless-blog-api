const dynamodb = require('aws-sdk/clients/dynamodb');

const dbTable = new dynamodb.DocumentClient();

const tableName = process.env.ASSET_TABLE;

module.exports = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getAssetsByUuid only accept GET method, you tried: ${event.httpMethod}`);
  }

  console.info('received:', event);
  const { uuid } = event.pathParameters;


  const data = await dbTable.get({
    TableName: tableName,
    Key: { uuid },
  }).promise();

  const item = data.Item;

  const response = {
    statusCode: item ? 200 : 404,
    body: JSON.stringify(item),
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
};
