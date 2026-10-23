/* Prentenboek: één groot voorwerp per bladzijde, naam bij elke tik.
   Het vijfde hoofdstuk, Mijn spullen, bestaat uit foto's die een ouder heeft toegevoegd. */

import { CHAPTERS, PHOTO_CHAPTER, photoChapter } from '../words.js';
import { listPhotos } from '../store.js';

let chapterKey = CHAPTERS[0].key;   // onthouden tussen bezoeken, ook voor het fotohoofdstuk
let page = 0;
let urls = [];                      // object-URL's van de foto's, opgeruimd bij unmount

export default {
  id: 'book',
  mount(root, ctx) {
    let chapters = CHAPTERS;
    let chapter = 0;

    root.innerHTML = `
      <div class="bg">${ctx.art.landscape()}</div>
      <div class="book-chapters" id="chips" style="position:relative;z-index:1"></div>
      <div class="book-page" id="page" style="position:relative;z-index:1"><div id="pic" style="width:100%;height:100%"></div></div>
      <div class="book-word" id="word" style="position:relative;z-index:1"></div>
      <div class="book-nav" style="position:relative;z-index:1">
        <div class="book-arrow" id="prev">${ctx.art.arrow('left')}</div>
        <div class="book-arrow" id="next">${ctx.art.arrow('right')}</div>
      </div>`;

    const pic = root.querySelector('#pic');
    const wordEl = root.querySelector('#word');
    const pageEl = root.querySelector('#page');
    const chipsEl = root.querySelector('#chips');

    function word() { return chapters[chapter].words[page]; }

    function fx(w) {
      const a = ctx.audio;
      if (a.animals[w.fx]) { ctx.sound('geluid-' + w.key, a.animals[w.fx]); return; }
      if (typeof a[w.fx] === 'function') a[w.fx]();
    }

    /* Hoofdstuk en bladzijde moeten bestaan: foto's kunnen weg zijn sinds het vorige bezoek */
    function clamp() {
      chapter = Math.max(0, chapters.findIndex((c) => c.key === chapterKey));
      if (page >= chapters[chapter].words.length) page = 0;
    }

    function markChip() {
      chipsEl.querySelectorAll('.book-chip').forEach((c, i) => c.classList.toggle('active', i === chapter));
    }

    function renderChips() {
      chipsEl.innerHTML = chapters.map((c, i) => `<div class="book-chip" data-ch="${i}">${ctx.art.byName(c.icon)}</div>`).join('');
      chipsEl.querySelectorAll('.book-chip').forEach((c) => ctx.onTap(c, () => {
        chapter = Number(c.dataset.ch);
        chapterKey = chapters[chapter].key;
        page = 0;
        ctx.audio.tap(); show();
      }));
      markChip();
    }

    function show(speak = true) {
      const w = word();
      pic.innerHTML = w.photo ? `<img src="${w.photo.url}" alt="">` : ctx.art.byName(w.key);
      wordEl.textContent = w.name;
      markChip();
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
      page = (page + 1) % chapters[chapter].words.length;
      ctx.audio.rustle(); show();
    });
    ctx.onTap(root.querySelector('#prev'), () => {
      const n = chapters[chapter].words.length;
      page = (page - 1 + n) % n;
      ctx.audio.rustle(); show();
    });

    clamp();
    renderChips();
    show(false);

    // Foto's van eigen spullen ophalen. Pas als er minstens één is, komt het hoofdstuk met de camera erbij.
    listPhotos().then((photos) => {
      if (!root.isConnected || !photos.length) return;
      const withUrls = photos.map((p) => ({ ...p, url: URL.createObjectURL(p.blob) }));
      urls = withUrls.map((p) => p.url);
      chapters = [...CHAPTERS, photoChapter(withUrls)];
      renderChips();
      // Was ze de vorige keer bij haar eigen spullen? Dan daar verdergaan.
      if (chapterKey === PHOTO_CHAPTER.key) { clamp(); show(false); }
    }).catch((e) => console.warn(e));
  },
  unmount() {
    urls.forEach((u) => URL.revokeObjectURL(u));
    urls = [];
  }
};
