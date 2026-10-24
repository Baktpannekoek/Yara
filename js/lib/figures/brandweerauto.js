/* De brandweerauto: rode wagen van opzij met een cabine met raam, een witte streep, een ladder
   op het dak die omhoog kan, een blauw zwaailicht, koplamp en twee wielen. Rust: de motor bromt
   zachtjes, het zwaailicht pulseert af en toe. Tik: zwaailicht knippert, de ladder gaat omhoog en
   omlaag met een zachte sirene, of hij rijdt een stukje. */

import { INK, L, L2, PAL, shade, part, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';
import { extraSounds } from '../../sounds-extra.js';

const ROOD = PAL.rood, ROODS = shade(PAL.rood, -0.18), GEEL = PAL.geel, BLAUW = PAL.blauw, GRIJS = PAL.grijs, RAAM = '#e3f2fb';

function wheel(name, cx, cy, r) {
  return part(name, cx, cy, `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${INK}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.6}" fill="${GRIJS}" ${L2}/>
    <path d="M${cx} ${cy - r * 0.6} V${cy + r * 0.6} M${cx - r * 0.6} ${cy} H${cx + r * 0.6}" stroke="${INK}" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.2}" fill="${INK}"/>`);
}

const lightPulse = (fig, times) => A.tween(fig, fig.part('zwaailicht'), [{ transform: 'scale(1)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }], { duration: 220, iterations: times });

const CABINE = 'M78 100 V70 q0 -8 8 -8 H104 q8 0 10 8 V100z';

export const brandweerauto = {
  key: 'brandweerauto',
  svg() {
    const sporten = [16, 26, 36, 46, 56, 66].map((x) => `M${x} 48 V52`).join(' ');
    return svgWrap(`
      ${shadow(60, 112, 48, 5)}
      ${part('lijf', 60, 100, `
        <rect x="4" y="98" width="112" height="6" rx="3" fill="${GRIJS}" ${L2}/>
        ${part('ladder', 10, 50, `
          <rect x="8" y="44" width="68" height="4" rx="2" fill="${GEEL}" ${L2}/>
          <path d="${sporten}" fill="none" stroke="${INK}" stroke-width="2"/>
          <rect x="8" y="52" width="68" height="4" rx="2" fill="${GEEL}" ${L2}/>`)}
        <rect x="6" y="56" width="74" height="46" rx="6" fill="${ROOD}" ${L}/>
        <path d="M6 82 H80 V96 q0 6 -6 6 H12 q-6 0 -6 -6z" fill="${ROODS}"/>
        <rect x="6" y="56" width="74" height="46" rx="6" fill="none" ${L}/>
        <rect x="12" y="62" width="54" height="16" rx="3" fill="${GRIJS}" ${L2}/>
        <path d="M12 67 H66 M12 72 H66" stroke="${INK}" stroke-width="1.2" opacity=".5"/>
        <path d="${CABINE}" fill="${ROOD}" ${L}/>
        <path d="M78 82 H114 V100 H78z" fill="${ROODS}"/>
        <path d="${CABINE}" fill="none" ${L}/>
        <rect x="6" y="86" width="108" height="6" fill="#fff" opacity=".9"/>
        <path d="M84 68 H102 q5 0 7 5 V82 H84z" fill="${RAAM}" ${L2}/>
        <rect x="113" y="70" width="5" height="8" rx="2" fill="${INK}"/>
        <rect x="6" y="52" width="14" height="6" rx="2" fill="${GRIJS}" ${L2}/>
        ${part('zwaailicht', 96, 59, `<rect x="88" y="58" width="16" height="5" rx="2" fill="${INK}"/><path d="M90 58 a6 6 0 0 1 12 0z" fill="${BLAUW}" ${L2}/><circle cx="94" cy="55" r="1.5" fill="#fff"/>`)}
        ${part('lamp', 111, 80, `<circle cx="111" cy="80" r="4" fill="${GEEL}" ${L2}/><circle cx="111" cy="80" r="1.5" fill="#fff"/>`)}`)}
      ${wheel('wiel-1', 26, 102, 10)}${wheel('wiel-2', 94, 102, 10)}
    `);
  },

  idle(fig) {
    A.bobLoop(fig, fig.part('lijf'), 0.7, 900, 'lijf');
    A.occasionally(fig, [6000, 12000], () => lightPulse(fig, 2));
  },

  async react(fig, ctx, tap, world) {
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    ctx.sound('geluid-brandweerauto', extraSounds.brandweerauto);
    if (n % 2 === 1) {
      // Sirene: zwaailicht knippert, ladder omhoog en weer omlaag, blauwe sterretjes
      const p = world.center(fig, 0.8, 0.47);
      fx.sparkles(p.x, p.y, 5, BLAUW);
      await A.par(
        () => lightPulse(fig, 5).finished.catch(() => {}),
        () => A.tilt(fig, 'ladder', -26, 500, 400)
      );
      fig.later(() => ctx.say('brandweerauto', 'brandweerauto'), 100);
    } else {
      // Rijden met knipperend zwaailicht
      lightPulse(fig, 6);
      const w = fig.el.getBoundingClientRect().width;
      await A.drive(fig, w * 0.4, 1500, ['wiel-1', 'wiel-2']);
      fig.later(() => ctx.say('brandweerauto', 'brandweerauto'), 100);
    }
  }
};
