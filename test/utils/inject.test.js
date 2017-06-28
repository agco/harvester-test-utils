'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const inject = require('../../lib/utils/inject');

describe('inject.js', () => {
  const server = {};

  beforeEach('setup stubs', () => {
    server.register = sinon.stub();
  });

  it('registers inject-then module with hapijs', () => {
    server.plugins = {};
    server.register.callsArg(1);
    return inject(server)
      .then(_serverReturn => {
        expect(server.register.calledOnce).to.be.true;
        expect(_serverReturn).to.be.an('object');
      });
  });

  it('does not register inject-then module if it exists', () => {
    server.plugins = {};
    server.plugins['inject-then'] = {};
    return inject(server)
      .then(_serverReturn => {
        expect(server.register.called).to.be.false;
        expect(_serverReturn).to.be.an('object');
      });
  });
});
