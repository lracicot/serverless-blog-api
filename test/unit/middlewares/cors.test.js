/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const cors = require('../../../src/middlewares/cors');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

describe('Test cors middleware', () => {
  let nextStub;

  beforeEach(() => {
    nextStub = sinon.stub().returns({ statusCode: 200 });
  });

  it('should call the next middleware', async () => {
    const event = { path: 'foo' };
    const context = { fiz: 'buz' };

    const response = await cors(nextStub)(event, context);

    expect(nextStub).to.have.been.calledWith(event, context);
    expect(response.headers['Access-Control-Allow-Origin']).not.to.be.undefined;
  });
});
