/* De tractor: groene trekker van opzij met een groot achterwiel en een klein voorwiel,
   cabine met raam en stuur, motorkap met lamp en een uitlaat. Rust: putt-putt (snel klein wiebelen),
   af en toe een rookwolkje. Tik: rijdt een stukje met rookwolkjes en draaiende wielen,
   of bokt met de voorkant omhoog. */

import { INK, L, L2, PAL, shade, part, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';
import { extraSounds } from '../../sounds-extra.js';

const GROEN = PAL.groen, GROENS = shade(PAL.groen, -0.18), GEEL = PAL.geel, GRIJS = PAL.grijs, RAAM = '#e3f2fb';

function bigWheel(name, cx, cy, r) {
  const lugs = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    lugs.push(`M${(cx + Math.cos(a) * (r - 1)).toFixed(1)} ${(cy + Math.sin(a) * (r - 1)).toFixed(1)} L${(cx + Math.cos(a) * (r - 5)).toFixed(1)} ${(cy + Math.sin(a) * (r - 5)).toFixed(1)}`);
  }
  return part(name, cx, cy, `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${INK}"/>
    <path d="${lugs.join(' ')}" fill="none" stroke="${GRIJS}" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.6}" fill="${GEEL}" ${L2}/>
    <path d="M${cx} ${cy - r * 0.6} V${cy + r * 0.6} M${cx - r * 0.6} ${cy} H${cx + r * 0.6}" stroke="${INK}" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.18}" fill="${INK}"/>`);
}

function wheel(name, cx, cy, r) {
  return part(name, cx, cy, `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${INK}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.6}" fill="${GEEL}" ${L2}/>
    <path d="M${cx} ${cy - r * 0.6} V${cy + r * 0.6} M${cx - r * 0.6} ${cy} H${cx + r * 0.6}" stroke="${INK}" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.2}" fill="${INK}"/>`);
}

/* Punt op de tekening dat meebeweegt als de tractor rijdt */
function punt(fig, px, py) {
  const r = fig.svg.getBoundingClientRect();
  return { x: r.left + r.width * px, y: r.top + r.height * py };
}

export const tractor = {
  key: 'tractor',
  svg() {
    return svgWrap(`
      ${shadow(60, 112, 46, 5)}
      ${part('lijf', 30, 92, `
        <rect x="26" y="86" width="78" height="10" rx="3" fill="${GRIJS}" ${L2}/>
        <path d="M58 66 H100 q8 0 8 8 V94 H58z" fill="${GROEN}" ${L}/>
        <path d="M58 80 H108 V94 H58z" fill="${GROENS}"/>
        <path d="M58 66 H100 q8 0 8 8 V94 H58z" fill="none" ${L}/>
        <path d="M96 80 V90 M100 80 V90" stroke="${INK}" stroke-width="1.5" opacity=".6"/>
        <circle cx="103" cy="75" r="4" fill="${GEEL}" ${L2}/>
        <rect x="22" y="40" width="40" height="52" rx="5" fill="${GROEN}" ${L}/>
        <path d="M22 80 H62 V87 q0 5 -5 5 H27 q-5 0 -5 -5z" fill="${GROENS}"/>
        <rect x="22" y="40" width="40" height="52" rx="5" fill="none" ${L}/>
        <rect x="28" y="46" width="28" height="26" rx="3" fill="${RAAM}" ${L2}/>
        <circle cx="50" cy="64" r="4" fill="none" ${L2}/>
        <rect x="16" y="34" width="52" height="8" rx="3" fill="${GROENS}" ${L}/>
        <rect x="62" y="94" width="10" height="6" rx="2" fill="${GRIJS}" ${L2}/>
        ${part('uitlaat', 68, 66, `<rect x="65" y="42" width="6" height="26" rx="2" fill="${INK}"/><rect x="62" y="38" width="12" height="6" rx="3" fill="${GRIJS}" ${L2}/>`)}`)}
      ${bigWheel('wiel-1', 30, 92, 20)}${wheel('wiel-2', 96, 102, 10)}
    `);
  },

  idle(fig) {
    // Putt-putt: het lijf schokt snel en klein
    A.bobLoop(fig, fig.part('lijf'), 1, 280, 'lijf');
    A.occasionally(fig, [5000, 11000], () => {
      const p = fig.chimney ? fig.chimney() : null;
      if (p) fx.steam(p.x, p.y, 1);
    });
  },

  async react(fig, ctx, tap, world) {
    fig.chimney = () => world.center(fig, 0.57, 0.32);
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    ctx.sound('geluid-tractor', extraSounds.tractor);
    if (n % 2 === 1) {
      // Rijden met rookwolkjes uit de uitlaat en draaiende wielen
      const smoke = setInterval(() => { const q = punt(fig, 0.57, 0.32); fx.steam(q.x, q.y, 1); }, 200);
      const w = fig.el.getBoundingClientRect().width;
      await A.drive(fig, w * 0.38, 1700, ['wiel-1', 'wiel-2']);
      clearInterval(smoke);
      fig.later(() => ctx.say('tractor', 'tractor'), 100);
    } else {
      // Bokken: de voorkant gaat omhoog (het lijf kantelt om de achteras) en ploft weer neer
      const p = fig.chimney();
      fx.steam(p.x, p.y, 3);
      await A.par(
        () => A.tilt(fig, 'lijf', -14, 400, 350),
        () => A.tween(fig, fig.part('wiel-2'), [
          { transform: 'translateY(0)' }, { transform: 'translateY(-16px)', offset: 0.3 }, { transform: 'translateY(-16px)', offset: 0.627 }, { transform: 'translateY(0)' }
        ], { duration: 750, easing: A.ease.out }).finished.catch(() => {})
      );
      const c = world.center(fig, 0.8, 0.95);
      fx.dust(c.x, c.y, 5);
      fig.later(() => ctx.say('tractor', 'tractor'), 100);
    }
  }
};
