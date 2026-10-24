/* De kip: rond lijf met vleugel en staartveren, twee oranje pootjes, kop met rode kam en lel,
   snavel met bewegende onderste helft. Rust: ademt, knippert, pikt af en toe, wiebelt met kam,
   vleugel of staart. Tik: tokt en fladdert met veertjes, of legt een ei (klein ei bij de staart,
   sterretjes). */

import { L, L2, PAL, shade, part, eye, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';

const WIT = PAL.wit, WITS = '#e4e8f0', ROOD = PAL.rood, ORANJE = PAL.oranje, ORANJES = shade(PAL.oranje, -0.18), CREME = PAL.creme;
const run = (fig, el, kf, opts) => { const a = A.tween(fig, el, kf, opts); return a ? a.finished.catch(() => {}) : Promise.resolve(); };

function foot(name, x) {
  return part(name, x, 102, `<path d="M${x} 102 v10 M${x - 7} 112 h14 M${x} 106 l-5 6 M${x} 106 l5 6" stroke="${ORANJE}" stroke-width="3.5" stroke-linecap="round" fill="none"/>`);
}

export const kip = {
  key: 'kip',
  svg() {
    return svgWrap(`
      ${shadow(58, 114, 30)}
      ${foot('poot-l', 48)}${foot('poot-r', 64)}
      ${part('ei', 26, 106, `<ellipse cx="26" cy="104" rx="7" ry="9" fill="${CREME}" ${L}/><circle cx="23" cy="100" r="2" fill="#fff"/>`, 'opacity="0"')}
      ${part('staart', 34, 80, `<path d="M36 84 q-22 -4 -24 -22 q10 2 16 12 q-6 -14 2 -26 q6 8 6 22 q2 -12 12 -16 q0 12 -8 22z" fill="${WITS}" ${L}/>`)}
      ${part('lijf', 56, 106, `
        <path d="M64 74 q4 -14 12 -22 l14 8 q-8 10 -8 22z" fill="${WIT}" ${L}/>
        <ellipse cx="56" cy="84" rx="30" ry="22" fill="${WIT}"/>
        <path d="M26 84 a30 22 0 0 0 60 0z" fill="${WITS}"/>
        <ellipse cx="56" cy="84" rx="30" ry="22" fill="none" ${L}/>`)}
      ${part('vleugel', 64, 76, `<path d="M64 76 q-24 -4 -32 16 q20 8 34 -6z" fill="${WITS}" ${L}/><path d="M48 86 q8 -4 14 0" fill="none" ${L2}/>`)}
      ${part('kop', 78, 68, `
        ${part('kam', 82, 32, `<path d="M70 34 q-2 -12 7 -10 q2 -12 11 -6 q6 -10 11 -1 q-2 10 -10 13 q-10 3 -19 4z" fill="${ROOD}" ${L}/>`)}
        <circle cx="82" cy="48" r="18" fill="${WIT}"/>
        <path d="M64 48 a18 18 0 0 0 36 0z" fill="${WITS}" opacity=".5"/>
        <circle cx="82" cy="48" r="18" fill="none" ${L}/>
        ${eye('oog', 88, 44, 5.5)}
        <circle cx="79" cy="56" r="3.5" fill="#f9a9c4" opacity=".75"/>
        <path d="M98 46 l16 4 l-16 5z" fill="${ORANJE}" ${L}/>
        ${part('snavel-onder', 98, 52, `<path d="M98 52 l14 1 l-14 5z" fill="${ORANJES}" ${L}/>`)}
        <path d="M93 58 q-3 10 5 9 q5 -1 1 -9z" fill="${ROOD}" ${L2}/>`)}
    `);
  },

  idle(fig) {
    A.breathe(fig, 'lijf', 0.025, 2400);
    A.blinkLoop(fig, ['oog']);
    A.occasionally(fig, [3500, 8000], () => {
      const r = Math.random();
      if (r < 0.25) A.wiggle(fig, 'kam', 10, 2, 160);
      else if (r < 0.5) A.tilt(fig, 'kop', 14, 300, 250);
      else if (r < 0.75) A.flap(fig, 'vleugel', 18, 2, 160);
      else A.wiggle(fig, 'staart', 8, 3, 150);
    });
  },

  async react(fig, ctx, tap, world) {
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    A.lookAt(fig, ['oog-pupil'], tap.x * 2, tap.y * 2, 800);
    ctx.sound('geluid-kip', ctx.audio.animals.kip);
    if (n % 2 === 1) {
      // Tokken: vleugel fladdert, snavel open, kop knikt, een hupje en veertjes
      const f = world.center(fig, 0.5, 0.55);
      fx.feathers(f.x, f.y, 3);
      await A.par(
        () => A.flap(fig, 'vleugel', 32, 5, 130),
        () => A.tilt(fig, 'snavel-onder', 22, 200, 500),
        () => A.wiggle(fig, 'kop', 7, 4, 180),
        () => A.hop(fig, 8, 500)
      );
      fig.later(() => ctx.say('kip', 'kip'), 100);
    } else {
      // Ei leggen: even hurken met wiebelende staart, dan verschijnt een ei bij de staart met sterretjes
      await A.par(
        () => run(fig, fig.svg, [{ transform: 'scale(1,1)' }, { transform: 'scale(1.1,.9)', offset: 0.3 }, { transform: 'scale(1.1,.9)', offset: 0.6 }, { transform: 'scale(1,1)' }], { duration: 900, easing: A.ease.out }),
        () => A.wiggle(fig, 'staart', 14, 4, 150),
        () => A.tilt(fig, 'kop', 10, 300, 400)
      );
      run(fig, fig.part('ei'), [
        { transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1.2)', opacity: 1, offset: 0.1 }, { transform: 'scale(1)', opacity: 1, offset: 0.18 },
        { transform: 'scale(1)', opacity: 1, offset: 0.8 }, { transform: 'scale(1)', opacity: 0 }
      ], { duration: 3200, easing: A.ease.out });
      const e = world.center(fig, 0.22, 0.87);
      fx.sparkles(e.x, e.y, 6);
      fig.later(() => ctx.say('kip', 'kip'), 150);
    }
  }
};
