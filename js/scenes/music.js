/* Muziekhoek met twee standen.
   Instrumenten: zes gekleurde klankstaven die altijd mooi samen klinken, plus instrumenten met hun naam.
   Liedjes: bekende kinderliedjes die papa of mama zelf inzingen. Zonder opname klinkt de melodie
   als die bekend is, anders zegt de app de titel en nodigt de ouder uit om te zingen. */

import { INSTRUMENTS, SONGS } from '../words.js';
import { instrumentSounds, playNote } from '../sounds-more.js';
import * as more from '../art-more.js';

const PADS = [
  { kind: 'circle', color: '#f28b82' },
  { kind: 'square', color: '#ffd66b' },
  { kind: 'triangle', color: '#8fcf7c' },
  { kind: 'star', color: '#8fcbea' },
  { kind: 'heart', color: '#f7a8c4' },
  { kind: 'flower', color: '#cdb4f0' }
];

let mode = 'instrumenten';
let instrument = 'piano';

// Acht toetsen: C D E F G A B C, elk met een eigen kleur
const KEYS = [
  [261.63, '#f28b82'], [293.66, '#ffb84d'], [329.63, '#ffd66b'], [349.23, '#8fcf7c'],
  [392.0, '#a7e6d7'], [440.0, '#8fcbea'], [493.88, '#cdb4f0'], [523.25, '#f7a8c4']
];

function songIcon(ctx, name) {
  if (name === 'bed') return ctx.art.bed();
  if (name === 'bel') return ctx.art.bell();
  if (name === 'maan') return ctx.art.moon();
  if (name === 'ster') return ctx.art.star();
  if (name === 'gezicht') return ctx.art.faceIcon();
  if (name === 'paddenstoel') return more.paddenstoel();
  return ctx.art.byName(name);
}

function instrumentArt(ctx, key) {
  if (key === 'trommel') return ctx.art.drum();
  if (key === 'bel') return ctx.art.bell();
  return typeof more[key] === 'function' ? more[key]() : ctx.art.byName(key);
}

export default {
  id: 'music',
  mount(root, ctx) {
    let playing = null;      // { key, source } van het liedje dat nu klinkt
    let timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));

    function stopSong() {
      if (!playing) return;
      try { if (playing.source) playing.source.stop(); } catch {}
      ctx.audio.stopMelody();
      const tile = root.querySelector(`.song-tile[data-key="${playing.key}"]`);
      if (tile) tile.classList.remove('playing');
      playing = null;
    }

    function build() {
      stopSong();
      const inst = mode === 'instrumenten';
      root.innerHTML = `
        <div class="bg">${ctx.art.landscape()}</div>
        <div class="music-body">
          ${inst ? `
            <div class="inst-strip">${INSTRUMENTS.map((it) => `<div class="inst-btn ${it.key === instrument ? 'active' : ''}" data-key="${it.key}">${instrumentArt(ctx, it.key)}</div>`).join('')}</div>
            <div class="inst-stage">
              <div class="inst-player">${more.poppetje()}</div>
              <div class="inst-big bob" id="inst-big">${instrumentArt(ctx, instrument)}</div>
            </div>
            <div class="key-row">${KEYS.map(([f, c], i) => `<div class="key" data-i="${i}" style="--c:${c}"></div>`).join('')}</div>
          ` : `
            <div class="song-grid">${SONGS.map((s) => `<div class="song-tile" data-key="${s.key}">${songIcon(ctx, s.icon)}</div>`).join('')}</div>
          `}
        </div>
        <div class="mode-switch">
          <div class="mode-btn ${inst ? 'active' : ''}" data-mode="instrumenten">${more.instrumentIcon()}</div>
          <div class="mode-btn ${inst ? '' : 'active'}" data-mode="liedjes">${more.liedjeIcon()}</div>
        </div>`;

      // Toetsen: klinken in de klank van het gekozen instrument
      root.querySelectorAll('.key').forEach((el) => {
        ctx.onTap(el, () => {
          playNote(instrument, KEYS[Number(el.dataset.i)][0]);
          ctx.animate(el, 'anim-pop');
          const big = root.querySelector('#inst-big');
          if (big) ctx.animate(big, Number(el.dataset.i) % 2 ? 'anim-wiggle' : 'anim-bounce');
        });
      });

      let lastInst = 0;
      root.querySelectorAll('.inst-btn').forEach((el) => {
        ctx.onTap(el, (e) => {
          e.stopPropagation();
          const now = performance.now();
          if (now - lastInst < 500) return;
          lastInst = now;
          const key = el.dataset.key;
          const it = INSTRUMENTS.find((x) => x.key === key);
          instrument = key;
          root.querySelectorAll('.inst-btn').forEach((b) => b.classList.toggle('active', b === el));
          const big = root.querySelector('#inst-big');
          big.innerHTML = instrumentArt(ctx, key);
          ctx.animate(big, 'anim-appear');
          ctx.sound('geluid-' + key, instrumentSounds[key]);
          later(() => ctx.say(key, it.name), 900);
          ctx.setHint(`Dit is een ${it.name}. Speel maar op de toetsen!`);
        });
      });

      root.querySelectorAll('.song-tile').forEach((el) => {
        ctx.onTap(el, () => {
          const key = el.dataset.key;
          const song = SONGS.find((s) => s.key === key);
          if (playing && playing.key === key) { stopSong(); ctx.setHint('Nog een keer?'); return; }
          stopSong();
          el.classList.add('playing');
          ctx.animate(el, 'anim-pop');
          if (ctx.speech.hasRecording(key)) {
            const source = ctx.speech.playRecording(key);
            playing = { key, source };
            if (source) source.onended = () => { if (playing && playing.key === key) stopSong(); };
            ctx.setHint(`${song.title}. Zing je mee?`);
          } else if (song.melody) {
            playing = { key, source: null };
            ctx.audio.playMelody(song.melody, { onDone: () => { if (playing && playing.key === key) stopSong(); } });
            ctx.setHint(`${song.title}. Zing jij de woorden?`);
          } else {
            playing = null;
            el.classList.remove('playing');
            ctx.audio.chime();
            later(() => ctx.speech.speak(song.title), 300);
            ctx.setHint(`${song.title}. Zing jij het liedje? Je kunt het ook inspreken in het oudermenu.`);
          }
        });
      });

      root.querySelectorAll('.mode-btn').forEach((b) => {
        ctx.onTap(b, (e) => {
          e.stopPropagation();
          if (b.dataset.mode === mode) return;
          mode = b.dataset.mode;
          ctx.audio.tap();
          build();
        });
      });

      ctx.setHint(inst ? 'Kies een instrument en speel op de toetsen' : 'Tik op een liedje');
    }

    build();
    this.unmount = () => { stopSong(); timers.forEach(clearTimeout); timers = []; };
  }
};
