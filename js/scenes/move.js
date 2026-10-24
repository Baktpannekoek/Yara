/* Doe mee: een poppetje doet een beweging voor, het woord klinkt, en zij doet het na.
   Imiteren is op anderhalf de manier van leren. Een tik op het poppetje kiest een willekeurige
   beweging, de knopjes eronder kiezen er een bewust. */

import { MOVES } from '../words.js';
import { moveSounds } from '../sounds-more.js';
import * as more from '../art-more.js';

const INK = '#3b4252';
const GLYPHS = {
  springen: `<svg viewBox="0 0 100 100"><path d="M50 84 V24 M26 46 L50 20 L74 46" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  klappen: `<svg viewBox="0 0 100 100"><ellipse cx="33" cy="56" rx="15" ry="24" fill="#ffd9b8" stroke="${INK}" stroke-width="2" transform="rotate(-18 33 56)"/><ellipse cx="67" cy="56" rx="15" ry="24" fill="#ffd9b8" stroke="${INK}" stroke-width="2" transform="rotate(18 67 56)"/><path d="M50 30 l-5 -9 M50 30 l5 -9 M50 26 v-10" stroke="#ffb84d" stroke-width="4" stroke-linecap="round"/></svg>`,
  stampen: `<svg viewBox="0 0 100 100"><path d="M18 68 V40 q0 -8 8 -8 H46 q6 0 10 6 l8 12 q18 4 22 12 V70 q0 4 -4 4 H22 q-4 0 -4 -6z" fill="#f28b82" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><path d="M14 86 h20 M30 92 h14 M52 88 h22" stroke="${INK}" stroke-width="4" stroke-linecap="round"/></svg>`,
  zwaaien: `<svg viewBox="0 0 100 100"><path d="M30 58 V36 a6 6 0 0 1 12 0 V30 a6 6 0 0 1 12 0 V33 a6 6 0 0 1 12 0 V42 a6 6 0 0 1 12 0 V64 a24 24 0 0 1 -48 0z" fill="#ffd9b8" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><path d="M14 24 q6 -6 12 0 M12 40 q6 -6 12 0" fill="none" stroke="#8fcbea" stroke-width="3" stroke-linecap="round"/></svg>`,
  rennen: `<svg viewBox="0 0 100 100"><path d="M18 50 H68 M52 30 L74 50 L52 70" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 32 h16 M6 68 h16" stroke="#8fcbea" stroke-width="5" stroke-linecap="round"/></svg>`,
  draaien: `<svg viewBox="0 0 100 100"><path d="M74 52 a24 24 0 1 1 -9 -19" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M60 18 l16 14 l-20 6z" fill="${INK}"/></svg>`
};

export default {
  id: 'move',
  mount(root, ctx) {
    root.innerHTML = `
      <div class="bg">${ctx.art.landscape()}</div>
      <div class="move-figure" id="figure">${more.poppetje()}</div>
      <div class="move-buttons">
        ${MOVES.map((m) => `<div class="move-btn" data-move="${m.key}" aria-label="${m.name}">${GLYPHS[m.key]}</div>`).join('')}
      </div>`;

    const figure = root.querySelector('#figure');
    let timers = [];
    let busyUntil = 0;
    let lastMove = null;
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));

    function doMove(m) {
      const now = performance.now();
      if (now < busyUntil) return;
      busyUntil = now + 1100;
      lastMove = m.key;
      figure.className = 'move-figure';
      void figure.offsetWidth;
      figure.classList.add('do-' + m.anim);
      later(() => figure.classList.remove('do-' + m.anim), 1000);
      ctx.sound('fx-' + m.fx, moveSounds[m.fx]);
      later(() => ctx.say(m.key, m.say), 150);
      ctx.setHint(m.question);
      root.querySelectorAll('.move-btn').forEach((b) => b.classList.toggle('active', b.dataset.move === m.key));
    }

    ctx.onTap(figure, () => {
      // Een andere beweging dan de vorige, zodat het poppetje afwisselt
      const keuze = MOVES.filter((m) => m.key !== lastMove);
      doMove(keuze[Math.floor(Math.random() * keuze.length)]);
    });
    root.querySelectorAll('.move-btn').forEach((b) => {
      ctx.onTap(b, (e) => {
        e.stopPropagation();
        ctx.animate(b, 'anim-pop');
        doMove(MOVES.find((m) => m.key === b.dataset.move));
      });
    });

    ctx.setHint('Tik op het poppetje en doe mee!');
    this.unmount = () => { timers.forEach(clearTimeout); timers = []; };
  }
};
