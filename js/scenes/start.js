/* Startscherm: één grote zon, met vliegtuigjes, vogels en vlinders die overvliegen.
   De eerste tik ontgrendelt het geluid en de stem. */

import { GREETING_KEY } from '../words.js';
import * as extra from '../art-extra.js';

function isIos() { return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
function isStandalone() { return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches; }

export default {
  id: 'start',
  mount(root, ctx) {
    const tip = isIos() && !isStandalone()
      ? `<div class="muted" style="position:absolute;bottom:calc(env(safe-area-inset-bottom) + 14px);left:0;right:0;text-align:center;padding:0 24px">Tip voor ouders: tik in Safari op Delen en kies "Zet op beginscherm". Dan opent de app fullscreen.</div>`
      : '';
    // Overvliegers: vliegtuig, vogel, vlinder, elk op een eigen hoogte en tempo
    const flyers = [
      { art: extra.vliegtuig(), top: 14, dur: 14, delay: 0, size: 20 },
      { art: ctx.art.vogel(), top: 26, dur: 11, delay: 3, size: 11, flip: true },
      { art: ctx.art.vlinder(), top: 62, dur: 17, delay: 6, size: 10 },
      { art: ctx.art.vogel(), top: 20, dur: 13, delay: 9, size: 9 }
    ];
    root.innerHTML = `
      <div class="bg">${ctx.art.landscape({ sun: false })}</div>
      <div class="sky-flyers">
        ${flyers.map((f) => `<div class="flyer-loop ${f.flip ? 'flip' : ''}" style="top:${f.top}%;--dur:${f.dur}s;--delay:${f.delay}s;--fs:${f.size}vmin">${f.art}</div>`).join('')}
      </div>
      <div class="start-sun breathe" id="start-sun" style="position:relative;z-index:1">${ctx.art.sun(true)}</div>
      <div class="start-text" style="position:relative;z-index:1">Tik op de zon</div>
      ${tip}`;
    const sunEl = root.querySelector('#start-sun');
    let started = false;
    ctx.onTap(sunEl, () => {
      if (started) return;
      started = true;
      // Alles wat een gebaar nodig heeft, meteen: geluid en stem ontgrendelen
      ctx.audio.unlock();
      ctx.speech.prime();
      ctx.audio.chime();
      ctx.animate(sunEl, 'anim-pop');
      // De begroeting wacht hooguit anderhalve seconde tot de opnames geladen zijn
      const greet = () => ctx.say(GREETING_KEY, `Hoi ${ctx.childName}!`);
      Promise.race([ctx.ready || Promise.resolve(), new Promise((r) => setTimeout(r, 1500))]).then(greet, greet);
      ctx.startSession();
      setTimeout(() => ctx.go('world'), 1300);
    });
  }
};
