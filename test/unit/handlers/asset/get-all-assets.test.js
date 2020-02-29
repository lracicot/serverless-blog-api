/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const AWS = require('aws-sdk-mock');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { expect } = chai;

const lambda = require('../../../../src/handlers/asset/get-all-assets');
const getAllAssetsEvent = require('../../../events/asset/event-get-all-assets.json');
const fakeAssets = require('../../../data/assets');

describe('Test getAllAssets handler', () => {
  before(() => {
    AWS.mock('DynamoDB.DocumentClient', 'scan', async () => ({ Items: fakeAssets }));
  });

  after(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });

  it('should return assets', async () => {
    const result = await lambda(getAllAssetsEvent);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(fakeAssets),
    };

    expect(result.statusCode).to.eql(expectedResult.statusCode);
    expect(result.body).to.eql(expectedResult.body);
  });
});
