/* Spraak: eerst de opname van papa of mama, anders de Nederlandse stem van het apparaat.

   iOS-valkuilen: speechSynthesis.speak moet de eerste keer vanuit een echte tik komen en
   heeft bij de eerste keer een flinke opstartvertraging. Daarom "primen" we de stem bij de
   eerste tik met een onhoorbare utterance. Ook laat WebKit een nieuwe utterance soms vallen
   als er vlak daarvoor cancel() is aangeroepen; daarom alleen cancel als er echt iets speelt. */

import * as audio from './audio.js';
import * as real from './realsounds.js';
import { getRecording, listRecordingKeys } from './store.js';

const buffers = new Map();   // key -> AudioBuffer
const gains = new Map();     // key -> versterking zodat elke opname even hard klinkt
let voices = [];

/* Piek van een opname meten: een zachte opname krijgt meer versterking (hooguit vier keer) */
function peakGain(buffer) {
  let peak = 0;
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const d = buffer.getChannelData(c);
    for (let i = 0; i < d.length; i += 4) { const v = Math.abs(d[i]); if (v > peak) peak = v; }
  }
  if (!peak) return 1;
  return Math.max(0.5, Math.min(4, 0.9 / peak));
}
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
    gains.set(key, peakGain(buf));
    return true;
  } catch (e) {
    console.warn('Opname niet te decoderen', key, e);
    buffers.delete(key);
    return false;
  }
}

export function forget(key) { buffers.delete(key); gains.delete(key); }
export function setBuffer(key, buffer) { buffers.set(key, buffer); gains.set(key, peakGain(buffer)); }
export function hasRecording(key) { return buffers.has(key); }
export function recordingCount() { return buffers.size; }

/* Speel een opname af en geef de bron terug, zodat de aanroeper hem kan stoppen */
export function playRecording(key) {
  if (!buffers.has(key)) return null;
  return audio.playBuffer(buffers.get(key), gains.get(key) || 1);
}

/* Spreek een woord uit. Opname heeft voorrang. */
export function say(key, text) {
  audio.duckAmbient(1800);
  if (buffers.has(key)) { playRecording(key); return 'opname'; }
  return speak(text) ? 'stem' : 'stil';
}

/* Speel een geluid: opname van de ouder, anders de echte opname uit sounds/, anders synthetisch.
   Sleutels als 'geluid-koe' of 'fx-klap' horen bij de bestanden koe.wav en klap.wav. */
export function sound(key, fallback) {
  audio.duckAmbient(1500);
  if (buffers.has(key)) { playRecording(key); return 'opname'; }
  const base = String(key).replace(/^(geluid|fx)-/, '');
  if (real.play(base)) return 'echt';
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
