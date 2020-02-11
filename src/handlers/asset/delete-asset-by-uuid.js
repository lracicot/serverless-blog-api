const AWS = require('aws-sdk');

const tableName = process.env.ASSET_TABLE;

module.exports = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    throw new Error(`getAsset only accept DELETE method, you tried: ${event.httpMethod}`);
  }
  console.info('received:', event);

  const { uuid } = event.pathParameters;
  let response;

  // Delete the item from the table
  const dbTable = new AWS.dynamodb.DocumentClient();
  const data = await dbTable.get({
    TableName: tableName,
    Key: { uuid },
  }).promise();

  if (!data.Item) {
    response = {
      statusCode: 404,
    };
  } else {
    await dbTable.delete({
      TableName: tableName,
      Key: { uuid },
    }).promise();

    response = {
      statusCode: 200,
    };
  }

  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
};
