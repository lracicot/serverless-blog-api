/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const AWS = require('aws-sdk-mock');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

const lambda = require('../../../../src/handlers/post/get-post-by-uuid');
const getPostEvent = require('../../../events/post/event-get-post-by-uuid.json');
const getPostNotFoundEvent = require('../../../events/post/event-get-post-by-uuid-not-found.json');
const fakePosts = require('../../../data/posts');

describe('Test getPostByUuid handler', () => {
  beforeEach(() => {
    AWS.mock('DynamoDB.DocumentClient', 'get', async data => ({
      Item: (data.Key.uuid === fakePosts[0].uuid) ? {
        ...fakePosts[0],
      } : null,
    }));
  });

  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });

  it('should return 404 if post not found', async () => {
    const result = await lambda(getPostNotFoundEvent);

    expect(result.statusCode).to.eql(404);
    expect(result.body).to.be.undefined;
  });

  it('should return the post if valid uuid', async () => {
    const result = await lambda(getPostEvent);
    const resultBody = JSON.parse(result.body);

    expect(result.statusCode).to.eql(200);
    expect(resultBody).to.eql(fakePosts[0]);
  });
});
