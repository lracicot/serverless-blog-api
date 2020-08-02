/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

const lambda = require('../../../../src/handlers/exporter/get-all-exports');
const getAllExportsEvent = require('../../../events/exporter/event-get-all-exports.json');
const fakeExports = require('../../../data/exports');

describe('Test getAllExports handler', () => {
  const tableMock = {};

  beforeEach(() => {
    tableMock.findAll = sinon.stub().returns(fakeExports);
  });

  it('should return exports', async () => {
    const result = await lambda(tableMock)(getAllExportsEvent);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(fakeExports),
    };

    expect(result.statusCode).to.eql(expectedResult.statusCode);
    expect(result.body).to.eql(expectedResult.body);
  });
});
