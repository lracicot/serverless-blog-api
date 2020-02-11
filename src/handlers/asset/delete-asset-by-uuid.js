const tableName = process.env.ASSET_TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');

const dbTable = new dynamodb.DocumentClient();

module.exports = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    throw new Error(`getAsset only accept DELETE method, you tried: ${event.httpMethod}`);
  }
  // All log statements are written to CloudWatch
  console.info('received:', event);

  // Get uuid from pathParameters from APIGateway because of `/{uuid}` at template.yml
  const { uuid } = event.pathParameters;
  let response;

  // Delete the item from the table
  try {
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
  } catch (err) {
    console.log(err);
    response = {
      statusCode: 500,
    };
  }

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
};
