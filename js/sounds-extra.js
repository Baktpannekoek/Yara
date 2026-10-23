/* Extra cartoon-geluiden voor wilde dieren en voertuigen.
   Gebouwd met dezelfde bouwstenen als de boerderijdieren in audio.js: voice (oscillator
   met zachte envelope) en noise (ruisstoot). Een telefoonluidspreker laat weinig horen
   onder 200 Hz, daarom heeft elk laag geluid een extra laag in het middengebied.
   Alles blijft zacht (gain 0.15 tot 0.35) en begint zonder harde tik (attack minstens 0.005).
   Elk geluid duurt tussen 0.4 en 1.5 seconde. */

import { voice, noise } from './audio.js';

/* ---- Wilde dieren ---- */

export const wildSounds = {
  /* Vriendelijke brul: laag en glijdend omlaag, met een trilling in het volume
     zodat het rommelt in plaats van bromt. */
  leeuw() {
    voice({ type: 'sawtooth', freq: 160, glide: { to: 105, time: 1.0 }, dur: 1.0, gain: 0.3, attack: 0.12, release: 0.3, lp: 1000, am: { rate: 24, depth: 0.5 } });
    voice({ type: 'sawtooth', freq: 320, glide: { to: 210, time: 1.0 }, dur: 1.0, gain: 0.16, attack: 0.15, release: 0.3, bp: { freq: 650, q: 1.2 }, am: { rate: 24, depth: 0.5 }, vib: { rate: 5, depth: 6 } });
  },

  /* Toeter van de slurf: een toon die omhoog klimt en daarbij trilt. */
  olifant() {
    voice({ type: 'sawtooth', freq: 230, glide: { to: 520, time: 0.65 }, dur: 0.75, gain: 0.26, attack: 0.06, release: 0.25, lp: 2400, vib: { rate: 6, depth: 18 } });
    voice({ type: 'square', freq: 460, glide: { to: 1040, time: 0.65 }, dur: 0.75, gain: 0.08, attack: 0.08, release: 0.25, bp: { freq: 1500, q: 1 }, vib: { rate: 6, depth: 30 } });
  },

  /* "Oe-oe-aa": twee korte roepjes en een langere die omhoog gaat. */
  aap() {
    [0, 0.2].forEach((w, i) => {
      voice({ type: 'triangle', freq: 480 + i * 40, glide: { to: 640 + i * 40, time: 0.12 }, dur: 0.13, gain: 0.24, attack: 0.01, release: 0.06, lp: 2200, when: w });
    });
    voice({ type: 'sawtooth', freq: 560, glide: { to: 900, time: 0.3 }, dur: 0.38, gain: 0.2, attack: 0.02, release: 0.15, bp: { freq: 1200, q: 1.2 }, vib: { rate: 12, depth: 25 }, when: 0.42 });
  },

  /* Giraffen zijn bijna stil. Dit is een zacht gebrom met een paar kauwgeluiden erbij. */
  giraf() {
    voice({ type: 'triangle', freq: 240, glide: { to: 200, time: 0.85 }, dur: 0.85, gain: 0.15, attack: 0.1, release: 0.25, lp: 900, vib: { rate: 5, depth: 6 }, am: { rate: 4, depth: 0.4 } });
    [0.05, 0.27, 0.49, 0.71].forEach((w) => {
      noise({ dur: 0.1, gain: 0.15, bp: { freq: 750, q: 1 }, attack: 0.01, when: w });
    });
  },

  /* Korte hinnik, anders dan het paard: drie blaffende stootjes en een kort staartje. */
  zebra() {
    [0, 0.13, 0.26].forEach((w, i) => {
      voice({ type: 'square', freq: 640 - i * 30, glide: { to: 520, time: 0.09 }, dur: 0.1, gain: 0.2, attack: 0.008, release: 0.05, lp: 2400, am: { rate: 40, depth: 0.5 }, when: w });
    });
    voice({ type: 'triangle', freq: 900, glide: { to: 580, time: 0.3 }, dur: 0.32, gain: 0.16, attack: 0.01, release: 0.18, vib: { rate: 18, depth: 40 }, when: 0.4 });
  },

  /* Klik-klak met de bek: twee korte tikken en daarna een laag knorretje. */
  krokodil() {
    [[0, 2200], [0.2, 1600]].forEach(([w, f]) => {
      noise({ dur: 0.04, gain: 0.26, bp: { freq: f, q: 3 }, when: w });
      voice({ type: 'sine', freq: 900, glide: { to: 380, time: 0.04 }, dur: 0.05, gain: 0.18, attack: 0.005, release: 0.04, when: w });
    });
    voice({ type: 'sawtooth', freq: 125, glide: { to: 95, time: 0.4 }, dur: 0.45, gain: 0.26, attack: 0.04, release: 0.2, lp: 900, am: { rate: 22, depth: 0.6 }, when: 0.45 });
    voice({ type: 'sawtooth', freq: 250, glide: { to: 190, time: 0.4 }, dur: 0.45, gain: 0.14, attack: 0.05, release: 0.2, bp: { freq: 520, q: 1.5 }, am: { rate: 22, depth: 0.6 }, when: 0.45 });
  }
};

/* ---- Voertuigen ---- */

export const vehicleSounds = {
  /* Twee toetjes, een tweeklank zoals een echte autoclaxon. */
  auto() {
    [[0, 0.14], [0.2, 0.2]].forEach(([w, d]) => {
      voice({ type: 'square', freq: 440, dur: d, gain: 0.18, attack: 0.01, release: 0.08, lp: 1800, when: w });
      voice({ type: 'square', freq: 554, dur: d, gain: 0.1, attack: 0.01, release: 0.08, lp: 1800, when: w });
    });
  },

  /* Opzwellende suis. Een ruisstoot kan zelf niet glijden, daarom liggen hier zes
     stootjes over elkaar waarvan de bandpass steeds hoger zit en het volume groeit. */
  vliegtuig() {
    for (let i = 0; i < 6; i++) {
      noise({ dur: 0.4, gain: 0.1 + i * 0.02, attack: 0.08, bp: { freq: 600 + i * 320, q: 0.8 }, when: i * 0.2 });
    }
    voice({ type: 'sawtooth', freq: 180, glide: { to: 360, time: 1.2 }, dur: 1.2, gain: 0.12, attack: 0.3, release: 0.3, lp: 1200, vib: { rate: 8, depth: 6 } });
    voice({ type: 'sine', freq: 900, glide: { to: 1900, time: 1.2 }, dur: 1.2, gain: 0.06, attack: 0.4, release: 0.3 });
  },

  /* Tsjoeke-tsjoeke: vier ruisstootjes in tempo, daarna een fluit met twee tonen tegelijk. */
  trein() {
    [0, 0.17, 0.34, 0.51].forEach((w, i) => {
      noise({ dur: 0.13, gain: 0.22, bp: { freq: i % 2 ? 900 : 1300, q: 0.8 }, when: w });
      voice({ type: 'sine', freq: 150, glide: { to: 90, time: 0.08 }, dur: 0.08, gain: 0.12, attack: 0.005, release: 0.05, when: w });
    });
    [660, 880].forEach((f) => {
      voice({ type: 'triangle', freq: f, dur: 0.5, gain: 0.14, attack: 0.05, release: 0.25, vib: { rate: 5, depth: 8 }, when: 0.72 });
    });
  },

  /* Lagere toeter dan de auto, een langere toooet. */
  bus() {
    voice({ type: 'square', freq: 220, dur: 0.5, gain: 0.2, attack: 0.03, release: 0.12, lp: 1400 });
    voice({ type: 'square', freq: 330, dur: 0.5, gain: 0.1, attack: 0.03, release: 0.12, lp: 1400 });
  },

  /* Putt-putt-putt: lage korte tikken met een beetje ruis voor de middentonen. */
  tractor() {
    for (let i = 0; i < 6; i++) {
      const w = i * 0.14;
      voice({ type: 'sine', freq: 150, glide: { to: 70, time: 0.06 }, dur: 0.07, gain: 0.3, attack: 0.005, release: 0.05, when: w });
      noise({ dur: 0.05, gain: 0.14, bp: { freq: 700, q: 1 }, when: w });
    }
  },

  /* Lange lage scheepstoeter met een laag in het middengebied zodat hij ook op een telefoon klinkt. */
  boot() {
    voice({ type: 'sawtooth', freq: 110, dur: 1.2, gain: 0.28, attack: 0.15, release: 0.3, lp: 700, vib: { rate: 4, depth: 2 } });
    voice({ type: 'sawtooth', freq: 220, dur: 1.2, gain: 0.16, attack: 0.18, release: 0.3, bp: { freq: 450, q: 1.2 }, vib: { rate: 4, depth: 4 } });
    voice({ type: 'triangle', freq: 165, dur: 1.2, gain: 0.08, attack: 0.2, release: 0.3, lp: 900 });
  },

  /* Zachte sirene: een keer omhoog en een keer omlaag, zacht en binnen een seconde. */
  brandweerauto() {
    voice({ type: 'triangle', freq: 520, glide: { to: 780, time: 0.45 }, dur: 0.45, gain: 0.15, attack: 0.08, release: 0.04, lp: 1800 });
    voice({ type: 'triangle', freq: 780, glide: { to: 520, time: 0.43 }, dur: 0.45, gain: 0.15, attack: 0.02, release: 0.08, lp: 1800, when: 0.45 });
  },

  /* Fietsbel: twee hoge tingels met een zachte boventoon. */
  fiets() {
    [0, 0.16].forEach((w) => {
      voice({ type: 'sine', freq: 1760, dur: 0.35, gain: 0.18, attack: 0.005, release: 0.3, when: w });
      voice({ type: 'sine', freq: 1760 * 2.76, dur: 0.2, gain: 0.05, attack: 0.005, release: 0.2, when: w });
    });
  }
};

export const extraSounds = { ...wildSounds, ...vehicleSounds };
