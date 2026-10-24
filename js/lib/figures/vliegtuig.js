/* Het vliegtuig: een propellervliegtuigje van opzij, met rode staart en vleugel, raampjes,
   een propeller op de neus en twee kleine wieltjes. In de lucht: zweeft zonder schaduw, propeller
   draait altijd. Tik: vliegt een lus met een wolkenspoor, of wiebelt met de vleugel en rolt. */

import { INK, L, L2, PAL, shade, part, shadow, svgWrap } from '../style.js';
import { pauseIdle, resumeIdle } from '../rig.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';
import { extraSounds } from '../../sounds-extra.js';

const WIT = PAL.wit, WITS = '#e4e8f0', ROOD = PAL.rood, ROODS = shade(PAL.rood, -0.18), RAAM = '#c9e6f8', GRIJS = PAL.grijs;

function wheel(name, cx, cy, r) {
  return part(name, cx, cy, `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${INK}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.5}" fill="${GRIJS}" ${L2}/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.18}" fill="${INK}"/>`);
}

/* Punt op de tekening dat meebeweegt tijdens de lus */
function punt(fig, px, py) {
  const r = fig.svg.getBoundingClientRect();
  return { x: r.left + r.width * px, y: r.top + r.height * py };
}

const ROMP = 'M12 72 q4 -12 20 -12 H84 q22 0 28 14 q-6 14 -28 14 H32 q-16 0 -20 -12z';

export const vliegtuig = {
  key: 'vliegtuig',
  svg(opts = {}) {
    const inLucht = opts.zone === 'lucht';
    return svgWrap(`
      ${inLucht ? '' : shadow(60, 112, 44, 5)}
      <path d="M44 86 V103 M92 86 V103" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
      ${wheel('wiel-1', 44, 105, 7)}${wheel('wiel-2', 92, 105, 7)}
      ${part('lijf', 60, 74, `
        <path d="M18 64 L12 36 H28 L40 62z" fill="${ROOD}" ${L}/>
        <path d="M22 74 L6 80 H26z" fill="${ROODS}" ${L}/>
        <path d="${ROMP}" fill="${WIT}" ${L}/>
        <path d="M14 76 q2 12 18 12 H84 q22 0 28 -14 H14z" fill="${WITS}"/>
        <path d="${ROMP}" fill="none" ${L}/>
        <path d="M24 81 H98" stroke="${ROOD}" stroke-width="3" stroke-linecap="round"/>
        <path d="M80 62 q16 0 22 8 H80z" fill="${RAAM}" ${L2}/>
        <circle cx="40" cy="73" r="4.5" fill="${RAAM}" ${L2}/><circle cx="54" cy="73" r="4.5" fill="${RAAM}" ${L2}/><circle cx="68" cy="73" r="4.5" fill="${RAAM}" ${L2}/>
        ${part('vleugel', 62, 76, `<path d="M48 76 L38 95 H60 L76 76z" fill="${ROOD}" ${L}/><path d="M43 86 L38 95 H60 L66 86z" fill="${ROODS}"/><path d="M48 76 L38 95 H60 L76 76z" fill="none" ${L}/>`)}
        ${part('propeller', 114, 74, `<ellipse cx="114" cy="74" rx="2.6" ry="17" fill="${GRIJS}" ${L2}/><circle cx="114" cy="74" r="4.2" fill="${PAL.geel}" ${L2}/>`)}`)}
    `);
  },

  idle(fig) {
    if (fig.zone === 'lucht') A.bobLoop(fig, fig.svg, 3, 2600);
    else A.bobLoop(fig, fig.part('lijf'), 0.7, 220, 'lijf');
    A.spinLoop(fig, 'propeller', 500);
    A.occasionally(fig, [5000, 10000], () => A.wiggle(fig, 'vleugel', 5, 1, 520));
  },

  async react(fig, ctx, tap, world) {
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    ctx.sound('geluid-vliegtuig', extraSounds.vliegtuig);
    if (n % 2 === 1) {
      // Een lus: omhoog, over de kop en weer terug, met een spoor van wolkjes
      const w = fig.el.getBoundingClientRect().width;
      const R = w * 0.3;
      const frames = [];
      for (let i = 0; i <= 8; i++) {
        const t = i / 8, th = t * Math.PI * 2;
        frames.push({ transform: `translate(${(R * Math.sin(th)).toFixed(1)}px, ${(-R * (1 - Math.cos(th))).toFixed(1)}px) rotate(${-360 * t}deg)`, offset: t });
      }
      const trail = setInterval(() => { const q = punt(fig, 0.5, 0.62); fx.steam(q.x, q.y, 1); }, 140);
      pauseIdle(fig, 'root');
      await A.tween(fig, fig.svg, frames, { duration: 1700, easing: A.ease.inOut }).finished.catch(() => {});
      resumeIdle(fig, 'root');
      clearInterval(trail);
      fig.later(() => ctx.say('vliegtuig', 'vliegtuig'), 100);
    } else {
      // Wiebelen met de vleugel en een rolletje opzij
      pauseIdle(fig, 'root');
      await A.par(
        () => A.wiggle(fig, 'vleugel', 14, 4, 170),
        () => A.tween(fig, fig.svg, [
          { transform: 'rotate(0) translateY(0)' }, { transform: 'rotate(-14deg) translateY(-6px)', offset: 0.3 },
          { transform: 'rotate(12deg) translateY(-6px)', offset: 0.65 }, { transform: 'rotate(0) translateY(0)' }
        ], { duration: 900, easing: A.ease.inOut }).finished.catch(() => {})
      );
      resumeIdle(fig, 'root');
      fig.later(() => ctx.say('vliegtuig', 'vliegtuig'), 100);
    }
  }
};
