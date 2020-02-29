const DynamoDbClient = require('../../dynamodb/client');

const tableName = process.env.POST_TABLE;

module.exports = async (event) => {
  const { slug } = event.pathParameters;
  const table = new DynamoDbClient(tableName);

  const items = await table.findBy('slug', slug);

  return {
    statusCode: items.length ? 200 : 404,
    body: items[0] ? JSON.stringify(items[0]) : undefined,
  };
};
