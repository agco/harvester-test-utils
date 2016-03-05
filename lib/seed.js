'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const inject = require('./utils/inject');
const httpUtils = require('./utils/http');

/**
 * Configure Seed class.
 *
 * Sample usage:
 *
 * const seed = new Seed();
 * seed.init(serverPromise)
 *     .then((server) => { seed.dropCollectionsAndSeed(myFixtures); })
 *     .then(() => {
 *        // start tests
 *     });
 *
 */

class Seed {
  init(serverPromise) {
    return serverPromise.then(server => {
      this._server = server;
      return inject(server);
    });
  }

  _postAllFixtures(key, items) {
    return _(items).map(item => {
      const endpoint = `/${key}`;
      return httpUtils.resourcePost(this._server, endpoint, { data: item }).then(response => {
        return response.result.data.id;
      });
    }).thru(Promise.all)
      .value()
      .then(result => {
        return { [key]: result };
      });
  }

  drop(collectionName) {
    const model = this._server.plugins['hapi-harvester'].adapter.models[collectionName];
    if (model) {
      return model.remove({}).lean().exec();
    }
    return Promise.resolve();
  }

  /**
   * Drop collections whose names are specified in vararg manner.
   *
   * @returns {*} array of collection names
   */
  dropCollections() {
    if (arguments.length === 0) {
      throw new Error('Collection names must be specified explicitly');
    }
    const collectionNames = arguments;
    const promises = _.map(collectionNames, collectionName => this.drop(collectionName));
    return Promise.all(promises).then(() => {
      return collectionNames;
    });
  }

  seed(fixtures) {
    const promises = _.map(fixtures, (fixture, collectionName) => {
      return this._postAllFixtures(collectionName, fixture);
    });

    return Promise.all(promises)
      .then(result => {
        const response = {};
        _.forEach(result, item => {
          _.extend(response, item);
        });
        return response;
      });
  }

  dropCollectionsAndSeed(fixtures) {
    return this.dropCollections
      .apply(this, _.keys(fixtures))
      .then(() => this.seed(fixtures));
  }

}

module.exports = Seed;
