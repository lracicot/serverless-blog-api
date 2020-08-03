/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

process.env.UPLOAD_BUCKET = 'bucket1';
process.env.BACKUP_BUCKET = 'bucket2';

const lambda = require('../../../../src/handlers/exporter/trigger-export');

describe('Test triggerExportHandler', () => {
  const exportTableMock = {};
  const postTableMock = {};
  const assetTableMock = {};
  const exporterMock = {};

  beforeEach(() => {
    exportTableMock.put = sinon.stub().returns();
    postTableMock.put = sinon.stub().returns();
    assetTableMock.put = sinon.stub().returns();
    exportTableMock.findAll = sinon.stub().returns();
    postTableMock.findAll = sinon.stub().returns();
    assetTableMock.findAll = sinon.stub().returns();
    exporterMock.launchExport = sinon.stub().returns(new Promise(resolve => resolve()));
    exporterMock.createStreamUploader = sinon.stub().returns(new Promise(resolve => resolve()));
    exporterMock.getPosts = sinon.stub().returns(new Promise(resolve => resolve()));
    exporterMock.getAssets = sinon.stub().returns(new Promise(resolve => resolve()));
    exporterMock.createAssetFileGetter = sinon.stub().returns(new Promise(resolve => resolve()));
  });

  it('should return exports', async () => {
    const result = await lambda(exporterMock, exportTableMock, postTableMock, assetTableMock)();
    const body = JSON.parse(result.body);

    const expectedResult = {
      statusCode: 201,
    };

    expect(result.statusCode).to.eql(expectedResult.statusCode);
    expect(body.status).to.eql('pending');
  });

  it('should handle errors', async () => {
    exporterMock.launchExport = sinon.stub().returns(new Promise((resolve, reject) => reject()));
    const result = await lambda(exporterMock, exportTableMock, postTableMock, assetTableMock)();
    const body = JSON.parse(result.body);

    const expectedResult = {
      statusCode: 201,
    };

    expect(result.statusCode).to.eql(expectedResult.statusCode);
    expect(body.status).to.eql('pending');
  });
});
