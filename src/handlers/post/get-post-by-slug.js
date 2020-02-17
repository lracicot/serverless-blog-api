const AWS = require('aws-sdk');
const logger = require('../../logger');

const tableName = process.env.POST_TABLE;

module.exports = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }

  logger.info('received:', event);
  const { slug } = event.pathParameters;

  const dbTable = new AWS.DynamoDB.DocumentClient();
  const data = await dbTable.scan({
    TableName: tableName,
    ExpressionAttributeValues: {
      ':s': slug,
    },
    ExpressionAttributeNames: {
      '#s': 'slug',
    },
    FilterExpression: '#s = :s',
  }).promise();

  const item = data.Items[0];

  const response = {
    statusCode: item ? 200 : 404,
    body: item ? JSON.stringify(item) : undefined,
  };

  logger.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return {
    ...response,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
};
