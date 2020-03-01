/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

const lambda = require('../../../../src/handlers/post/create-post');
const createPostEvent = require('../../../events/post/event-create-post.json');
const createPostDuplicateEvent = require('../../../events/post/event-create-post-duplicate.json');
const fakePosts = require('../../../data/posts');

describe('Test createPost handler', () => {
  const tableMock = {};

  beforeEach(() => {
    tableMock.findBy = sinon.stub().returns([]);
    tableMock.put = sinon.stub();
  });

  it('should create and return post', async () => {
    const result = await lambda(tableMock)(createPostEvent);
    const resultBody = JSON.parse(result.body);
    const expectedPost = JSON.parse(createPostEvent.body);

    expect(tableMock.put).to.have.been.calledWithMatch(expectedPost);
    expect(result.statusCode).to.eql(201);
    expect(resultBody.title).to.eql(expectedPost.title);
    expect(resultBody.slug).to.eql(expectedPost.slug);
    expect(resultBody.content).to.eql(expectedPost.content);
    expect(resultBody.uuid).to.exist;
    expect(resultBody.created_at).to.exist;
    expect(resultBody.updated_at).to.exist;
    expect(resultBody.status).to.eql('draft');
  });

  it('should not create duplicate slugs', async () => {
    tableMock.findBy = sinon.stub().returns(fakePosts);
    const result = await lambda(tableMock)(createPostDuplicateEvent);
    const resultBody = JSON.parse(result.body);

    expect(tableMock.put).to.not.have.been.called;
    expect(result.statusCode).to.eql(400);
    expect(resultBody).to.eql({ error: 'Slug already exists' });
  });
});
