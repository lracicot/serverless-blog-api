const AWS = require('aws-sdk');

class DynamoDbClient {
  constructor(tableName) {
    this.tableName = tableName;
    this.dbTable = new AWS.DynamoDB.DocumentClient();
  }

  findOneByKey(key, value) {
    const query = {};
    query[key] = value;

    return this.dbTable.get({
      TableName: this.tableName,
      Key: query,
    }).promise().then(data => data.Item);
  }

  findAll(limit) {
    return this.dbTable.scan({
      TableName: this.tableName,
      Limit: limit,
    }).promise().then(data => data.Items);
  }

  findBy(key, value) {
    return this.dbTable.scan({
      TableName: this.tableName,
      ExpressionAttributeValues: {
        ':s': value,
      },
      ExpressionAttributeNames: {
        '#s': key,
      },
      FilterExpression: '#s = :s',
    }).promise().then(data => data.Items);
  }

  put(item) {
    return this.dbTable.put({
      TableName: this.tableName,
      Item: item,
    }).promise();
  }

  deleteByKey(key, value) {
    const query = {};
    query[key] = value;

    return this.dbTable.delete({
      TableName: this.tableName,
      Key: query,
    }).promise();
  }
}

module.exports = DynamoDbClient;
