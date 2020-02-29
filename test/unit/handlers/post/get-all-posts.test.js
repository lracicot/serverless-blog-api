/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const AWS = require('aws-sdk-mock');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

const lambda = require('../../../../src/handlers/post/get-all-posts');
const getAllPostsEvent = require('../../../events/post/event-get-all-posts.json');
const getAllPostsEventLimit = require('../../../events/post/event-get-all-posts-limit.json');
const fakePosts = require('../../../data/posts');

describe('Test getAllPosts handler', () => {
  let scanTableSpy;

  before(() => {
    scanTableSpy = sinon.stub().returns({ Items: fakePosts });
    AWS.mock('DynamoDB.DocumentClient', 'scan', async data => scanTableSpy(data));
  });

  after(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });

  it('should return posts', async () => {
    const result = await lambda(getAllPostsEvent);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(fakePosts),
    };

    expect(result.statusCode).to.eql(expectedResult.statusCode);
    expect(result.body).to.eql(expectedResult.body);
  });

  it('should return a limited number of post', async () => {
    const result = await lambda(getAllPostsEventLimit);

    expect(result.statusCode).to.eql(200);
    expect(scanTableSpy).to.have.been.calledWithMatch({
      Limit: '2',
    });
  });
});
