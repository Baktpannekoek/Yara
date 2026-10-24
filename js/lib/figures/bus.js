/* De bus: een lange gele bus van opzij met een rij raampjes, een deur die open kan,
   een bordje op het dak, koplamp en achterlicht. Rust: de motor bromt zachtjes, de lamp knippert soms.
   Tik: toetert, de deur gaat open en dicht en hij rijdt een stukje, of hij wiebelt op zijn wielen. */

import { INK, L, L2, PAL, shade, part, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import { extraSounds } from '../../sounds-extra.js';

const GEEL = PAL.geel, GEELS = shade(PAL.geel, -0.16), ORANJE = PAL.oranje, GRIJS = PAL.grijs, RAAM = '#e3f2fb';

function wheel(name, cx, cy, r) {
  return part(name, cx, cy, `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${INK}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.6}" fill="${GRIJS}" ${L2}/>
    <path d="M${cx} ${cy - r * 0.6} V${cy + r * 0.6} M${cx - r * 0.6} ${cy} H${cx + r * 0.6}" stroke="${INK}" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.2}" fill="${INK}"/>`);
}

const lampPulse = (fig, times) => A.tween(fig, fig.part('lamp'), [{ transform: 'scale(1)' }, { transform: 'scale(1.6)' }, { transform: 'scale(1)' }], { duration: 280, iterations: times });

export const bus = {
  key: 'bus',
  svg() {
    const ramen = [12, 30, 48].map((x) => `<rect x="${x}" y="50" width="15" height="19" rx="3" fill="${RAAM}" ${L2}/>`).join('');
    return svgWrap(`
      ${shadow(60, 112, 48, 5)}
      ${part('lijf', 60, 100, `
        <rect x="8" y="98" width="104" height="6" rx="3" fill="${GRIJS}" ${L2}/>
        <rect x="40" y="36" width="40" height="9" rx="3" fill="#fff" ${L2}/><path d="M47 40.5 H73" stroke="${PAL.blauw}" stroke-width="3" stroke-linecap="round"/>
        <rect x="6" y="42" width="108" height="60" rx="9" fill="${GEEL}" ${L}/>
        <path d="M6 80 H114 V93 q0 9 -9 9 H15 q-9 0 -9 -9z" fill="${GEELS}"/>
        <rect x="6" y="73" width="108" height="7" fill="${ORANJE}"/>
        <rect x="6" y="42" width="108" height="60" rx="9" fill="none" ${L}/>
        ${ramen}
        <path d="M90 50 H104 q8 0 10 8 V69 H90z" fill="${RAAM}" ${L2}/>
        <rect x="113" y="52" width="5" height="9" rx="2" fill="${INK}"/>
        <circle cx="10" cy="92" r="3.5" fill="${PAL.rood}" ${L2}/>
        ${part('deur', 64, 75, `<rect x="64" y="50" width="18" height="48" rx="3" fill="${GEELS}" ${L2}/><rect x="67" y="53" width="12" height="16" rx="2" fill="${RAAM}" ${L2}/><path d="M73 50 V98" stroke="${INK}" stroke-width="1.5"/>`)}
        ${part('lamp', 110, 92, `<circle cx="110" cy="92" r="4.5" fill="#fff" ${L2}/><circle cx="110" cy="92" r="1.6" fill="${PAL.geel}"/>`)}`)}
      ${wheel('wiel-1', 24, 102, 10)}${wheel('wiel-2', 96, 102, 10)}
    `);
  },

  idle(fig) {
    A.bobLoop(fig, fig.part('lijf'), 0.8, 700, 'lijf');
    A.occasionally(fig, [6000, 12000], () => lampPulse(fig, 2));
  },

  async react(fig, ctx, tap, world) {
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    ctx.sound('geluid-bus', extraSounds.bus);
    if (n % 2 === 1) {
      // Toeteren: deur open en dicht, dan een stukje rijden
      lampPulse(fig, 3);
      await A.tween(fig, fig.part('deur'), [
        { transform: 'scaleX(1)' }, { transform: 'scaleX(.12)', offset: 0.3 }, { transform: 'scaleX(.12)', offset: 0.65 }, { transform: 'scaleX(1)' }
      ], { duration: 700, easing: A.ease.out }).finished.catch(() => {});
      const w = fig.el.getBoundingClientRect().width;
      await A.drive(fig, w * 0.38, 1200, ['wiel-1', 'wiel-2']);
      fig.later(() => ctx.say('bus', 'bus'), 100);
    } else {
      // Wiebelen op de wielen
      lampPulse(fig, 3);
      await A.tween(fig, fig.svg, [
        { transform: 'rotate(0) translateY(0)' }, { transform: 'rotate(-2.5deg) translateY(-3px)' }, { transform: 'rotate(2.5deg) translateY(0)' },
        { transform: 'rotate(-1.5deg) translateY(-2px)' }, { transform: 'rotate(0) translateY(0)' }
      ], { duration: 900, easing: A.ease.inOut }).finished.catch(() => {});
      fig.later(() => ctx.say('bus', 'bus'), 100);
    }
  }
};
