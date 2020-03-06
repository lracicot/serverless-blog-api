/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const AWS = require('aws-sdk-mock');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

const DynamoDbClient = require('../../src/dynamodb');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

describe('Test dynamodb client', () => {
  let dbClient;
  let getTableSpy;
  let putTableSpy;
  let deleteTableSpy;
  let scanTableSpy;

  beforeEach(() => {
    getTableSpy = sinon.stub().returns(new Promise(resolve => resolve({ Item: {} })));
    putTableSpy = sinon.stub().returns(new Promise(resolve => resolve()));
    deleteTableSpy = sinon.stub().returns(new Promise(resolve => resolve()));
    scanTableSpy = sinon.stub().returns(new Promise(resolve => resolve({ Items: [] })));
    AWS.mock('DynamoDB.DocumentClient', 'get', async data => getTableSpy(data));
    AWS.mock('DynamoDB.DocumentClient', 'put', async data => putTableSpy(data));
    AWS.mock('DynamoDB.DocumentClient', 'delete', async data => deleteTableSpy(data));
    AWS.mock('DynamoDB.DocumentClient', 'scan', async data => scanTableSpy(data));
    dbClient = new DynamoDbClient('tableName');
  });

  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });

  describe('findOneByKey', () => {
    it('should fetch an item', async () => {
      await dbClient.findOneByKey('keyName', 'keyValue');

      expect(getTableSpy).to.have.been.calledWithMatch({
        Key: {
          keyName: 'keyValue',
        },
      });
    });
  });

  describe('findAll', () => {
    it('should fetch items', async () => {
      await dbClient.findAll();

      expect(scanTableSpy).to.have.been.called;
    });

    it('should fetch a limited number of items', async () => {
      await dbClient.findAll(42);

      expect(scanTableSpy).to.have.been.calledWithMatch({
        Limit: 42,
      });
    });
  });

  describe('findBy', () => {
    it('should fetch items', async () => {
      await dbClient.findBy('keyName', 'keyValue');

      expect(scanTableSpy).to.have.been.calledWithMatch({
        ExpressionAttributeValues: {
          ':s': 'keyValue',
        },
        ExpressionAttributeNames: {
          '#s': 'keyName',
        },
        FilterExpression: '#s = :s',
      });
    });
  });

  describe('put', () => {
    it('should update an item', async () => {
      const item = { foo: 'bar' };
      await dbClient.put(item);

      expect(putTableSpy).to.have.been.calledWithMatch({
        Item: item,
      });
    });
  });

  describe('deleteByKey', () => {
    it('should delete an item', async () => {
      await dbClient.deleteByKey('keyName', 'keyValue');

      expect(deleteTableSpy).to.have.been.calledWithMatch({
        Key: {
          keyName: 'keyValue',
        },
      });
    });
  });
});
