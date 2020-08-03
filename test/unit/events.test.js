/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const chai = require('chai');

const { expect } = chai;

const controller = require('../../src/events');

describe('Test events', () => {
  it('should not export undefined properties', async () => {
    expect(controller.exporter).to.not.be.undefined;
  });

  it('should return handlers', async () => {
    expect(typeof controller.exporter.triggerExport === 'function').to.be.true;
  });
});
