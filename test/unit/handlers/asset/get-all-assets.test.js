/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

const lambda = require('../../../../src/handlers/asset/get-all-assets');
const getAllAssetsEvent = require('../../../events/asset/event-get-all-assets.json');
const fakeAssets = require('../../../data/assets');

describe('Test getAllAssets handler', () => {
  const tableMock = {};

  beforeEach(() => {
    tableMock.findAll = sinon.stub().returns(fakeAssets);
  });

  it('should return assets', async () => {
    const result = await lambda(tableMock)(getAllAssetsEvent);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(fakeAssets),
    };

    expect(result.statusCode).to.eql(expectedResult.statusCode);
    expect(result.body).to.eql(expectedResult.body);
  });
});
