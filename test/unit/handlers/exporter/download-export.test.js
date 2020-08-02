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
process.env.BACKUP_BUCKET = 'bucket';

const lambda = require('../../../../src/handlers/exporter/download-export');
const downloadExportEvent = require('../../../events/exporter/event-download-export.json');

describe('Test downloadExport handler', () => {
  const tableMock = {};
  let getObjectSpy;

  beforeEach(() => {
    tableMock.findOneByKey = sinon.stub().returns({ file: 'export.tgz' });
    getObjectSpy = sinon.stub().returns(new Promise(resolve => resolve({ Body: 'a find body' })));
    AWS.mock('S3', 'getObject', async data => getObjectSpy(data));
  });

  afterEach(() => {
    AWS.restore('S3');
  });

  it('should return a file', async () => {
    const result = await lambda(tableMock)(downloadExportEvent);

    const expectedResult = {
      statusCode: 200,
      body: 'a find body',
    };

    expect(result.statusCode).to.eql(expectedResult.statusCode);
    expect(result.body).to.eql(expectedResult.body);
  });
});
