// /* eslint-disable no-undef */
// /* eslint-disable no-unused-expressions */
// const AWS = require('aws-sdk-mock');
// const sinon = require('sinon');
// const chai = require('chai');
// const chaiAsPromised = require('chai-as-promised');
// const sinonChai = require('sinon-chai');
//
// const CacheController = require('../../src/cache');
//
// chai.use(sinonChai);
// chai.use(chaiAsPromised);
//
// const { expect } = chai;
//
// describe('Test cloudfront client', () => {
//   let cloudFrontClient;
//   let createInvalidation;
//
//   beforeEach(() => {
//     createInvalidation = sinon.stub().returns(new Promise(resolve => resolve()));
//     AWS.mock('CloudFront', 'get', async data => createInvalidation(data));
//     cloudFrontClient = new CacheController('123ABC');
//   });
//
//   afterEach(() => {
//     AWS.restore('CloudFront');
//   });
//
//   describe('deleteByKey', () => {
//     it('should create an invalidation', async () => {
//       await cloudFrontClient.invalidateUrl(['/', '/test']);
//       expect(createInvalidation).to.have.been.calledWithMatch(['/', '/test']);
//     });
//   });
// });
