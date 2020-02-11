const AWS = require('aws-sdk');

const tableName = process.env.POST_TABLE;

module.exports = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getAllPosts only accept GET method, you tried: ${event.httpMethod}`);
  }

  console.info('received:', event);

  const dbTable = new AWS.DynamoDB.DocumentClient();
  const data = await dbTable.scan({
    TableName: tableName,
    ExpressionAttributeValues: {
      ':s': 'published',
    },
    ExpressionAttributeNames: {
      '#s': 'status',
    },
    FilterExpression: '#s = :s',
  }).promise();

  const items = data.Items;

  const response = {
    statusCode: 200,
    body: JSON.stringify(items),
  };

  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
};
