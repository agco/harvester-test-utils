'use strict';

const chai = require('chai');
const expect = chai.expect;

const resourceGet = (server, endpoint, credentials) => {
  return server.injectThen({
    url: endpoint,
    method: 'get',
    headers: {
      jsonapiversion: '1.0'
    },
    credentials,
  }).then(res => {
    expect(res.statusCode).to.equal(200);
    return res;
  });
};

const resourcePatch = (server, endpoint, body, credentials) => {
  return server.injectThen({
    url: endpoint,
    method: 'patch',
    headers: {
      jsonapiversion: '1.0'
    },
    credentials,
    payload: body
  }).then(res => {
    expect(res.statusCode).to.equal(200);
    return res;
  });
};

const resourceDelete = (server, endpoint, credentials) => {
  return server.injectThen({
    url: endpoint,
    method: 'delete',
    headers: {
      jsonapiversion: '1.0'
    },
    credentials,
  }).then(res => {
    expect(res.statusCode).to.equal(204);
    return res;
  });
};

const resourcePost = (server, endpoint, body, credentials) => {
  return server.injectThen({
    url: endpoint,
    method: 'post',
    headers: {
      jsonapiversion: '1.0'
    },
    credentials,
    payload: body
  }).then(res => {
    expect(res.statusCode).to.equal(201);
    return res;
  });
};

module.exports = { resourceGet, resourcePost, resourcePatch, resourceDelete };
