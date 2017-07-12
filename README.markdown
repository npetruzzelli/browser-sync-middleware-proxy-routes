# browser-sync-middleware-proxy-routes

A Browsersync middleware that provides route support when running Browsersync as a proxy server.

It immitates the `routes` option available to Browswersync's built in static server.

## Installation

```
npm install --save-dev browser-sync-middleware-proxy-routes
```

## Usage Example

```javascript
const browserSync = require('browser-sync');
const bmProxyRoutes = require('browser-sync-middleware-proxy-routes');
const bs = browserSync.create('devProxy');

/**
 * Proxy another HTTP server that may be using `app/www` as the document root
 * directory.
 */
var bsConfig = {
  notify: false,
  port: 9000,
  reloadOnRestart: true,
  proxy: {
    /**
     * URL to proxy
     */
    target:'http://localhost/'
  },

  /**
   * An alternate location for static assets if the proxy server returns 404.
   * Your compiled Sass styles or Babel scripts and their source map files may 
   * be here.
   */
  serveStatic: ['.tmp/www'],
  middleware: bmProxyRoutes({
    /**
     * Route for source maps sources that are not embedded in the `.map` file.
     * This is assuming you've configured your source maps's `sourceRoot` 
     * property to be "/_source/".
     */
    '/_source': 'app/src'

    /**
     * Route for Bower Components sources in your source maps.
     *
     * Bower components may have source map routes that look like:
     * "../../../.tmp/bower_components/". This is the path to a bower component
     * relative to your code in "app/src/styles/main.scss" or 
     * "app/src/scripts/main.es6". Since it is above the document root, the 
     * browser may look for these files at: "/.tmp/bower_components/"
     */
    '/.tmp/bower_components': '.tmp/bower_components'
  })
};
bs.init(bsConfig);
```

## API

### browsersyncMiddlewareProxyRoutes(routes[, existingMiddleware])

Returns an array of middleware for serving routes. Each route gets its own middleware. This array will make up or contribute to the `middleware` option in your Browsersync configuration.

#### routes

Type: `Object`

> ```javascript
> // Since version 1.2.1
> // The key is the url to match
> // The value is which folder to serve (relative to your current working directory)
> ```

Reference: [Browsersync options: server](https://browsersync.io/docs/options#option-server).

#### existingMiddleware

Type: `Array`

Default: `[]`

If an array of existing middleware is provided, then the new middleware will be appended to it and the return value will be the updated middleware array. 

Reference: [Browsersync options: middleware](https://browsersync.io/docs/options#option-middleware).

_* **Experimental.** The only purpose of this argument is to maintain consistency with the [code upon which it was based](https://github.com/BrowserSync/browser-sync/blob/a3e115df9456def82981704245a102e15c884eac/lib/server/static-server.js#L51-L71). It may be removed or stablized in the future._
