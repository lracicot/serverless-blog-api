const AWS = require('aws-sdk');

const tableName = process.env.POST_TABLE;

module.exports = async (event) => {
  const { limit } = event.queryStringParameters || { limit: 100 };

  const dbTable = new AWS.DynamoDB.DocumentClient();
  const data = await dbTable.scan({
    TableName: tableName,
    Limit: limit,
  }).promise();

  const items = data.Items;

  const response = {
    statusCode: 200,
    body: JSON.stringify(items),
  };

  return response;
};
