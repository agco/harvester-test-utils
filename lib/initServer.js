'use strict';

const inject = require('./utils/inject');

module.exports = serverPromise => {
  return serverPromise.then(server => {
    return inject(server);
  });
};
