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

const lambda = require('../../../../src/handlers/post/delete-post-by-uuid');
const deletePostEvent = require('../../../events/post/event-delete-post-by-uuid.json');
const deletePostNotFoundEvent = require('../../../events/post/event-delete-post-by-uuid-not-found.json');
const fakePosts = require('../../../data/posts');

describe('Test deletePostByUuid handler', () => {
  let deleteTableSpy;

  beforeEach(() => {
    deleteTableSpy = sinon.spy();
    AWS.mock('DynamoDB.DocumentClient', 'get', async data => ({
      Item: (data.Key.uuid === fakePosts[0].uuid) ? {
        ...fakePosts[0],
      } : null,
    }));
    AWS.mock('DynamoDB.DocumentClient', 'delete', async data => deleteTableSpy(data));
  });

  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });

  it('throws error if not DELETE', async () => {
    await expect(lambda({ httpMethod: 'GET' })).to.be.rejectedWith(Error);
  });

  it('should return 404 if post not found', async () => {
    const result = await lambda(deletePostNotFoundEvent);

    expect(deleteTableSpy).to.not.have.been.called;
    expect(result.statusCode).to.eql(404);
    expect(result.body).to.be.undefined;
  });

  it('should call the delete method and return 200', async () => {
    const result = await lambda(deletePostEvent);

    expect(deleteTableSpy).to.have.been.calledWithMatch({
      Key: {
        uuid: fakePosts[0].uuid,
      },
    });
    expect(result.statusCode).to.eql(200);
    expect(result.body).to.be.undefined;
  });
});
