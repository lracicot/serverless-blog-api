/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const { expect } = chai;

const app = require('../../src/app');


describe('Test app', () => {
  describe('post', () => {
    it('should execute handler if matching method', async () => {
      const handler = sinon.spy();
      const appStack = app(() => handler);

      appStack.post(handler)({ httpMethod: 'POST' });
      expect(handler).to.have.been.called;
    });

    it('should not execute handler if not matching method', async () => {
      const handler = sinon.spy();
      const appStack = app(() => handler);

      expect(() => appStack.post(handler)({ httpMethod: 'GET' })).to.throw(Error);
      expect(handler).to.not.have.been.called;
    });
  });
  describe('get', () => {
    it('should execute handler if matching method', async () => {
      const handler = sinon.spy();
      const appStack = app(() => handler);

      appStack.get(handler)({ httpMethod: 'GET' });
      expect(handler).to.have.been.called;
    });

    it('should not execute handler if not matching method', async () => {
      const handler = sinon.spy();
      const appStack = app(() => handler);

      expect(() => appStack.get(handler)({ httpMethod: 'POST' })).to.throw(Error);
      expect(handler).to.not.have.been.called;
    });
  });
  describe('delete', () => {
    it('should execute handler if matching method', async () => {
      const handler = sinon.spy();
      const appStack = app(() => handler);

      appStack.delete(handler)({ httpMethod: 'DELETE' });
      expect(handler).to.have.been.called;
    });

    it('should not execute handler if not matching method', async () => {
      const handler = sinon.spy();
      const appStack = app(() => handler);

      expect(() => appStack.delete(handler)({ httpMethod: 'POST' })).to.throw(Error);
      expect(handler).to.not.have.been.called;
    });
  });
  describe('put', () => {
    it('should execute handler if matching method', async () => {
      const handler = sinon.spy();
      const appStack = app(() => handler);

      appStack.put(handler)({ httpMethod: 'PUT' });
      expect(handler).to.have.been.called;
    });

    it('should not execute handler if not matching method', async () => {
      const handler = sinon.spy();
      const appStack = app(() => handler);

      expect(() => appStack.put(handler)({ httpMethod: 'POST' })).to.throw(Error);
      expect(handler).to.not.have.been.called;
    });
  });
});
