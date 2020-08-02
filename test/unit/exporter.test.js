/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const AWSMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const stream = require('stream');

const exporter = require('../../src/exporter');

const fakeAssets = require('../data/assets');
const fakePosts = require('../data/posts');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

describe('Exporter', () => {
  // let postTableMock;
  // let assetTableMock;

  beforeEach(() => {
    uploadSpy = sinon.stub().returns(new Promise(resolve => resolve()));
    getObjectSpy = sinon.stub();
    AWSMock.mock('S3', 'upload', async data => uploadSpy(data));
    AWSMock.mock('S3', 'getObject', getObjectSpy);

    // postTableMock.findAll = sinon.stub();
    // postTableMock.findAll.returns(fakeExports);
    //
    // assetTableMock.findAll = sinon.stub();
    // assetTableMock.findAll.returns(fakeassets);

    // exporter = new Exporter(postTableMock, assetTableMock);
  });

  afterEach(() => {
    AWSMock.restore('S3');
  });

  describe('createStreamUploader', () => {
    it('returns a function', () => {
      const s3 = new AWS.S3();
      const streamUploader = exporter.createStreamUploader(s3, 'test-bucket');
      expect(typeof streamUploader === 'function').to.be.true;
    });

    it('returns a function that returns a steam', () => {
      const s3 = new AWS.S3();
      const streamUploader = exporter.createStreamUploader(s3, 'test-bucket')('test-path');
      expect(streamUploader instanceof stream.PassThrough).to.be.true;
    });

    // it('emit an error on upload error', () => {
    //   const uploadSpy = sinon.stub().returns('error');
    //   AWS.mock('S3', 'upload', () => uploadSpy());
    //   const s3 = new AWS.S3();
    //   const streamUploader = exporter.createStreamUploader(s3, 'test-bucket')('test-path');
    //   streamUploader.on('error');
    // });
  });

  describe('createAssetFileGetter', () => {
    it('returns a function', () => {
      const s3 = new AWS.S3();
      const assetFileGetter = exporter.createAssetFileGetter(s3, 'test-bucket');
      expect(typeof assetFileGetter === 'function').to.be.true;
    });

    it('returns a function that returns a promise', () => {
      const s3 = new AWS.S3();
      const assetFileGetter = exporter.createAssetFileGetter(s3, 'test-bucket')('test.png');
      expect(assetFileGetter instanceof Promise).to.be.true;
    });

    it('returns a function that returns a promise that resolve with binary data', async () => {
      const s3 = new AWS.S3();
      s3.getObject = () => ({ promise: () => new Promise(resolve => resolve({ Body: 'binary data' })) });

      const assetFile = await exporter.createAssetFileGetter(s3, 'test-bucket')('test.png');
      expect(assetFile).to.equals('binary data');
    });
  });

  describe('getAssets', () => {
    it('returns a promise', () => {
      const assetGetter = () => new Promise(resolve => resolve(fakeAssets));
      const assetFileGetter = () => new Promise(resolve => resolve('binary data'));
      const getAssets = exporter.getAssets(assetGetter, assetFileGetter);
      expect(getAssets instanceof Promise).to.be.true;
    });

    it('returns a promise that returns a list of files', async () => {
      const assetGetter = () => new Promise(resolve => resolve(fakeAssets));
      const assetFileGetter = () => new Promise(resolve => resolve('binary data'));
      const assets = await exporter.getAssets(assetGetter, assetFileGetter);
      expect(assets.length > 1).to.be.true;
      expect(assets[assets.length - 1].filePath).to.equals('assets.json');
    });
  });

  describe('getPosts', () => {
    it('returns a promise', () => {
      const postGetter = () => new Promise(resolve => resolve(fakePosts));
      const getPosts = exporter.getPosts(postGetter);
      expect(getPosts instanceof Promise).to.be.true;
    });

    it('returns a promise that returns a list of posts', async () => {
      const postGetter = () => new Promise(resolve => resolve(fakePosts));
      const posts = await exporter.getPosts(postGetter);
      expect(posts.filePath).to.equals('posts.json');
    });
  });

  describe('uploadExport', () => {
    it('returns a promise', () => {
      const s3 = new AWS.S3();
      const uploadExport = exporter.uploadExport(
        exporter.createStreamUploader(s3, 'test-bucket'),
        { pipe: () => {} },
        'export.tar',
      );
      expect(uploadExport instanceof Promise).to.be.true;
    });
  });

  describe('launchExport', () => {
    it('returns a promise', () => {
      const dataGetter = () => new Promise(resolve => resolve([
        { filePath: 'test.png', data: 'binary data' },
      ]));

      const s3 = new AWS.S3();
      s3.upload = (params, cb) => cb();

      const launchExport = exporter.launchExport(
        dataGetter,
        'export.tar',
        exporter.createStreamUploader(s3, 'test-bucket'),
      );
      expect(launchExport instanceof Promise).to.be.true;
    });

    it('emits an error', async () => {
      const dataGetter = () => new Promise(resolve => resolve([
        { filePath: 'test.png', data: 'binary data' },
      ]));

      const s3 = new AWS.S3();
      s3.upload = (params, cb) => cb('error');

      const exp = exporter.launchExport(
        dataGetter,
        'export.tar',
        exporter.createStreamUploader(s3, 'test-bucket'),
      );
      expect(exp).to.be.rejectedWith('error');
    });
  });
});
