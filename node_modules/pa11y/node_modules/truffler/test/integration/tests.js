// jshint maxstatements: false
// jscs:disable disallowMultipleVarDecl, maximumLineLength
'use strict';

var assert = require('proclaim');
var truffler = require('../..');

describe('Truffler Example Application', function () {
	var error, test, exit;

	before(function (done) {
		var options = {
			page: {
				headers: {
					Foo: 'bar',
					Cookie: 'foo=bar'
				}
			},
			testFunction: function (browser, page, completeTest) {
				page.evaluate(
					function () {
						/* global document */
						return {
							title: document.title,
							body: document.body.textContent
						};
					},
					function (result) {
						completeTest(null, result);
					}
				);
			}
		};
		truffler(options, function (trufflerError, trufflerTest, trufflerExit) {
			error = trufflerError;
			test = trufflerTest;
			exit = trufflerExit;
			done();
		});
	});

	after(function () {
		exit();
	});

	it('Should not error', function () {
		assert.isNull(error);
	});

	describe('with basic HTML', function () {

		it('should report the title of a requested page', function (done) {
			test(this.websiteAddress + '/', function (error, result) {
				assert.isNull(error);
				assert.strictEqual(result.title, 'Index Page');
				done();
			});
		});

		it('should report the body text of the requested page', function (done) {
			test(this.websiteAddress + '/', function (error, result) {
				assert.isNull(error);
				assert.strictEqual(result.body.trim(), 'Hello World!');
				done();
			});
		});

	});

	describe('with headers', function () {

		it('send the expected headers to the requested page', function (done) {
			test(this.websiteAddress + '/header-dump', function (error, result) {
				assert.isNull(error);
				assert.strictEqual(result.body.trim(), 'Cookie: foo=bar\nFoo: bar');
				done();
			});
		});

	});

});
