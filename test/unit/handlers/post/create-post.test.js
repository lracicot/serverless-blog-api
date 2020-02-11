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

const lambda = require('../../../../src/handlers/post/create-post');
const createPostEvent = require('../../../events/post/event-create-post.json');
const createPostDuplicateEvent = require('../../../events/post/event-create-post-duplicate.json');
const fakePosts = require('../../../data/posts');

describe('Test createPost handler', () => {
  let putTableSpy;

  beforeEach(() => {
    putTableSpy = sinon.spy();
    AWS.mock('DynamoDB.DocumentClient', 'put', async data => putTableSpy(data));
    AWS.mock('DynamoDB.DocumentClient', 'scan', async () => ({
      Items: [],
    }));
  });

  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });

  it('throws error if not POST', async () => {
    await expect(lambda({ httpMethod: 'GET' })).to.be.rejectedWith(Error);
  });

  it('should create and return post', async () => {
    const result = await lambda(createPostEvent);
    const resultBody = JSON.parse(result.body);
    const expectedPost = JSON.parse(createPostEvent.body);

    expect(putTableSpy).to.have.been.calledWithMatch({
      Item: expectedPost,
    });
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
    AWS.restore('DynamoDB.DocumentClient');
    AWS.mock('DynamoDB.DocumentClient', 'scan', async () => ({
      Items: fakePosts,
    }));
    const result = await lambda(createPostDuplicateEvent);
    const resultBody = JSON.parse(result.body);

    expect(putTableSpy).to.not.have.been.called;
    expect(result.statusCode).to.eql(400);
    expect(resultBody).to.eql({ error: 'Slug already exists' });
  });
});
