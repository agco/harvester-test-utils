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
  const allPromises = _.map(fixtures, (value, key) => {
    return db.dropModel(server, key).then(() => seed(server, key, value));
  });
  return Promise.all(allPromises);
};

module.exports = { dropAndSeed };
