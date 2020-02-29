const DynamoDbClient = require('../../dynamodb/client');

const tableName = process.env.POST_TABLE;

module.exports = async (event) => {
  const { limit } = event.queryStringParameters || { limit: 100 };

  const table = new DynamoDbClient(tableName);

  return {
    statusCode: 200,
    body: JSON.stringify(await table.findAll(limit)),
  };
};
