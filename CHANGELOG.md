# Changelog

## 5.0.0

* **Major** Require Node.js `18` or `20`
* **Major** Upgrade to `pa11y@^8` from `^6`
  * Includes an upgrade to Puppeteer `^22` from `9`.
  * Fixes compatibility with Ubuntu versions 20.04 and above. The [workaround](MIGRATION.md#migrating-from-30-to-40) documented for `pa11y-webservice@4` is no longer required.
* **Major** Upgrade to `hapi@21` from `20`
* Upgrade to `minimatch@3.1` from `3.0`

Full comparison to `4.3.1`: [4.3.1...5.0.0](https://github.com/pa11y/pa11y/compare/4.3.1...5.0.0)

## 4.3.1 (2023-11-15)

* Fix bug in naming when requiring `lodash.groupby`

## 4.3.0 (2023-11-14)

* Set dependency `pa11y` to `^6.2.3` from `~6.2.3` to permit minor level upgrades to take place at installation time.
* Indicate increased confidence in compatibility of:
  * Node.js versions `18`, `20` (added to `12`, `14`, `16`)
  * MongoDB versions `2-7`
* Document workaround for Ubuntu > `20.04`

## 4.2.0 (2023-11-13)

* Update to `pa11y@~6.2.3` from `~6.1.0`
* Other dependency updates above patch level:
  * `hapi@~20.3` from `~20.2`
  * `cron@~2.4` from `~1.8`
  * `joi@~17.11` from `~17.4`
  * `mongodb@~3.7` from `~3.6`

## 4.1.0 (2022-04-25)

* Add support for Node v16 via upgrading Hapi to the latest version
* Log the number of workers configured when starting the app

## 4.0.1 (2022-03-15)

* Address warnings related to mongodb event listening

## 4.0.0 (2021-11-26)

* Update pa11y to version 6.
* Drop support for versions of Node.js older than 12.
* Update MongoDB Node driver from v2 to v3, which adds support for MongoDB v4 databases.

## 3.2.1 (2021-04-27)

* Update pa11y to version 5.3.1
* Fixes a potential security issue where MongoDB username and password could be shown in logs (#124).

## 3.2.0 (2020-10-05)

* Update pa11y to version 5.3.0, which means better compatibility with sites using AMD modules
* Add the ability to configure the number of workers running pa11y tests (thanks @carlochess)
* Update several dependencies
* Replace chalk with kleur

## 3.1.2 (2019-09-27)

* Add data fixtures back, which are required by pa11y-dashboard to run its tests.

## 3.1.1 (2019-09-27)

* Bump pa11y to 5.2.1, which fixes an issue with some sites failing.

## 3.1.0 (2019-09-20)

* Display the task ID before each line of output, so it's clear to which task a line of output belongs to.

## 3.0.1 (2019-09-13)

* Fix a critical issue with the pa11y tasks not being launched properly by cron
* Minor doc improvements

## 3.0.0 (2019-07-04)

* Update pa11y to v5, which replaces Phantomjs with Headless Chrome (thanks @wilco42)
* Add new index page, useful when running webservice as a standalone process (thanks @rtshilston)
* Add additional debugging info
* Update dependencies (thanks @paazmaya, @josebolos, and others)
* Bump required node version to v8 or greater
* Lots of bug fixes (thanks @joeyciechanowicz for this, and also for helping reviewing PRs and issues)
* Documentation updates (thanks to @josebolos for this)
* See the [migration guide](https://github.com/pa11y/webservice/blob/master/MIGRATION.md#migrating-from-20-to-30) for details of the breaking changes in this release

## 2.3.1 (2017-11-28)

* Update tooling
* Update dependencies
  * pa11y: ^4.5.0 to ^4.13.2

## 2.3.0 (2017-01-27)

* Add support for Pa11y actions
* Update dependencies
  * pa11y: ~4.1 to ^4.5.0

## 2.2.0 (2016-11-21)

* Update dependencies
  * pa11y: ~4.0 to ~4.1

## 2.1.2 (2016-11-07)

* Fix the task hideElements option

## 2.1.1 (2016-11-07)

* Fix the task header option

## 2.1.0 (2016-10-19)

* Allow setting of headers and hidden elements

## 2.0.1 (2016-08-19)

* Add license field to package.json
* Upgrade mocha to version 3
* Upgrade hapi from ~9.3 to ~12.1. Fixes:
  * [https://nodesecurity.io/advisories/45](https://nodesecurity.io/advisories/45)
  * [https://nodesecurity.io/advisories/63](https://nodesecurity.io/advisories/63)
  * [https://nodesecurity.io/advisories/65](https://nodesecurity.io/advisories/65)
  * [https://nodesecurity.io/advisories/121](https://nodesecurity.io/advisories/121)

## 2.0.0 (2016-06-05)

* Drop Node.js 0.10–0.12 support
* Update dependencies
  * pa11y: ~3.7 to ~4.0
* See the [migration guide](https://github.com/pa11y/webservice/blob/master/MIGRATION.md#migrating-from-10-to-20) for details

## 1.11.1 (2016-06-05)

* Update references/links after a repo rename

## 1.11.0 (2016-05-26)

* Update Node.js version support to 0.10–6.0
* Update dependencies
  * async: ~1.4 to ~1.5
  * cron: ~1.0 to ~1.1
  * freeport: removed
  * hapi: ~1.9 to ~9.3
  * joi: added at ~6.10
  * mongodb: ~2.0 to ~2.1
  * pa11y: ~3.6 to ~3.7
  * request: ~2.61 to ^2
* Update references/links to the new Pa11y organisation

## 1.10.0 (2016-05-22)

* Add the ability to configure task wait times

## 1.9.0 (2016-05-18)

* Allow configuration by environment variables
* Fix an issue with the HTTP auth feature
* Fix typos

## 1.8.1 (2016-04-25)

* Correct an out-of-date error message

## 1.8.0 (2016-04-17)

* Add a `SIGINT` handler
* Switch from Grunt to Make
* Fix all lint errors
* Update dependencies
  * pa11y: ~3.0 to ~3.6

## 1.7.0 (2016-03-16)

* Save all Pa11y results rather than choosing certain properties
* Fix the `npm start` script
* Display startup errors in the logs

## 1.6.4 (2016-02-09)

* Update Node.js version support

## 1.6.3 (2015-10-16)

* Update dependencies
  * pa11y: ~2.4 to ~3.0

## 1.6.2 (2015-08-20)

* Update dependencies
  * mongodb: ~1.3 to ~2.0

## 1.6.1 (2015-07-07)

* Make PhantomJS port finding more robust

## 1.6.0 (2015-07-06)

* Add the ability to configure task username and password (basic auth)

## 1.5.1 (2015-07-02)

* Update dependencies
  * pa11y: ~1.6 to ~2.3

## 1.5.0 (2015-07-02)

* Add the ability to configure task timeouts

## 1.4.0 (2015-01-17)

* Update dependencies
  * pa11y: ~1.5 to ~1.6

## 1.3.2 (2014-03-15)

* Fix the documentation for starting the app

## 1.3.1 (2014-02-10)

* Add the GPL preamble to all files

## 1.3.0 (2013-12-11)

* Add ignore rules to result fixtures
* Store the currently active ignore rules on results

## 1.2.0 (2013-11-27)

* Index task names
* Add edit annotations to tasks
* Add an endpoint for task editing

## 1.1.1 (2013-11-21)

* Restructure the way fixtures are loaded

## 1.1.0 (2013-11-21)

* Fix typos
* Remove supervisor
* Add build status to the README
* Add a Travis config

## 1.0.0 (2013-11-19)

* Initial stable release

## 1.0.0-beta.9 pre-release (2013-11-15)

* Sort tasks by name first
* Add a list of client libraries

## 1.0.0-beta.8 pre-release (2013-11-11)

* Add a "name" property to tasks
* Add a grunt task for running in test/development

## 1.0.0-beta.7 pre-release (2013-11-05)

* Move from Make to Grunt
* Add indices to collections
* Update dependencies
  * pa11y: ~1.4 to ~1.5

## 1.0.0-beta.6 pre-release (2013-10-03)

* Add the ability to run a single task ad-hoc

## 1.0.0-beta.5 pre-release (2013-09-27)

* Add more varied data to fixtures, and add development fixtures

## 1.0.0-beta.4 pre-release (2013-09-25)

* Add full details to individual task when last result is requested
* Remove related results when a task is deleted

## 1.0.0-beta.3 pre-release (2013-09-20)

* Add an endpoint for getting a single result
* Fix typos

## 1.0.0-beta.2 pre-release (2013-09-16)

* Allow requesting the last result for a task in the API

## 1.0.0-beta.1 pre-release (2013-09-12)

* Initial release
