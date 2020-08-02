// /* eslint-disable no-undef */
// /* eslint-disable no-unused-expressions */
// const sinon = require('sinon');
// const chai = require('chai');
// const chaiAsPromised = require('chai-as-promised');
// const sinonChai = require('sinon-chai');
//
// chai.use(sinonChai);
// chai.use(chaiAsPromised);
//
// const { expect } = chai;
//
// const lambda = require('../../../../src/handlers/cache/invalidate-paths');
// const invalidatePathsEvent = require('../../../events/cache/event-invalidate-paths.json');
//
// describe('Test invalidatePath handler', () => {
//   const cacheController = {};
//
//   beforeEach(() => {
//     cacheController.findOneByKey = sinon.stub();
//     cacheController.findOneByKey.withArgs('uuid', fakePosts[0].uuid).returns({
//       ...fakePosts[0],
//       status: 'published',
//     });
//   });
//
//   it('should return cache invalidation data', async () => {
//     const result = await lambda(distributionId)(invalidatePathsEvent);
//
//     expect(cacheController.invalidateUrl).to.not.have.been.called;
//     expect(result).to.be.ok;
//   });
// });
