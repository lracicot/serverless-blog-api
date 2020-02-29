/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const AWS = require('aws-sdk-mock');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { expect } = chai;

const lambda = require('../../../../src/handlers/post/get-published-posts');
const getAllPostsEvent = require('../../../events/post/event-get-published-posts.json');
const fakePosts = require('../../../data/posts');

const publishedPosts = fakePosts.filter(p => p.status === 'published');

describe('Test getPublishedPosts handler', () => {
  before(() => {
    AWS.mock('DynamoDB.DocumentClient', 'scan', async () => ({ Items: publishedPosts }));
  });

  after(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });

  it('should return posts', async () => {
    const result = await lambda(getAllPostsEvent);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(publishedPosts),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };

    expect(result).to.eql(expectedResult);
  });
});
