const AWS = require('aws-sdk');
const logger = require('../../logger');

const tableName = process.env.POST_TABLE;

module.exports = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    throw new Error(`getMethod only accept DELETE method, you tried: ${event.httpMethod}`);
  }
  // All log statements are written to CloudWatch
  logger.info('received:', event);

  // Get uuid from pathParameters from APIGateway because of `/{uuid}` at template.yml
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
  return response;
};
