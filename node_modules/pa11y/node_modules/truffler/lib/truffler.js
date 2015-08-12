'use strict';

var extend = require('node.extend');
var hasbin = require('hasbin');
var phantom = require('phantom');
var pkg = require('../package.json');

module.exports = truffler;
module.exports.defaults = {
	log: {
		debug: function () {},
		error: function () {},
		info: function () {}
	},
	page: {
		headers: {},
		settings: {
			userAgent: 'truffler/' + pkg.version
		},
		viewport: {
			width: 1024,
			height: 768
		}
	},
	phantom: {
		port: 12300
	},
	testFunction: function (browser, page, done) {
		done(null, null);
	}
};

function truffler (options, completeSetup) {
	options = defaultOptions(options);
	requirePhantomBinary(function (error) {
		if (error) {
			return completeSetup(error);
		}
		phantom.create(function (browser) {
			options.log.info('PhantomJS browser created');
			completeSetup(
				null,
				testUrl.bind(null, options, browser),
				exitBrowser.bind(null, browser)
			);
		}, options.phantom);
	});
}

function requirePhantomBinary (done) {
	hasbin.some(['phantomjs', 'phantomjs.exe'], function (hasPhantom) {
		var error = (hasPhantom ? null : new Error('PhantomJS binary was not found in PATH'));
		done(error);
	});
}

function testUrl (options, browser, url, completeTest) {
	if (!/[a-z]+:\/\//i.test(url)) {
		url = 'http://' + url;
	}
	options.log.info('Testing page: "' + url + '"');
	browser.createPage(function (page) {
		options.log.debug('PhantomJS page created for "' + url + '"');
		configurePage(page, options.page);
		page.open(url, function (status) {
			if (status !== 'success') {
				var error = new Error('Page "' + url + '" could not be loaded');
				options.log.error('PhantomJS failed to open "' + url + '"');
				return completeTest(error);
			}
			options.log.debug('PhantomJS page for "' + url + '" opened');
			options.testFunction(browser, page, function (error, result) {
				if (error) {
					options.log.error('Test function errored for "' + url + '"');
				}
				else {
					options.log.debug('Test function ran for "' + url + '"');
				}
				completeTest(error, result);
			});
		});
	});
}

function configurePage (page, options) {
	applySettingsToPage(page, options.settings);
	page.set('viewportSize', options.viewport);
	page.set('customHeaders', options.headers);
}

function applySettingsToPage (page, settings) {
	Object.keys(settings).forEach(function (setting) {
		page.set('settings.' + setting, settings[setting]);
	});
}

function exitBrowser (browser) {
	browser.exit();
}

function defaultOptions (options) {
	return extend(true, {}, module.exports.defaults, options);
}
