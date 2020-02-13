/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const chai = require('chai');

const { expect } = chai;

const controller = require('../../../src/handlers/index');

describe('Test index', () => {
  it('should not export undefined properties', async () => {
    expect(controller.post).to.not.be.undefined;
    expect(controller.asset).to.not.be.undefined;
  });
});
