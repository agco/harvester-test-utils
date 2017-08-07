'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const db = require('./utils/db');

const seed = (server, modelName, _data) => {
  const data = _.isArray(_data) ? _.cloneDeep(_data) : [_.cloneDeep(_data)];
  const adapter = server.plugins['hapi-harvester'].adapter;
  return Promise.map(data, d => adapter.create(modelName, d));
};

const dropAndSeed = (server, fixtures) => {
  const collectedFixtures = {};

  _.each(fixtures, value => {
    const data = _.isArray(value) ? value : [value];
    _.reduce(data, (result, value) => {
      result[value.type] = result[value.type] || [];
      result[value.type].push(value);
      return result;
    }, collectedFixtures);
  });

  const allPromises = _.map(collectedFixtures, (value, key) => {
    return db.dropModel(server, key).then(() => seed(server, key, value));
  });
  return Promise.all(allPromises);
};

module.exports = { dropAndSeed };
