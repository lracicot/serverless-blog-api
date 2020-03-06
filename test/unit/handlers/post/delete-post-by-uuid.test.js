/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
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
  const tableMock = {};

  beforeEach(() => {
    tableMock.deleteByKey = sinon.stub();
  });

  it('should return 404 if post not found', async () => {
    tableMock.findOneByKey = sinon.stub().returns(null);
    const result = await lambda(tableMock)(deletePostNotFoundEvent);

    expect(tableMock.deleteByKey).to.not.have.been.called;
    expect(result.statusCode).to.eql(404);
    expect(result.body).to.be.undefined;
  });

  it('should call the delete method and return 200', async () => {
    tableMock.findOneByKey = sinon.stub().returns(fakePosts[0]);
    const result = await lambda(tableMock)(deletePostEvent);

    expect(tableMock.deleteByKey).to.have.been.calledWithMatch('uuid', fakePosts[0].uuid);
    expect(result.statusCode).to.eql(200);
    expect(JSON.parse(result.body).uuid).to.eql(fakePosts[0].uuid);
  });
});
