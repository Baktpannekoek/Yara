/* Stickers: elke tik plakt een sticker op de plek van de vinger. De strook onderaan kiest welke.
   De doos rechtsonder ruimt alles op, want opruimen hoort er ook bij. */

import { STICKERS } from '../words.js';
import { whoosh } from '../sounds-more.js';
import * as more from '../art-more.js';

const MAX_STICKERS = 40;
let chosen = null;   // onthouden tussen bezoeken

function stickerArt(ctx, key) {
  if (key === 'ster') return ctx.art.star();
  if (key === 'hart') return ctx.art.shape('heart', '#f7a8c4');
  return ctx.art.byName(key);
}

export default {
  id: 'stickers',
  mount(root, ctx) {
    // Vijf stickers in de strook, elke keer een andere mix
    const strip = [...STICKERS].sort(() => Math.random() - 0.5).slice(0, 5);
    if (!chosen || !strip.some((s) => s.key === chosen)) chosen = strip[0].key;

    root.innerHTML = `
      <div class="bg">${ctx.art.landscape()}</div>
      <div class="sticker-field" id="field"></div>
      <div class="sticker-strip" id="strip">
        ${strip.map((s) => `<div class="sticker-pick ${s.key === chosen ? 'active' : ''}" data-key="${s.key}">${stickerArt(ctx, s.key)}</div>`).join('')}
      </div>
      <div class="opruimdoos tap" id="doos">${more.opruimdoos()}</div>`;

    const field = root.querySelector('#field');
    const doos = root.querySelector('#doos');
    let timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    let count = 0;

    function vmin() { return Math.min(window.innerWidth, window.innerHeight) / 100; }

    function place(x, y) {
      const size = 16 * vmin();
      const el = document.createElement('div');
      el.className = 'sticker anim-appear';
      el.style.setProperty('--s', `${size}px`);
      el.style.left = `${x - size / 2}px`;
      el.style.top = `${y - size / 2}px`;
      el.style.transform = `rotate(${(Math.random() * 30 - 15).toFixed(1)}deg)`;
      el.innerHTML = stickerArt(ctx, chosen);
      field.appendChild(el);
      count++;
      ctx.audio.pop();
      if (count % 6 === 0) ctx.audio.sparkle();
      // Te vol? De oudste sticker verdwijnt zachtjes
      const all = field.querySelectorAll('.sticker');
      if (all.length > MAX_STICKERS) { const oud = all[0]; oud.style.transition = 'opacity 500ms'; oud.style.opacity = '0'; later(() => oud.remove(), 520); }
      ctx.setHint(count === 1 ? 'Plak maar! Tik ergens op de wei' : `Hoeveel ${STICKERS.find((s) => s.key === chosen).name}s zie je?`);
    }

    function cleanUp() {
      const all = [...field.querySelectorAll('.sticker')];
      if (!all.length) { ctx.animate(doos, 'anim-wiggle'); ctx.audio.tap(); return; }
      whoosh();
      ctx.animate(doos, 'anim-bounce');
      const d = doos.getBoundingClientRect();
      const cx = d.left + d.width / 2, cy = d.top + d.height / 2;
      all.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const dx = cx - (r.left + r.width / 2), dy = cy - (r.top + r.height / 2);
        el.animate([
          { transform: el.style.transform, opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) scale(.1) rotate(180deg)`, opacity: 0.2 }
        ], { duration: 500 + i * 15, easing: 'ease-in', fill: 'forwards' }).onfinish = () => el.remove();
      });
      count = 0;
      later(() => ctx.speech.speak('Opgeruimd!'), 400);
      ctx.setHint('Alles opgeruimd! Nog een keer?');
    }

    // Kiezen in de strook
    root.querySelectorAll('.sticker-pick').forEach((p) => {
      ctx.onTap(p, (e) => {
        e.stopPropagation();
        chosen = p.dataset.key;
        root.querySelectorAll('.sticker-pick').forEach((q) => q.classList.toggle('active', q === p));
        ctx.animate(p, 'anim-pop');
        ctx.audio.tap();
        const s = STICKERS.find((x) => x.key === chosen);
        later(() => ctx.say(s.key, s.name), 100);
      });
    });
    ctx.onTap(doos, (e) => { e.stopPropagation(); cleanUp(); });
    ctx.onTap(root, (e) => place(e.clientX, e.clientY));

    ctx.setHint('Tik op de wei om een sticker te plakken');
    this.unmount = () => { timers.forEach(clearTimeout); timers = []; };
  }
};
