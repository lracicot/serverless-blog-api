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

const lambda = require('../../../../src/handlers/asset/delete-asset-by-uuid');
const deleteAssetEvent = require('../../../events/asset/event-delete-asset-by-uuid.json');
const deleteAssetNotFoundEvent = require('../../../events/asset/event-delete-asset-by-uuid-not-found.json');
const fakeAssets = require('../../../data/assets');

describe('Test deleteAssetByUuid handler', () => {
  let deleteTableSpy;

  beforeEach(() => {
    deleteTableSpy = sinon.spy();
    AWS.mock('DynamoDB.DocumentClient', 'get', async data => ({
      Item: (data.Key.uuid === fakeAssets[0].uuid) ? {
        ...fakeAssets[0],
      } : null,
    }));
    AWS.mock('DynamoDB.DocumentClient', 'delete', async data => deleteTableSpy(data));
  });

  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });

  it('throws error if not DELETE', async () => {
    await expect(lambda({ httpMethod: 'GET' })).to.be.rejectedWith(Error);
  });

  it('should return 404 if asset not found', async () => {
    const result = await lambda(deleteAssetNotFoundEvent);

    expect(deleteTableSpy).to.not.have.been.called;
    expect(result.statusCode).to.eql(404);
    expect(result.body).to.be.undefined;
  });

  it('should call the delete method and return 200', async () => {
    const result = await lambda(deleteAssetEvent);

    expect(deleteTableSpy).to.have.been.calledWithMatch({
      Key: {
        uuid: fakeAssets[0].uuid,
      },
    });
    expect(result.statusCode).to.eql(200);
    expect(result.body).to.be.undefined;
  });
});
