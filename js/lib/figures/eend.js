/* De eend: lijf, vleugel, staartveren, kop met snavel (onderste helft beweegt), oog.
   In het water: deint, knippert, fladdert af en toe. Tik: kwaakt (snavel open, kop knikt,
   vleugel fladdert, spetters) of duikt met zijn kop in het water. */

import { INK, L, L2, PAL, shade, part, eye, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';

const GEEL = PAL.geel, GEELS = shade(PAL.geel, -0.16), SNAVEL = PAL.oranje, SNAVELS = shade(PAL.oranje, -0.18);

export const eend = {
  key: 'eend',
  svg(opts = {}) {
    const inWater = opts.zone === 'water';
    return svgWrap(`
      ${inWater ? '' : shadow(60, 114, 28)}
      ${inWater ? '' : `<path d="M50 104 v8 M42 112 h12 M66 104 v8 M58 112 h12" stroke="${SNAVEL}" stroke-width="3.5" stroke-linecap="round" fill="none"/>`}
      ${part('staart', 34, 86, `<path d="M34 86 q-16 -14 -10 -26 q10 6 18 18z" fill="${GEEL}" ${L}/>`)}
      ${part('lijf', 60, 100, `
        <ellipse cx="58" cy="88" rx="32" ry="20" fill="${GEEL}" ${L}/>
        <path d="M26 88 a32 20 0 0 0 64 0z" fill="${GEELS}"/><ellipse cx="58" cy="88" rx="32" ry="20" fill="none" ${L}/>`)}
      ${part('vleugel', 46, 82, `<path d="M44 82 q22 -10 36 4 q-14 12 -34 6z" fill="${GEELS}" ${L}/><path d="M56 86 q10 -2 16 2" fill="none" ${L2}/>`)}
      ${part('kop', 82, 70, `
        <path d="M74 72 q0 -16 6 -24" fill="none" stroke="${GEEL}" stroke-width="12" stroke-linecap="round"/><path d="M74 72 q0 -16 6 -24" fill="none" ${L} stroke-width="3"/>
        <circle cx="86" cy="44" r="17" fill="${GEEL}" ${L}/>
        <path d="M69 44 a17 17 0 0 0 34 0z" fill="${GEELS}" opacity=".5"/><circle cx="86" cy="44" r="17" fill="none" ${L}/>
        <path d="M80 26 q4 -8 8 -2 q4 -6 6 2" fill="${GEEL}" ${L2}/>
        ${eye('oog', 92, 40, 5.5)}
        <path d="M100 46 q14 -4 18 4 q-6 2 -18 2z" fill="${SNAVEL}" ${L}/>
        ${part('snavel-onder', 100, 50, `<path d="M100 50 q12 0 16 4 q-8 4 -16 0z" fill="${SNAVELS}" ${L}/>`)}`)}
      ${inWater ? `<path d="M22 100 q18 -4 36 0 t36 0" fill="none" stroke="#fff" stroke-width="2.5" opacity=".9" stroke-linecap="round"/>` : ''}
    `);
  },

  idle(fig) {
    if (fig.zone === 'water') A.floatLoop(fig, fig.svg, 2.5, 3200);
    else A.breathe(fig, 'lijf', 0.025, 2600);
    A.blinkLoop(fig, ['oog']);
    A.occasionally(fig, [3500, 8000], () => {
      const r = Math.random();
      if (r < 0.4) A.flap(fig, 'vleugel', 18, 2, 160);
      else if (r < 0.7) A.tilt(fig, 'kop', Math.random() < 0.5 ? 8 : -8, 400, 500);
      else A.wiggle(fig, 'staart', 10, 3, 150);
    });
  },

  async react(fig, ctx, tap, world) {
    const c = world.center(fig, 0.5, 0.85);
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    if (n % 3 === 0 && fig.zone === 'water') {
      // Duiken: kop naar beneden in het water, spetters, en weer omhoog
      fx.splash(c.x, c.y, 7); fx.ripple(c.x, c.y);
      await A.tween(fig, fig.svg, [
        { transform: 'rotate(0)' }, { transform: 'rotate(38deg) translateY(4px)', offset: 0.3 }, { transform: 'rotate(38deg) translateY(4px)', offset: 0.65 }, { transform: 'rotate(0)' }
      ], { duration: 1400, easing: A.ease.out }).finished.catch(() => {});
      ctx.sound('geluid-eend', ctx.audio.animals.eend);
      fig.later(() => ctx.say('eend', 'eend'), 900);
      fx.splash(c.x, c.y, 5);
    } else {
      // Kwaken: snavel open, kop knikt, vleugel fladdert, spetters of veertjes
      ctx.sound('geluid-eend', ctx.audio.animals.eend);
      if (fig.zone === 'water') { fx.splash(c.x, c.y, 6); fx.ripple(c.x, c.y); } else fx.feathers(c.x, c.y - c.y * 0.05, 3);
      await A.par(
        () => A.tilt(fig, 'snavel-onder', 22, 200, 500),
        () => A.wiggle(fig, 'kop', 7, 3, 220),
        () => A.flap(fig, 'vleugel', 30, 4, 140)
      );
      fig.later(() => ctx.say('eend', 'eend'), 150);
    }
  }
};
