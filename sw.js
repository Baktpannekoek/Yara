/* Service worker: alles in de cache zodat de app offline werkt.
   Verhoog VERSION bij elke wijziging, dan haalt de app de nieuwe bestanden op. */
const VERSION = 'yara-v17';
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './js/app.js',
  './js/art-extra.js',
  './js/art-more.js',
  './js/art.js',
  './js/audio.js',
  './js/backup.js',
  './js/parent.js',
  './js/realsounds.js',
  './js/sounds-extra-bundel.js',
  './js/sounds-extra.js',
  './js/sounds-more.js',
  './js/speech.js',
  './js/store.js',
  './js/words.js',
  './js/lib/anim.js',
  './js/lib/fx.js',
  './js/lib/rig.js',
  './js/lib/scene.js',
  './js/lib/style.js',
  './js/lib/figures/aap.js',
  './js/lib/figures/auto.js',
  './js/lib/figures/boot.js',
  './js/lib/figures/brandweerauto.js',
  './js/lib/figures/bus.js',
  './js/lib/figures/eend.js',
  './js/lib/figures/fiets.js',
  './js/lib/figures/giraf.js',
  './js/lib/figures/hond.js',
  './js/lib/figures/index.js',
  './js/lib/figures/kat.js',
  './js/lib/figures/kikker.js',
  './js/lib/figures/kip.js',
  './js/lib/figures/koe.js',
  './js/lib/figures/krokodil.js',
  './js/lib/figures/leeuw.js',
  './js/lib/figures/olifant.js',
  './js/lib/figures/paard.js',
  './js/lib/figures/persoon.js',
  './js/lib/figures/schaap.js',
  './js/lib/figures/tractor.js',
  './js/lib/figures/trein.js',
  './js/lib/figures/varken.js',
  './js/lib/figures/vliegtuig.js',
  './js/lib/figures/vogel.js',
  './js/lib/figures/zebra.js',
  './js/lib/worlds/boerderij.js',
  './js/lib/worlds/park.js',
  './js/lib/worlds/parts.js',
  './js/lib/worlds/savanne.js',
  './js/lib/worlds/stadje.js',
  './js/scenes/book.js',
  './js/scenes/bubbles.js',
  './js/scenes/face.js',
  './js/scenes/kiekeboe.js',
  './js/scenes/move.js',
  './js/scenes/music.js',
  './js/scenes/sleep.js',
  './js/scenes/speelwei.js',
  './js/scenes/start.js',
  './js/scenes/stickers.js',
  './js/scenes/world.js',
  './sounds/aap.wav',
  './sounds/auto.wav',
  './sounds/boertje.wav',
  './sounds/boot.wav',
  './sounds/brandweerauto.wav',
  './sounds/bus.wav',
  './sounds/eend.wav',
  './sounds/fiets.wav',
  './sounds/giechel.wav',
  './sounds/hond.wav',
  './sounds/kat.wav',
  './sounds/kikker.wav',
  './sounds/kip.wav',
  './sounds/klap.wav',
  './sounds/koe.wav',
  './sounds/krokodil.wav',
  './sounds/leeuw.wav',
  './sounds/manifest.json',
  './sounds/olifant.wav',
  './sounds/paard.wav',
  './sounds/schaap.wav',
  './sounds/scheetje.wav',
  './sounds/tractor.wav',
  './sounds/trein.wav',
  './sounds/varken.wav',
  './sounds/vliegtuig.wav',
  './sounds/vogel.wav',
  './sounds/zebra.wav',
  './music/bumbly-march.mp3',
  './music/carefree.mp3',
  './music/fluffing-a-duck.mp3',
  './music/happy-boy-end-theme.mp3',
  './music/monkeys-spinning-monkeys.mp3',
  './music/pamgaea.mp3',
  './music/sneaky-snitch.mp3',
  './music/wallpaper.mp3',
  './icons/icon-180.png',
  './icons/icon-512.png',
  './icons/icon.svg'
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
