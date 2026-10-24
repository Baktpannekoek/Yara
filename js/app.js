/* Yara's wereld: navigatie, invoer, sessietimer, bovenbalk */

import * as audio from './audio.js';
import * as speech from './speech.js';
import * as realsounds from './realsounds.js';
import * as art from './art.js';
import { loadSettings, settings } from './store.js';
import { openGate } from './parent.js';

import start from './scenes/start.js';
import world from './scenes/world.js';
import kiekeboe from './scenes/kiekeboe.js';
import speelwei from './scenes/speelwei.js';
import music from './scenes/music.js';
import move from './scenes/move.js';
import bubbles from './scenes/bubbles.js';
import stickers from './scenes/stickers.js';
import book from './scenes/book.js';
import face from './scenes/face.js';
import sleep from './scenes/sleep.js';

const SCENES = { start, world, speelwei, kiekeboe, music, move, bubbles, stickers, book, face, sleep };
const NO_TOPBAR = new Set(['start', 'sleep']);

const stage = document.getElementById('stage');
const topbar = document.getElementById('topbar');
const hintEl = document.getElementById('hint');
const btnHome = document.getElementById('btn-home');
const btnParent = document.getElementById('btn-parent');
const overlayEl = document.getElementById('overlay');

let current = null;      // { id, el, scene }
let lastTapAt = 0;
const TAP_GAP = 120;     // ms: twee tikken vlak na elkaar tellen als één (handpalm, dubbele vinger)

/* ---------- Tikken ---------- */

function onTap(el, fn) {
  el.classList.add('tap');
  el.addEventListener('pointerdown', (e) => {
    const t = performance.now();
    if (t - lastTapAt < TAP_GAP) return;
    lastTapAt = t;
    e.preventDefault();
    audio.resume();
    fn(e);
  });
}

function animate(el, cls = 'anim-pop') {
  if (!el) return;
  el.classList.remove(cls);
  // Reflow forceren zodat de animatie opnieuw start
  void el.offsetWidth;
  el.classList.add(cls);
  el.addEventListener('animationend', () => el.classList.remove(cls), { once: true });
}

/* ---------- Sessietimer met zacht einde ---------- */

const session = {
  endAt: 0,
  remaining: 0,
  timer: null,
  start() {
    this.stop();
    const min = settings().sessionMinutes;
    if (!min) return;
    this.remaining = min * 60 * 1000;
    this.resume();
  },
  resume() {
    if (!this.remaining || this.timer) return;
    this.endAt = Date.now() + this.remaining;
    this.timer = setTimeout(() => {
      this.timer = null;
      // Oudermenu open? Dan even wachten, anders begint het slaapliedje onder het opnemen door
      if (!overlayEl.hidden) { this.remaining = 10000; this.resume(); return; }
      this.remaining = 0;
      go('sleep');
    }, this.remaining);
  },
  pause() {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; this.remaining = Math.max(0, this.endAt - Date.now()); }
  },
  stop() { if (this.timer) clearTimeout(this.timer); this.timer = null; this.remaining = 0; }
};

/* ---------- Context voor de schermen ---------- */

const ctx = {
  go, onTap, animate, setHint, audio, speech, art,
  say: speech.say,
  sound: speech.sound,
  settings,
  get childName() { return settings().childName || 'Yara'; },
  startSession: () => session.start()
};

function setHint(text) {
  if (!text) { hintEl.hidden = true; hintEl.textContent = ''; return; }
  hintEl.textContent = text;
  hintEl.hidden = false;
}

function go(id) {
  const scene = SCENES[id];
  if (!scene) return;
  if (current) {
    const old = current;
    try { old.scene.unmount && old.scene.unmount(); } catch (e) { console.warn(e); }
    old.el.classList.add('leaving');
    setTimeout(() => old.el.remove(), 420);
    // Elke uitgang uit het slaapscherm (maan, of Klaar in het oudermenu) begint een nieuwe speeltijd
    if (old.id === 'sleep' && id !== 'sleep') session.start();
  }
  const el = document.createElement('section');
  el.className = 'scene';
  el.dataset.scene = id;
  stage.appendChild(el);
  setHint('');
  topbar.hidden = NO_TOPBAR.has(id);
  current = { id, el, scene };
  scene.mount(el, ctx);
  // Zachte achtergrondmuziek, afhankelijk van het plekje; stil in de muziekhoek en op het slaapscherm
  if (id === 'start' || id === 'music' || id === 'sleep') audio.stopAmbient(); else audio.startAmbient(scene.ambient || id);
}

/* ---------- Geluid ontgrendelen op elke echte tik ----------
   pointerdown telt op iOS niet altijd als gebaar, touchend en click wel.
   Zolang het geluid nog niet draait, proberen we het bij elke tik opnieuw. */

function gestureUnlock() {
  if (!audio.isReady()) audio.unlock();
  else audio.resume();
  speech.prime();
  realsounds.load();
}
['touchend', 'click', 'keydown'].forEach((ev) => document.addEventListener(ev, gestureUnlock, { passive: true }));

/* ---------- iOS-gebaren uitzetten: geen zoom, geen scroll, geen menu's ---------- */

function inOverlay(e) {
  return !overlayEl.hidden && overlayEl.contains(e.target);
}
let lastTouchEnd = 0;
document.addEventListener('touchstart', (e) => {
  // Twee of meer vingers: knijpen voorkomen, ook in het oudermenu
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });
document.addEventListener('touchmove', (e) => {
  if (e.touches.length > 1 || !inOverlay(e)) e.preventDefault();
}, { passive: false });
document.addEventListener('touchend', (e) => {
  // Dubbeltik-zoom van Safari voorkomen buiten het oudermenu
  const t = performance.now();
  if (t - lastTouchEnd < 350 && !inOverlay(e)) e.preventDefault();
  lastTouchEnd = t;
}, { passive: false });
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
document.addEventListener('gestureend', (e) => e.preventDefault());
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('dblclick', (e) => e.preventDefault());
document.addEventListener('selectstart', (e) => { if (!inOverlay(e)) e.preventDefault(); });

document.addEventListener('visibilitychange', () => {
  if (document.hidden) { session.pause(); audio.stopAmbient(); if ('speechSynthesis' in window) speechSynthesis.cancel(); }
  else { audio.resume(); session.resume(); if (current && !['start', 'music', 'sleep'].includes(current.id)) audio.startAmbient(current.scene.ambient || current.id); }
});
window.addEventListener('pageshow', () => audio.resume());
window.addEventListener('focus', () => audio.resume());

/* ---------- Bovenbalk ---------- */

btnHome.innerHTML = art.sun();
btnParent.innerHTML = art.gear();
onTap(btnHome, () => { audio.tap(); go('world'); });
btnParent.addEventListener('pointerdown', (e) => { e.preventDefault(); openGate(ctx); });

/* ---------- Start ---------- */

async function init() {
  await loadSettings();
  speech.init();
  audio.setVolume(settings().volume);
  audio.setAmbientEnabled(settings().ambient !== false);
  // Het startscherm wacht hier kort op, zodat de begroeting de opname van papa of mama pakt
  ctx.ready = speech.loadRecordings().catch((e) => console.warn(e));
  go('start');

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    // Bij de allereerste installatie is herladen niet nodig; alleen bij een echte nieuwe versie
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' })
      .then((reg) => {
        // Bij elke terugkeer naar de app even kijken of er een nieuwe versie is
        document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update().catch(() => {}); });
      })
      .catch((e) => console.warn('Service worker niet geregistreerd', e));
    // Nieuwe versie klaar: meteen herladen op het startscherm, anders zodra de app naar de achtergrond gaat
    let pendingReload = false;
    navigator.serviceWorker.addEventListener('message', (e) => {
      if (!hadController || !e.data || e.data.type !== 'nieuwe-versie') return;
      if (!current || current.id === 'start') location.reload();
      else pendingReload = true;
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden && pendingReload) location.reload(); });
  }
}

init();
