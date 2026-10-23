/* Gezichtje: tik op neus, ogen, mond, oren, haar en wangen */

import { FACE_PARTS } from '../words.js';

const ANIM = { oog: 'blink', neus: 'anim-wiggle', mond: 'anim-pop', oor: 'anim-wiggle', haar: 'anim-pop', wang: 'anim-pop' };

export default {
  id: 'face',
  mount(root, ctx) {
    root.innerHTML = `
      <div class="bg">${ctx.art.landscape()}</div>
      <div class="face-wrap" id="face" style="position:relative;z-index:1">${ctx.art.face()}</div>`;
    const wrap = root.querySelector('#face');

    ctx.onTap(wrap, (e) => {
      const target = e.target.closest ? e.target.closest('[data-part]') : null;
      if (!target) {
        // Tik op het gezicht zelf: een lachje
        ctx.audio.sparkle();
        ctx.animate(wrap, 'anim-wiggle');
        return;
      }
      const key = target.dataset.part;
      const part = FACE_PARTS.find((p) => p.key === key);
      // Beide ogen, oren of wangen bewegen samen
      wrap.querySelectorAll(`[data-part="${key}"]`).forEach((el) => ctx.animate(el, ANIM[key] || 'anim-pop'));
      ctx.audio.tap();
      setTimeout(() => ctx.say(part.key, part.name), 120);
      ctx.setHint(part.question);
    });

    ctx.setHint('Waar is de neus?');
  }
};
