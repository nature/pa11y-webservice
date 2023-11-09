// This file is part of Pa11y Webservice.
//
// Pa11y Webservice is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Pa11y Webservice is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Pa11y Webservice.  If not, see <http://www.gnu.org/licenses/>.
'use strict';

const util = require('util');
const assert = require('proclaim');
const app = require('../../app');

const config = {
	database: process.env.DATABASE || 'mongodb://127.0.0.1/pa11y-webservice-test',
	host: process.env.HOST || '0.0.0.0',
	port: process.env.PORT_FOR_SPINUP_TEST || 3010
};

describe('pa11y-webservice lifecycle', function() {
	it('should start and stop the service', async () => {
		const service = await util.promisify(app)(config);
		assert.isDefined(service);

		await service.server.stop();
	});
});
