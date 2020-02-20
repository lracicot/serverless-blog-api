const AWS = require('aws-sdk');
const logger = require('../../logger');

const tableName = process.env.ASSET_TABLE;

module.exports = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    throw new Error(`deleteAssetByUuid only accept DELETE method, you tried: ${event.httpMethod}`);
  }
  logger.info('received:', event);

  const { uuid } = event.pathParameters;
  let response;

  // Delete the item from the table
  const dbTable = new AWS.DynamoDB.DocumentClient();
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

  logger.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return {
    ...response,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
};
