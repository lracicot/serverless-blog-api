const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const logger = require('../../logger');

const tableName = process.env.POST_TABLE;

module.exports = async (event) => {
  if (event.httpMethod !== 'POST') {
    throw new Error(`createPost only accepts POST method, you tried: ${event.httpMethod} method.`);
  }
  // All log statements are written to CloudWatch
  logger.info('received:', event);

  // Get slug and name from the body of the request
  const body = JSON.parse(event.body);

  // Get existing post if any
  const dbTable = new AWS.DynamoDB.DocumentClient();
  const data = await dbTable.scan({
    TableName: tableName,
    ExpressionAttributeValues: {
      ':s': body.slug,
    },
    ExpressionAttributeNames: {
      '#s': 'slug',
    },
    FilterExpression: '#s = :s',
  }).promise();

  let response;

  if (data.Items.length) {
    response = {
      statusCode: 400,
      body: JSON.stringify({ error: 'Slug already exists' }),
    };
  } else {
    body.uuid = uuid();
    body.created_at = (new Date()).toISOString();
    body.updated_at = (new Date()).toISOString();
    body.status = 'draft';

    await dbTable.put({
      TableName: tableName,
      Item: body,
    }).promise();

    response = {
      statusCode: 201,
      body: JSON.stringify(body),
    };
  }

  logger.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${JSON.stringify(response.body)}`);
  return response;
};
