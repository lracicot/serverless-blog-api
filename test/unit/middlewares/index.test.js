/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const { corsMiddleware, loggerMiddleware, checkMethodMiddleware } = require('../../../src/middlewares');
const HttpMethodError = require('../../../src/errors/HttpMethodError');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

describe('Test logger middleware', () => {
  let nextStub;

  beforeEach(() => {
    nextStub = sinon.stub().returns({ statusCode: 200 });
  });

  it('should call the next middleware', async () => {
    const event = { path: 'foo' };
    const context = { fiz: 'buz' };

    loggerMiddleware(nextStub)(event, context);

    expect(nextStub).to.have.been.calledWith(event, context);
  });
});

describe('Test cors middleware', () => {
  let nextStub;

  beforeEach(() => {
    nextStub = sinon.stub().returns({ statusCode: 200 });
  });

  it('should call the next middleware', async () => {
    const event = { path: 'foo' };
    const context = { fiz: 'buz' };

    const response = corsMiddleware(nextStub)(event, context);

    expect(nextStub).to.have.been.calledWith(event, context);
    expect(response.headers['Access-Control-Allow-Origin']).not.to.be.undefined;
  });
});

describe('Test checkMethod middleware', () => {
  let nextStub;

  beforeEach(() => {
    nextStub = sinon.stub().returns({ statusCode: 200 });
  });

  it('should call the next middleware', async () => {
    const event = { httpMethod: 'GET', path: 'foo' };
    const context = { fiz: 'buz' };

    checkMethodMiddleware('GET', nextStub)(event, context);

    expect(nextStub).to.have.been.calledWith(event, context);
  });

  it('should throw HttpMethodError if unmatched method', async () => {
    const event = { httpMethod: 'POST' };
    const context = { };

    expect(checkMethodMiddleware('GET', nextStub)(event, context)).to.be.rejectedWith(HttpMethodError);
  });
});

// describe('Test app middleware', () => {
//   let nextStub;
//
//   beforeEach(() => {
//     nextStub = sinon.stub().returns();
//   });
//
//   it('should call the next middleware', async () => {
//     const event = { path: 'foo' };
//     const context = { fiz: 'buz' };
//
//     app(nextStub)(event, context);
//
//     expect(nextStub).to.have.been.calledWith(event, context);
//   });
// });
