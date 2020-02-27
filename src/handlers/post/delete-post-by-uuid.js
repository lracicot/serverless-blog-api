const AWS = require('aws-sdk');

const tableName = process.env.POST_TABLE;

module.exports = async (event) => {
  // Get uuid from pathParameters from APIGateway because of `/{uuid}` at template.yml
  const { uuid } = event.pathParameters;
  let response;

  // Delete the item from the table
  const dbTable = new AWS.DynamoDB.DocumentClient();
  const data = await dbTable.get({
    TableName: tableName,
    Key: { uuid },
  }).promise();

  if (!data.Item) {
    response = {
      statusCode: 404,
    };
  } else {
    await dbTable.delete({
      TableName: tableName,
      Key: { uuid },
    }).promise();

    response = {
      statusCode: 200,
      body: JSON.stringify({ uuid }),
    };
  }

  return response;
};
