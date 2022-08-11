if (!self.define) {
  let e,
    s = {}
  const i = (i, r) => (
    (i = new URL(i + '.js', r).href),
    s[i] ||
      new Promise(s => {
        if ('document' in self) {
          const e = document.createElement('script')
          ;(e.src = i), (e.onload = s), document.head.appendChild(e)
        } else (e = i), importScripts(i), s()
      }).then(() => {
        let e = s[i]
        if (!e) throw new Error(`Module ${i} didn’t register its module`)
        return e
      })
  )
  self.define = (r, n) => {
    const l =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href
    if (s[l]) return
    let t = {}
    const o = e => i(e, l),
      d = { module: { uri: l }, exports: t, require: o }
    s[l] = Promise.all(r.map(e => d[e] || o(e))).then(e => (n(...e), t))
  }
}
define(['./workbox-b3e22772'], function (e) {
  'use strict'
  self.addEventListener('message', e => {
    e.data && 'SKIP_WAITING' === e.data.type && self.skipWaiting()
  }),
    e.precacheAndRoute(
      [
        { url: 'assets/index-legacy.c7f9f586.js', revision: null },
        { url: 'assets/index.1a74e2ef.css', revision: null },
        { url: 'assets/index.940abc5d.js', revision: null },
        { url: 'assets/polyfills-legacy.b87fb019.js', revision: null },
        { url: 'assets/vendor-legacy.47bd17be.js', revision: null },
        { url: 'assets/vendor.725f29df.js', revision: null },
        { url: 'index.html', revision: '8c1e9174764820ab4b046e15e0679d85' },
        {
          url: 'javascript/home.js',
          revision: 'aef43bcc21d6d2954082f0a15ee792bd',
        },
        {
          url: 'javascript/inviteduser-tags.js',
          revision: '0322164198f40d13002bf02e8009f482',
        },
        {
          url: 'javascript/login.js',
          revision: 'efdd4e0172a0a9f12996fa8b85e2bbc2',
        },
        { url: 'registerSW.js', revision: '1872c500de691dce40960bb85481de07' },
        {
          url: 'manifest.webmanifest',
          revision: 'e39b441ccf0d91e3124dbaf4fe0896bb',
        },
      ],
      {}
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      new e.NavigationRoute(e.createHandlerBoundToURL('index.html'))
    )
})
