/* Prentenboek: één groot voorwerp per bladzijde, naam bij elke tik */

import { CHAPTERS } from '../words.js';

let chapter = 0;
let page = 0;

export default {
  id: 'book',
  mount(root, ctx) {
    root.innerHTML = `
      <div class="bg">${ctx.art.landscape()}</div>
      <div class="book-chapters" style="position:relative;z-index:1">
        ${CHAPTERS.map((c, i) => `<div class="book-chip" data-ch="${i}">${ctx.art.byName(c.icon)}</div>`).join('')}
      </div>
      <div class="book-page" id="page" style="position:relative;z-index:1"><div id="pic" style="width:100%;height:100%"></div></div>
      <div class="book-word" id="word" style="position:relative;z-index:1"></div>
      <div class="book-nav" style="position:relative;z-index:1">
        <div class="book-arrow" id="prev">${ctx.art.arrow('left')}</div>
        <div class="book-arrow" id="next">${ctx.art.arrow('right')}</div>
      </div>`;

    const pic = root.querySelector('#pic');
    const wordEl = root.querySelector('#word');
    const pageEl = root.querySelector('#page');
    const chips = root.querySelectorAll('.book-chip');

    function word() { return CHAPTERS[chapter].words[page]; }

    function fx(w) {
      const a = ctx.audio;
      if (a.animals[w.fx]) { ctx.sound('geluid-' + w.key, a.animals[w.fx]); return; }
      if (typeof a[w.fx] === 'function') a[w.fx]();
    }

    function show(speak = true) {
      const w = word();
      pic.innerHTML = ctx.art.byName(w.key);
      wordEl.textContent = w.name;
      chips.forEach((c, i) => c.classList.toggle('active', i === chapter));
      ctx.animate(pic, 'anim-appear');
      if (speak) ctx.say(w.key, w.name);
      ctx.setHint(`Zeg maar: ${w.name}`);
    }

    ctx.onTap(pageEl, () => {
      const w = word();
      ctx.animate(pic, w.fx === 'boing' ? 'anim-bounce' : 'anim-wiggle');
      ctx.say(w.key, w.name);
      setTimeout(() => fx(w), 700);
    });

    ctx.onTap(root.querySelector('#next'), () => {
      page = (page + 1) % CHAPTERS[chapter].words.length;
      ctx.audio.rustle(); show();
    });
    ctx.onTap(root.querySelector('#prev'), () => {
      const n = CHAPTERS[chapter].words.length;
      page = (page - 1 + n) % n;
      ctx.audio.rustle(); show();
    });
    chips.forEach((c) => ctx.onTap(c, () => {
      chapter = Number(c.dataset.ch); page = 0;
      ctx.audio.tap(); show();
    }));

    show(false);
  }
};
