/* Gezichtje: tik op neus, ogen, mond, oren, haar en wangen.
   Grote onzichtbare tikzones over elk onderdeel, zodat een peutervinger altijd raak is.
   Een tik naast de onderdelen geeft een ander gezichtje. */

import { FACE_PARTS } from '../words.js';

const ANIM = { oog: 'blink', neus: 'anim-wiggle', mond: 'anim-pop', oor: 'anim-wiggle', haar: 'anim-pop', wang: 'anim-pop' };

// Tikzones: onderdeel, middelpunt x, y en straal in de 100x100-tekening. Latere zones liggen bovenop.
const HITS = [
  ['haar', 50, 22, 24],
  ['oor', 14, 56, 14], ['oor', 86, 56, 14],
  ['wang', 29, 67, 9], ['wang', 71, 67, 9],
  ['mond', 50, 79, 13],
  ['neus', 50, 65, 8],
  ['oog', 38, 54, 11], ['oog', 62, 54, 11]
];

const VARIANTS = [
  { hair: '#8a5a3b', skin: '#ffd9b8' },   // bruin haar
  { hair: '#f2c14e', skin: '#f7e0c8' },   // blond
  { hair: '#2e2a2a', skin: '#c68642' },   // zwart haar, donkere huid
  { hair: '#c0392b', skin: '#ffe1c9' },   // rood haar
  { hair: '#5a3a26', skin: '#e8b48c' }    // donkerbruin
];

let variant = 0;

export default {
  id: 'face',
  mount(root, ctx) {
    root.innerHTML = `
      <div class="bg">${ctx.art.landscape()}</div>
      <div class="face-wrap" id="face" style="position:relative;z-index:1">${ctx.art.face()}</div>`;
    const wrap = root.querySelector('#face');
    const svg = wrap.querySelector('svg');

    // Tikzones toevoegen
    const ns = 'http://www.w3.org/2000/svg';
    HITS.forEach(([part, cx, cy, r]) => {
      const c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r);
      c.setAttribute('fill', 'transparent');
      c.setAttribute('pointer-events', 'all');
      c.dataset.part = part;
      svg.appendChild(c);
    });

    function applyVariant() {
      const v = VARIANTS[variant % VARIANTS.length];
      svg.querySelectorAll('[fill="#8a5a3b"]').forEach((el) => el.setAttribute('fill', v.hair));
      svg.querySelectorAll('[fill="#ffd9b8"]').forEach((el) => el.setAttribute('fill', v.skin));
      // Terugzetten gaat via de oorspronkelijke kleuren, daarom onthouden we ze
      svg.querySelectorAll(`[fill="${v.hair}"]`).forEach((el) => el.dataset.role = 'hair');
      svg.querySelectorAll(`[fill="${v.skin}"]`).forEach((el) => el.dataset.role = 'skin');
    }
    function nextVariant() {
      variant = (variant + 1) % VARIANTS.length;
      const v = VARIANTS[variant];
      svg.querySelectorAll('[data-role="hair"]').forEach((el) => el.setAttribute('fill', v.hair));
      svg.querySelectorAll('[data-role="skin"]').forEach((el) => el.setAttribute('fill', v.skin));
    }
    applyVariant();

    ctx.onTap(wrap, (e) => {
      const target = e.target.closest ? e.target.closest('[data-part]') : null;
      if (!target) {
        // Tik naast de onderdelen: een ander gezichtje
        ctx.audio.sparkle();
        nextVariant();
        ctx.animate(wrap, 'anim-wiggle');
        ctx.setHint('Een ander gezichtje! Wie is dit?');
        return;
      }
      const key = target.dataset.part;
      const part = FACE_PARTS.find((p) => p.key === key);
      // Beide ogen, oren of wangen bewegen samen
      wrap.querySelectorAll(`[data-part="${key}"]`).forEach((el) => ctx.animate(el, ANIM[key] || 'anim-pop'));
      ctx.audio.tap();
      ctx.say(part.key, part.name);
      ctx.setHint(part.question);
    });

    ctx.setHint('Waar is de neus?');
  }
};
