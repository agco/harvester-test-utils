'use strict';

const chai = require('chai');
const expect = chai.expect;

function resourceGet(server, endpoint) {
  return server.injectThen({
    url: endpoint,
    method: 'get'
  }).then(res => {
    expect(res.statusCode).to.equal(200);
    return res;
  });
}

function resourcePatch(server, endpoint, body) {
  return server.injectThen({
    url: endpoint,
    method: 'patch',
    payload: body
  }).then(res => {
    expect(res.statusCode).to.equal(200);
    return res;
  });
}

function resourceDelete(server, endpoint) {
  return server.injectThen({
    url: endpoint,
    method: 'delete'
  }).then(res => {
    expect(res.statusCode).to.equal(204);
    return res;
  });
}

function resourcePost(server, endpoint, body) {
  return server.injectThen({
    url: endpoint,
    method: 'post',
    payload: body
  }).then(res => {
    expect(res.statusCode).to.equal(201);
    return res;
  });
}

module.exports = { resourceGet, resourcePost, resourcePatch, resourceDelete };
