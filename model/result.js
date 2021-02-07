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

/* eslint id-length: 'off' */
/* eslint no-catch-shadow: 'off' */
/* eslint no-underscore-dangle: 'off' */
'use strict';

const {ObjectID} = require('mongodb');

// Result model
module.exports = function(app, callback) {
	app.db.collection('results', async (errors, collection) => {
		await collection.createIndex({
			date: 1
		});

		const model = {
			collection: collection,

			// Create a result
			create(newResult) {
				if (!newResult.date) {
					newResult.date = Date.now();
				}
				if (newResult.task && !(newResult.task instanceof ObjectID)) {
					newResult.task = new ObjectID(newResult.task);
				}
				return collection.insert(newResult)
					.then(result => model.prepareForOutput(result.ops[0]))
					.catch(error => {
						console.error('model:result:create failed', error.message);
					});
			},

			// Default filter options
			_defaultFilterOpts(opts) {
				const now = Date.now();
				const thirtyDaysAgo = now - (1000 * 60 * 60 * 24 * 30);
				return {
					from: (new Date(opts.from || thirtyDaysAgo)).getTime(),
					to: (new Date(opts.to || now)).getTime(),
					full: Boolean(opts.full),
					task: opts.task
				};
			},

			// Get results
			_getFiltered(opts) {
				opts = model._defaultFilterOpts(opts);
				const filter = {
					date: {
						$lt: opts.to,
						$gt: opts.from
					}
				};
				if (opts.task) {
					filter.task = new ObjectID(opts.task);
				}

				const prepare = opts.full ? model.prepareForFullOutput : model.prepareForOutput;

				return collection
					.find(filter)
					.sort({date: -1})
					.limit(opts.limit || 0)
					.toArray()
					.then(results => results.map(prepare))
					.catch(error => {
						console.error('model:result:_getFiltered failed');
						console.error(error.message);
					});
			},

			// Get results for all tasks
			getAll(opts) {
				delete opts.task;
				return model._getFiltered(opts);
			},

			// Get a result by ID
			getById(id, full) {
				const prepare = (full ? model.prepareForFullOutput : model.prepareForOutput);
				try {
					id = new ObjectID(id);
				} catch (error) {
					console.error('ObjectID generation failed for id: ' + id, error.message);
					return null;
				}
				return model.collection.findOne({_id: id})
					.then(result => {
						if (result) {
							result = prepare(result);
						}
						return result;
					})
					.catch(error => {
						console.error(`model:result:getById failed, with id: ${id}`, error.message);
						return null;
					});
			},

			// Get results for a single task
			getByTaskId(id, opts) {
				opts.task = id;
				return model._getFiltered(opts);
			},

			// Delete results for a single task
			deleteByTaskId(id) {
				try {
					id = new ObjectID(id);
				} catch (error) {
					console.error('ObjectID generation failed for id: ' + id, error.message);
					return null;
				}
				return model.collection.deleteMany({task: id})
					.catch(error => {
						console.error(`model:result:deleteByTaskId failed, with id: ${id}`);
						console.error(error.message);
					});
			},

			// Get a result by ID and task ID
			getByIdAndTaskId(id, task, opts) {
				const prepare = (opts.full ? model.prepareForFullOutput : model.prepareForOutput);

				try {
					id = new ObjectID(id);
					task = new ObjectID(task);
				} catch (error) {
					console.error('ObjectID generation failed for id: ' + id, error.message);
					return null;
				}

				return model.collection.findOne({
					_id: id,
					task: task
				})
					.then(result => {
						if (result) {
							result = prepare(result);
						}
						return result;
					})
					.catch(error => {
						console.error(`model:result:getByIdAndTaskId failed, with id: ${id}`);
						console.error(error.message);
					});
			},

			// Prepare a result for output
			prepareForOutput(result) {
				result = model.prepareForFullOutput(result);
				delete result.results;
				return result;
			},
			prepareForFullOutput(result) {
				return {
					id: result._id.toString(),
					task: result.task.toString(),
					date: new Date(result.date).toISOString(),
					count: result.count,
					ignore: result.ignore || [],
					results: result.results || []
				};
			},
			convertPa11y2Results(results) {
				return {
					count: {
						total: results.issues.length,
						error: results.issues.filter(result => result.type === 'error').length,
						warning: results.issues.filter(result => result.type === 'warning').length,
						notice: results.issues.filter(result => result.type === 'notice').length
					},
					results: results.issues
				};
			}

		};
		callback(errors, model);
	});
};
