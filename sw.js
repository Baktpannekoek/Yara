/* Service worker: alles in de cache zodat de app offline werkt.
   Verhoog VERSION bij elke wijziging, dan haalt de app de nieuwe bestanden op. */
const VERSION = 'yara-v16';
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './js/app.js',
  './js/audio.js',
  './js/speech.js',
  './js/realsounds.js',
  './js/store.js',
  './js/art.js',
  './js/words.js',
  './js/parent.js',
  './js/art-extra.js',
  './js/sounds-extra.js',
  './js/backup.js',
  './js/art-more.js',
  './js/sounds-more.js',
  './js/sounds-extra-bundel.js',
  './js/lib/style.js',
  './js/lib/rig.js',
  './js/lib/anim.js',
  './js/lib/fx.js',
  './js/lib/scene.js',
  './js/lib/worlds/boerderij.js',
  './js/lib/figures/index.js',
  './js/lib/figures/koe.js',
  './js/lib/figures/eend.js',
  './js/lib/figures/trein.js',
  './js/scenes/start.js',
  './js/scenes/world.js',
  './js/scenes/kiekeboe.js',
  './js/scenes/speelwei.js',
  './js/scenes/music.js',
  './js/scenes/move.js',
  './js/scenes/stickers.js',
  './js/scenes/bubbles.js',
  './js/scenes/book.js',
  './js/scenes/face.js',
  './js/scenes/sleep.js',
  './sounds/manifest.json',
  './sounds/koe.wav',
  './sounds/eend.wav',
  './sounds/schaap.wav',
  './sounds/paard.wav',
  './sounds/kip.wav',
  './sounds/varken.wav',
  './sounds/kikker.wav',
  './sounds/hond.wav',
  './sounds/kat.wav',
  './sounds/vogel.wav',
  './sounds/leeuw.wav',
  './sounds/olifant.wav',
  './sounds/aap.wav',
  './sounds/zebra.wav',
  './sounds/krokodil.wav',
  './sounds/auto.wav',
  './sounds/vliegtuig.wav',
  './sounds/trein.wav',
  './sounds/bus.wav',
  './sounds/tractor.wav',
  './sounds/boot.wav',
  './sounds/brandweerauto.wav',
  './sounds/fiets.wav',
  './sounds/boertje.wav',
  './sounds/scheetje.wav',
  './sounds/giechel.wav',
  './sounds/klap.wav',
  './icons/icon.svg',
  './icons/icon-180.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    // Met een versie in de URL komen alle bestanden vers van de server, niet uit een oude HTTP-cache.
    // Bij het ophalen negeert de cache de querystring (ignoreSearch), dus ./js/app.js vindt ./js/app.js?v=...
    caches.open(VERSION).then((cache) => cache.addAll(FILES.map((u) => u + '?v=' + VERSION))).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => clients.forEach((c) => c.postMessage({ type: 'nieuwe-versie', version: VERSION })))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(event.request).then((res) => {
        if (res && res.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(event.request, copy));
        }
        return res;
      });
    })
  );
});
