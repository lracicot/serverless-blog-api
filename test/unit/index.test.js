/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const chai = require('chai');

const { expect } = chai;

const controller = require('../../src/index');

describe('Test index', () => {
  it('should not export undefined properties', async () => {
    expect(controller.post).to.not.be.undefined;
    expect(controller.asset).to.not.be.undefined;
    expect(controller.exporter).to.not.be.undefined;
  });

  it('should return handlers', async () => {
    expect(typeof controller.post.createPost === 'function').to.be.true;
  });
});
