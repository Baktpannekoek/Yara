/* Alle geluiden komen uit de Web Audio API: geen bestanden nodig, werkt offline.
   Eén AudioContext, ontgrendeld bij de eerste tik, met een begrenzer zodat niets schrikt. */

let ctx = null;
let master = null;
let unlocked = false;
let volume = 0.8;

export function isUnlocked() { return unlocked; }

export function unlock() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 12;
    comp.ratio.value = 6;
    comp.attack.value = 0.005;
    comp.release.value = 0.2;
    master = ctx.createGain();
    master.gain.value = volume;
    master.connect(comp);
    comp.connect(ctx.destination);
  }
  if (ctx.state !== 'running') ctx.resume();
  // Stille buffer afspelen: dit is de klassieke iOS-ontgrendeling
  const buf = ctx.createBuffer(1, 1, 22050);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  src.start(0);
  unlocked = true;
  return ctx;
}

export function resume() {
  if (ctx && ctx.state !== 'running') ctx.resume();
}

export function setVolume(v) {
  volume = Math.max(0, Math.min(1, v));
  if (master) master.gain.setTargetAtTime(volume, ctx.currentTime, 0.05);
}

function now() { return ctx ? ctx.currentTime : 0; }

/* Basis: een oscillator met zachte envelope */
function voice({ type = 'triangle', freq = 440, dur = 0.4, gain = 0.3, attack = 0.02, release = 0.15,
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
    const lfo = ctx.createOscillator();
    lfo.frequency.value = am.rate;
    const lg = ctx.createGain();
    lg.gain.value = am.depth;
    const base = ctx.createGain();
    base.gain.value = 1 - am.depth;
    lfo.connect(lg);
    lg.connect(g.gain);
    lfo.start(t0); lfo.stop(t0 + dur + release + 0.1);
  }
  node.connect(g);
  g.connect(dest || master);
  osc.start(t0);
  osc.stop(t0 + dur + release + 0.1);
  return osc;
}

/* Ruisstoot, voor plop, trommel en knorren */
function noise({ dur = 0.15, gain = 0.3, attack = 0.005, when = 0, bp = null, lp = null, hp = null }) {
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

/* ---- Algemene geluiden ---- */

export const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25]; // C D E G A C, pentatonisch

export function note(freq, dur = 0.6, when = 0, gain = 0.28) {
  voice({ type: 'triangle', freq, dur, gain, attack: 0.01, release: 0.35, when });
  voice({ type: 'sine', freq: freq * 2, dur: dur * 0.6, gain: gain * 0.25, attack: 0.01, release: 0.3, when });
}

export function pop() {
  voice({ type: 'sine', freq: 900, glide: { to: 300, time: 0.09 }, dur: 0.09, gain: 0.25, attack: 0.003, release: 0.08 });
  noise({ dur: 0.06, gain: 0.08, hp: 2000 });
}

export function drum() {
  voice({ type: 'sine', freq: 160, glide: { to: 55, time: 0.18 }, dur: 0.18, gain: 0.5, attack: 0.003, release: 0.15 });
  noise({ dur: 0.08, gain: 0.12, lp: 1200 });
}

export function bell() {
  const f = 1046.5;
  voice({ type: 'sine', freq: f, dur: 1.2, gain: 0.22, attack: 0.003, release: 0.8 });
  voice({ type: 'sine', freq: f * 2.76, dur: 0.7, gain: 0.08, attack: 0.003, release: 0.5 });
  voice({ type: 'sine', freq: f * 5.4, dur: 0.3, gain: 0.03, attack: 0.003, release: 0.3 });
}

export function creak() {
  voice({ type: 'sawtooth', freq: 180, glide: { to: 260, time: 0.5 }, dur: 0.5, gain: 0.06, attack: 0.05, release: 0.15, lp: 900, vib: { rate: 14, depth: 10 } });
}

export function thud() {
  voice({ type: 'sine', freq: 120, glide: { to: 60, time: 0.15 }, dur: 0.15, gain: 0.3, attack: 0.003, release: 0.12 });
}

export function chime() {
  [0, 0.12, 0.24].forEach((w, i) => note(SCALE[[2, 3, 5][i]], 0.5, w, 0.18));
}

export function tap() {
  voice({ type: 'sine', freq: 600, dur: 0.06, gain: 0.12, attack: 0.003, release: 0.06 });
}

export function sparkle() {
  [0, 0.08, 0.16, 0.24].forEach((w, i) => voice({ type: 'sine', freq: 1400 + i * 300, dur: 0.12, gain: 0.08, attack: 0.003, release: 0.15, when: w }));
}

export function honk() {
  voice({ type: 'square', freq: 330, dur: 0.18, gain: 0.12, attack: 0.01, release: 0.08, lp: 1200 });
  voice({ type: 'square', freq: 392, dur: 0.22, gain: 0.12, attack: 0.01, release: 0.1, lp: 1200, when: 0.2 });
}

export function boing() {
  voice({ type: 'sine', freq: 200, glide: { to: 500, time: 0.25 }, dur: 0.25, gain: 0.2, attack: 0.005, release: 0.2, vib: { rate: 20, depth: 30 } });
}

export function splash() {
  noise({ dur: 0.35, gain: 0.18, bp: { freq: 1800, q: 0.7 } });
  voice({ type: 'sine', freq: 500, glide: { to: 900, time: 0.3 }, dur: 0.3, gain: 0.06, attack: 0.02, release: 0.2 });
}

export function crunch() {
  [0, 0.12].forEach((w) => noise({ dur: 0.1, gain: 0.15, bp: { freq: 2500, q: 1 }, when: w }));
}

export function rustle() {
  noise({ dur: 0.4, gain: 0.08, bp: { freq: 3000, q: 0.5 } });
}

export function yawn() {
  voice({ type: 'triangle', freq: 300, glide: { to: 180, time: 0.9 }, dur: 0.9, gain: 0.1, attack: 0.2, release: 0.3, lp: 800 });
}

/* ---- Dierengeluiden (cartoon, gemaakt met oscillatoren) ---- */

export const animals = {
  koe() {
    voice({ type: 'sawtooth', freq: 130, glide: { to: 95, time: 0.9 }, dur: 0.9, gain: 0.22, attack: 0.08, release: 0.3, lp: 500, vib: { rate: 5, depth: 4 } });
    voice({ type: 'sine', freq: 65, dur: 0.9, gain: 0.15, attack: 0.1, release: 0.3 });
  },
  hond() {
    [0, 0.22].forEach((w) => {
      voice({ type: 'sawtooth', freq: 380, glide: { to: 220, time: 0.12 }, dur: 0.12, gain: 0.2, attack: 0.005, release: 0.08, bp: { freq: 700, q: 1.2 }, when: w });
      noise({ dur: 0.08, gain: 0.08, bp: { freq: 900, q: 1 }, when: w });
    });
  },
  kat() {
    voice({ type: 'triangle', freq: 500, glide: { to: 950, time: 0.3 }, dur: 0.3, gain: 0.14, attack: 0.03, release: 0.05, vib: { rate: 7, depth: 12 } });
    voice({ type: 'triangle', freq: 950, glide: { to: 420, time: 0.45 }, dur: 0.45, gain: 0.14, attack: 0.01, release: 0.25, vib: { rate: 7, depth: 12 }, when: 0.3 });
  },
  eend() {
    [0, 0.16, 0.32].forEach((w) => voice({ type: 'square', freq: 320, glide: { to: 260, time: 0.1 }, dur: 0.1, gain: 0.11, attack: 0.01, release: 0.05, lp: 1800, am: { rate: 60, depth: 0.5 }, when: w }));
  },
  schaap() {
    voice({ type: 'sawtooth', freq: 240, dur: 0.75, gain: 0.14, attack: 0.05, release: 0.2, bp: { freq: 900, q: 1.5 }, vib: { rate: 9, depth: 14 }, am: { rate: 9, depth: 0.5 } });
  },
  paard() {
    voice({ type: 'triangle', freq: 800, glide: { to: 1300, time: 0.25 }, dur: 0.25, gain: 0.1, attack: 0.02, release: 0.05, vib: { rate: 22, depth: 60 } });
    voice({ type: 'triangle', freq: 1300, glide: { to: 500, time: 0.6 }, dur: 0.6, gain: 0.12, attack: 0.01, release: 0.25, vib: { rate: 22, depth: 60 }, when: 0.25 });
  },
  kip() {
    [0, 0.18, 0.36, 0.6].forEach((w, i) => voice({ type: 'triangle', freq: i === 3 ? 820 : 560, glide: { to: i === 3 ? 500 : 480, time: 0.1 }, dur: i === 3 ? 0.25 : 0.1, gain: 0.13, attack: 0.005, release: 0.06, when: w }));
  },
  varken() {
    [0, 0.35].forEach((w) => {
      noise({ dur: 0.28, gain: 0.2, bp: { freq: 350, q: 2 }, when: w });
      voice({ type: 'sawtooth', freq: 110, dur: 0.25, gain: 0.08, attack: 0.02, release: 0.1, lp: 400, am: { rate: 28, depth: 0.7 }, when: w });
    });
  },
  kikker() {
    voice({ type: 'square', freq: 150, glide: { to: 120, time: 0.4 }, dur: 0.4, gain: 0.12, attack: 0.02, release: 0.1, lp: 900, am: { rate: 26, depth: 0.6 } });
    voice({ type: 'square', freq: 170, glide: { to: 130, time: 0.3 }, dur: 0.3, gain: 0.1, attack: 0.02, release: 0.1, lp: 900, am: { rate: 26, depth: 0.6 }, when: 0.5 });
  },
  vogel() {
    [0, 0.14, 0.3, 0.42].forEach((w, i) => voice({ type: 'sine', freq: 2200 + (i % 2) * 400, glide: { to: 3000 + (i % 2) * 300, time: 0.08 }, dur: 0.08, gain: 0.08, attack: 0.005, release: 0.05, when: w }));
  }
};

/* ---- Opnames van ouders afspelen ---- */

export async function decode(blob) {
  if (!ctx) unlock();
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

export function playLullaby({ beat = 0.75, gain = 0.16, onDone } = {}) {
  stopMelody();
  if (!ctx) return;
  let t = 0.3;
  LULLABY.forEach(([n, len]) => {
    const dur = len * beat;
    voice({ type: 'sine', freq: N[n], dur: dur * 0.85, gain, attack: 0.08, release: 0.5, when: t });
    voice({ type: 'triangle', freq: N[n] / 2, dur: dur * 0.85, gain: gain * 0.35, attack: 0.1, release: 0.5, when: t, lp: 600 });
    t += dur;
  });
  melodyTimer = setTimeout(() => { melodyTimer = null; if (onDone) onDone(); }, (t + 1.5) * 1000);
  return t;
}

export function stopMelody() {
  if (melodyTimer) { clearTimeout(melodyTimer); melodyTimer = null; }
}
