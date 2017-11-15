1.0.4 / 2017-11-15
==================
- Bugfix: Cannot read property 'compareWith' of undefined

1.0.3 / 2017-11-01
==================
- Ability to compare with custom fixture for patch tests
- Added before hook for automated POST tests (e.g. to seed a user)

1.0.2 / 2017-08-08
==================
- Made seed more flexible. Can now pass in multiple different models to seed at once.

1.0.1 / 2017-07-27
==================
- Feature: added `removeLinks` util to remove links from hapi-harvester responses
- Feature: added automated test for GetById routes
- Bugfix: return deep clone of fixture for `fixtures.get()` and `fixtures.getAll()`
- Bugfix: pass `credentials` object to inject function calls

1.0.0 / 2017-07-01
==================
- changed seeding to use db directly instead of http
- upgraded packages
- use jsonapi 1.0 by default
- refactor and cleanup

*This release has major changes and is not compatible with 0.0.x versions*

0.0.3 / 2017-06-29
==================
- Fixed bug in inject util. Now it returns the server object even if inject-then was already registered.

0.0.2 / 2016-04-29
==================
- Exposed DB utils

0.0.1 / 2016-02-27
==================
- Initial commit of test utils
