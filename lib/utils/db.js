'use strict';

const Promise = require('bluebird');
const _ = require('lodash');

const _drop = model => {
  return model.remove({}).lean().exec().then(() => model.ensureIndexes());
};

const getModel = (server, modelName, id) => {
  const adapter = server.plugins['hapi-harvester'].adapter;
  return adapter.find(modelName, { id }).then(result => result[0]);
};

const dropModel = (server, modelName) => {
  const model = server.plugins['hapi-harvester'].adapter.models[modelName];
  if (model) {
    return _drop(model);
  }
  return Promise.reject(new Error(`Model ${modelName} not found.`));
};

const dropAll = server => {
  const harvesterPlugin = server.plugins['hapi-harvester'];
  const models = _.values(harvesterPlugin.adapter.models);
  return Promise.map(models, model => _drop(model));
};

module.exports = { dropAll, dropModel, getModel };
