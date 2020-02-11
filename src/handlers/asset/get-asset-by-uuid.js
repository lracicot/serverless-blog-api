const AWS = require('aws-sdk');
const logger = require('../../logger');

const tableName = process.env.ASSET_TABLE;

module.exports = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getAssetsByUuid only accept GET method, you tried: ${event.httpMethod}`);
  }

  logger.info('received:', event);
  const { uuid } = event.pathParameters;

  const dbTable = new AWS.DynamoDB.DocumentClient();
  const data = await dbTable.get({
    TableName: tableName,
    Key: { uuid },
  }).promise();

  const item = data.Item;

  const response = {
    statusCode: item ? 200 : 404,
    body: item ? JSON.stringify(item) : undefined,
  };

  logger.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
};
