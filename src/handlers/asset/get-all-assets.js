// Get the DynamoDB table name from environment variables
const tableName = process.env.ASSET_TABLE;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');

const dbTable = new dynamodb.DocumentClient();

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
module.exports = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getAllAssets only accept GET method, you tried: ${event.httpMethod}`);
  }
  // All log statements are written to CloudWatch
  console.info('received:', event);

  // get all items from the table
  console.log(`Table name: ${tableName}`);
  const data = await dbTable.scan({
    TableName: tableName,
  }).promise();

  const items = data.Items;

  const response = {
    statusCode: 200,
    body: JSON.stringify(items),
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
};
