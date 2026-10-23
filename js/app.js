/* Yara's wereld: navigatie, invoer, sessietimer, bovenbalk */

import * as audio from './audio.js';
import * as speech from './speech.js';
import * as art from './art.js';
import { loadSettings, settings } from './store.js';
import { openGate } from './parent.js';

import start from './scenes/start.js';
import world from './scenes/world.js';
import farm from './scenes/farm.js';
import music from './scenes/music.js';
import bubbles from './scenes/bubbles.js';
import book from './scenes/book.js';
import face from './scenes/face.js';
import sleep from './scenes/sleep.js';

const SCENES = { start, world, farm, music, bubbles, book, face, sleep };
const NO_TOPBAR = new Set(['start', 'sleep']);

const stage = document.getElementById('stage');
const topbar = document.getElementById('topbar');
const hintEl = document.getElementById('hint');
const btnHome = document.getElementById('btn-home');
const btnParent = document.getElementById('btn-parent');

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
    if (!this.remaining) return;
    this.endAt = Date.now() + this.remaining;
    this.timer = setTimeout(() => { this.timer = null; this.remaining = 0; go('sleep'); }, this.remaining);
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
  }
  const el = document.createElement('section');
  el.className = 'scene';
  el.dataset.scene = id;
  stage.appendChild(el);
  setHint('');
  topbar.hidden = NO_TOPBAR.has(id);
  current = { id, el, scene };
  scene.mount(el, ctx);
}

/* ---------- iOS-gebaren uitzetten ---------- */

function inOverlay(e) {
  const ov = document.getElementById('overlay');
  return !ov.hidden && ov.contains(e.target);
}
document.addEventListener('touchmove', (e) => { if (!inOverlay(e)) e.preventDefault(); }, { passive: false });
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('dblclick', (e) => e.preventDefault());
document.addEventListener('selectstart', (e) => { if (!inOverlay(e)) e.preventDefault(); });

document.addEventListener('visibilitychange', () => {
  if (document.hidden) { session.pause(); if ('speechSynthesis' in window) speechSynthesis.cancel(); }
  else { audio.resume(); session.resume(); }
});

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
  speech.loadRecordings().catch((e) => console.warn(e));
  go('start');

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').catch((e) => console.warn('Service worker niet geregistreerd', e));
  }
}

init();
