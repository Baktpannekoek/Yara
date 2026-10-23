/* Muziekhoek met twee standen.
   Instrumenten: zes gekleurde klankstaven die altijd mooi samen klinken, plus instrumenten met hun naam.
   Liedjes: bekende kinderliedjes die papa of mama zelf inzingen. Zonder opname klinkt de melodie
   als die bekend is, anders zegt de app de titel en nodigt de ouder uit om te zingen. */

import { INSTRUMENTS, SONGS } from '../words.js';
import { instrumentSounds } from '../sounds-more.js';
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
            <div class="pad-row">${PADS.map((p, i) => `<div class="music-pad" data-i="${i}">${ctx.art.shape(p.kind, p.color)}</div>`).join('')}</div>
            <div class="inst-grid">${INSTRUMENTS.map((it) => `<div class="inst-tile" data-key="${it.key}">${instrumentArt(ctx, it.key)}</div>`).join('')}</div>
          ` : `
            <div class="song-grid">${SONGS.map((s) => `<div class="song-tile" data-key="${s.key}">${songIcon(ctx, s.icon)}</div>`).join('')}</div>
          `}
        </div>
        <div class="mode-switch">
          <div class="mode-btn ${inst ? 'active' : ''}" data-mode="instrumenten">${more.instrumentIcon()}</div>
          <div class="mode-btn ${inst ? '' : 'active'}" data-mode="liedjes">${more.liedjeIcon()}</div>
        </div>`;

      root.querySelectorAll('.music-pad[data-i]').forEach((el) => {
        const i = Number(el.dataset.i);
        ctx.onTap(el, () => {
          ctx.audio.note(ctx.audio.SCALE[i], 0.7);
          ctx.animate(el, i % 2 ? 'anim-wiggle' : 'anim-pop');
        });
      });

      let lastInst = 0;
      root.querySelectorAll('.inst-tile').forEach((el) => {
        ctx.onTap(el, () => {
          const now = performance.now();
          if (now - lastInst < 600) return;
          lastInst = now;
          const key = el.dataset.key;
          ctx.animate(el, 'anim-bounce');
          const it = INSTRUMENTS.find((x) => x.key === key);
          ctx.sound('geluid-' + key, instrumentSounds[key]);
          later(() => ctx.say(key, it.name), 900);
          ctx.setHint(`Dit is een ${it.name}. Hoor je hem?`);
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

      ctx.setHint(inst ? 'Tik op de vormen en de instrumenten' : 'Tik op een liedje');
    }

    build();
    this.unmount = () => { stopSong(); timers.forEach(clearTimeout); timers = []; };
  }
};
