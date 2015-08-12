'use strict';

var sinon = require('sinon');

var hasbin = module.exports = sinon.stub();
hasbin.some = sinon.stub().yieldsAsync(true);
