/* Spraak: eerst de opname van papa of mama, anders de Nederlandse stem van het apparaat.

   iOS-valkuilen: speechSynthesis.speak moet de eerste keer vanuit een echte tik komen en
   heeft bij de eerste keer een flinke opstartvertraging. Daarom "primen" we de stem bij de
   eerste tik met een onhoorbare utterance. Ook laat WebKit een nieuwe utterance soms vallen
   als er vlak daarvoor cancel() is aangeroepen; daarom alleen cancel als er echt iets speelt. */

import * as audio from './audio.js';
import { getRecording, listRecordingKeys } from './store.js';

const buffers = new Map();   // key -> AudioBuffer
let voices = [];
let nlVoice = null;
let primed = false;

function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  voices = window.speechSynthesis.getVoices() || [];
  const nl = voices.filter((v) => (v.lang || '').toLowerCase().replace('_', '-').startsWith('nl'));
  const nlnl = nl.filter((v) => /nl-nl/i.test(v.lang));
  // De betere stemmen van iOS staan in de voiceURI als premium of enhanced
  nlVoice =
    nlnl.find((v) => /premium|enhanced/i.test(v.voiceURI || '')) ||
    nlnl.find((v) => /xander|claire|ellen|siri|premium|enhanced|verbeterd/i.test(v.name)) ||
    nlnl[0] ||
    nl[0] || null;
}

export function init() {
  if ('speechSynthesis' in window) {
    pickVoice();
    window.speechSynthesis.addEventListener('voiceschanged', pickVoice);
    // iOS vult de lijst soms pas na een moment, zonder voiceschanged
    setTimeout(pickVoice, 800);
    setTimeout(pickVoice, 3000);
  }
}

export function hasDutchVoice() { return !!nlVoice; }

/* Bij de eerste tik: de spraakmotor wakker maken zonder iets hoorbaars te zeggen */
export function prime() {
  if (primed || !('speechSynthesis' in window)) return;
  const s = window.speechSynthesis;
  if (s.speaking || s.pending) { primed = true; return; }
  try {
    const u = new SpeechSynthesisUtterance('.');
    u.lang = 'nl-NL';
    if (nlVoice) u.voice = nlVoice;
    u.volume = 0;
    s.speak(u);
    primed = true;
  } catch {}
}

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
export function setBuffer(key, buffer) { buffers.set(key, buffer); }
export function hasRecording(key) { return buffers.has(key); }
export function recordingCount() { return buffers.size; }

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
  const s = window.speechSynthesis;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'nl-NL';
    if (nlVoice) u.voice = nlVoice;
    u.rate = 0.9;
    u.pitch = 1.05;
    u.volume = 1;
    if (s.speaking || s.pending) {
      s.cancel();
      setTimeout(() => s.speak(u), 60);
    } else {
      s.speak(u);
    }
    primed = true;
    return true;
  } catch (e) {
    console.warn('Spraak mislukt', e);
    return false;
  }
}
