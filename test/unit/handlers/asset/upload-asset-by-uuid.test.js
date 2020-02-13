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

process.env.UPLOAD_BUCKET = 'test';

const lambda = require('../../../../src/handlers/asset/upload-asset-by-uuid');
const uploadAssetEvent = require('../../../events/asset/event-upload-asset-by-uuid.json');
const uploadAssetNotFoundEvent = require('../../../events/asset/event-upload-asset-by-uuid-not-found.json');
const fakeAssets = require('../../../data/assets');

describe('Test uploadAssetByUuid handler', () => {
  let putTableSpy;
  let putS3Spy;

  beforeEach(() => {
    putTableSpy = sinon.spy();
    putS3Spy = sinon.spy();
    AWS.mock('DynamoDB.DocumentClient', 'get', async data => ({
      Item: (data.Key.uuid === fakeAssets[0].uuid) ? {
        ...fakeAssets[0],
      } : null,
    }));
    AWS.mock('DynamoDB.DocumentClient', 'put', async data => putTableSpy(data));
    AWS.mock('S3', 'putObject', async data => putS3Spy(data));
  });

  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient');
    AWS.restore('S3');
  });

  it('throws error if not POST', async () => {
    await expect(lambda({ httpMethod: 'PUT' })).to.be.rejectedWith(Error);
  });

  it('should return 404 if asset not found', async () => {
    const result = await lambda(uploadAssetNotFoundEvent);

    expect(putTableSpy).to.not.have.been.called;
    expect(putS3Spy).to.not.have.been.called;
    expect(result.statusCode).to.eql(404);
    expect(result.body).to.be.undefined;
  });

  it('should return an uploaded asset if valid uuid', async () => {
    const result = await lambda(uploadAssetEvent);
    const resultBody = JSON.parse(result.body);

    expect(result.statusCode).to.eql(200);
    expect(putTableSpy).to.have.been.calledWithMatch({
      Item: {
        status: 'uploaded',
      },
    });
    expect(putS3Spy).to.have.been.calledWithMatch({
      Bucket: process.env.UPLOAD_BUCKET,
      Key: '468d81da-7e43-4713-93bd-008e6148e349.png',
      Body: uploadAssetEvent.body,
      ACL: 'public-read',
    });
    expect(resultBody).to.deep.include({
      status: 'uploaded',
    });
  });
});
