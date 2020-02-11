// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');

const dbTable = new dynamodb.DocumentClient();

// Get the DynamoDB table name from environment variables
const tableName = process.env.ASSET_TABLE;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
module.exports = async (event) => {
  if (event.httpMethod !== 'PUT') {
    throw new Error(`updateAssetByUuid only accepts PUT method, you tried: ${event.httpMethod} method.`);
  }
  // All log statements are written to CloudWatch
  console.info('received:', event);

  // Get uuid and name from the body of the request
  const { uuid } = event.pathParameters;
  const body = JSON.parse(event.body);

  // Get existing post if any
  const data = await dbTable.get({
    TableName: tableName,
    Key: { uuid },
  }).promise();

  let response = {
    statusCode: 404,
  };

  if (data.Item) {
    body.uuid = uuid;
    body.updated_at = body.updated_at || (new Date()).toISOString();
    body.created_at = body.created_at || data.Item.created_at;

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

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${JSON.stringify(response.body)}`);
  return response;
};
