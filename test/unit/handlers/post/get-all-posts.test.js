/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const AWS = require('aws-sdk-mock');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { expect } = chai;

const lambda = require('../../../../src/handlers/post/get-all-posts');
const getAllPostsEvent = require('../../../events/post/event-get-all-posts.json');
const fakePosts = require('../../../data/posts');

describe('Test getAllPosts handler', () => {
  before(() => {
    AWS.mock('DynamoDB.DocumentClient', 'scan', async () => ({ Items: fakePosts }));
  });

  after(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });

  it('throws error if not GET', async () => {
    await expect(lambda({ httpMethod: 'POST' })).to.be.rejectedWith(Error);
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
});
