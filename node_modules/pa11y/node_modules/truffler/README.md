
Truffler
========

Access web pages programmatically with [PhantomJS][phantom], for running tests or scraping information.

[![NPM version][shield-npm]][info-npm]
[![Node.js version support][shield-node]][info-node]
[![Build status][shield-build]][info-build]
[![Dependencies][shield-dependencies]][info-dependencies]
[![MIT licensed][shield-license]][info-license]

```js
var truffler = require('truffler');

truffler({
    testFunction: function (browser, page, done) {
        // do something with the PhantomJS browser and page
        done();
    }
}, function (error, test, exit) {
    test('http://www.nature.com/', function (error, results) {
        console.log(results);
    });
});
```


Table Of Contents
-----------------

- [Install](#install)
- [Usage](#usage)
- [Options](#options)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)


Install
-------

Install Truffler with [npm][npm]:

```sh
npm install truffler
```


Usage
-----

Require in Truffler:

```js
var truffler = require('truffler');
```

Create a test function by initialising Truffler with [some options](#options):

```js
truffler(options, function (error, test, exit) { /* ... */ });
```

Within your callback, you can use the `test` and `exit` functions to run tests against web pages or exit PhantomJS:

```js
truffler(options, function (error, test, exit) {

    // Run a test on nature.com
    test('http://www.nature.com/', function (error, results) {
        // ...
    });

});
```

```js
truffler(options, function (error, test, exit) {

    // Exit PhantomJS
    exit();

});
```

The results that get passed into your test callback come from the test function you define in options:

```js
truffler({
    testFunction: function (browser, page, done) {

        // ... do something with PhantomJS

        // To indicate that an error occurred, call back with an error:
        done(new Error('Something went wrong!'));

        // To indicate success and pass results on, call back with the results:
        done(null, 'some information to pass along');

    }
});
```


Options
-------

### `log` (object)

An object which implments the methods `debug`, `error`, and `info` which will be used to report errors and test information.

```js
truffler({
    log: {
        debug: console.log.bind(console),
        error: console.error.bind(console),
        info: console.info.bind(console)
    }
});
```

Each of these defaults to an empty function.

### `page.headers` (object)

A key-value map of request headers to send when testing a web page.

```js
truffler({
    page: {
        headers: {
            Cookie: 'foo=bar'
        }
    }
});
```

Defaults to an empty object.

### `page.settings` (object)

A key-value map of request headers to add to the PhantomJS page as settings. For a full list of available settings, see the [PhantomJS page settings documentation][phantom-page-settings].

```js
truffler({
    page: {
        settings: {
            loadImages: false,
            userName: 'nature',
            password: 'say the magic word'
        }
    }
});
```

Defaults to:

```js
{
    userAgent: 'truffler/<version>'
}
```

### `page.viewport` (object)

The viewport width and height in pixels. The `viewport` object must have both `width` and `height` properties.

```js
truffler({
    page: {
        viewport: {
            width: 320,
            height: 480
        }
    }
});
```

Defaults to:

```js
{
    width: 1024,
    height: 768
}
```

### `phantom` (object)

A key-value map of settings to initialise PhantomJS with. This is passed directly into the `phantom` module – [documentation can be found here][phantom-node-options]. You can pass PhantomJS command-line parameters in the `phantom.parameters` option as key-value pairs.

```js
truffler({
    phantom: {
        port: 1234,
        parameters: {
            'ignore-ssl-errors': 'true'
        }
    }
});
```

Defaults to:

```js
{
    port: 12300
}
```

### `testFunction` (function)

The function to run when a page is tested with Truffler. This should accept three arguments:

- `browser`: A PhantomJS [browser][phantom-browser] instance
- `page`: A PhantomJS [page][phantom-page] instance
- `done`: A callback function to be called when testing is complete

The browser and page instances are provided by the phantom module, which makes [a few small changes to the API][phantom-node-options].


Examples
--------

### Basic Example

Run Truffler on a URL and output the page title:

```
node example/basic
```

### Multiple Example

Use [async][async] to run Truffler on multiple URLs in series, and output the page titles:

```
node example/multiple
```


Contributing
------------

To contribute to Truffler, clone this repo locally and commit your code on a separate branch.

Please write unit tests for your code, and check that everything works by running the following before opening a pull-request:

```sh
make ci
```


License
-------

Truffler is licensed under the [MIT][info-license] license.  
Copyright &copy; 2015, Nature Publishing Group



[async]: https://github.com/caolan/async
[npm]: https://npmjs.org/
[phantom]: http://phantomjs.org/
[phantom-browser]: http://phantomjs.org/api/phantom/
[phantom-node-options]: https://github.com/sgentle/phantomjs-node#functionality-details
[phantom-page]: http://phantomjs.org/api/webpage/
[phantom-page-settings]: http://phantomjs.org/api/webpage/property/settings.html

[info-dependencies]: https://gemnasium.com/nature/truffler
[info-license]: LICENSE
[info-node]: package.json
[info-npm]: https://www.npmjs.com/package/truffler
[info-build]: https://travis-ci.org/nature/truffler
[shield-dependencies]: https://img.shields.io/gemnasium/nature/truffler.svg
[shield-license]: https://img.shields.io/badge/license-MIT-blue.svg
[shield-node]: https://img.shields.io/node/v/truffler.svg?label=node.js+support
[shield-npm]: https://img.shields.io/npm/v/truffler.svg
[shield-build]: https://img.shields.io/travis/nature/truffler/master.svg
