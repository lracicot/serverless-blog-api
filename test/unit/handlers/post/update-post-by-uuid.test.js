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

const lambda = require('../../../../src/handlers/post/update-post-by-uuid');
const updatePostEvent = require('../../../events/post/event-update-post-by-uuid.json');
const updatePostStatusEvent = require('../../../events/post/event-update-post-by-uuid-update-status.json');
const updatePostNotFoundEvent = require('../../../events/post/event-update-post-by-uuid-not-found.json');
const fakePosts = require('../../../data/posts');

describe('Test updatePostByUuid handler', () => {
  let putTableSpy;

  beforeEach(() => {
    putTableSpy = sinon.spy();
    AWS.mock('DynamoDB.DocumentClient', 'get', async data => ({
      Item: (data.Key.uuid === fakePosts[0].uuid) ? {
        ...fakePosts[0],
      } : null,
    }));
    AWS.mock('DynamoDB.DocumentClient', 'put', async data => putTableSpy(data));
  });

  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });

  it('throws error if not PUT', async () => {
    await expect(lambda({ httpMethod: 'POST' })).to.be.rejectedWith(Error);
  });

  it('should return 404 if post not found', async () => {
    const result = await lambda(updatePostNotFoundEvent);

    expect(putTableSpy).to.not.have.been.called;
    expect(result.statusCode).to.eql(404);
    expect(result.body).to.be.undefined;
  });

  it('should return updated post if valid uuid', async () => {
    const updatedAt = (new Date()).toISOString();
    const updatePostEventBody = JSON.parse(updatePostEvent.body);
    updatePostEventBody.updated_at = updatedAt;
    const result = await lambda({
      ...updatePostEvent,
      body: JSON.stringify(updatePostEventBody),
    });
    const resultBody = JSON.parse(result.body);
    const expectedPost = {
      ...JSON.parse(updatePostEvent.body),
      updated_at: updatedAt,
    };

    expect(putTableSpy).to.have.been.calledWithMatch({
      Item: expectedPost,
    });
    expect(result.statusCode).to.eql(200);
    expect(resultBody).to.deep.include(expectedPost);
  });

  it('should automatically set updated_at', async () => {
    const result = await lambda(updatePostEvent);
    const resultBody = JSON.parse(result.body);
    const expectedPost = JSON.parse(updatePostEvent.body);

    expect(putTableSpy).to.have.been.calledWithMatch({
      Item: expectedPost,
    });
    expect(result.statusCode).to.eql(200);
    expect(resultBody.updated_at).to.not.eql(fakePosts[0].updated_at);
  });

  it('should keep status as-is if no status sent', async () => {
    const result = await lambda(updatePostEvent);
    const resultBody = JSON.parse(result.body);

    expect(result.statusCode).to.eql(200);
    expect(resultBody.status).to.eql(fakePosts[0].status);
  });

  it('should update status if status sent', async () => {
    const result = await lambda(updatePostStatusEvent);
    const resultBody = JSON.parse(result.body);
    const expectedPost = JSON.parse(updatePostStatusEvent.body);

    expect(result.statusCode).to.eql(200);
    expect(resultBody.status).to.eql(expectedPost.status);
  });
});
