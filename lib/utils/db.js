'use strict';

const Promise = require('bluebird');
const _ = require('lodash');

function dropDb(server) {
  const harvesterPlugin = server.plugins['hapi-harvester'];
  return Promise
    .map(_.values(harvesterPlugin.adapter.models), model => {
      return model.remove({}).lean().exec();
    })
    .then(() => {
      return Promise.map(_.values(harvesterPlugin.adapter.models), model => {
        return new Promise(resolve => {
          model.ensureIndexes(resolve);
        });
      });
    });
}

module.exports = { dropDb };
