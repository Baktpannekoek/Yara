/* De fiets: twee wielen met spaken, een rood frame met spatborden, zadel, stuur met bel,
   trappers, een standaard en een vlaggetje achterop. Rust: de wielen draaien heel langzaam,
   de vlag wappert, de bel wiebelt af en toe. Tik: rinkelt (bel wiebelt, sterretjes) en rijdt een
   stukje met snel draaiende wielen, of wiebelt op zijn standaard. */

import { INK, L, L2, PAL, shade, part, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';
import { extraSounds } from '../../sounds-extra.js';

const ROOD = PAL.rood, ROODS = shade(PAL.rood, -0.18), GEEL = PAL.geel, GRIJS = PAL.grijs, ORANJE = PAL.oranje;

function wheel(name, cx, cy, r) {
  const spaken = [];
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI;
    const dx = Math.cos(a) * (r - 2), dy = Math.sin(a) * (r - 2);
    spaken.push(`M${(cx - dx).toFixed(1)} ${(cy - dy).toFixed(1)} L${(cx + dx).toFixed(1)} ${(cy + dy).toFixed(1)}`);
  }
  return part(name, cx, cy, `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="4.5"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 4}" fill="none" stroke="${GRIJS}" stroke-width="1.5"/>
    <path d="${spaken.join(' ')}" fill="none" stroke="${INK}" stroke-width="1.4"/>
    <circle cx="${cx}" cy="${cy}" r="3" fill="${INK}"/>`);
}

/* Een dikke lijn: inkt eronder, kleur erbovenop */
function buis(d, kleur, w = 4.5) {
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 3}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${kleur}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

export const fiets = {
  key: 'fiets',
  svg() {
    return svgWrap(`
      ${shadow(60, 112, 44, 5)}
      ${wheel('wiel-1', 28, 96, 16)}${wheel('wiel-2', 92, 96, 16)}
      ${buis('M10 94 A18 18 0 0 1 46 94', ROODS, 4)}
      ${buis('M74 94 A18 18 0 0 1 110 94', ROODS, 4)}
      ${part('vlag', 26, 56, `<path d="M26 78 V56" fill="none" ${L2}/><path d="M26 56 l12 4 l-12 4z" fill="${ORANJE}" ${L2}/>`)}
      ${part('frame', 60, 94, `
        ${buis('M28 96 L60 94 L50 58 L28 96 M50 58 L88 54 L84 68 L60 94 M84 68 L92 96', ROOD)}
        <path d="M60 94 L68 112" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
        <path d="M28 90 L60 88 M28 102 L60 100" fill="none" stroke="${INK}" stroke-width="1.3" opacity=".6"/>
        <circle cx="60" cy="94" r="6" fill="${GRIJS}" ${L2}/>
        <path d="M60 94 L54 84 M60 94 L66 104" fill="none" ${L2}/>
        <rect x="50" y="82" width="8" height="4" rx="1.5" fill="${INK}"/><rect x="62" y="102" width="8" height="4" rx="1.5" fill="${INK}"/>
        <path d="M50 58 V50" fill="none" ${L}/>
        <ellipse cx="49" cy="49" rx="8" ry="3.2" fill="${INK}"/>
        <path d="M20 76 H34" fill="none" ${L}/>
        <circle cx="98" cy="66" r="3.5" fill="${GEEL}" ${L2}/>`)}
      ${part('stuur', 88, 54, `
        <path d="M88 54 V47" fill="none" ${L}/>
        <path d="M80 46 H98" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
        <rect x="95" y="44" width="6" height="4" rx="2" fill="${ROOD}" ${L2}/>
        ${part('bel', 82, 44, `<path d="M78.5 44 a3.5 3.5 0 0 1 7 0z" fill="${GEEL}" ${L2}/><circle cx="82" cy="41.5" r="1.1" fill="#fff"/>`)}`)}
    `);
  },

  idle(fig) {
    A.spinLoop(fig, 'wiel-1', 7000);
    A.spinLoop(fig, 'wiel-2', 7000);
    A.sway(fig, 'vlag', 8, 1800);
    A.occasionally(fig, [5000, 10000], () => A.wiggle(fig, 'bel', 10, 2, 150));
  },

  async react(fig, ctx, tap, world) {
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    const b = world.center(fig, 0.68, 0.36);
    ctx.sound('geluid-fiets', extraSounds.fiets);
    if (n % 2 === 1) {
      // Rinkelen: bel wiebelt met sterretjes, dan een stukje rijden met snel draaiende wielen
      fx.sparkles(b.x, b.y, 6);
      await A.wiggle(fig, 'bel', 25, 4, 110);
      A.wiggle(fig, 'vlag', 20, 5, 160);
      const w = fig.el.getBoundingClientRect().width;
      await A.drive(fig, w * 0.4, 1400, ['wiel-1', 'wiel-2']);
      fig.later(() => ctx.say('fiets', 'fiets'), 100);
    } else {
      // Wiebelen op de standaard, bel tingelt mee
      fx.sparkles(b.x, b.y, 3);
      await A.par(
        () => A.wiggle(fig, 'bel', 15, 3, 140),
        () => A.tween(fig, fig.svg, [
          { transform: 'rotate(0)' }, { transform: 'rotate(5deg)' }, { transform: 'rotate(-5deg)' }, { transform: 'rotate(3deg)' }, { transform: 'rotate(0)' }
        ], { duration: 800, easing: A.ease.inOut }).finished.catch(() => {})
      );
      fig.later(() => ctx.say('fiets', 'fiets'), 100);
    }
  }
};
