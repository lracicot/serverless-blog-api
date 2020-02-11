/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const AWS = require('aws-sdk-mock');
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
  let putTableSpy;

  beforeEach(() => {
    putTableSpy = sinon.spy();
    AWS.mock('DynamoDB.DocumentClient', 'put', async data => putTableSpy(data));
    AWS.mock('DynamoDB.DocumentClient', 'scan', async () => ({
      Items: [],
    }));
  });

  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });

  it('throws error if not POST', async () => {
    await expect(lambda({ httpMethod: 'GET' })).to.be.rejectedWith(Error);
  });

  it('should create and return asset', async () => {
    const result = await lambda(createAssetEvent);
    const resultBody = JSON.parse(result.body);
    const expectedAsset = JSON.parse(createAssetEvent.body);

    expect(putTableSpy).to.have.been.calledWithMatch({
      Item: expectedAsset,
    });
    expect(result.statusCode).to.eql(201);
    expect(resultBody.title).to.eql(expectedAsset.title);
    expect(resultBody.uuid).to.exist;
    expect(resultBody.created_at).to.exist;
    expect(resultBody.updated_at).to.exist;
    expect(resultBody.status).to.eql('created');
  });
});
