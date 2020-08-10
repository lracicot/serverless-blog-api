/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const logger = require('../../../src/middlewares/logger');

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

    await logger(nextStub)(event, context);

    expect(nextStub).to.have.been.calledWith(event, context);
  });

  it('should log response from non-HTTP handlers', () => {
    const event = { path: 'foo' };
    logger(sinon.stub().returns({}))(event, context);
  });
});
