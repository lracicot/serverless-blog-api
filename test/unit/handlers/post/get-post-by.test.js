/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const lambdaByUuid = require('../../../../src/handlers/post/get-post-by-uuid');
const lambdaBySlug = require('../../../../src/handlers/post/get-post-by-slug');
const getPostEvent = require('../../../events/post/event-get-post-by-uuid.json');
const getPostNotFoundEvent = require('../../../events/post/event-get-post-by-uuid-not-found.json');
const fakePosts = require('../../../data/posts');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

describe('Test getPostByUuid handler', () => {
  const tableMock = {};

  it('should return 404 if post not found', async () => {
    tableMock.findOneByKey = sinon.stub().returns(null);
    const result = await lambdaByUuid(tableMock)(getPostNotFoundEvent);

    expect(result.statusCode).to.eql(404);
    expect(result.body).to.be.undefined;
  });

  it('should return the post if valid uuid', async () => {
    tableMock.findOneByKey = sinon.stub().returns(fakePosts[0]);
    const result = await lambdaByUuid(tableMock)(getPostEvent);
    const resultBody = JSON.parse(result.body);

    expect(result.statusCode).to.eql(200);
    expect(resultBody).to.eql(fakePosts[0]);
  });
});

describe('Test getPostBySlug handler', () => {
  const tableMock = {};

  it('should return 404 if post not found', async () => {
    tableMock.findBy = sinon.stub().returns([]);
    const result = await lambdaBySlug(tableMock)(getPostNotFoundEvent);

    expect(result.statusCode).to.eql(404);
    expect(result.body).to.be.undefined;
  });

  it('should return the post if valid slug', async () => {
    tableMock.findBy = sinon.stub().returns([fakePosts[0]]);
    const result = await lambdaBySlug(tableMock)(getPostEvent);
    const resultBody = JSON.parse(result.body);

    expect(result.statusCode).to.eql(200);
    expect(resultBody).to.eql(fakePosts[0]);
  });
});
