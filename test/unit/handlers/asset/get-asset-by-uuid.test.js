/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const AWS = require('aws-sdk-mock');
const chai = require('chai');
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
  beforeEach(() => {
    AWS.mock('DynamoDB.DocumentClient', 'get', async data => ({
      Item: (data.Key.uuid === fakeAssets[0].uuid) ? {
        ...fakeAssets[0],
      } : null,
    }));
  });

  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });

  it('throws error if not GET', async () => {
    await expect(lambda({ httpMethod: 'POST' })).to.be.rejectedWith(Error);
  });

  it('should return 404 if asset not found', async () => {
    const result = await lambda(getAssetNotFoundEvent);

    expect(result.statusCode).to.eql(404);
    expect(result.body).to.be.undefined;
  });

  it('should return the asset if valid uuid', async () => {
    const result = await lambda(getAssetEvent);
    const resultBody = JSON.parse(result.body);

    expect(result.statusCode).to.eql(200);
    expect(resultBody).to.eql(fakeAssets[0]);
  });
});
