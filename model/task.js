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
/*jshint maxcomplexity:10*/

'use strict';

var async = require('async');
var chalk = require('chalk');
var ObjectID = require('mongodb').ObjectID;
var pa11y = require('pa11y');

function pa11yLog(message) {
	console.log(chalk.grey('  > ' + message));
}

// Task model
module.exports = function(app, callback) {
	app.db.collection('tasks', function(err, collection) {
		collection.ensureIndex({
			name: 1,
			url: 1,
			standard: 1
		}, {
			w: -1
		});
		var model = {

			collection: collection,

			// Create a task
			create: function(newTask, callback) {
				collection.insert(newTask, function(err, result) {
					if (err) {
						return callback(err);
					}
					callback(null, model.prepareForOutput(result.ops[0]));
				});
			},

			// Get all tasks
			getAll: function(callback) {
				collection
					.find()
					.sort({
						name: 1,
						standard: 1,
						url: 1
					})
					.toArray(function(err, tasks) {
						if (err) {
							return callback(err);
						}
						callback(null, tasks.map(model.prepareForOutput));
					});
			},

			// Get a task by ID
			getById: function(id, callback) {
				try {
					id = new ObjectID(id);
				} catch (err) {
					return callback(null, null);
				}
				collection.findOne({_id: id}, function(err, task) {
					if (err) {
						return callback(err);
					}
					if (task) {
						task = model.prepareForOutput(task);
					}
					callback(null, task);
				});
			},

			// Edit a task by ID
			editById: function(id, edits, callback) {
				var idString = id;
				try {
					id = new ObjectID(id);
				} catch (err) {
					return callback(null, 0);
				}
				var now = Date.now();
				var taskEdits = {
					name: edits.name,
					timeout: parseInt(edits.timeout, 10),
					wait: parseInt(edits.wait, 10),
					username: edits.username,
					password: edits.password
				};
				if (edits.ignore) {
					taskEdits.ignore = edits.ignore;
				}
				collection.update({_id: id}, {$set: taskEdits}, function(err, updateCount) {
					if (err || updateCount < 1) {
						return callback(err, 0);
					}
					var annotation = {
						type: 'edit',
						date: now,
						comment: edits.comment || 'Edited task'
					};
					model.addAnnotationById(idString, annotation, function(err) {
						callback(err, updateCount);
					});
				});
			},

			// Add an annotation to a task
			addAnnotationById: function(id, annotation, callback) {
				model.getById(id, function(err, task) {
					if (err || !task) {
						return callback(err, 0);
					}
					id = new ObjectID(id);
					if (!Array.isArray(task.annotations)) {
						collection.update({_id: id}, {$set: {annotations: [annotation]}}, callback);
					} else {
						collection.update({_id: id}, {$push: {annotations: annotation}}, callback);
					}
				});
			},

			// Delete a task by ID
			deleteById: function(id, callback) {
				try {
					id = new ObjectID(id);
				} catch (err) {
					return callback(null);
				}
				collection.deleteOne({_id: id}, function(error, result) {
					callback(error, result ? result.deletedCount : null);
				});
			},

			// Run a task by ID
			runById: function(id, callback) {
				model.getById(id, function(err, task) {
					if (err) {
						return callback(err);
					}
					var pa11yOptions = {
						standard: task.standard,
						timeout: (task.timeout || 30000),
						wait: (task.wait || 0),
						ignore: task.ignore,
						phantom: {},
						log: {
							debug: pa11yLog,
							error: pa11yLog,
							log: pa11yLog
						}
					};
					if (task.username && task.password) {
						pa11yOptions.page = {
							settings: {
								userName: task.username,
								password: task.password
							}
						};
					}
					if (task.headers) {
						if (pa11yOptions.page) {
							pa11yOptions.page.headers = task.headers;
						} else {
							pa11yOptions.page = {
								headers: task.headers
							};
						}
					}
					if (task.hideElements) {
						pa11yOptions.hideElements = task.hideElements;
					}

					async.waterfall([

						function(next) {
							try {
								var test = pa11y(pa11yOptions);
								test.run(task.url, next);
							} catch (error) {
								next(error);
							}
						},

						function(results, next) {
							results = app.model.result.convertPa11y2Results(results);
							results.task = new ObjectID(task.id);
							results.ignore = task.ignore;
							app.model.result.create(results, next);
						}

					], callback);
				});
			},

			// Prepare a task for output
			prepareForOutput: function(task) {
				var output = {
					id: task._id.toString(),
					name: task.name,
					url: task.url,
					timeout: (task.timeout ? parseInt(task.timeout, 10) : 30000),
					wait: (task.wait ? parseInt(task.wait, 10) : 0),
					standard: task.standard,
					ignore: task.ignore || []
				};
				if (task.annotations) {
					output.annotations = task.annotations;
				}
				if (task.username) {
					output.username = task.username;
				}
				if (task.password) {
					output.password = task.password;
				}
				if (task.hideElements) {
					output.hideElements = task.hideElements;
				}
				if (task.headers) {
					output.headers = task.headers;
				}
				return output;
			}

		};
		callback(err, model);
	});
};
