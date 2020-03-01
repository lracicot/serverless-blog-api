/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

const lambda = require('../../../../src/handlers/post/archive-post-by-uuid');
const archivePostEvent = require('../../../events/post/event-archive-post-by-uuid.json');
const archivePostNotFoundEvent = require('../../../events/post/event-archive-post-by-uuid-not-found.json');
const fakePosts = require('../../../data/posts');

describe('Test archivePostByUuid handler', () => {
  const tableMock = {};

  beforeEach(() => {
    tableMock.findOneByKey = sinon.stub();
    tableMock.findOneByKey.withArgs('uuid', fakePosts[0].uuid).returns({
      ...fakePosts[0],
      status: 'published',
    });

    tableMock.put = sinon.stub();
  });

  it('should return 404 if post not found', async () => {
    const result = await lambda(tableMock)(archivePostNotFoundEvent);

    expect(tableMock.put).to.not.have.been.called;
    expect(result.statusCode).to.eql(404);
    expect(result.body).to.be.undefined;
  });

  it('should return status archived if valid uuid', async () => {
    const result = await lambda(tableMock)(archivePostEvent);
    const resultBody = JSON.parse(result.body);

    expect(tableMock.put).to.have.been.calledWithMatch({
      status: 'archived',
    });
    expect(result.statusCode).to.eql(200);
    expect(resultBody.status).to.eql('archived');
  });
});
