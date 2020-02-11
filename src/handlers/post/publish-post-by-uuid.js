const AWS = require('aws-sdk');
const logger = require('../../logger');

const tableName = process.env.POST_TABLE;

module.exports = async (event) => {
  if (event.httpMethod !== 'POST') {
    throw new Error(`upsertPost only accepts POST method, you tried: ${event.httpMethod} method.`);
  }
  logger.info('received:', event);

  const { uuid } = event.pathParameters;

  // Get existing post if any
  const dbTable = new AWS.DynamoDB.DocumentClient();
  const data = await dbTable.get({
    TableName: tableName,
    Key: { uuid },
  }).promise();

  let response = {
    statusCode: 404,
  };

  if (data.Item) {
    const item = {
      ...(data.Item),
      status: 'published',
    };

    // Creates a new item, or replaces an old item with a new item
    await dbTable.put({
      TableName: tableName,
      Item: item,
    }).promise();

    response = {
      statusCode: 200,
      body: JSON.stringify(item),
    };
  }

  logger.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${JSON.stringify(response.body)}`);
  return response;
};
