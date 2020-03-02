/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

const lambda = require('../../../../src/handlers/asset/get-asset-by-uuid');
const getAssetEvent = require('../../../events/asset/event-get-asset-by-uuid.json');
const getAssetNotFoundEvent = require('../../../events/asset/event-get-asset-by-uuid-not-found.json');
const fakeAssets = require('../../../data/assets');

describe('Test getAssetByUuid handler', () => {
  const tableMock = {};

  it('should return 404 if asset not found', async () => {
    tableMock.findOneByKey = sinon.stub().returns(null);
    const result = await lambda(tableMock)(getAssetNotFoundEvent);

    expect(result.statusCode).to.eql(404);
    expect(result.body).to.be.undefined;
  });

  it('should return the asset if valid uuid', async () => {
    tableMock.findOneByKey = sinon.stub().returns(fakeAssets[0]);
    const result = await lambda(tableMock)(getAssetEvent);
    const resultBody = JSON.parse(result.body);

    expect(result.statusCode).to.eql(200);
    expect(resultBody).to.eql(fakeAssets[0]);
  });
});
