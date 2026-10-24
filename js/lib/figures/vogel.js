/* De vogel: klein blauw lijf met lichte buik, vleugel, staartveren, kop met kuifje, oog en snavel
   met bewegende onderste helft. In de lucht: geen schaduw, pootjes ingetrokken, zweeft op en neer.
   Op de grond: pootjes en schaduw, ademt. Tik: fladdert en vliegt een rondje met noten, of tjilpt
   met open snavel. */

import { L, L2, PAL, shade, part, eye, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';

const BLAUW = PAL.blauw, BLAUWS = shade(PAL.blauw, -0.16), BUIK = PAL.creme, SNAVEL = PAL.oranje, SNAVELS = shade(PAL.oranje, -0.18);
const run = (fig, el, kf, opts) => { const a = A.tween(fig, el, kf, opts); return a ? a.finished.catch(() => {}) : Promise.resolve(); };

export const vogel = {
  key: 'vogel',
  svg(opts = {}) {
    const inAir = opts.zone === 'lucht';
    return svgWrap(`
      ${inAir ? '' : shadow(58, 114, 26)}
      ${inAir
        ? `<path d="M50 96 l-3 7 M62 96 l3 7" stroke="${SNAVEL}" stroke-width="3.5" stroke-linecap="round" fill="none"/>`
        : `<path d="M50 96 v16 M43 112 h14 M62 96 v16 M55 112 h14" stroke="${SNAVEL}" stroke-width="3.5" stroke-linecap="round" fill="none"/>`}
      ${part('staart', 34, 72, `<path d="M36 74 q-16 -6 -24 6 q10 4 18 0 q-8 6 -6 12 q10 -2 16 -12z" fill="${BLAUWS}" ${L}/>`)}
      ${part('lijf', 56, 98, `
        <ellipse cx="56" cy="76" rx="26" ry="22" fill="${BLAUW}"/>
        <path d="M30 76 a26 22 0 0 0 52 0z" fill="${BLAUWS}"/>
        <ellipse cx="54" cy="84" rx="15" ry="10" fill="${BUIK}"/>
        <ellipse cx="56" cy="76" rx="26" ry="22" fill="none" ${L}/>`)}
      ${part('vleugel', 62, 66, `<path d="M62 66 q-26 -2 -32 20 q22 6 34 -10z" fill="${BLAUWS}" ${L}/><path d="M46 78 q8 -4 14 -2" fill="none" ${L2}/>`)}
      ${part('kop', 70, 64, `
        <path d="M72 32 q-2 -10 6 -12 q0 4 2 8 q2 -8 10 -6 q-4 4 -4 10z" fill="${BLAUWS}" ${L2}/>
        <circle cx="76" cy="48" r="18" fill="${BLAUW}"/>
        <path d="M58 48 a18 18 0 0 0 36 0z" fill="${BLAUWS}" opacity=".4"/>
        <circle cx="76" cy="48" r="18" fill="none" ${L}/>
        ${eye('oog', 82, 44, 5.5)}
        <circle cx="73" cy="56" r="3.5" fill="#f9a9c4" opacity=".75"/>
        <path d="M92 48 l16 4 l-16 5z" fill="${SNAVEL}" ${L}/>
        ${part('snavel-onder', 92, 54, `<path d="M92 54 l14 0 l-14 5z" fill="${SNAVELS}" ${L}/>`)}`)}
    `);
  },

  idle(fig) {
    if (fig.zone === 'lucht') A.bobLoop(fig, fig.svg, 3, 2400);
    else A.breathe(fig, 'lijf', 0.025, 2400);
    A.blinkLoop(fig, ['oog']);
    A.occasionally(fig, [3000, 7000], () => {
      const r = Math.random();
      if (r < 0.35) A.flap(fig, 'vleugel', 24, 3, 150);
      else if (r < 0.6) A.tilt(fig, 'kop', Math.random() < 0.5 ? 10 : -10, 350, 450);
      else if (r < 0.8) A.wiggle(fig, 'staart', 10, 3, 160);
      else A.lookAt(fig, ['oog-pupil'], Math.random() * 2 - 1, Math.random() * 0.6 - 0.3, 1600);
    });
  },

  async react(fig, ctx, tap, world) {
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    const b = world.center(fig, 0.85, 0.35);
    A.lookAt(fig, ['oog-pupil'], tap.x * 2, tap.y * 2, 800);
    ctx.sound('geluid-vogel', ctx.audio.animals.vogel);
    if (n % 2 === 1) {
      // Rondje vliegen: vleugel fladdert door, lijf zweeft in een boog omhoog en terug, noten
      fx.notes(b.x, b.y, 3);
      const w = fig.el.getBoundingClientRect().width;
      await A.par(
        () => run(fig, fig.svg, [
          { transform: 'translate(0,0) rotate(0)' },
          { transform: `translate(${-w * 0.7}px,${-w * 0.6}px) rotate(-14deg)`, offset: 0.25 },
          { transform: `translate(0,${-w * 1.1}px) rotate(0)`, offset: 0.5 },
          { transform: `translate(${w * 0.7}px,${-w * 0.6}px) rotate(14deg)`, offset: 0.75 },
          { transform: 'translate(0,0) rotate(0)' }
        ], { duration: 1600, easing: A.ease.inOut }),
        () => A.flap(fig, 'vleugel', 36, 10, 160),
        () => A.wiggle(fig, 'staart', 10, 5, 320)
      );
      fig.later(() => ctx.say('vogel', 'vogel'), 100);
    } else {
      // Tjilpen: snavel open en dicht, kopje knikt, vleugel wipt, noten bij de snavel
      fx.notes(b.x, b.y, 2);
      await A.par(
        () => run(fig, fig.part('snavel-onder'), [{ transform: 'rotate(0)' }, { transform: 'rotate(24deg)' }, { transform: 'rotate(0)' }], { duration: 220, iterations: 3, easing: 'ease-in-out' }),
        () => A.wiggle(fig, 'kop', 6, 3, 220),
        () => A.flap(fig, 'vleugel', 20, 2, 170),
        () => run(fig, fig.svg, [{ transform: 'translateY(0)' }, { transform: 'translateY(-3px)' }, { transform: 'translateY(0)' }], { duration: 330, iterations: 2, easing: 'ease-in-out' })
      );
      fig.later(() => ctx.say('vogel', 'vogel'), 100);
    }
  }
};
