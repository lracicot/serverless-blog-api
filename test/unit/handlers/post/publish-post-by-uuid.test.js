/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
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
  const tableMock = {};

  beforeEach(() => {
    tableMock.findOneByKey = sinon.stub();
    tableMock.put = sinon.stub();
  });

  it('should return 404 if post not found', async () => {
    tableMock.findOneByKey.returns(null);
    const result = await lambda(tableMock)(publishPostNotFoundEvent);

    expect(tableMock.put).to.not.have.been.called;
    expect(result.statusCode).to.eql(404);
    expect(result.body).to.be.undefined;
  });

  it('should return status published if valid uuid', async () => {
    tableMock.findOneByKey.returns({
      ...fakePosts[0],
      status: 'draft',
    });
    const result = await lambda(tableMock)(publishPostEvent);
    const resultBody = JSON.parse(result.body);

    expect(tableMock.put).to.have.been.calledWithMatch({
      status: 'published',
    });
    expect(result.statusCode).to.eql(200);
    expect(resultBody.status).to.eql('published');
  });
});
