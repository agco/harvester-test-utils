'use strict';

const _ = require('lodash');
const chai = require('chai');
const expect = chai.expect;
const httpUtils = require('./http');
const fixtures = require('../fixtures');
const seed = require('../seed');
const db = require('./db');

const getResponseFixture = res => {
  const payload = JSON.parse(res.payload);
  expect(payload.data).to.not.be.undefined;
  return _.isArray(payload.data) ? payload.data[0] : payload.data;
};

const removeLinks = _object => {
  const object = _object;
  if (_.isObject(object)) {
    delete object.links;
    _.forEach(object, value => {
      removeLinks(value);
    });
  }
  return object;
};

const getEndPoint = (...theArgs) => {
  return _.chain(theArgs)
    .filter()
    .reduce((acum, s) => `${acum}/${s}`, '')
    .value();
};

const compareWithFixture = (obj, fixture, fixtureName) => {
  expect(obj).to.be.deep.equal(fixture[fixtureName]);
};

const checkBody = (res, fixture, fixtureName) => {
  expect(res.payload).to.not.be.undefined;
  const returnedFixture = getResponseFixture(res);
  removeLinks(returnedFixture);
  compareWithFixture(returnedFixture, fixture, fixtureName);
  return res;
};

const checkValidPost = (fixtureName, server, _fixture, _options) => {
  const fixture = _fixture || fixtures.get(fixtureName, 0);
  const options = _options || {};
  const namespace = options.namespace;
  const credentials = options.credentials;
  const endpoint = getEndPoint(namespace, fixtureName);
  const id = fixture[fixtureName].id;

  return db
    .dropModel(server, fixtureName)
    .then(() => httpUtils.resourcePost(server, endpoint, { data: fixture[fixtureName] }, credentials))
    .then(res => checkBody(res, fixture, fixtureName))
    .then(() => db.getModel(server, fixtureName, id))
    .then(dbResult => compareWithFixture(dbResult, fixture, fixtureName));
};

const checkValidGet = (fixtureName, server, _fixture, _options) => {
  const fixture = _fixture || fixtures.get(fixtureName, 0);
  const options = _options || {};
  const namespace = options.namespace;
  const credentials = options.credentials;
  const endpoint = getEndPoint(namespace, fixtureName);

  return seed
    .dropAndSeed(server, fixture)
    .then(() => httpUtils.resourceGet(server, endpoint, credentials))
    .then(res => checkBody(res, fixture, fixtureName));
};

const checkValidGetId = (fixtureName, server, _fixture, _options) => {
  const fixture = _fixture || fixtures.get(fixtureName, 0);
  const options = _options || {};
  const namespace = options.namespace;
  const credentials = options.credentials;
  const endpoint = getEndPoint(namespace, fixtureName);
  const fixtureEndpoint = `${endpoint}/${fixture[fixtureName].id}`;

  return seed
    .dropAndSeed(server, fixture)
    .then(() => httpUtils.resourceGet(server, fixtureEndpoint, credentials))
    .then(res => checkBody(res, fixture, fixtureName));
};

const checkValidPatch = (fixtureName, server, _fixture, _options) => {
  const fixture = _fixture || fixtures.get(fixtureName, 0);
  const seedFixture = _.cloneDeep(fixture);
  seedFixture[fixtureName].attributes = {};
  const options = _options || {};
  const namespace = options.namespace;
  const credentials = options.credentials;
  const endpoint = getEndPoint(namespace, fixtureName);
  const id = fixture[fixtureName].id;
  const fixtureEndpoint = `${endpoint}/${id}`;

  return seed
    .dropAndSeed(server, seedFixture)
    .then(() => {
      const body = {};
      body.data = _.omit(fixture[fixtureName], 'id');
      return httpUtils.resourcePatch(server, fixtureEndpoint, body, credentials);
    })
    .then((res) => checkBody(res, fixture, fixtureName))
    .then(() => db.getModel(server, fixtureName, id))
    .then(dbResult => compareWithFixture(dbResult, fixture, fixtureName));
};

const checkValidDelete = (fixtureName, server, _fixture, _options) => {
  const fixture = _fixture || fixtures.get(fixtureName, 0);
  const options = _options || {};

  const namespace = options.namespace;
  const credentials = options.credentials;
  const endpoint = getEndPoint(namespace, fixtureName);
  const id = fixture[fixtureName].id;
  const fixtureEndpoint = `${endpoint}/${id}`;

  return seed
    .dropAndSeed(server, fixture)
    .then(() => httpUtils.resourceDelete(server, fixtureEndpoint, credentials))
    .then(() => db.getModel(server, fixtureName, id))
    .then(result => {
      expect(result).to.be.undefined;
    });
};

module.exports = { checkValidPost, checkValidGet, checkValidGetId, checkValidPatch, checkValidDelete, removeLinks };
