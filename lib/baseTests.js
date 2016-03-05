'use strict';

const dbUtils = require('./utils/db');
const validityUtils = require('./utils/validity');
const inject = require('./utils/inject');

class BaseTests {
  init(serverPromise) {
    return serverPromise.then(server => {
      this._server = server;
      return inject(server);
    });
  }

  testGetValidSuccess(fixtureName, fixture, options) {
    it(`GET from /${fixtureName}/{:id} - success`, () => {
      return validityUtils.checkValidGet(fixtureName, this._server, fixture, options);
    });
  }

  testPatchValidSuccess(fixtureName, fixture, options) {
    it(`PATCH to /${fixtureName} - success`, () => {
      return validityUtils.checkValidPatch(fixtureName, this._server, fixture, options);
    });
  }

  testPostValidSuccess(fixtureName, fixture, options) {
    it(`POST to /${fixtureName} - success`, () => {
      return validityUtils.checkValidPost(fixtureName, this._server, fixture, options);
    });
  }

  testDeleteValidSuccess(fixtureName, fixture, options) {
    it(`DELETE from /${fixtureName}/{:id} - success`, () => {
      return validityUtils.checkValidDelete(fixtureName, this._server, fixture, options);
    });
  }

  testStandardActions(fixtureName, fixture, options) {
    describe(`Standard API actions for ${fixtureName}`, () => {
      before(() => {
        return dbUtils.dropDb(this._server);
      });

      this.testGetValidSuccess(fixtureName, fixture, options);
      this.testPatchValidSuccess(fixtureName, fixture, options);
      this.testPostValidSuccess(fixtureName, fixture, options);
      this.testDeleteValidSuccess(fixtureName, fixture, options);
    });
  }
}

module.exports = BaseTests;
