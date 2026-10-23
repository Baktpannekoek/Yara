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

/* ---- Opruimen ---- */

export function whoosh() {
  noise({ dur: 0.45, gain: 0.2, bp: { freq: 1800, q: 0.6 }, attack: 0.05 });
  voice({ type: 'sine', freq: 700, glide: { to: 200, time: 0.4 }, dur: 0.4, gain: 0.1, attack: 0.02, release: 0.1 });
}

export const moreSounds = { ...instrumentSounds, ...moveSounds, whoosh };
