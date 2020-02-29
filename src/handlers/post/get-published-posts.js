const AWS = require('aws-sdk');

const tableName = process.env.POST_TABLE;

module.exports = async () => {
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

  return {
    statusCode: 200,
    body: JSON.stringify(items),
  };
};
