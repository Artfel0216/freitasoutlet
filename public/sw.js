const CACHE_NAME = 'freitasoutlet-v6'
const PRECACHE_ASSETS = [
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/offline',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  )
  self.clients.claim()
})

function isNavigationRequest(request) {
  return request.mode === 'navigate'
}

function isStaticAsset(request) {
  const url = new URL(request.url)
  return (
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/fonts/')
  )
}

function isJsBundle(request) {
  return new URL(request.url).pathname.startsWith('/_next/static/')
}

function isApiRequest(request) {
  return new URL(request.url).pathname.startsWith('/api/')
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return
  if (url.hostname === 'stripe.com' || url.hostname.endsWith('.stripe.com')) return

  if (isNavigationRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          return response
        })
        .catch(() =>
          caches.match(event.request).then(
            (cached) => cached || caches.match('/offline')
          )
        )
    )
    return
  }

  if (isJsBundle(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
        .catch(() => caches.match(event.request))
    )
    return
  }

  if (isStaticAsset(event.request)) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) =>
          cached ||
          fetch(event.request).then((response) => {
            if (response.status === 200) {
              const clone = response.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
            }
            return response
          })
      )
    )
    return
  }

  if (isApiRequest(event.request)) {
    event.respondWith(fetch(event.request))
    return
  }

  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request).then((response) => {
          if (response.status === 200 && !new URL(event.request.url).pathname.startsWith('/_next/image')) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
    )
  )
})

self.addEventListener('push', (event) => {
  if (!event.data) return
  try {
    const data = event.data.json()
    const options = {
      body: data.body || 'Novidade no Freitas Outlet!',
      icon: '/icon-192.png',
      badge: '/icon.svg',
      data: { url: data.url || '/' },
    }
    event.waitUntil(
      self.registration.showNotification(data.title || 'Freitas Outlet', options)
    )
  } catch {
    event.waitUntil(
      self.registration.showNotification('Freitas Outlet', {
        body: event.data.text(),
        icon: '/icon-192.png',
      })
    )
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})