const path = require('path')
const serveStatic = require('serve-static')
const _ = {
  isPlainObject: require('lodash.isplainobject'),
  forEach: require('lodash.foreach')
}
var _routes = 0
/**
 * Add support for `routes` on proxy servers. Should only be used with "proxy"
 * mode. Made to complement the `serveStatic` option.
 *
 * Inspired by / consistent with
 * {@link https://github.com/BrowserSync/browser-sync/blob/a3e115df9456def82981704245a102e15c884eac/lib/server/static-server.js#L51-L71}
 *
 * @param  {Object}                   routes               - An object where
 *     each property key is a URL path to match and the value is the file system
 *     path to the directory that will be served by that URL.
 * @param  {Array.<Function|Object>}  [existingMiddleware] - An array of
 *     functions and/or objects representing middleware. If provided, the new
 *     middleware objects will be appended to it.
 * @return {Array.<Function|Object>}                       - An array of
 *     middleware with route middleware appended to it.
 */
function proxyRoutes(routes, existingMiddleware) {
  if (!routes || !_.isPlainObject(routes)) {
    return existingMiddleware
  }
  var updatedMiddleware = existingMiddleware || []
  _.forEach(routes, function(root, urlPath) {
    // strip trailing slash
    if (urlPath[urlPath.length - 1] === '/') {
      urlPath = urlPath.slice(0, -1)
    }
    updatedMiddleware = updatedMiddleware.concat({
      route: urlPath,
      id: 'Browsersync Server Proxy Routes Middleware - ' + _routes++,
      handle: serveStatic(path.resolve(root))
    })
  })
  return updatedMiddleware
}

module.exports = proxyRoutes
