'use strict';

const BaseTests = require('./lib/baseTests');
const fixtures = require('./lib/fixtures');
const seed = require('./lib/seed');
const initServer = require('./lib/initServer');
const db = require('./lib/utils/db');
const removeLinks = require('./lib/utils/validity').removeLinks;

module.exports = {
  fixtures, BaseTests, seed, initServer, db, removeLinks
};
