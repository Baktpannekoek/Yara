/* Alle geluiden komen uit de Web Audio API: geen bestanden nodig, werkt offline.
   Eén AudioContext, ontgrendeld bij de eerste tik, met een begrenzer zodat niets schrikt.

   iPhone-valkuil: staat de belschakelaar op stil, dan dempt iOS alle Web Audio, maar niet
   een gewoon <audio>-element. Daarom speelt er na de eerste tik een onhoorbaar stil
   geluidsbestand in een lus. Daardoor schakelt iOS de audiosessie om naar "afspelen" en
   klinkt Web Audio ook met de schakelaar op stil. Dit is dezelfde truc die spelletjes gebruiken. */

let ctx = null;
let master = null;
let volume = 0.8;
let media = null;        // het stille <audio>-element
let mediaOk = false;

/* Een halve seconde stilte als WAV (8 kHz, 16-bit mono), gemaakt in de browser zelf */
function silentWav() {
  const rate = 8000, n = rate / 2;
  const buf = new ArrayBuffer(44 + n * 2);
  const v = new DataView(buf);
  const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE');
  w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  w(36, 'data'); v.setUint32(40, n * 2, true);
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return 'data:audio/wav;base64,' + btoa(bin);
}

function ensureMedia() {
  if (!media) {
    media = document.createElement('audio');
    media.src = silentWav();
    media.loop = true;
    media.preload = 'auto';
    media.setAttribute('playsinline', '');
    media.setAttribute('aria-hidden', 'true');
    media.style.display = 'none';
    media.volume = 1;   // de inhoud is stil, het volume moet aan staan om te tellen
    document.body.appendChild(media);
  }
  if (media.paused) {
    const p = media.play();
    if (p && p.then) p.then(() => { mediaOk = true; }).catch(() => { mediaOk = false; });
  }
}

function ensureContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  ctx = new AC({ latencyHint: 'interactive' });
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -12;
  comp.knee.value = 10;
  comp.ratio.value = 4;
  comp.attack.value = 0.004;
  comp.release.value = 0.15;
  master = ctx.createGain();
  master.gain.value = volume;
  master.connect(comp);
  comp.connect(ctx.destination);
  return ctx;
}

export function isReady() { return !!ctx && ctx.state === 'running' && mediaOk; }

/* Aanroepen vanuit een echte tik (touchend of click telt zeker, pointerdown meestal) */
export function unlock() {
  // iOS 17 en nieuwer: de audiosessie expliciet op afspelen, dan telt de belschakelaar niet
  if ('audioSession' in navigator) { try { navigator.audioSession.type = 'playback'; } catch {} }
  ensureContext();
  if (ctx.state !== 'running') ctx.resume().catch(() => {});
  // Stille buffer afspelen: de klassieke iOS-ontgrendeling van Web Audio
  try {
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
  } catch {}
  ensureMedia();
  return ctx;
}

export function resume() {
  checkAlive();
  if (ctx && ctx.state !== 'running') ctx.resume().catch(() => {});
  if (media && media.paused) ensureMedia();
}

/* iOS-valkuil: na wisselen van app of vergrendelen meldt de context soms 'running'
   terwijl de klok stilstaat en er niets meer klinkt. Bij elke tik kijken we of de
   klok sinds de vorige tik is opgeschoven. Zo niet, dan bouwen we de context opnieuw.
   Opgenomen stemmen blijven bruikbaar: een AudioBuffer hangt niet aan een context. */
let lastClock = -1;
let lastStamp = 0;
function checkAlive() {
  if (!ctx) return;
  const nowMs = performance.now();
  const frozen = ctx.state === 'running' && lastClock >= 0 && nowMs - lastStamp > 400 && ctx.currentTime === lastClock;
  if (frozen) {
    console.warn('Audio stond stil, context opnieuw opgebouwd');
    try { ctx.close(); } catch {}
    ctx = null; master = null; melodyBus = null;
    ensureContext();
    if (ctx.state !== 'running') ctx.resume().catch(() => {});
    lastClock = -1;
    lastStamp = nowMs;
    return;
  }
  lastClock = ctx.currentTime;
  lastStamp = nowMs;
}

export function setVolume(v) {
  volume = Math.max(0, Math.min(1, v));
  if (master) master.gain.setTargetAtTime(volume, ctx.currentTime, 0.05);
}

function now() { return ctx ? ctx.currentTime : 0; }

/* Basis: een oscillator met zachte envelope. Geëxporteerd zodat extra geluiden in
   andere bestanden dezelfde bouwstenen gebruiken. */
export function voice({ type = 'triangle', freq = 440, dur = 0.4, gain = 0.3, attack = 0.02, release = 0.15,
                 when = 0, glide = null, lp = null, bp = null, vib = null, am = null, dest = null }) {
  if (!ctx) return;
  const t0 = now() + when;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glide) osc.frequency.exponentialRampToValueAtTime(glide.to, t0 + (glide.time || dur));
  let node = osc;
  if (vib) {
    const lfo = ctx.createOscillator();
    lfo.frequency.value = vib.rate;
    const lg = ctx.createGain();
    lg.gain.value = vib.depth;
    lfo.connect(lg); lg.connect(osc.frequency);
    lfo.start(t0); lfo.stop(t0 + dur + release + 0.1);
  }
  if (lp) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp; node.connect(f); node = f; }
  if (bp) { const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = bp.freq; f.Q.value = bp.q || 2; node.connect(f); node = f; }
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + attack);
  g.gain.setValueAtTime(gain, t0 + Math.max(attack, dur - release));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + release);
  if (am) {
    // Trilling in serie: het signaal wordt vermenigvuldigd met (1 - depth) + depth * sin,
    // zodat de envelope van g de echte sterkte blijft bepalen
    const depth = Math.min(0.5, am.depth);
    const lfo = ctx.createOscillator();
    lfo.frequency.value = am.rate;
    const base = ctx.createGain();
    base.gain.value = 1 - depth;
    const lg = ctx.createGain();
    lg.gain.value = depth;
    lfo.connect(lg);
    lg.connect(base.gain);
    node.connect(base);
    node = base;
    lfo.start(t0); lfo.stop(t0 + dur + release + 0.1);
  }
  node.connect(g);
  g.connect(dest || master);
  osc.start(t0);
  osc.stop(t0 + dur + release + 0.1);
  return osc;
}

/* Ruisstoot, voor plop, trommel en knorren */
export function noise({ dur = 0.15, gain = 0.3, attack = 0.005, when = 0, bp = null, lp = null, hp = null }) {
  if (!ctx) return;
  const t0 = now() + when;
  const len = Math.ceil(ctx.sampleRate * (dur + 0.05));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  let node = src;
  if (hp) { const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp; node.connect(f); node = f; }
  if (lp) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp; node.connect(f); node = f; }
  if (bp) { const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = bp.freq; f.Q.value = bp.q || 1; node.connect(f); node = f; }
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  node.connect(g);
  g.connect(master);
  src.start(t0);
  src.stop(t0 + dur + 0.1);
}

/* ---- Algemene geluiden (afgestemd op het kleine luidsprekertje van een telefoon) ---- */

export const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25]; // C D E G A C, pentatonisch

export function note(freq, dur = 0.6, when = 0, gain = 0.36) {
  voice({ type: 'triangle', freq, dur, gain, attack: 0.01, release: 0.35, when });
  voice({ type: 'sine', freq: freq * 2, dur: dur * 0.6, gain: gain * 0.3, attack: 0.01, release: 0.3, when });
}

export function pop() {
  voice({ type: 'sine', freq: 1000, glide: { to: 320, time: 0.09 }, dur: 0.09, gain: 0.32, attack: 0.003, release: 0.08 });
  noise({ dur: 0.06, gain: 0.1, hp: 2000 });
}

export function drum() {
  voice({ type: 'sine', freq: 180, glide: { to: 60, time: 0.18 }, dur: 0.18, gain: 0.55, attack: 0.003, release: 0.15 });
  noise({ dur: 0.09, gain: 0.18, lp: 1500 });
}

export function bell() {
  const f = 1046.5;
  voice({ type: 'sine', freq: f, dur: 1.2, gain: 0.3, attack: 0.003, release: 0.8 });
  voice({ type: 'sine', freq: f * 2.76, dur: 0.7, gain: 0.1, attack: 0.003, release: 0.5 });
  voice({ type: 'sine', freq: f * 5.4, dur: 0.3, gain: 0.04, attack: 0.003, release: 0.3 });
}

export function creak() {
  voice({ type: 'sawtooth', freq: 220, glide: { to: 320, time: 0.4 }, dur: 0.4, gain: 0.08, attack: 0.04, release: 0.12, lp: 1400, vib: { rate: 14, depth: 12 } });
}

export function thud() {
  voice({ type: 'sine', freq: 160, glide: { to: 70, time: 0.14 }, dur: 0.14, gain: 0.35, attack: 0.003, release: 0.12 });
  noise({ dur: 0.05, gain: 0.08, lp: 1200 });
}

export function chime() {
  [0, 0.12, 0.24].forEach((w, i) => note(SCALE[[2, 3, 5][i]], 0.5, w, 0.24));
}

export function tap() {
  voice({ type: 'sine', freq: 660, dur: 0.06, gain: 0.16, attack: 0.003, release: 0.06 });
}

export function sparkle() {
  [0, 0.08, 0.16, 0.24].forEach((w, i) => voice({ type: 'sine', freq: 1400 + i * 300, dur: 0.12, gain: 0.12, attack: 0.003, release: 0.15, when: w }));
}

export function honk() {
  voice({ type: 'square', freq: 330, dur: 0.18, gain: 0.16, attack: 0.01, release: 0.08, lp: 1600 });
  voice({ type: 'square', freq: 392, dur: 0.22, gain: 0.16, attack: 0.01, release: 0.1, lp: 1600, when: 0.2 });
}

export function boing() {
  voice({ type: 'sine', freq: 220, glide: { to: 560, time: 0.25 }, dur: 0.25, gain: 0.26, attack: 0.005, release: 0.2, vib: { rate: 20, depth: 30 } });
}

export function splash() {
  noise({ dur: 0.35, gain: 0.22, bp: { freq: 1800, q: 0.7 } });
  voice({ type: 'sine', freq: 500, glide: { to: 900, time: 0.3 }, dur: 0.3, gain: 0.08, attack: 0.02, release: 0.2 });
}

export function crunch() {
  [0, 0.12].forEach((w) => noise({ dur: 0.1, gain: 0.2, bp: { freq: 2500, q: 1 }, when: w }));
}

export function rustle() {
  noise({ dur: 0.4, gain: 0.1, bp: { freq: 3000, q: 0.5 } });
}

export function yawn() {
  voice({ type: 'triangle', freq: 320, glide: { to: 200, time: 0.9 }, dur: 0.9, gain: 0.14, attack: 0.2, release: 0.3, lp: 1200 });
}

/* ---- Dierengeluiden (cartoon, gemaakt met oscillatoren).
   Een telefoonluidspreker laat weinig horen onder 200 Hz, daarom zit er altijd een
   laag erbij in het middengebied. ---- */

export const animals = {
  koe() {
    voice({ type: 'sawtooth', freq: 130, glide: { to: 95, time: 0.9 }, dur: 0.9, gain: 0.3, attack: 0.08, release: 0.3, lp: 900, vib: { rate: 5, depth: 5 } });
    voice({ type: 'sawtooth', freq: 260, glide: { to: 190, time: 0.9 }, dur: 0.9, gain: 0.16, attack: 0.1, release: 0.3, bp: { freq: 520, q: 1.5 }, vib: { rate: 5, depth: 8 } });
  },
  hond() {
    [0, 0.22].forEach((w) => {
      voice({ type: 'sawtooth', freq: 420, glide: { to: 240, time: 0.12 }, dur: 0.12, gain: 0.3, attack: 0.005, release: 0.08, bp: { freq: 900, q: 1 }, when: w });
      noise({ dur: 0.08, gain: 0.12, bp: { freq: 1100, q: 1 }, when: w });
    });
  },
  kat() {
    voice({ type: 'triangle', freq: 520, glide: { to: 980, time: 0.3 }, dur: 0.3, gain: 0.22, attack: 0.03, release: 0.05, vib: { rate: 7, depth: 14 } });
    voice({ type: 'triangle', freq: 980, glide: { to: 430, time: 0.45 }, dur: 0.45, gain: 0.22, attack: 0.01, release: 0.25, vib: { rate: 7, depth: 14 }, when: 0.3 });
  },
  eend() {
    [0, 0.16, 0.32].forEach((w) => voice({ type: 'square', freq: 330, glide: { to: 260, time: 0.1 }, dur: 0.1, gain: 0.2, attack: 0.01, release: 0.05, lp: 2600, am: { rate: 55, depth: 0.5 }, when: w }));
  },
  schaap() {
    voice({ type: 'sawtooth', freq: 250, dur: 0.75, gain: 0.26, attack: 0.05, release: 0.2, bp: { freq: 1100, q: 1.2 }, vib: { rate: 9, depth: 16 }, am: { rate: 9, depth: 0.5 } });
  },
  paard() {
    voice({ type: 'triangle', freq: 800, glide: { to: 1300, time: 0.25 }, dur: 0.25, gain: 0.18, attack: 0.02, release: 0.05, vib: { rate: 22, depth: 60 } });
    voice({ type: 'triangle', freq: 1300, glide: { to: 500, time: 0.6 }, dur: 0.6, gain: 0.2, attack: 0.01, release: 0.25, vib: { rate: 22, depth: 60 }, when: 0.25 });
  },
  kip() {
    [0, 0.18, 0.36, 0.6].forEach((w, i) => voice({ type: 'triangle', freq: i === 3 ? 820 : 560, glide: { to: i === 3 ? 500 : 480, time: 0.1 }, dur: i === 3 ? 0.25 : 0.1, gain: 0.22, attack: 0.005, release: 0.06, when: w }));
  },
  varken() {
    [0, 0.35].forEach((w) => {
      noise({ dur: 0.28, gain: 0.36, bp: { freq: 950, q: 1.5 }, when: w });
      voice({ type: 'sawtooth', freq: 190, dur: 0.25, gain: 0.14, attack: 0.02, release: 0.1, lp: 1500, am: { rate: 28, depth: 0.5 }, when: w });
    });
  },
  kikker() {
    voice({ type: 'square', freq: 190, glide: { to: 150, time: 0.4 }, dur: 0.4, gain: 0.22, attack: 0.02, release: 0.1, lp: 2200, am: { rate: 26, depth: 0.5 } });
    voice({ type: 'square', freq: 210, glide: { to: 160, time: 0.3 }, dur: 0.3, gain: 0.2, attack: 0.02, release: 0.1, lp: 2200, am: { rate: 26, depth: 0.5 }, when: 0.5 });
  },
  vogel() {
    [0, 0.14, 0.3, 0.42].forEach((w, i) => voice({ type: 'sine', freq: 2200 + (i % 2) * 400, glide: { to: 3000 + (i % 2) * 300, time: 0.08 }, dur: 0.08, gain: 0.14, attack: 0.005, release: 0.05, when: w }));
  }
};

/* ---- Opnames van ouders afspelen ---- */

export async function decode(blob) {
  ensureContext();
  const data = await blob.arrayBuffer();
  return new Promise((resolve, reject) => {
    // Callback-vorm: werkt ook op oudere iOS-versies
    ctx.decodeAudioData(data, resolve, reject);
  });
}

export function playBuffer(buffer, gain = 1) {
  if (!ctx || !buffer) return null;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const g = ctx.createGain();
  g.gain.value = gain;
  src.connect(g);
  g.connect(master);
  src.start();
  return src;
}

/* ---- Melodie en slaapliedje ---- */

const N = { C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25 };

// "Altijd is Kortjakje ziek", een oud volkswijsje (zelfde melodie als Twinkle Twinkle)
const LULLABY = [
  ['C4', 1], ['C4', 1], ['G4', 1], ['G4', 1], ['A4', 1], ['A4', 1], ['G4', 2],
  ['F4', 1], ['F4', 1], ['E4', 1], ['E4', 1], ['D4', 1], ['D4', 1], ['C4', 2],
  ['G4', 1], ['G4', 1], ['F4', 1], ['F4', 1], ['E4', 1], ['E4', 1], ['D4', 2],
  ['G4', 1], ['G4', 1], ['F4', 1], ['F4', 1], ['E4', 1], ['E4', 1], ['D4', 2],
  ['C4', 1], ['C4', 1], ['G4', 1], ['G4', 1], ['A4', 1], ['A4', 1], ['G4', 2],
  ['F4', 1], ['F4', 1], ['E4', 1], ['E4', 1], ['D4', 1], ['D4', 1], ['C4', 2]
];

let melodyTimer = null;
let melodyBus = null;   // eigen kanaal, zodat het liedje echt stopt bij een tik op de maan

export function playLullaby({ beat = 0.75, gain = 0.2, onDone } = {}) {
  stopMelody();
  if (!ctx) return;
  melodyBus = ctx.createGain();
  melodyBus.connect(master);
  const dest = melodyBus;
  let t = 0.3;
  LULLABY.forEach(([n, len]) => {
    const dur = len * beat;
    voice({ type: 'sine', freq: N[n], dur: dur * 0.85, gain, attack: 0.08, release: 0.5, when: t, dest });
    voice({ type: 'triangle', freq: N[n] / 2, dur: dur * 0.85, gain: gain * 0.35, attack: 0.1, release: 0.5, when: t, lp: 600, dest });
    t += dur;
  });
  melodyTimer = setTimeout(() => { melodyTimer = null; if (onDone) onDone(); }, (t + 1.5) * 1000);
  return t;
}

export function stopMelody() {
  if (melodyTimer) { clearTimeout(melodyTimer); melodyTimer = null; }
  if (melodyBus && ctx) {
    const bus = melodyBus;
    melodyBus = null;
    try {
      bus.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
      setTimeout(() => { try { bus.disconnect(); } catch {} }, 700);
    } catch {}
  }
}
