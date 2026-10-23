/* De wereld: grote tegels naar de plekjes */

import * as more from '../art-more.js';

const TILES = [
  { id: 'kiekeboe', icon: (art) => art.barnIcon(), label: 'Kiekeboe' },
  { id: 'music', icon: (art) => art.noteIcon(), label: 'Muziek' },
  { id: 'move', icon: () => more.doeMeeIcon(), label: 'Doe mee' },
  { id: 'bubbles', icon: (art) => art.bubbleIcon(), label: 'Bellen' },
  { id: 'stickers', icon: () => more.stickerIcon(), label: 'Stickers' },
  { id: 'book', icon: (art) => art.bookIcon(), label: 'Boek' },
  { id: 'face', icon: (art) => art.faceIcon(), label: 'Gezichtje' }
];

export default {
  id: 'world',
  mount(root, ctx) {
    const enabled = ctx.settings().scenes || {};
    const tiles = TILES.filter((t) => enabled[t.id] !== false);
    root.innerHTML = `
      <div class="bg">${ctx.art.landscape()}</div>
      <div class="world-grid">
        ${tiles.map((t, i) => `<div class="tile bob" style="animation-delay:${i * 0.4}s" data-go="${t.id}" aria-label="${t.label}">${t.icon(ctx.art)}</div>`).join('')}
      </div>`;
    let left = false;   // twee snelle tikken bouwen een plekje anders twee keer op
    root.querySelectorAll('[data-go]').forEach((el) => {
      ctx.onTap(el, () => {
        if (left) return;
        left = true;
        ctx.audio.tap();
        ctx.animate(el, 'anim-pop');
        setTimeout(() => ctx.go(el.dataset.go), 250);
      });
    });
    ctx.setHint('Waar wil je spelen?');
  }
};
