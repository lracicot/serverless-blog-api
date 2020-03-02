/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

const lambda = require('../../../../src/handlers/asset/update-asset-by-uuid');
const updateAssetEvent = require('../../../events/asset/event-update-asset-by-uuid.json');
const updateAssetStatusEvent = require('../../../events/asset/event-update-asset-by-uuid-update-status.json');
const updateAssetNotFoundEvent = require('../../../events/asset/event-update-asset-by-uuid-not-found.json');
const fakeAssets = require('../../../data/assets');

describe('Test updateAssetByUuid handler', () => {
  const tableMock = {};

  beforeEach(() => {
    tableMock.findOneByKey = sinon.stub().returns(fakeAssets[0]);
    tableMock.put = sinon.stub();
  });

  it('should return 404 if asset not found', async () => {
    tableMock.findOneByKey = sinon.stub().returns(null);
    const result = await lambda(tableMock)(updateAssetNotFoundEvent);

    expect(tableMock.put).to.not.have.been.called;
    expect(result.statusCode).to.eql(404);
    expect(result.body).to.be.undefined;
  });

  it('should return updated asset if valid uuid', async () => {
    const updatedAt = (new Date()).toISOString();
    const updateAssetEventBody = JSON.parse(updateAssetEvent.body);
    updateAssetEventBody.updated_at = updatedAt;
    const result = await lambda(tableMock)({
      ...updateAssetEvent,
      body: JSON.stringify(updateAssetEventBody),
    });
    const resultBody = JSON.parse(result.body);
    const expectedAsset = {
      ...JSON.parse(updateAssetEvent.body),
      updated_at: updatedAt,
    };

    expect(tableMock.put).to.have.been.calledWithMatch(expectedAsset);
    expect(result.statusCode).to.eql(200);
    expect(resultBody).to.deep.include(expectedAsset);
  });

  it('should automatically set updated_at', async () => {
    const result = await lambda(tableMock)(updateAssetEvent);
    const resultBody = JSON.parse(result.body);
    const expectedAsset = JSON.parse(updateAssetEvent.body);

    expect(tableMock.put).to.have.been.calledWithMatch(expectedAsset);
    expect(result.statusCode).to.eql(200);
    expect(resultBody.updated_at).to.not.eql(fakeAssets[0].updated_at);
  });

  it('should keep status as-is if no status sent', async () => {
    const result = await lambda(tableMock)(updateAssetEvent);
    const resultBody = JSON.parse(result.body);

    expect(result.statusCode).to.eql(200);
    expect(resultBody.status).to.eql(fakeAssets[0].status);
  });

  it('should update status if status sent', async () => {
    const result = await lambda(tableMock)(updateAssetStatusEvent);
    const resultBody = JSON.parse(result.body);
    const expectedAsset = JSON.parse(updateAssetStatusEvent.body);

    expect(result.statusCode).to.eql(200);
    expect(resultBody.status).to.eql(expectedAsset.status);
  });
});
