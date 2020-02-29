/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

const AWS = require('aws-sdk-mock');
const chai = require('chai');

const { expect } = chai;

const controller = require('../../src/index');
const getAllPostsEvent = require('../events/post/event-get-all-posts.json');
const fakePosts = require('../data/posts');

describe('Functional test app', () => {
  before(() => {
    AWS.mock('DynamoDB.DocumentClient', 'scan', async () => ({ Items: fakePosts }));
  });

  after(() => {
    AWS.restore('DynamoDB.DocumentClient');
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
