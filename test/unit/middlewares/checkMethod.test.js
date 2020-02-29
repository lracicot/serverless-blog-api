/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const checkMethod = require('../../../src/middlewares/checkMethod');
const HttpMethodError = require('../../../src/errors/HttpMethodError');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

describe('Test checkMethod middleware', () => {
  let nextStub;

  beforeEach(() => {
    nextStub = sinon.stub().returns({ statusCode: 200 });
  });

  it('should call the next middleware', async () => {
    const event = { httpMethod: 'GET', path: 'foo' };
    const context = { fiz: 'buz' };

    checkMethod('GET', nextStub)(event, context);

    expect(nextStub).to.have.been.calledWith(event, context);
  });

  it('should throw HttpMethodError if unmatched method', async () => {
    const event = { httpMethod: 'POST' };
    const context = { };

    expect(() => checkMethod('GET', nextStub)(event, context)).to.throw(HttpMethodError);
    expect(nextStub).to.not.have.been.called;
  });
});
