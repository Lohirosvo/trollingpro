/* TrollingPro 2 – service worker.
   Tallentaa sovelluksen laitteelle, jotta se toimii järvellä ilman verkkoa.
   Kun päivität index.html:ää, nosta CACHE-numeroa yhdellä. */
const CACHE = 'trollingpro-v1';
const FILES = ['./', './index.html', './manifest.webmanifest', './kuvake-192.png', './kuvake-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
