const DynamoDbClient = require('../../dynamodb/client');

const tableName = process.env.POST_TABLE;

module.exports = async (event) => {
  const { uuid } = event.pathParameters;
  const table = new DynamoDbClient(tableName);

  const item = await table.findOneByKey('uuid', uuid);

  if (item) {
    item.status = 'archived';
    await table.put(item);

    return {
      statusCode: 200,
      body: JSON.stringify(item),
    };
  }

  return {
    statusCode: 404,
  };
};
