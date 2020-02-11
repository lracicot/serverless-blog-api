const AWS = require('aws-sdk');
const logger = require('../../logger');

const tableName = process.env.POST_TABLE;

module.exports = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getAllPosts only accept GET method, you tried: ${event.httpMethod}`);
  }

  logger.info('received:', event);

  const dbTable = new AWS.DynamoDB.DocumentClient();
  const data = await dbTable.scan({
    TableName: tableName,
  }).promise();

  const items = data.Items;

  const response = {
    statusCode: 200,
    body: JSON.stringify(items),
  };

  logger.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
};
