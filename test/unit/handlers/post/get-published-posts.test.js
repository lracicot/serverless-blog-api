/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

const lambda = require('../../../../src/handlers/post/get-published-posts');
const getAllPostsEvent = require('../../../events/post/event-get-published-posts.json');
const fakePosts = require('../../../data/posts');

const publishedPosts = fakePosts.filter(p => p.status === 'published');

describe('Test getPublishedPosts handler', () => {
  const tableMock = {};

  beforeEach(() => {
    tableMock.findBy = sinon.stub();
    tableMock.findBy.withArgs('status', 'published').returns(publishedPosts);
  });

  it('should return posts', async () => {
    const result = await lambda(tableMock)(getAllPostsEvent);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(publishedPosts),
    };

    expect(tableMock.findBy).to.have.been.calledWith('status', 'published');
    expect(result).to.eql(expectedResult);
  });
});
