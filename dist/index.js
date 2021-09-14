'use strict'
var r = require('loader-utils'),
  e = require('path')
function t(r) {
  return 'string' == typeof r || Array.isArray(r)
}
function n(r, e) {
  for (
    var t = {
        string: function (r, e) {
          return !!~e.indexOf(r)
        },
        regexp: function (r, e) {
          return r.test(e)
        }
      },
      n = 0,
      o = !0;
    n < r.length;
    n += 1
  ) {
    var i = r[n],
      u = /\s+[a-zA-Z]+/gi
        .exec(Object.prototype.toString.call(i).toLowerCase())[1]
        .trim()
    return (o = 'function' != typeof t[u] || t[u](i, e))
  }
  return o
}
;(module.exports = function (o) {
  var i = this.resourcePath,
    u = r.getOptions(this),
    a = process.cwd(),
    c = u.config,
    s = void 0 === c ? {} : c
  if (!s.loader) return o
  if (
    (s.include || (s.include = []),
    s.exclude || (s.exclude = []),
    (function (r, e) {
      var o = r.include,
        i = r.exclude
      if (!t(o))
        return console.warn('param include must be string or array'), !0
      if (!t(i))
        return console.warn('param exclude must be string or array'), !0
      var u = 'string' == typeof o ? [o] : o,
        a = 'string' == typeof i ? [i] : i,
        c = 0 !== u.length && n(u, e),
        s = 0 !== a.length && n(a, e)
      return c || s
    })(s, i))
  )
    return o
  var l =
    s.loaderPath ||
    e.resolve(s.projectPath || a, 'node_modules/'.concat(s.loader))
  require(l).call(this, o)
}),
  (module.exports.raw = !0)
