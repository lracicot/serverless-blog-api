/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

const AWSMock = require('aws-sdk-mock');
const chai = require('chai');
const sinon = require('sinon');
const fs = require('fs');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const triggerExportEvent = require('../events/exporter/event-event-trigger-export.json');
const fakePosts = require('../data/posts');

const fakeAssetPath = '../data/asset-bucket/test.png';

AWSMock.mock('DynamoDB.DocumentClient', 'scan', async () => ({ Items: fakePosts }));
AWSMock.mock('DynamoDB.DocumentClient', 'put', async () => {});
AWSMock.mock('DynamoDB.DocumentClient', 'get', async () => ({ Item: fakePosts[0] }));

process.env.POST_TABLE = 'posts';
process.env.ASSET_TABLE = 'assets';
process.env.EXPORT_TABLE = 'exports';

const controller = require('../../src/events');

describe('Functional test export', () => {
  let scanMock;
  let putMock;
  let getMock;

  before(() => {
    scanMock = sinon.stub();

    // When scanning post table, returns a promise of DynamoDB results for posts
    scanMock.withArgs({
      TableName: process.env.POST_TABLE,
      Limit: 1000,
    }).returns({ promise: () => new Promise(resolve => resolve({ Items: fakePosts })) });

    // When scanning asset table, returns a promise of DynamoDB results for assets
    scanMock.withArgs({
      TableName: process.env.ASSET_TABLE,
      Limit: 1000,
    }).returns({ promise: () => new Promise(resolve => resolve({ Items: fakeAssets })) });

    getMock = sinon.stub().returns({
      promise: () => new Promise(resolve => resolve({ Item: fakePosts[0] })),
    });
    putMock = sinon.stub();
    uploadSpy = sinon.spy();

    // Assign mock functions
    AWSMock.mock('DynamoDB.DocumentClient', 'get', getMock);
    AWSMock.mock('DynamoDB.DocumentClient', 'scan', scanMock);
    AWSMock.mock('DynamoDB.DocumentClient', 'put', putMock);
    AWSMock.mock('S3', 'getObject', () => ({
      promise: () => new Promise(resolve => resolve({ Body: fs.readFileSync(fakeAssetPath) })),
    }));
    AWSMock.mock('S3', 'upload', uploadSpy);
  });

  after(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
    AWSMock.restore('S3');
  });

  it('should upload the export to S3', async () => {
    await controller.exporter.triggerExport(triggerExportEvent);
  });
});
