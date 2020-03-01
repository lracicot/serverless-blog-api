/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

const lambda = require('../../../../src/handlers/asset/create-asset');
const createAssetEvent = require('../../../events/asset/event-create-asset.json');

describe('Test createAsset handler', () => {
  const tableMock = {};

  beforeEach(() => {
    tableMock.findBy = sinon.stub().returns([]);
    tableMock.put = sinon.stub();
  });

  it('should create and return asset', async () => {
    const result = await lambda(tableMock)(createAssetEvent);
    const resultBody = JSON.parse(result.body);
    const expectedAsset = JSON.parse(createAssetEvent.body);

    expect(tableMock.put).to.have.been.calledWithMatch(expectedAsset);
    expect(result.statusCode).to.eql(201);
    expect(resultBody.title).to.eql(expectedAsset.title);
    expect(resultBody.uuid).to.exist;
    expect(resultBody.created_at).to.exist;
    expect(resultBody.updated_at).to.exist;
    expect(resultBody.status).to.eql('created');
  });
});
