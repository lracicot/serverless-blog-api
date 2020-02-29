const AWS = require('aws-sdk');

const tableName = process.env.ASSET_TABLE;

module.exports = async (event) => {
  const { uuid } = event.pathParameters;

  const dbTable = new AWS.DynamoDB.DocumentClient();
  const data = await dbTable.get({
    TableName: tableName,
    Key: { uuid },
  }).promise();

  const item = data.Item;

  return {
    statusCode: item ? 200 : 404,
    body: item ? JSON.stringify(item) : undefined,
  };
};
