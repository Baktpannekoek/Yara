/* Spraak: eerst de opname van papa of mama, anders de Nederlandse stem van het apparaat. */

import * as audio from './audio.js';
import { getRecording, listRecordingKeys } from './store.js';

const buffers = new Map();   // key -> AudioBuffer
let voices = [];
let nlVoice = null;

function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  voices = window.speechSynthesis.getVoices() || [];
  const nl = voices.filter((v) => (v.lang || '').toLowerCase().startsWith('nl'));
  nlVoice =
    nl.find((v) => v.lang.toLowerCase() === 'nl-nl' && /xander|claire|ellen|siri|premium|enhanced/i.test(v.name)) ||
    nl.find((v) => v.lang.toLowerCase() === 'nl-nl') ||
    nl[0] || null;
}

export function init() {
  if ('speechSynthesis' in window) {
    pickVoice();
    window.speechSynthesis.addEventListener('voiceschanged', pickVoice);
  }
}

export function hasDutchVoice() { return !!nlVoice; }

export async function loadRecordings() {
  const keys = await listRecordingKeys();
  await Promise.all(keys.map((k) => loadOne(k)));
}

export async function loadOne(key) {
  const rec = await getRecording(key);
  if (!rec || !rec.blob) { buffers.delete(key); return false; }
  try {
    const buf = await audio.decode(rec.blob);
    buffers.set(key, buf);
    return true;
  } catch (e) {
    console.warn('Opname niet te decoderen', key, e);
    buffers.delete(key);
    return false;
  }
}

export function forget(key) { buffers.delete(key); }
export function hasRecording(key) { return buffers.has(key); }

/* Spreek een woord uit. Opname heeft voorrang. */
export function say(key, text) {
  if (buffers.has(key)) { audio.playBuffer(buffers.get(key)); return 'opname'; }
  return speak(text) ? 'stem' : 'stil';
}

/* Speel een geluid: opname van de ouder, anders het synthetische geluid. */
export function sound(key, fallback) {
  if (buffers.has(key)) { audio.playBuffer(buffers.get(key)); return 'opname'; }
  if (fallback) fallback();
  return 'synth';
}

export function speak(text) {
  if (!('speechSynthesis' in window) || !text) return false;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'nl-NL';
    if (nlVoice) u.voice = nlVoice;
    u.rate = 0.85;
    u.pitch = 1.05;
    u.volume = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    return true;
  } catch (e) {
    console.warn('Spraak mislukt', e);
    return false;
  }
}
