'use strict';

var fs = require('fs');
var http = require('http');
var parseUrl = require('url').parse;

module.exports = startWebsite;

function startWebsite (port, done) {
	var routes = {

		'/': function (request, response) {
			response.writeHead(200);
			response.end(fs.readFileSync(__dirname + '/index.html'));
		},

		'/header-dump': function (request, response) {
			response.writeHead(200);
			response.end(
				'Cookie: ' + request.headers.cookie + '\n' +
				'Foo: ' + request.headers.foo
			);
		},

		default: function (request, response) {
			response.writeHead(404);
			response.end('not found');
		}

	};
	var website = http.createServer(function (request, response) {
		var url = parseUrl(request.url).pathname;
		website.lastRequest = request;
		(routes[url] || routes.default)(request, response);
	});
	website.listen(port, function (error) {
		done(error, website);
	});
}
