const AWS = require('aws-sdk');

const tableName = process.env.ASSET_TABLE;

module.exports = async () => {
  // get all items from the table
  const dbTable = new AWS.DynamoDB.DocumentClient();
  const data = await dbTable.scan({
    TableName: tableName,
  }).promise();

  const items = data.Items;

  return {
    statusCode: 200,
    body: JSON.stringify(items),
  };
};
