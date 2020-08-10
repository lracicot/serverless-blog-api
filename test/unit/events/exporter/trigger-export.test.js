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

const lambda = require('../../../../src/events/exporter/trigger-export');
const event = require('../../../events/exporter/event-event-trigger-export.json');
const fakeExports = require('../../../data/exports');

describe('Test exportTrigger event', () => {
  const exportTableMock = {};
  const postTableMock = {};
  const assetTableMock = {};
  const exporterMock = {};

  beforeEach(() => {
    exportTableMock.put = sinon.stub().returns();
    postTableMock.put = sinon.stub().returns();
    assetTableMock.put = sinon.stub().returns();
    exportTableMock.findOneByKey = sinon.stub().returns(fakeExports[0]);
    postTableMock.findAll = sinon.stub().returns();
    assetTableMock.findAll = sinon.stub().returns();
    exporterMock.launchExport = getter => getter;
    exporterMock.createStreamUploader = sinon.stub().returns(new Promise(resolve => resolve()));
    exporterMock.getPosts = getter => getter();
    exporterMock.getAssets = getter => getter();
    exporterMock.createAssetFileGetter = sinon.stub().returns(new Promise(resolve => resolve()));
  });

  it('should save the completed export', async () => {
    await lambda(
      exporterMock,
      exportTableMock,
      postTableMock,
      assetTableMock,
    )(event);

    expect(exportTableMock.put.calledWithMatch({ status: 'completed' })).to.be.true;
  });

  it('should handle errors', async () => {
    exporterMock.launchExport = sinon.stub().returns(new Promise((resolve, reject) => reject()));
    await lambda(
      exporterMock,
      exportTableMock,
      postTableMock,
      assetTableMock,
    )(event);

    expect(exportTableMock.put.calledWithMatch({ status: 'error' })).to.be.true;
  });

  it('should do nothing when event is not INSERT from dynamodb', async () => {
    exporterMock.launchExport = sinon.stub().returns(new Promise((resolve, reject) => reject()));
    await lambda(
      exporterMock,
      exportTableMock,
      postTableMock,
      assetTableMock,
    )({ Records: [{}] });
    await lambda(
      exporterMock,
      exportTableMock,
      postTableMock,
      assetTableMock,
    )({ Records: [{ eventName: 'UPDATE', eventSource: 'aws:dynamodb' }] });
    await lambda(
      exporterMock,
      exportTableMock,
      postTableMock,
      assetTableMock,
    )({ Records: [{ eventName: 'INSERT', eventSource: 'aws:potato' }] });

    expect(exportTableMock.put.called).to.be.false;
  });
});
