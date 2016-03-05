'use strict';

const Promise = require('bluebird');
const injectThen = require('inject-then');

module.exports = (server) => {
  return new Promise((resolve) => {
    if (!server.plugins['inject-then']) {
      server.register([{ register: injectThen }], () => resolve(server));
    }
  });
};
