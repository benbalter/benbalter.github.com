// jshint maxstatements: false
// jscs:disable disallowMultipleVarDecl, maximumLineLength
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');
var sinon = require('sinon');

describe('lib/truffler', function () {
	var extend, hasbin, phantom, pkg, truffler;

	beforeEach(function () {

		extend = sinon.spy(require('node.extend'));
		mockery.registerMock('node.extend', extend);

		hasbin = require('../mock/hasbin');
		mockery.registerMock('hasbin', hasbin);

		phantom = require('../mock/phantom');
		mockery.registerMock('phantom', phantom);

		pkg = require('../../../package.json');

		truffler = require('../../../lib/truffler');

	});

	it('should be a function', function () {
		assert.isFunction(truffler);
	});

	describe('.defaults', function () {
		var defaults;

		beforeEach(function () {
			defaults = truffler.defaults;
		});

		it('should have a `log` property', function () {
			assert.isObject(defaults.log);
		});

		it('should have a `log.debug` method', function () {
			assert.isFunction(defaults.log.debug);
		});

		it('should have a `log.error` method', function () {
			assert.isFunction(defaults.log.error);
		});

		it('should have a `log.info` method', function () {
			assert.isFunction(defaults.log.info);
		});

		it('should have a `page` property', function () {
			assert.isObject(defaults.page);
		});

		it('should have a `page.headers` property', function () {
			assert.isObject(defaults.page.headers);
		});

		it('should have a `page.settings` property', function () {
			assert.isObject(defaults.page.settings);
		});

		it('should have a `page.settings.userAgent` property', function () {
			assert.strictEqual(defaults.page.settings.userAgent, 'truffler/' + pkg.version);
		});

		it('should have a `page.viewport` property', function () {
			assert.isObject(defaults.page.viewport);
		});

		it('should have a `page.viewport.width` property', function () {
			assert.strictEqual(defaults.page.viewport.width, 1024);
		});

		it('should have a `page.viewport.width` property', function () {
			assert.strictEqual(defaults.page.viewport.height, 768);
		});

		it('should have a `phantom` property', function () {
			assert.isObject(defaults.phantom);
		});

		it('should have a `phantom.port` property', function () {
			assert.strictEqual(defaults.phantom.port, 12300);
		});

		it('should have a `testFunction` method', function () {
			assert.isFunction(defaults.testFunction);
		});

	});

	it('should not callback with an error', function (done) {
		truffler({}, function (error) {
			assert.isNull(error);
			done();
		});
	});

	it('should callback with a test function', function (done) {
		truffler({}, function (error, test) {
			assert.isFunction(test);
			done();
		});
	});

	it('should callback with an exit function', function (done) {
		truffler({}, function (error, test, exit) {
			assert.isFunction(exit);
			done();
		});
	});

	it('should default the options', function (done) {
		var options = {};
		truffler(options, function () {
			assert.calledOnce(extend);
			assert.isTrue(extend.firstCall.args[0]);
			assert.isObject(extend.firstCall.args[1]);
			assert.strictEqual(extend.firstCall.args[2], truffler.defaults);
			assert.strictEqual(extend.firstCall.args[3], options);
			done();
		});
	});

	it('should check for presence of PhantomJS binary', function (done) {
		truffler({}, function () {
			assert.calledOnce(hasbin.some);
			assert.calledWith(hasbin.some, ['phantomjs', 'phantomjs.exe']);
			done();
		});
	});

	it('should callback with an error if PhantomJS is not found', function (done) {
		hasbin.some.yieldsAsync(false);
		truffler({}, function (error) {
			assert.strictEqual(error.message, 'PhantomJS binary was not found in PATH');
			done();
		});
	});

	it('should create a PhantomJS browser with the expected options', function (done) {
		truffler({}, function () {
			assert.calledOnce(phantom.create);
			assert.isFunction(phantom.create.firstCall.args[0]);
			assert.strictEqual(phantom.create.firstCall.args[1], extend.firstCall.returnValue.phantom);
			done();
		});
	});

	it('should log the creation of a PhantomJS browser', function (done) {
		var options = {
			log: {
				info: sinon.spy()
			}
		};
		truffler(options, function () {
			assert.calledWith(options.log.info, 'PhantomJS browser created');
			done();
		});
	});

	describe('test function', function () {
		var options, test;

		beforeEach(function (done) {
			options = {
				log: {
					debug: sinon.spy(),
					error: sinon.spy(),
					info: sinon.spy()
				},
				page: {
					headers: {
						foo: 'bar'
					},
					settings: {
						foo: 'bar',
						bar: 'baz'
					},
					viewport: {
						width: 1234,
						height: 5678
					}
				},
				testFunction: sinon.stub().yieldsAsync(null, 'result')
			};
			truffler(options, function (error, testFn) {
				test = testFn;
				done();
			});
		});

		it('should callback without an error', function (done) {
			test('http://foo', function (error) {
				assert.isNull(error);
				done();
			});
		});

		it('should log that the test has begun', function (done) {
			test('http://foo', function () {
				assert.calledWith(options.log.info, 'Testing page: "http://foo"');
				done();
			});
		});

		it('should create a PhantomJS page', function (done) {
			test('http://foo', function () {
				assert.calledOnce(phantom.mockBrowser.createPage);
				assert.isFunction(phantom.mockBrowser.createPage.firstCall.args[0]);
				done();
			});
		});

		it('should log that the PhantomJS page has been created', function (done) {
			test('http://foo', function () {
				assert.calledWith(options.log.debug, 'PhantomJS page created for "http://foo"');
				done();
			});
		});

		it('should set the page\'s settings', function (done) {
			test('http://foo', function () {
				assert.calledWith(phantom.mockPage.set, 'settings.foo', 'bar');
				assert.calledWith(phantom.mockPage.set, 'settings.bar', 'baz');
				done();
			});
		});

		it('should set the page\'s viewport', function (done) {
			test('http://foo', function () {
				assert.calledWith(phantom.mockPage.set, 'viewportSize', options.page.viewport);
				done();
			});
		});

		it('should set the page\'s headers', function (done) {
			test('http://foo', function () {
				assert.calledWith(phantom.mockPage.set, 'customHeaders', options.page.headers);
				done();
			});
		});

		it('should open the test URL in the page', function (done) {
			test('http://foo', function () {
				assert.calledOnce(phantom.mockPage.open);
				assert.calledWith(phantom.mockPage.open, 'http://foo');
				assert.isFunction(phantom.mockPage.open.firstCall.args[1]);
				done();
			});
		});

		it('should log that the PhantomJS page has been opened', function (done) {
			test('http://foo', function () {
				assert.calledWith(options.log.debug, 'PhantomJS page for "http://foo" opened');
				done();
			});
		});

		it('should add a scheme to the test URL if one is not present', function (done) {
			test('foo', function () {
				assert.calledOnce(phantom.mockPage.open);
				assert.calledWith(phantom.mockPage.open, 'http://foo');
				assert.isFunction(phantom.mockPage.open.firstCall.args[1]);
				done();
			});
		});

		it('should callback with an error if opening the page fails', function (done) {
			phantom.mockPage.open.yieldsAsync('fail');
			test('http://foo', function (error) {
				assert.isObject(error);
				assert.strictEqual(error.message, 'Page "http://foo" could not be loaded');
				done();
			});
		});

		it('should log that the PhantomJS page open has failed if it does', function (done) {
			phantom.mockPage.open.yieldsAsync('fail');
			test('http://foo', function () {
				assert.calledWith(options.log.error, 'PhantomJS failed to open "http://foo"');
				done();
			});
		});

		it('should run the test function, passing in the browser, page, and callback', function (done) {
			test('http://foo', function () {
				assert.calledOnce(options.testFunction);
				assert.calledWith(options.testFunction, phantom.mockBrowser, phantom.mockPage);
				assert.isFunction(options.testFunction.firstCall.args[2]);
				done();
			});
		});

		it('should callback with the test function results', function (done) {
			test('http://foo', function (error, result) {
				assert.isNull(error);
				assert.strictEqual(result, 'result');
				done();
			});
		});

		it('should log that the test function has been run', function (done) {
			test('http://foo', function () {
				assert.calledWith(options.log.debug, 'Test function ran for "http://foo"');
				done();
			});
		});

		it('should callback with an error if the test function errors', function (done) {
			var testError = new Error('...');
			options.testFunction.yieldsAsync(testError);
			test('http://foo', function (error) {
				assert.strictEqual(error, testError);
				done();
			});
		});

		it('should log that the test function has failed if it does', function (done) {
			var testError = new Error('...');
			options.testFunction.yieldsAsync(testError);
			test('http://foo', function () {
				assert.calledWith(options.log.error, 'Test function errored for "http://foo"');
				done();
			});
		});

	});

	describe('exit function', function () {
		var exit;

		beforeEach(function (done) {
			truffler({}, function (error, testFn, exitFn) {
				exit = exitFn;
				done();
			});
		});

		it('should exit the PhantomJS browser', function () {
			exit();
			assert.calledOnce(phantom.mockBrowser.exit);
		});

	});

});
