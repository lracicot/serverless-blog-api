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

  beforeEach(() => {
    exportTableMock.put = sinon.stub().returns();
  });

  it('should return exports', async () => {
    const result = await lambda(exportTableMock)();
    const body = JSON.parse(result.body);

    const expectedResult = {
      statusCode: 201,
    };

    expect(result.statusCode).to.eql(expectedResult.statusCode);
    expect(body.status).to.eql('pending');
  });

  it('should handle errors', async () => {
    const result = await lambda(exportTableMock)();
    const body = JSON.parse(result.body);

    const expectedResult = {
      statusCode: 201,
    };

    expect(result.statusCode).to.eql(expectedResult.statusCode);
    expect(body.status).to.eql('pending');
  });
});
