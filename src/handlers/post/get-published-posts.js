const DynamoDbClient = require('../../dynamodb/client');

const tableName = process.env.POST_TABLE;

module.exports = async () => {
  const table = new DynamoDbClient(tableName);
  const items = await table.findBy('status', 'published');

  return {
    statusCode: 200,
    body: JSON.stringify(items),
  };
};
