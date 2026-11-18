// Meer Royal service worker: shows order alerts on the phone even when the website is closed.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))
self.addEventListener('fetch', () => {}) // no caching, so new website versions always load fresh
self.addEventListener('push', (e) => {
  let d = {}
  try { d = e.data ? e.data.json() : {} } catch (err) { d = { body: e.data ? e.data.text() : '' } }
  e.waitUntil(self.registration.showNotification(d.title || 'Meer Royal Spices', {
    body: d.body || '', icon: '/icon-192.png', badge: '/favicon-32.png', tag: d.tag || undefined, vibrate: [200, 100, 200, 100, 200], data: { url: d.url || '/admin' } }))
})
self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  const raw = (e.notification.data && e.notification.data.url) || '/admin'
  const url = raw.charAt(0) === '/' ? raw : '/admin' // only ever open pages of our own site
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) { if ('focus' in c) { if (c.navigate) c.navigate(url); return c.focus() } }
    return self.clients.openWindow(url)
  }))
})
