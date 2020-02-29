const DynamoDbClient = require('../../dynamodb/client');

const tableName = process.env.ASSET_TABLE;

module.exports = async () => {
  const table = new DynamoDbClient(tableName);

  return {
    statusCode: 200,
    body: JSON.stringify(await table.findAll()),
  };
};
