/* De krokodil: lang laag lijf met bulten op de rug en een lichte buik, vier korte poten,
   lange staart en een kop van opzij met ogen bovenop, bovenkaak met tandjes en een onderkaak
   als apart deel (kaak, draaipunt bij het scharnier). Rust: ademt (of deint in het water),
   staart zwaait, knippert, doet af en toe de bek een stukje open. Tik: klapt twee keer met zijn
   bek en zwaait met zijn staart, of rolt zich om met spetters. */

import { INK, L, L2, PAL, shade, part, eye, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';
import { extraSounds } from '../../sounds-extra.js';

const GROEN = PAL.groen, GROENS = shade(PAL.groen, -0.16), BUIK = '#dcefc2', MOND = '#e0646a', TAND = '#fff';

function leg(name, x, px, kleur) {
  return part(name, px, 98, `
    <rect x="${x}" y="96" width="12" height="16" rx="5" fill="${kleur}" ${L}/>
    <path d="M${x + 2} 109 v3 M${x + 6} 108 v4 M${x + 10} 109 v3" fill="none" ${L2}/>`);
}

export const krokodil = {
  key: 'krokodil',
  svg(opts = {}) {
    const inWater = opts.zone === 'water';
    return svgWrap(`
      ${inWater ? '' : shadow(62, 114, 52, 7)}
      ${inWater ? '' : leg('poot-la', 26, 32, GROENS) + leg('poot-ra', 60, 66, GROENS)}
      ${part('staart', 26, 90, `
        <path d="M18 80 l3 -7 l5 5z M10 86 l2 -7 l5 4z" fill="${GROENS}" ${L2}/>
        <path d="M26 78 C12 78 4 88 3 102 C12 102 20 104 28 101z" fill="${GROEN}" ${L}/>
        <path d="M26 90 C14 90 6 95 3 102 C12 102 20 104 28 101z" fill="${GROENS}"/>
        <path d="M26 78 C12 78 4 88 3 102 C12 102 20 104 28 101z" fill="none" ${L}/>`)}
      ${part('lijf', 52, 102, `
        <path d="M30 75 l4 -7 l4 7z M43 75 l4 -7 l4 7z M56 75 l4 -7 l4 7z M69 75 l4 -7 l4 7z" fill="${GROENS}" ${L2}/>
        <rect x="22" y="74" width="60" height="28" rx="14" fill="${GROEN}" ${L}/>
        <path d="M22 88 h60 a14 14 0 0 1 -14 14 H36 a14 14 0 0 1 -14 -14z" fill="${GROENS}"/>
        <ellipse cx="52" cy="95" rx="24" ry="5" fill="${BUIK}" ${L2}/>
        <rect x="22" y="74" width="60" height="28" rx="14" fill="none" ${L}/>`)}
      ${inWater ? '' : leg('poot-lv', 36, 42, GROEN) + leg('poot-rv', 70, 76, GROEN)}
      ${part('kop', 78, 84, `
        <circle cx="84" cy="68" r="7" fill="${GROEN}" ${L}/><circle cx="95" cy="67" r="7" fill="${GROEN}" ${L}/>
        <path d="M76 70 H90 q10 0 16 4 L112 78 q3 3 0 6 L100 86 H76z" fill="${GROEN}" ${L}/>
        <path d="M76 80 H107 L100 86 H76z" fill="${GROENS}"/>
        <path d="M76 70 H90 q10 0 16 4 L112 78 q3 3 0 6 L100 86 H76z" fill="none" ${L}/>
        <circle cx="110" cy="76" r="1.6" fill="${INK}"/>
        <path d="M92 86 l2 4 l2 -4z M100 85.5 l2 4 l2 -4z" fill="${TAND}" ${L2}/>
        ${eye('oog-l', 84, 66, 5)}${eye('oog-r', 95, 65, 5)}
        <circle cx="82" cy="79" r="3" fill="#f9a9c4" opacity=".75"/>
        ${part('kaak', 78, 87, `
          <path d="M78 87 H106 q6 0 6 4.5 q0 4.5 -6 4.5 H84 q-6 0 -6 -5z" fill="${GROENS}" ${L}/>
          <path d="M80 87 H106 q3 0 3 2.5 H82z" fill="${MOND}"/>
          <path d="M86 87 l2.5 -5 l2.5 5z M94 87 l2.5 -5 l2.5 5z M102 87 l2.5 -5 l2.5 5z" fill="${TAND}" ${L2}/>`)}`)}
      ${inWater ? `<path d="M6 100 q18 -4 36 0 t36 0 t36 0" fill="none" stroke="#fff" stroke-width="2.5" opacity=".9" stroke-linecap="round"/>` : ''}
    `);
  },

  idle(fig) {
    if (fig.zone === 'water') A.floatLoop(fig, fig.svg, 2, 3600);
    else A.breathe(fig, 'lijf', 0.02, 3200);
    A.sway(fig, 'staart', 6, 2600);
    A.blinkLoop(fig, ['oog-l', 'oog-r']);
    A.occasionally(fig, [4000, 9000], () => {
      const r = Math.random();
      if (r < 0.4) A.tilt(fig, 'kaak', 7, 300, 250);
      else if (r < 0.7) A.lookAt(fig, ['oog-l-pupil', 'oog-r-pupil'], Math.random() * 2 - 1, Math.random() * 0.6 - 0.3, 1600);
      else A.wiggle(fig, 'staart', 8, 2, 240);
    });
  },

  async react(fig, ctx, tap, world) {
    const c = world.center(fig, 0.5, 0.85);
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    A.lookAt(fig, ['oog-l-pupil', 'oog-r-pupil'], tap.x, tap.y, 900);
    if (n % 2 === 1) {
      // Klappen met de bek: onderkaak twee keer open en dicht, staart zwaait mee
      ctx.sound('geluid-krokodil', extraSounds.krokodil);
      await A.par(
        () => A.tween(fig, fig.part('kaak'), [
          { transform: 'rotate(0)' }, { transform: 'rotate(28deg)', offset: 0.2 }, { transform: 'rotate(2deg)', offset: 0.42 },
          { transform: 'rotate(28deg)', offset: 0.62 }, { transform: 'rotate(0)', offset: 0.85 }, { transform: 'rotate(0)' }
        ], { duration: 1000, easing: A.ease.out }).finished.catch(() => {}),
        () => A.tilt(fig, 'kop', -6, 250, 500),
        () => A.wiggle(fig, 'staart', 16, 3, 280)
      );
      fig.later(() => ctx.say('krokodil', 'krokodil'), 100);
    } else {
      // Omrollen: heen en weer wiegen met spetters
      ctx.sound('geluid-krokodil', extraSounds.krokodil);
      fx.splash(c.x, c.y, 8);
      if (fig.zone === 'water') fx.ripple(c.x, c.y);
      await A.shake(fig, null, 14, 850);
      fx.splash(c.x, c.y, 5);
      fig.later(() => ctx.say('krokodil', 'krokodil'), 150);
    }
  }
};
