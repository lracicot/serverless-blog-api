/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
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
  const tableMock = {};

  beforeEach(() => {
    tableMock.findAll = sinon.stub().returns(fakePosts);
  });

  it('should return posts', async () => {
    const result = await lambda(tableMock)(getAllPostsEvent);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(fakePosts),
    };

    expect(result.statusCode).to.eql(expectedResult.statusCode);
    expect(result.body).to.eql(expectedResult.body);
  });

  it('should return a limited number of post', async () => {
    const result = await lambda(tableMock)(getAllPostsEventLimit);

    expect(result.statusCode).to.eql(200);
    expect(tableMock.findAll).to.have.been.calledWithMatch(2);
  });
});
