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

const lambda = require('../../../../src/handlers/post/publish-post-by-uuid');
const publishPostEvent = require('../../../events/post/event-publish-post-by-uuid.json');
const publishPostNotFoundEvent = require('../../../events/post/event-publish-post-by-uuid-not-found.json');
const fakePosts = require('../../../data/posts');

describe('Test publishPostByUuid handler', () => {
  let putTableSpy;

  beforeEach(() => {
    putTableSpy = sinon.spy();
    AWS.mock('DynamoDB.DocumentClient', 'get', async data => ({
      Item: (data.Key.uuid === fakePosts[0].uuid) ? {
        ...fakePosts[0],
        status: 'draft',
      } : null,
    }));
    AWS.mock('DynamoDB.DocumentClient', 'put', async data => putTableSpy(data));
  });

  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });

  it('should return 404 if post not found', async () => {
    const result = await lambda(publishPostNotFoundEvent);

    expect(putTableSpy).to.not.have.been.called;
    expect(result.statusCode).to.eql(404);
    expect(result.body).to.be.undefined;
  });

  it('should return status published if valid uuid', async () => {
    const result = await lambda(publishPostEvent);
    const resultBody = JSON.parse(result.body);

    expect(putTableSpy).to.have.been.calledWithMatch({
      Item: {
        status: 'published',
      },
    });
    expect(result.statusCode).to.eql(200);
    expect(resultBody.status).to.eql('published');
  });
});
