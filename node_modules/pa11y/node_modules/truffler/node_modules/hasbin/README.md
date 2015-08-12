
HasBin
======

Check whether a binary exists in the `PATH` environment variable.

[![NPM version][shield-npm]][info-npm]
[![Node.js version support][shield-node]][info-node]
[![io.js version support][shield-iojs]][info-iojs]
[![Build status][shield-build]][info-build]
[![Dependencies][shield-dependencies]][info-dependencies]
[![MIT licensed][shield-license]][info-license]

```js
var hasbin = require('hasbin');

// Check if a binary exists
hasbin('node', function (result) {
    // result === true
});
hasbin('wtf', function (result) {
    // result === false
});

// Check if all binaries exist
hasbin.all(['node', 'npm'], function (result) {
    // result === true
});

// Check if at least one binary exists
hasbin.some(['node', 'wtf'], function (result) {
    // result === true
});
```


Table Of Contents
-----------------

- [Install](#install)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)


Install
-------

Install HasBin with [npm][npm]:

```sh
npm install hasbin
```


Usage
-----

### `hasbin(binaryName, callback)`

Check whether a binary exists on one of the paths in `process.env.PATH`. Calls back with `true` if it does.

```js
// Arguments
binaryName = String
callback = Function(Boolean)
```

```js
// Example
hasbin('node', function (result) {
    // result === true
});
```

### `hasbin.sync(binaryName)`

Synchronous `hasbin`.

```js
// Arguments
binaryName = String
return Boolean
```

```js
// Example
result = hasbin.sync('node');
```

### `hasbin.all(binaryNames, callback)`

Check whether all of a set of binaries exist on one of the paths in `process.env.PATH`. Calls back with `true` if all of the binaries do. Aliased as `hasbin.every`.

```js
// Arguments
binaryNames = Array(String)
callback = Function(Boolean)
```

```js
// Example
hasbin.all(['node', 'npm'], function (result) {
    // result === true
});
```

### `hasbin.all.sync(binaryNames)`

Synchronous `hasbin.all`. Aliased as `hasbin.every.sync`.

```js
// Arguments
binaryNames = Array(String)
return Boolean
```

```js
// Example
result = hasbin.all.sync(['node', 'npm']);
```

### `hasbin.some(binaryNames, callback)`

Check whether at least one of a set of binaries exists on one of the paths in `process.env.PATH`. Calls back with `true` if at least one of the binaries does. Aliased as `hasbin.any`.

```js
// Arguments
binaryNames = Array(String)
callback = Function(Boolean)
```

```js
// Example
hasbin.some(['node', 'npm'], function (result) {
    // result === true
});
```

### `hasbin.some.sync(binaryNames)`

Synchronous `hasbin.some`. Aliased as `hasbin.any.sync`.

```js
// Arguments
binaryNames = Array(String)
return Boolean
```

```js
// Example
result = hasbin.some.sync(['node', 'npm']);
```


Contributing
------------

To contribute to HasBin, clone this repo locally and commit your code on a separate branch.

Please write unit tests for your code, and check that everything works by running the following before opening a pull-request:

```sh
make ci
```


License
-------

HasBin is licensed under the [MIT][info-license] license.  
Copyright &copy; 2015, Nature Publishing Group



[npm]: https://npmjs.org/
[info-dependencies]: https://gemnasium.com/nature/hasbin
[info-iojs]: package.json
[info-license]: LICENSE
[info-node]: package.json
[info-npm]: https://www.npmjs.com/package/hasbin
[info-build]: https://travis-ci.org/nature/hasbin
[shield-dependencies]: https://img.shields.io/gemnasium/nature/hasbin.svg
[shield-iojs]: https://img.shields.io/badge/io.js%20support-latest-brightgreen.svg
[shield-license]: https://img.shields.io/badge/license-MIT-blue.svg
[shield-node]: https://img.shields.io/node/v/hasbin.svg?label=node.js+support
[shield-npm]: https://img.shields.io/npm/v/hasbin.svg
[shield-build]: https://img.shields.io/travis/nature/hasbin/master.svg
