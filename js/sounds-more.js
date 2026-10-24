/* Extra geluiden: instrumenten en bewegingen. Gebouwd met de bouwstenen uit audio.js. */

import { voice, noise, SCALE } from './audio.js';

/* ---- Instrumenten ---- */

export const instrumentSounds = {
  xylofoon() {
    SCALE.forEach((f, i) => {
      voice({ type: 'triangle', freq: f, dur: 0.35, gain: 0.3, attack: 0.005, release: 0.3, when: i * 0.12 });
      voice({ type: 'sine', freq: f * 3, dur: 0.15, gain: 0.08, attack: 0.005, release: 0.15, when: i * 0.12 });
    });
  },
  trommel() {
    [0, 0.28, 0.56].forEach((w, i) => {
      voice({ type: 'sine', freq: i === 2 ? 220 : 180, glide: { to: 60, time: 0.18 }, dur: 0.18, gain: 0.5, attack: 0.003, release: 0.15, when: w });
      noise({ dur: 0.09, gain: 0.18, lp: 1500, when: w });
    });
  },
  bel() {
    const f = 1046.5;
    [0, 0.5].forEach((w) => {
      voice({ type: 'sine', freq: f, dur: 1.0, gain: 0.3, attack: 0.003, release: 0.8, when: w });
      voice({ type: 'sine', freq: f * 2.76, dur: 0.6, gain: 0.1, attack: 0.003, release: 0.5, when: w });
    });
  },
  gitaar() {
    // Een akkoord, snaar voor snaar aangeslagen
    [196, 246.9, 329.6, 392, 493.9].forEach((f, i) => {
      voice({ type: 'triangle', freq: f, dur: 0.9, gain: 0.2, attack: 0.004, release: 0.7, when: i * 0.06, lp: 2500 });
      voice({ type: 'sawtooth', freq: f, dur: 0.3, gain: 0.05, attack: 0.004, release: 0.25, when: i * 0.06, lp: 1200 });
    });
  },
  piano() {
    [[261.6, 0], [329.6, 0], [392, 0], [523.3, 0.35]].forEach(([f, w]) => {
      voice({ type: 'triangle', freq: f, dur: 0.8, gain: 0.22, attack: 0.004, release: 0.6, when: w });
      voice({ type: 'sine', freq: f * 2, dur: 0.4, gain: 0.06, attack: 0.004, release: 0.3, when: w });
    });
  },
  trompet() {
    voice({ type: 'sawtooth', freq: 392, dur: 0.35, gain: 0.16, attack: 0.03, release: 0.08, lp: 2200, vib: { rate: 6, depth: 4 } });
    voice({ type: 'sawtooth', freq: 523.3, dur: 0.5, gain: 0.16, attack: 0.03, release: 0.2, lp: 2200, vib: { rate: 6, depth: 5 }, when: 0.38 });
  },
  rammelaar() {
    [0, 0.14, 0.3, 0.44, 0.6].forEach((w) => noise({ dur: 0.07, gain: 0.22, bp: { freq: 4500, q: 1.2 }, when: w }));
  },
  fluit() {
    voice({ type: 'sine', freq: 880, dur: 0.45, gain: 0.22, attack: 0.04, release: 0.1, vib: { rate: 5, depth: 6 } });
    voice({ type: 'sine', freq: 1046.5, dur: 0.5, gain: 0.22, attack: 0.03, release: 0.25, vib: { rate: 5, depth: 6 }, when: 0.45 });
    noise({ dur: 0.9, gain: 0.03, bp: { freq: 3000, q: 0.5 } });
  },
  tamboerijn() {
    [0, 0.25].forEach((w) => {
      noise({ dur: 0.18, gain: 0.22, hp: 5000, when: w });
      voice({ type: 'sine', freq: 200, glide: { to: 90, time: 0.1 }, dur: 0.1, gain: 0.25, attack: 0.003, release: 0.08, when: w });
    });
  }
};

/* ---- Eén toon in de klank van een instrument, voor de toetsen onder het instrument ---- */

export function playNote(instrument, freq) {
  switch (instrument) {
    case 'piano':
      voice({ type: 'triangle', freq, dur: 0.7, gain: 0.3, attack: 0.004, release: 0.5 });
      voice({ type: 'sine', freq: freq * 2, dur: 0.35, gain: 0.08, attack: 0.004, release: 0.3 });
      break;
    case 'xylofoon':
      voice({ type: 'triangle', freq, dur: 0.3, gain: 0.32, attack: 0.004, release: 0.3 });
      voice({ type: 'sine', freq: freq * 3, dur: 0.12, gain: 0.08, attack: 0.004, release: 0.12 });
      break;
    case 'gitaar':
      voice({ type: 'triangle', freq: freq / 2, dur: 0.9, gain: 0.26, attack: 0.004, release: 0.7, lp: 2200 });
      voice({ type: 'sawtooth', freq: freq / 2, dur: 0.25, gain: 0.06, attack: 0.004, release: 0.2, lp: 1200 });
      break;
    case 'trompet':
      voice({ type: 'sawtooth', freq, dur: 0.45, gain: 0.18, attack: 0.03, release: 0.15, lp: 2400, vib: { rate: 6, depth: freq * 0.01 } });
      break;
    case 'fluit':
      voice({ type: 'sine', freq: freq * 2, dur: 0.5, gain: 0.24, attack: 0.04, release: 0.15, vib: { rate: 5, depth: freq * 0.012 } });
      noise({ dur: 0.4, gain: 0.025, bp: { freq: 3000, q: 0.5 } });
      break;
    case 'bel':
      voice({ type: 'sine', freq: freq * 2, dur: 1.0, gain: 0.26, attack: 0.003, release: 0.8 });
      voice({ type: 'sine', freq: freq * 2 * 2.76, dur: 0.5, gain: 0.07, attack: 0.003, release: 0.4 });
      break;
    case 'trommel':
      voice({ type: 'sine', freq: freq / 2, glide: { to: freq / 6, time: 0.16 }, dur: 0.16, gain: 0.5, attack: 0.003, release: 0.14 });
      noise({ dur: 0.08, gain: 0.16, lp: 1800 });
      break;
    case 'rammelaar':
      [0, 0.09, 0.18].forEach((w) => noise({ dur: 0.06, gain: 0.22, bp: { freq: freq * 8, q: 2 }, when: w }));
      break;
    case 'tamboerijn':
      noise({ dur: 0.16, gain: 0.2, hp: 4500 });
      voice({ type: 'sine', freq: freq / 2, glide: { to: freq / 5, time: 0.1 }, dur: 0.1, gain: 0.22, attack: 0.003, release: 0.08 });
      break;
    default:
      voice({ type: 'triangle', freq, dur: 0.6, gain: 0.3, attack: 0.01, release: 0.35 });
  }
}

/* ---- Bewegingen ---- */

export const moveSounds = {
  boing() {
    voice({ type: 'sine', freq: 220, glide: { to: 560, time: 0.25 }, dur: 0.25, gain: 0.26, attack: 0.005, release: 0.2, vib: { rate: 20, depth: 30 } });
  },
  klap() {
    [0, 0.26].forEach((w) => noise({ dur: 0.09, gain: 0.4, bp: { freq: 1500, q: 0.7 }, when: w }));
  },
  stamp() {
    [0, 0.32].forEach((w) => {
      voice({ type: 'sine', freq: 150, glide: { to: 55, time: 0.16 }, dur: 0.16, gain: 0.45, attack: 0.003, release: 0.12, when: w });
      noise({ dur: 0.06, gain: 0.12, lp: 900, when: w });
    });
  },
  zwaai() {
    [0, 0.3, 0.6].forEach((w) => noise({ dur: 0.22, gain: 0.12, bp: { freq: 2200, q: 0.6 }, attack: 0.06, when: w }));
  },
  rennen() {
    [0, 0.14, 0.28, 0.42, 0.56, 0.7].forEach((w, i) => {
      voice({ type: 'sine', freq: i % 2 ? 170 : 140, glide: { to: 70, time: 0.08 }, dur: 0.08, gain: 0.25, attack: 0.003, release: 0.06, when: w });
    });
  },
  draai() {
    voice({ type: 'sine', freq: 300, glide: { to: 900, time: 0.7 }, dur: 0.7, gain: 0.14, attack: 0.05, release: 0.2, vib: { rate: 8, depth: 20 } });
    noise({ dur: 0.7, gain: 0.05, bp: { freq: 2500, q: 0.5 }, attack: 0.2 });
  }
};

/* ---- Gekke geluidjes voor de speelwei ---- */

export const funSounds = {
  scheetje() {
    noise({ dur: 0.35, gain: 0.3, bp: { freq: 180, q: 1.5 }, attack: 0.01 });
    voice({ type: 'sawtooth', freq: 90, glide: { to: 60, time: 0.35 }, dur: 0.35, gain: 0.18, attack: 0.01, release: 0.1, lp: 500, am: { rate: 30, depth: 0.5 } });
  },
  boertje() {
    voice({ type: 'sawtooth', freq: 140, glide: { to: 80, time: 0.45 }, dur: 0.45, gain: 0.22, attack: 0.02, release: 0.1, lp: 900, am: { rate: 18, depth: 0.5 } });
    noise({ dur: 0.3, gain: 0.1, bp: { freq: 600, q: 1 } });
  },
  giechel() {
    [0, 0.12, 0.24, 0.36, 0.5].forEach((w, i) => voice({ type: 'sine', freq: 700 + i * 90, glide: { to: 900 + i * 90, time: 0.08 }, dur: 0.09, gain: 0.18, attack: 0.005, release: 0.05, when: w }));
  },
  sprong() {
    voice({ type: 'sine', freq: 300, glide: { to: 700, time: 0.2 }, dur: 0.2, gain: 0.22, attack: 0.005, release: 0.15 });
    voice({ type: 'sine', freq: 500, glide: { to: 250, time: 0.15 }, dur: 0.15, gain: 0.2, attack: 0.005, release: 0.1, when: 0.4 });
  },
  kus() {
    voice({ type: 'sine', freq: 1200, glide: { to: 500, time: 0.12 }, dur: 0.12, gain: 0.18, attack: 0.03, release: 0.05 });
    noise({ dur: 0.05, gain: 0.08, hp: 3000, when: 0.1 });
  }
};

/* Kort vrolijk deuntje bij binnenkomst in de wereld */
export function jingle() {
  [[0, 0], [2, 0.14], [3, 0.28], [5, 0.42], [3, 0.62], [5, 0.8]].forEach(([i, w]) => {
    voice({ type: 'triangle', freq: SCALE[i], dur: 0.3, gain: 0.22, attack: 0.01, release: 0.25, when: w });
  });
}

/* ---- Opruimen ---- */

export function whoosh() {
  noise({ dur: 0.45, gain: 0.2, bp: { freq: 1800, q: 0.6 }, attack: 0.05 });
  voice({ type: 'sine', freq: 700, glide: { to: 200, time: 0.4 }, dur: 0.4, gain: 0.1, attack: 0.02, release: 0.1 });
}

export const moreSounds = { ...instrumentSounds, ...moveSounds, whoosh };
