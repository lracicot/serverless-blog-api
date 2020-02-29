const uuid = require('uuid/v4');
const DynamoDbClient = require('../../dynamodb/client');

const tableName = process.env.ASSET_TABLE;

module.exports = async (event) => {
  const body = JSON.parse(event.body);
  const table = new DynamoDbClient(tableName);

  body.uuid = uuid();
  body.created_at = (new Date()).toISOString();
  body.updated_at = (new Date()).toISOString();
  body.status = 'created';

  await table.put(body);

  return {
    statusCode: 201,
    body: JSON.stringify(body),
  };
};
