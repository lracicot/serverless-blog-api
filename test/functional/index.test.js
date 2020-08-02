/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

const AWSMock = require('aws-sdk-mock');
const chai = require('chai');
const fs = require('fs');

const { expect } = chai;
const getAllPostsEvent = require('../events/post/event-get-all-posts.json');
const triggerExportEvent = require('../events/exporter/event-trigger-export.json');
const fakePosts = require('../data/posts');

const fakeAssetPath = '../data/asset-bucket/test.png';

AWSMock.mock('DynamoDB.DocumentClient', 'scan', async () => ({ Items: fakePosts }));

process.env.POST_TABLE = 'posts';
process.env.ASSET_TABLE = 'assets';

const controller = require('../../src/index');

describe('Functional test posts', () => {
  before(() => {
    AWSMock.mock('DynamoDB.DocumentClient', 'scan', async () => ({ Items: fakePosts }));
  });

  after(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('should return posts', async () => {
    const result = await controller.post.getAllPosts(getAllPostsEvent);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(fakePosts),
    };

    expect(result.statusCode).to.eql(expectedResult.statusCode);
    expect(result.body).to.eql(expectedResult.body);
  });
});

describe('Functional test export', () => {
  let scanMock;
  let getObjectMock;

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

    // S3.getObject is used to retrieve an asset.
    getObjectMock = sinon.stub().returns({
      promise: () => new Promise(resolve => resolve({ Body: fs.readFileSync(fakeAssetPath) })),
    });


    // uploadSpy = sinon.stub().returns(new Promise(resolve => resolve()));

    // Assign mock functions
    AWSMock.mock('DynamoDB.DocumentClient', 'scan', scanMock);
    AWSMock.mock('S3', 'getObject', getObjectMock);
    // AWSMock.mock('S3', 'upload', async data => uploadSpy(data));
  });

  after(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
    AWSMock.restore('S3');
  });

  it('should return upload export file', async () => {
    const result = await controller.export.triggerExport(triggerExportEvent);

    const expectedResult = {
      statusCode: 201,
      body: JSON.stringify({ status: 'pending' }),
    };

    expect(result.statusCode).to.eql(expectedResult.statusCode);
    expect(JSON.parse(result.body).status).to.eql(JSON.parse(expectedResult.body).status);
  });
});
