const DynamoDbClient = require('../../dynamodb/client');

const tableName = process.env.POST_TABLE;

module.exports = async (event) => {
  const { uuid } = event.pathParameters;
  const table = new DynamoDbClient(tableName);

  const item = await table.findOneByKey('uuid', uuid);

  return {
    statusCode: item ? 200 : 404,
    body: item ? JSON.stringify(item) : undefined,
  };
};
