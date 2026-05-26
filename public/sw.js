// Smriti Service Worker — v2
// Handles: caching, share-target interception, file caching, background sync, notifications

const CACHE_NAME = 'smriti-v2';
const PENDING_FILES_CACHE = 'smriti-pending-files';
const SHARE_SYNC_TAG = 'smriti-share-sync';

const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/logo/dark_logo.png',
];

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate ────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) =>
        Promise.all(
          names
            .filter((n) => n !== CACHE_NAME && n !== PENDING_FILES_CACHE)
            .map((n) => caches.delete(n))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ─── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // ── Intercept the Share Target POST ──────────────────────────────────────
  // The manifest's share_target.action points here. The SW intercepts before
  // the Next.js API route so that file blobs can be stashed in Cache Storage
  // (they would be lost if we let the redirect swallow the POST body).
  if (url.pathname === '/api/share' && request.method === 'POST') {
    event.respondWith(handleShareTargetPost(request));
    return;
  }

  // Don't cache non-GET requests or API calls
  if (request.method !== 'GET') return;
  if (url.pathname.startsWith('/api/')) return;

  // Navigation: network-first, fallback to cached shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/'))
    );
    return;
  }

  // Static assets: stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fresh = fetch(request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          caches.open(CACHE_NAME).then((c) => c.put(request, response.clone()));
        }
        return response;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});

// ─── Share Target Handler ─────────────────────────────────────────────────────
async function handleShareTargetPost(request) {
  try {
    const formData = await request.formData();

    const url   = formData.get('url')   || '';
    const text  = formData.get('text')  || '';
    const title = formData.get('title') || '';

    // Collect all shared files (field name matches manifest params.files[0].name)
    const files = formData.getAll('media');

    const params = new URLSearchParams();
    if (url)   params.set('url',   url);
    if (text)  params.set('text',  text);
    if (title) params.set('title', title);

    // Stash files in Cache Storage so the client page can retrieve them
    if (files.length > 0) {
      const pendingId = `pending-${Date.now()}`;
      const cache = await caches.open(PENDING_FILES_CACHE);

      await Promise.all(
        files.map((file, i) =>
          cache.put(
            `/${pendingId}/${i}/${file.name}`,
            new Response(file, {
              headers: {
                'Content-Type': file.type || 'application/octet-stream',
                'X-File-Name': file.name,
                'X-File-Size': String(file.size),
              },
            })
          )
        )
      );

      params.set('pendingId',  pendingId);
      params.set('fileCount',  String(files.length));
      params.set('fileNames',  files.map((f) => encodeURIComponent(f.name)).join(','));
      params.set('fileTypes',  files.map((f) => f.type || '').join(','));
    }

    // 303 See Other → browser turns POST into a GET
    return Response.redirect(new URL(`/share?${params.toString()}`, self.location.origin).href, 303);
  } catch (err) {
    // Fallback: just open the app
    return Response.redirect(new URL('/', self.location.origin).href, 303);
  }
}

// ─── Background Sync ─────────────────────────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === SHARE_SYNC_TAG) {
    event.waitUntil(drainShareQueue());
  }
});

async function drainShareQueue() {
  const db = await openQueueDB();
  const items = await getQueuedItems(db);

  for (const item of items) {
    try {
      const res = await fetch('/api/share/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: item.url, text: item.text, title: item.title, token: item.token }),
      });

      if (res.ok) {
        await removeQueueItem(db, item.id);
        await sendNotification('Saved to Smriti', item.url || item.text || 'Content ingested');
      }
    } catch {
      // Network still down — will retry next sync
    }
  }
}

// ─── Notification ─────────────────────────────────────────────────────────────
async function sendNotification(title, body) {
  if (Notification.permission !== 'granted') return;
  await self.registration.showNotification(title, {
    body: body.length > 80 ? body.slice(0, 77) + '…' : body,
    icon:  '/logo/dark_logo.png',
    badge: '/logo/dark_logo.png',
    tag:   'smriti-save',
    renotify: false,
    requireInteraction: false,
    silent: true,
  });
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        const smriti = clients.find((c) => c.url.startsWith(self.location.origin));
        return smriti ? smriti.focus() : self.clients.openWindow('/');
      })
  );
});

// ─── Message Bridge ───────────────────────────────────────────────────────────
self.addEventListener('message', (event) => {
  const { type, title, body } = event.data || {};

  if (type === 'SKIP_WAITING')      self.skipWaiting();
  if (type === 'TRIGGER_SYNC')      self.registration.sync?.register(SHARE_SYNC_TAG).catch(() => {});
  if (type === 'SHOW_NOTIFICATION') sendNotification(title || 'Saved to Smriti', body || '');
});

// ─── IndexedDB queue (minimal, mirrors lib/share-queue.ts logic) ──────────────
function openQueueDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('smriti-share-queue', 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('queue')) {
        const s = db.createObjectStore('queue', { keyPath: 'id', autoIncrement: true });
        s.createIndex('status', 'status', { unique: false });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror  = () => reject(req.error);
  });
}

function getQueuedItems(db) {
  return new Promise((resolve, reject) => {
    const tx  = db.transaction('queue', 'readonly');
    const req = tx.objectStore('queue').index('status').getAll('pending');
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

function removeQueueItem(db, id) {
  return new Promise((resolve, reject) => {
    const tx  = db.transaction('queue', 'readwrite');
    const req = tx.objectStore('queue').delete(id);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}
