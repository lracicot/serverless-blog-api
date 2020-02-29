const AWS = require('aws-sdk');

const tableName = process.env.POST_TABLE;

module.exports = async (event) => {
  const { uuid } = event.pathParameters;
  const body = JSON.parse(event.body);

  // Get existing post if any
  const dbTable = new AWS.DynamoDB.DocumentClient();
  const data = await dbTable.get({
    TableName: tableName,
    Key: { uuid },
  }).promise();

  let response = {
    statusCode: 404,
  };

  if (data.Item) {
    body.uuid = uuid;
    body.updated_at = body.updated_at || (new Date()).toISOString();
    body.created_at = body.created_at || data.Item.created_at;
    body.status = body.status || data.Item.status;

    // Creates a new item, or replaces an old item with a new item
    await dbTable.put({
      TableName: tableName,
      Item: body,
    }).promise();

    response = {
      statusCode: 200,
      body: JSON.stringify(body),
    };
  }

  return response;
};
