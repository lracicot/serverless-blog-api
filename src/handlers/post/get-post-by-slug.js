const AWS = require('aws-sdk');

const tableName = process.env.POST_TABLE;

module.exports = async (event) => {
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

  return {
    statusCode: item ? 200 : 404,
    body: item ? JSON.stringify(item) : undefined,
  };
};
