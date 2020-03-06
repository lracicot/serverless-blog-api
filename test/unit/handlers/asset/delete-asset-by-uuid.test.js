/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

const lambda = require('../../../../src/handlers/asset/delete-asset-by-uuid');
const deleteAssetEvent = require('../../../events/asset/event-delete-asset-by-uuid.json');
const deleteAssetNotFoundEvent = require('../../../events/asset/event-delete-asset-by-uuid-not-found.json');
const fakeAssets = require('../../../data/assets');

describe('Test deleteAssetByUuid handler', () => {
  const tableMock = {};

  beforeEach(() => {
    tableMock.findOneByKey = sinon.stub().returns(fakeAssets[0]);
    tableMock.deleteByKey = sinon.stub();
  });

  it('should return 404 if asset not found', async () => {
    tableMock.findOneByKey = sinon.stub().returns(null);
    const result = await lambda(tableMock)(deleteAssetNotFoundEvent);

    expect(tableMock.deleteByKey).to.not.have.been.called;
    expect(result.statusCode).to.eql(404);
    expect(result.body).to.be.undefined;
  });

  it('should call the delete method and return 200', async () => {
    const result = await lambda(tableMock)(deleteAssetEvent);

    expect(tableMock.deleteByKey).to.have.been.calledWith('uuid', fakeAssets[0].uuid);
    expect(result.statusCode).to.eql(200);
    expect(JSON.parse(result.body).uuid).to.eql(fakeAssets[0].uuid);
  });
});
