/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const AWS = require('aws-sdk-mock');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { expect } = chai;

const lambda = require('../../../../src/handlers/post/get-all-posts');
const getAllPostsEvent = require('../../../events/post/event-get-all-posts.json');
// const getAllPostsEventLimit = require('../../../events/post/event-get-all-posts-limit.json');
// const getAllPostsEventLimitOffset = require(
// '../../../events/post/event-get-all-posts-limit-offset.json'
// );
const fakePosts = require('../../../data/posts');

describe('Test getAllPosts handler', () => {
  before(() => {
    AWS.mock('DynamoDB.DocumentClient', 'scan', async () => ({ Items: fakePosts }));
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

  // it('should return a limited number of post', async () => {
  //   const result = await lambda(getAllPostsEventLimit);
  //
  //   const expectedResult = {
  //     statusCode: 200,
  //     body: JSON.stringify([fakePosts[0], fakePosts[1]]),
  //   };
  //
  //   expect(result.statusCode).to.eql(expectedResult.statusCode);
  //   expect(JSON.parse(result.body).length).to.eql(2);
  //   expect(result.body).to.eql(expectedResult.body);
  // });

  // it('should return a limited number of post with offset', async () => {
  //   const result = await lambda(getAllPostsEventLimitOffset);
  //
  //   const expectedResult = {
  //     statusCode: 200,
  //     body: JSON.stringify([fakePosts[1], fakePosts[2]]),
  //   };
  //
  //   expect(result.statusCode).to.eql(expectedResult.statusCode);
  //   expect(JSON.parse(result.body).length).to.eql(2);
  //   expect(result.body).to.eql(expectedResult.body);
  // });
});
