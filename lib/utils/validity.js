'use strict';

const _ = require('lodash');
const chai = require('chai');
const expect = chai.expect;
const httpUtils = require('./http');
const fixtures = require('../fixtures');

function getResponseFixture(res) {
  const payload = JSON.parse(res.payload);
  expect(payload.data).to.not.be.undefined;
  return _.isArray(payload.data) ? payload.data[0] : payload.data;
}

function removeLinks(_object) {
  const object = _object;
  if (_.isObject(object)) {
    delete object.links;
    _.forEach(object, value => {
      removeLinks(value);
    });
  }
  return object;
}

function getEndPoint() {
  return _.chain(arguments)
    .values()
    .filter()
    .reduce((acum, s) => `${acum}/${s}`, '')
    .value();
}

function checkBody(res, fixture, fixtureName) {
  expect(res.payload).to.not.be.undefined;
  const returnedFixture = getResponseFixture(res, fixtureName);
  removeLinks(returnedFixture);
  expect(_.isEqual(returnedFixture, fixture)).to.be.true;
  return res;
}

function checkValidPost(fixtureName, server, _fixture, _options) {
  const fixture = _fixture || fixtures.get(fixtureName, 1);
  const options = _options || {};
  const namespace = options.namespace;
  const endpoint = getEndPoint(namespace, fixtureName);

  return httpUtils
    .resourcePost(server, endpoint, { data: fixture })
    .then(res => checkBody(res, fixture, fixtureName));
}

function checkValidGet(fixtureName, server, _fixture, _options) {
  const fixture = _fixture || fixtures.get(fixtureName, 0);
  const options = _options || {};
  const namespace = options.namespace;
  const endpoint = getEndPoint(namespace, fixtureName);
  const fixtureEndpoint = `${endpoint}/${fixture.id}`;

  return httpUtils
    .resourcePost(server, endpoint, { data: fixture })
    .then(() => {
      return httpUtils.resourceGet(server, fixtureEndpoint)
        .then((res) => {
          return checkBody(res, fixture, fixtureName);
        });
    });
}

function checkValidPatch(fixtureName, server, _fixture, _options) {
  const fixture = _fixture || fixtures.get(fixtureName, 2);
  const options = _options || {};
  const namespace = options.namespace;
  const endpoint = getEndPoint(namespace, fixtureName);
  const fixtureEndpoint = `${endpoint}/${fixture.id}`;

  return httpUtils
    .resourcePost(server, endpoint, { data: fixture })
    .then(() => {
      // TODO: force a change to at least one of the fixture properties
      const body = {};
      body.data = _.omit(fixture, 'id');
      return httpUtils.resourcePatch(server, fixtureEndpoint, body)
        .then((res) => {
          return checkBody(res, fixture, fixtureName);
        });
    });
}

function checkValidDelete(fixtureName, server, _fixture, _options) {
  const fixture = _fixture || fixtures.get(fixtureName, 3);
  const options = _options || {};

  const namespace = options.namespace;
  const endpoint = getEndPoint(namespace, fixtureName);
  const fixtureEndpoint = `${endpoint}/${fixture.id}`;

  return httpUtils
    .resourcePost(server, endpoint, { data: fixture })
    .then(() => {
      return httpUtils.resourceDelete(server, fixtureEndpoint)
        .then(res => {
          // TODO: check whether resource is not available anymore
          return res;
        });
    });
}

module.exports = { checkValidPost, checkValidGet, checkValidPatch, checkValidDelete };
