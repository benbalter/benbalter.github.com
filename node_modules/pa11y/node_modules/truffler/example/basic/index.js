'use strict';

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

	// Test http://nature.com/
	test('nature.com', function (error, result) {

		// Log the result
		console.log('The title of the page is: ' + result);

		// Exit truffler
		exit();

	});

});
