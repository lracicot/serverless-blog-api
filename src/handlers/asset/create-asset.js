const AWS = require('aws-sdk');
const uuid = require('uuid/v4');

const tableName = process.env.ASSET_TABLE;

module.exports = async (event) => {
  // Get slug and name from the body of the request
  const body = JSON.parse(event.body);

  body.uuid = uuid();
  body.created_at = (new Date()).toISOString();
  body.updated_at = (new Date()).toISOString();
  body.status = 'created';

  const dbTable = new AWS.DynamoDB.DocumentClient();
  await dbTable.put({
    TableName: tableName,
    Item: body,
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(body),
  };
};
