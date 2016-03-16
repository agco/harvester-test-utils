# Harvester Test Utils
*npm module for testing hapi-harvester based applications*

## Installation

```
npm install harvester-test-utils
```

## Requirements
To use `harvester-test-utils` your project has to meet some prerequisites.
* It only works for projects using [hapi-harvester](https://github.com/agco/hapi-harvester).
* It must use [mochajs](https://mochajs.org/) as testing framework

## Usage

### Testing standard actions
The `harvester-test-utils` offer a convenient way to test the default routes that are defined in the hapi-harvester
framework.

#### Initialization
The hapi-harvester server needs to be initialized before the test utils can be used. Usually this is done in the
before block of the test suite. You have to pass a Promise that eventually will yield a hapijs server instance.
The `init` method also returns a Promise.

```javascript
const testUtils = require('harvester-test-utils');
const baseTests = new testUtils.BaseTests();
const serverPromise = require('../../lib/server');

before(() => {
  return baseTests.init(serverPromise);
});
```

#### Test all routes
The most simple thing is to just test all default routes for a resource, of course only if you have defined
 all routes.

```javascript
baseTests.testStandardActions('myResource');
```

#### Test specific actions only
In cases where you only defined a few actions for a resource you can test them individually.
```javascript
baseTests.testGetValidSuccess('myResource');
```
This only tests the GET action for `myResource`. Also available are:
```
baseTests.testPatchValidSuccess('myResource');
baseTests.testPostValidSuccess('myResource');
baseTests.testDeleteValidSuccess('myResource');
```
#### Method arguments
All methods take 3 arguments.
```javascript
baseTests.testGetValidSuccess(resourceName, fixture, options);
```
* `resourceName` is a string with the resource name, e.g. `'myResource'`
* `fixture` is for passing in your own fixture. By default it will identify the fixtures by name and pick the first.
Read more about [fixtures](#fixtures).
* `options` Currently available options are
 * `namespace` a string with a namespace for the endpoints. E.g. `'allMyResources'`


### Init server
In some cases your tests are more complex than just testing default routes. You can still use `harvester-test-utils`
to initialize your server properly. Currently this will just register `inject-then`
(https://github.com/bendrucker/inject-then) with the hapijs server instance. In the future this might do
more initialization steps.

```javascript
const expect = require('chai').expect;
const testUtils = require('harvester-test-utils');
const initServer = new testUtils.initServer;
const serverPromise = require('../../lib/server');

let server = null;

before(() => {
  return initServer(serverPromise).then(_server => {
    server = _server;
  });
});

it('will do some stuff', () => {
  return server.injectThen({
    url: '/myResource',
    method: 'post',
    payload: {
      data: {
        type: 'myResource',
        attributes: {
          fun: 'is good',
          moreFun: 'is better'
        }
      }
    }
  })
  .then(response => {
    expect(response.statusCode).to.equal(201);
  });
});
```

### Fixtures
Fixtures in testing are a convenient way to get ready-to-use objects. You must put all fixtures in a folder called
`fixtures` in your test folder. Fixture files can either be of type `.json` or `.js`. It must contain
or export an array with at least one element.

#### Defining Fixtures
Fixture as JavaScript file:

```javascript
module.exports = [
  {
    id: 'e05bf92b-39a2-4525-9913-a9cda6ddc9a4',
    type: 'myResource',
    attributes: {
      fun: 'is good',
      moreFUn: 'is better'
    }
  }
];
```

Fixture as JSON file:

```json
[
  {
    "id": "e05bf92b-39a2-4525-9913-a9cda6ddc9a4",
    "type": "myResource",
    "attributes": {
      "fun": "is good",
      "moreFun": "is better"
    }
  }
]
```

#### Using Fixtures
Once defined in your project it's easy to load and use them. Anywhere in your test framework just require `fixtures`.
Fixtures will be cached and only be read from disk once.

```javascript
const testUtils = require('harvester-test-utils');
const fixtures = testUtils.fixtures;

const myResources = fixtures.get('myResource', 0); // gets myResource with index 0 from the array
const allFixtures = fixtures.getAll(); // gets all fixtures in the fixtures folder in an array
```

### Seed data
With `harvester-test-utils` you can pre-seed your database with fixtures you need for testing.

#### Drop Collections and Seed
The most simple way is to drop everything and recreate it. This way you can make sure always to test from a
fresh database. This method returns a Promise.

```
const testUtils = require('harvester-test-utils');
const fixtures = testUtils.fixtures;
const seedUtils = new testUtils.Seed();
const serverPromise = require('../../lib/server');
let server = null;

before(() => {
  return seedUtils.init(serverPromise).then(_server => {
    server = _server;
    return seedUtils.dropCollectionsAndSeed(fixtures.getAll());
  });
});
```

## License

The MIT License (MIT)

Copyright (c) 2016 AGCO

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
