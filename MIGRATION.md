# Migration guide

Pa11y Webservice's API changes between major versions. This is a guide to help you make the switch when this happens.

## Table of contents

* [Table of contents](#table-of-contents)
* [Migrating from 4.0 to 5.0](#migrating-from-40-to-50)
* [Migrating from 3.0 to 4.0](#migrating-from-30-to-40)
* [Migrating from 2.0 to 3.0](#migrating-from-20-to-30)
  * [PhantomJS to Headless Chrome](#phantomjs-to-headless-chrome)
  * [Node.js support for 3.0](#nodejs-support-for-30)
  * [Miscellaneous](#miscellaneous)
* [Migrating from 1.0 to 2.0](#migrating-from-10-to-20)
  * [Node.js support for 2.0](#nodejs-support-for-20)

## Migrating from 4.0 to 5.0

Pa11y Webservice 5 requires Node.js version `18` or `20`.

## Migrating from 3.0 to 4.0

Pa11y Webservice 4 requires Node.js version `12`, `14`, `16`, `18`, or `20`.

To run this version on Ubuntu 20.04 or above, a path to the Chrome executable must be defined in [chromeLaunchConfig](README#chromelaunchconfig-config-file-only), as `chromeLaunchConfig.executablePath`.

## Migrating from 2.0 to 3.0

### PhantomJS to Headless Chrome

Pa11y Webservice 3 uses version 5 of Pa11y, which replaces PhantomJS with [Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome). This allows us to use more modern JavaScript APIs and make Pa11y testing more stable.

As a result of this change, [Pa11y Webservice's requirements](../README.md#requirements) have changed, and you may need to install additional dependencies required by Chrome before being able to use this version.

### Node.js support for 3.0

Pa11y Webservice 3 requires Node.js version `8` or `10`.

### Miscellaneous

The default viewport dimensions for Pa11y have been changed from `1024x768` to `1280x1024`. This could make pa11y report a different number of errors if different content appears on the page based on its width, so results obtained with v2 and v3 may not be comparable.

## Migrating from 1.0 to 2.0

### Node.js support for 2.0

The only breaking change in Pa11y Webservice 2.0 is that Node.js 0.10 and 0.12 are no longer supported. We'll be using newer ES6 features in upcoming releases which will not work in these older Node.js versions.
