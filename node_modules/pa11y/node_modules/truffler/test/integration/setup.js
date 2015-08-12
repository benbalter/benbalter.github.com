// jshint maxstatements: false
// jscs:disable disallowMultipleVarDecl, maximumLineLength
'use strict';

var startWebsite = require('./mock/website');

before(function (done) {
	var self = this;

	self.websitePort = process.env.PORT || 6540;
	self.websiteAddress = 'http://localhost:' + self.websitePort;

	startWebsite(self.websitePort, function (error, website) {
		if (error) {
			done(error);
		}
		self.website = website;
		done();
	});

});
