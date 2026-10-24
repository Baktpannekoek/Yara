/* Echte geluiden: korte opnames uit sounds/ (zie sounds/CREDITS.md voor de bronnen).
   Ze worden na de eerste tik geladen en gedecodeerd. Zolang een geluid nog niet binnen is,
   klinkt de synthetische versie. */

import * as audio from './audio.js';

const buffers = new Map();
let started = false;

export function has(name) { return buffers.has(name); }

export function play(name, gain = 1) {
  const b = buffers.get(name);
  if (!b) return false;
  audio.playBuffer(b, gain);
  return true;
}

/* Laden in kleine groepjes, zodat de app meteen bruikbaar blijft */
export async function load() {
  if (started) return;
  started = true;
  let names = [];
  try {
    names = await (await fetch('sounds/manifest.json')).json();
  } catch (e) { console.warn('Geluidenlijst niet geladen', e); return; }
  const queue = [...names];
  const worker = async () => {
    while (queue.length) {
      const name = queue.shift();
      try {
        const blob = await (await fetch(`sounds/${name}.wav`)).blob();
        buffers.set(name, await audio.decode(blob));
      } catch (e) { console.warn('Geluid niet geladen', name, e); }
    }
  };
  await Promise.all([worker(), worker(), worker()]);
}
