const AWS = require('aws-sdk');

const tableName = process.env.ASSET_TABLE;

module.exports = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getAllAssets only accept GET method, you tried: ${event.httpMethod}`);
  }

  console.info('received:', event);

  // get all items from the table
  const dbTable = new AWS.dynamodb.DocumentClient();
  const data = await dbTable.scan({
    TableName: tableName,
  }).promise();

  const items = data.Items;

  const response = {
    statusCode: 200,
    body: JSON.stringify(items),
  };

  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
};
