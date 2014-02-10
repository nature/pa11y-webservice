// This file is part of pa11y-webservice.
// 
// pa11y-webservice is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// pa11y-webservice is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with pa11y-webservice.  If not, see <http://www.gnu.org/licenses/>.

'use strict';

var chalk = require('chalk');
var Hapi = require('hapi');

// Routes relating to individual tasks
module.exports = function (app) {
	var model = app.model;
	return [

		// Get a task
		{
			method: 'GET',
			path: '/tasks/{id}',
			handler: function (req) {
				model.task.getById(req.params.id, function (err, task) {
					if (err) {
						return req.reply().code(500);
					}
					if (!task) {
						return req.reply({
							code: 404,
							error: 'Not Found'
						}).code(404);
					}
					if (req.query.lastres) {
						model.result.getByTaskId(task.id, {
							limit: 1,
							full: true
						}, function (err, results) {
							if (err || !results) {
								return req.reply().code(500);
							}
							task.last_result = null;
							if (results && results.length) {
								task.last_result = results[0];
							}
							req.reply(task).code(200);
						});
					} else {
						req.reply(task).code(200);
					}
				});
			},
			config: {
				validate: {
					query: {
						lastres: Hapi.types.Boolean()
					},
					payload: false
				}
			}
		},

		// Edit a task
		{
			method: 'PATCH',
			path: '/tasks/{id}',
			handler: function (req) {
				model.task.getById(req.params.id, function (err, task) {
					if (err) {
						return req.reply().code(500);
					}
					if (!task) {
						return req.reply({
							code: 404,
							error: 'Not Found'
						}).code(404);
					}
					model.task.editById(task.id, req.payload, function (err, updateCount) {
						if (err || updateCount < 1) {
							return req.reply().code(500);
						}
						model.task.getById(task.id, function (err, task) {
							if (err) {
								return req.reply().code(500);
							}
							req.reply(task).code(200);
						});
					});
				});
			},
			config: {
				validate: {
					query: {},
					payload: {
						name: Hapi.types.String().required(),
						ignore: Hapi.types.Array(),
						comment: Hapi.types.String()
					}
				}
			}
		},

		// Delete a task
		{
			method: 'DELETE',
			path: '/tasks/{id}',
			handler: function (req) {
				model.task.deleteById(req.params.id, function (err, task) {
					if (err) {
						return req.reply().code(500);
					}
					if (!task) {
						return req.reply({
							code: 404,
							error: 'Not Found'
						}).code(404);
					}
					model.result.deleteByTaskId(req.params.id, function (err) {
						if (err) {
							return req.reply().code(500);
						}
						req.reply().code(204);
					});
				});
			},
			config: {
				validate: {
					query: {},
					payload: false
				}
			}
		},

		// Run a task
		{
			method: 'POST',
			path: '/tasks/{id}/run',
			handler: function (req) {
				model.task.getById(req.params.id, function (err, task) {
					if (err) {
						return req.reply().code(500);
					}
					if (!task) {
						return req.reply({
							code: 404,
							error: 'Not Found'
						}).code(404);
					}
					if (process.env.NODE_ENV !== 'test') {
						console.log('');
						console.log(chalk.grey('Starting to run one-off task @ %s'), new Date());
						console.log('Starting task %s', task.id);
						model.task.runById(req.params.id, function (err) {
							if (err) {
								console.log(
									chalk.red('Failed to finish task %s: %s'),
									task.id,
									err.message
								);
							} else {
								console.log(chalk.green('Finished task %s'), task.id);
							}
							console.log(
								chalk.grey('Finished running one-off task @ %s'),
								new Date()
							);
						});
					}
					req.reply().code(202);
				});
			},
			config: {
				validate: {
					query: {},
					payload: {}
				}
			}
		},

		// Get results for a task
		{
			method: 'GET',
			path: '/tasks/{id}/results',
			handler: function (req) {
				model.task.getById(req.params.id, function (err, task) {
					if (err) {
						return req.reply().code(500);
					}
					if (!task) {
						return req.reply({
							code: 404,
							error: 'Not Found'
						}).code(404);
					}
					model.result.getByTaskId(req.params.id, req.query, function (err, results) {
						if (err || !results) {
							return req.reply().code(500);
						}
						req.reply(results).code(200);
					});
				});
			},
			config: {
				validate: {
					query: {
						from: Hapi.types.String().date(),
						to: Hapi.types.String().date(),
						full: Hapi.types.Boolean()
					},
					payload: false
				}
			}
		},

		// Get a result for a task
		{
			method: 'GET',
			path: '/tasks/{tid}/results/{rid}',
			handler: function (req) {
				var rid = req.params.rid;
				var tid = req.params.tid;
				model.result.getByIdAndTaskId(rid, tid, req.query, function (err, result) {
					if (err) {
						return req.reply().code(500);
					}
					if (!result) {
						return req.reply({
							code: 404,
							error: 'Not Found'
						}).code(404);
					}
					req.reply(result).code(200);
				});
			},
			config: {
				validate: {
					query: {
						full: Hapi.types.Boolean()
					},
					payload: false
				}
			}
		}

	];
};
