# Pa11y Webservice

[![NPM version][shield-npm]][info-npm]
[![Node.js version support][shield-node]][info-node]
[![Build status][shield-build]][info-build]
[![GPL-3.0 licensed][shield-license]][info-license]

Pa11y Webservice is a Node.js service that can schedule accessibility testing for multiple URLs, using [Pa11y][pa11y].

Use this service if you'd like to coordinate your testing by interacting with a restful API. For other scenarios, another Pa11y tool may be more appropriate:

- [Pa11y Dashboard][pa11y-dashboard] provides a visual interface
- [Pa11y CI][pa11y-ci], and [Pa11y][pa11y] itself, can be executed from the command line, which is likely to be more useful for accessibility testing as part of a CI/CD workflow

## Requirements

- [Node.js][node]: Each major version of Pa11y Webservice is designed to support a set of stable/LTS versions of Node.js. Pa11y Webservice 5 requires Node.js `18` or `20`.
- [MongoDB][mongo]: The service stores test results in a MongoDB database and expects one to be available and running.

### Pally Webservice 4 and Linux/Ubuntu
Pa11y (and therefore this service) uses Headless Chrome to perform accessibility testing. On Linux and other Unix-like systems, Pa11y's attempt to install it as a dependency sometimes fails since additional operating system packages will be required. Your distribution's documentation should describe how to install these.


## Setup

Clone this repository:

```sh
git clone https://github.com/pa11y/pa11y-webservice.git
```

Now install its dependencies:

```sh
cd pa11y-webservice
npm install
```

We're nearly ready to run the service, but first we must provide some configuration.

## Configuration

The service can be configured in one of two ways: using environment variables, or using a configuration file. When both are present, the file's contents will override the environment variables. We provide some [sample configuration files](config) for reference.

Each configurable option is documented [here](#list-of-configuration-options), listed by its JSON-file property name. The environment variable equivalent for each option is identical, but upper-snake-cased.

### Configuration using environment variables

Supply each option to the service's environment. For example, to supply a port inline at the time of execution, the relevant environment variable would be `PORT`:

```sh
PORT=8080 npm start
```

### Configuration using a JSON file

Configuration can also be provided by a JSON file, allowing separate configurations to be maintained for multiple contexts. This method is also the only way to configure the instance of Headless Chrome that Pa11y will use.

We label each of these contexts a 'mode'. The mode is set by the `NODE_ENV` environment variable, and defaults to `development`. Pa11y Webservice will look for the mode's configuration file at `config/{mode}.json`. Providing `NODE_ENV=production` would lead to the service looking for `config/production.json`:

```sh
NODE_ENV=production npm start
```

The [`config`](config) directory here contains three examples. You could use one as a base to create your own configuration.

```sh
cp config/development.sample.json config/development.json
```

```sh
cp config/production.sample.json config/production.json
```

```sh
cp config/test.sample.json config/test.json
```

### List of configuration options

#### `database`

*(string)* The MongoDB [connection string][mongo-connection-string] for your database.

Env equivalent: `DATABASE`.

#### `host`

*(string)* The host to run the application on. This is normally best left as `"0.0.0.0"`, which means the application will run on any incoming connections.

Env equivalent: `HOST`.

#### `port`

*(number)* The port to run the application on.

Env equivalent: `PORT`.

#### `cron`

*(string)* A crontab which describes when to generate reports for each task.

Env equivalent: `CRON`.

#### `numWorkers`

*(number)* The number of workers that will be running concurrently on each cron execution.

Env equivalent: `NUM_WORKERS`.

#### `chromeLaunchConfig` (config file only)

*(object)* Options to be supplied to the instance of Headless Chrome that Pa11y will create. See [`chromeLaunchConfig`](https://github.com/pa11y/pa11y#chromelaunchconfig-object)'s documentation for more information.

Env equivalent: none. This option can only be defined by a file.

## API documentation

Our wiki documents the interface presented by this webservice:

- [Webservice endpoints][wiki-web-service]
- [Resource types][wiki-resources]

## Client libraries

- [Pa11y Webservice Node.js Client][pa11y-webservice-client-node]

## Contributing

There are many ways to contribute to Pa11y Webservice, we cover these in the [contributing guide](CONTRIBUTING.md) for this repo.

If you're ready to contribute some code, follow the [setup guide](#setup). The project can be linted and unit tested immediately:

```sh
npm run lint           # Lint the code
npm run test:unit      # Run the unit tests
```

The integration tests require the service to be running in the background, since they'll be checking its behaviour.

1. Create a configuration file for the `test` mode; one can be created quickly with `cp config/test.sample.json config/test.json`
1. Start the service in test mode with:

   ```sh
   NODE_ENV=test npm start &
   ```

   The `&` places the service into the background. An alternative approach is to run `NODE_ENV=test npm start`, suspend the process with `CTRL+z`, and finally run `bg` to place it into the background.

1. ```sh
   npm run test:integration   # Run the integration tests
   npm test                   # Run both the integration tests and the unit tests mentioned above
   ```

### Locally testing the GitHub Actions workflow `test.yml`

1. Install [Docker Desktop] and [Nektos Act]. You can install these directly, or with a software package manager. For example, with Homebrew:

   ```sh
   brew install --cask docker
   brew install act
   ```

1. To check the syntax of a GitHub Actions workflow before pushing it:

   ```sh
   # Verify `test.yml`
   act --dryrun push
   ```

   ```sh
   # Verify `publish.yml`
   act --dryrun release
   ```

1. To test the `push` workflow under Node.js 18 only:

   ```sh
   act push --matrix node-version:18
   ```

   Add `--verbose` for more information.

## Fixtures

If you'd like to preview Pa11y Webservice or present it to someone else, we've provided some [sample tasks and results](data/fixture), which can be embedded by running one of the following commands:

```sh
NODE_ENV=development npm run load-fixtures
```

```sh
NODE_ENV=test npm run load-fixtures
```

## Support and migration

> [!TIP]
> We maintain a [migration guide](MIGRATION.md) to help you migrate between major versions.

When we release a new major version we will continue to support the previous major version for 6 months. This support will be limited to fixes for critical bugs and security issues. If you're opening an issue related to this project, please mention the specific version that the issue affects.

The following table lists the major versions available and, for each previous major version, its end-of-support date, and its final minor version released.

| Major version | Final minor version | Node.js support              | [pa11y] version  | Support end date |
| :------------ | :-----------------  | :--------------------------- | :--------------- | :--------------- |
| `5`           |                     | `18`, `20`                   | `^8`             | ✅ Current major version |
| `4`           | `4.3`               | `12`, `14`, `16`, `18`, `20` | `^6`             | October 2024     |
| `3`           | `3.2`               | `8`, `10`                    | `^6`             | May 2022         |
| `2`           | `2.3`               | `4`, `6`                     | `^4`             | January 2020     |
| `1`           | `1.11`              | `0.10`, `0.12`, `4`, `6`     | `~3.7`           | December 2016    |

## License

Pa11y Webservice is licensed under the [GNU General Public License 3.0][info-license].  
Copyright &copy; 2013-2024, Team Pa11y and contributors

[mongo]: http://www.mongodb.org/
[mongo-connection-string]: http://docs.mongodb.org/manual/reference/connection-string/
[node]: http://nodejs.org/
[Docker Desktop]: https://www.docker.com/products/docker-desktop/
[Nektos Act]: https://nektosact.com/

[pa11y]: https://github.com/pa11y/pa11y
[pa11y-ci]: https://github.com/pa11y/pa11y-ci
[pa11y-dashboard]: https://github.com/pa11y/pa11y-dashboard
[pa11y-webservice-client-node]: https://github.com/pa11y/pa11y-webservice-client-node
[wiki-web-service]: https://github.com/pa11y/pa11y-webservice/wiki/Web-Service-Endpoints
[wiki-resources]: https://github.com/pa11y/pa11y-webservice/wiki/Resource-Types

[info-license]: LICENSE
[info-node]: package.json
[info-npm]: https://www.npmjs.com/package/pa11y-webservice
[info-build]: https://github.com/pa11y/pa11y-webservice/actions/workflows/tests.yml
[shield-license]: https://img.shields.io/badge/license-GPL%203.0-blue.svg
[shield-node]: https://img.shields.io/node/v/pa11y-webservice
[shield-npm]: https://img.shields.io/npm/v/pa11y-webservice.svg
[shield-build]: https://github.com/pa11y/pa11y-webservice/actions/workflows/tests.yml/badge.svg
