'use strict';

const validityUtils = require('./utils/validity');
const inject = require('./utils/inject');
const db = require('./utils/db');

class BaseTests {
  init(serverPromise) {
    return serverPromise
      .then(server => {
        this._server = server;
        return db.dropAll(server);
      })
      .then(() => inject(this._server));
  }

  testGetIdValidSuccess(fixtureName, fixture, options) {
    it(`GET from /${fixtureName}/{:id} - success`, () => {
      return validityUtils.checkValidGetId(fixtureName, this._server, fixture, options);
    });
  }

  testGetValidSuccess(fixtureName, fixture, options) {
    it(`GET from /${fixtureName} - success`, () => {
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
      this.testGetIdValidSuccess(fixtureName, fixture, options);
      this.testGetValidSuccess(fixtureName, fixture, options);
      this.testPatchValidSuccess(fixtureName, fixture, options);
      this.testPostValidSuccess(fixtureName, fixture, options);
      this.testDeleteValidSuccess(fixtureName, fixture, options);
    });
  }
}

module.exports = BaseTests;
