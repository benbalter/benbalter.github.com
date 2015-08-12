'use strict';

var async = require('async');
var truffler = require('../..');

// Start truffling
truffler({

	// The test function which will get run on URLs
	testFunction: function (browser, page, done) {

		// Evaluate the page, extract the title, and callback
		page.evaluate(
			function () {
				/* global document */
				return document.title;
			},
			function (result) {
				done(null, result);
			}
		);

	},

	// Log what's happening to the console
	log: {
		debug: console.log.bind(console),
		error: console.error.bind(console),
		info: console.log.bind(console)
	}

}, function (error, test, exit) {

	// Use the async library to run multiple tests in series
	// https://github.com/caolan/async
	async.series({

		// Test the Nature home page
		home: test.bind(null, 'http://nature.com/'),

		// Test the Nature Plants home page
		plants: test.bind(null, 'http://nature.com/nplants/')

	}, function (error, results) {

		// Log the results
		console.log('The title of the Nature home page is: ' + results.home);
		console.log('The title of the Nature Plants home page is: ' + results.plants);

		// Exit truffler
		exit();

	});

});
