/* De trein: locomotief van opzij, met schoorsteen, cabine, drie wielen en een koplamp.
   Rust: puft zachtjes, af en toe een klein stoomwolkje. Tik: fluit en rijdt een stukje
   met draaiende wielen en stoom, of knippert met de lamp en toetert. */

import { INK, L, L2, PAL, shade, part, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';

const ROOD = PAL.rood, ROODS = shade(PAL.rood, -0.18), BLAUW = PAL.blauw, BLAUWS = shade(PAL.blauw, -0.18), GRIJS = PAL.grijs;

function wheel(name, cx, cy, r) {
  return part(name, cx, cy, `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${INK}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.62}" fill="${GRIJS}" ${L2}/>
    <path d="M${cx} ${cy - r * 0.62} V${cy + r * 0.62} M${cx - r * 0.62} ${cy} H${cx + r * 0.62}" stroke="${INK}" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.2}" fill="${INK}"/>`);
}

export const trein = {
  key: 'trein',
  svg() {
    return svgWrap(`
      ${shadow(60, 112, 44, 5)}
      ${part('lijf', 60, 100, `
        <rect x="8" y="94" width="104" height="8" rx="3" fill="${ROODS}" ${L}/>
        <rect x="14" y="60" width="58" height="36" rx="10" fill="${ROOD}" ${L}/>
        <path d="M14 82 h58 v6 a8 8 0 0 1 -8 8 H22 a8 8 0 0 1 -8 -8z" fill="${ROODS}"/><rect x="14" y="60" width="58" height="36" rx="10" fill="none" ${L}/>
        <rect x="70" y="42" width="38" height="54" rx="6" fill="${BLAUW}" ${L}/>
        <rect x="70" y="82" width="38" height="14" rx="4" fill="${BLAUWS}"/><rect x="70" y="42" width="38" height="54" rx="6" fill="none" ${L}/>
        <rect x="66" y="36" width="46" height="9" rx="4" fill="${ROOD}" ${L}/>
        <rect x="78" y="52" width="22" height="18" rx="4" fill="#e3f2fb" ${L}/>
        <path d="M78 61 H100" stroke="${INK}" stroke-width="2"/>
        <circle cx="34" cy="76" r="9" fill="${PAL.geel}" ${L}/><circle cx="34" cy="76" r="4" fill="#fff4dc"/>
        ${part('schoorsteen', 32, 60, `<path d="M24 60 h16 v-14 h-16z" fill="${INK}"/><rect x="20" y="40" width="24" height="8" rx="3" fill="${INK}"/>`)}
        ${part('lamp', 12, 78, `<circle cx="12" cy="78" r="5" fill="${PAL.geel}" ${L2}/><circle cx="12" cy="78" r="2" fill="#fff"/>`)}
        <rect x="4" y="88" width="14" height="8" rx="2" fill="${GRIJS}" ${L2}/>
        <path d="M4 100 l-4 10 h22 l-4 -10z" fill="${GRIJS}" ${L2}/>`)}
      ${wheel('wiel-1', 30, 102, 10)}${wheel('wiel-2', 58, 102, 10)}${wheel('wiel-3', 90, 102, 10)}
      ${part('stang', 30, 102, `<path d="M30 104 H90" stroke="${GRIJS}" stroke-width="3.5" stroke-linecap="round"/><path d="M30 104 H90" stroke="${INK}" stroke-width="1" opacity=".4"/>`)}
    `);
  },

  idle(fig) {
    A.bobLoop(fig, fig.part('lijf'), 1.2, 900, 'lijf');
    A.occasionally(fig, [5000, 11000], () => {
      const p = fig.chimney ? fig.chimney() : null;
      if (p) fx.steam(p.x, p.y, 1);
    });
  },

  async react(fig, ctx, tap, world) {
    fig.chimney = () => world.center(fig, 0.27, 0.34);
    const p = fig.chimney();
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    if (n % 3 === 0) {
      // Fluiten: lamp knippert, stoom, zonder te rijden
      ctx.sound('geluid-trein', ctx.audio.animals.trein || ctx.audio.honk);
      fx.steam(p.x, p.y, 4);
      await A.tween(fig, fig.part('lamp'), [{ transform: 'scale(1)' }, { transform: 'scale(1.6)' }, { transform: 'scale(1)' }], { duration: 300, iterations: 4 }).finished.catch(() => {});
      fig.later(() => ctx.say('trein', 'trein'), 100);
    } else {
      // Tsjoeke tsjoeke: een stukje rijden met stoom en draaiende wielen
      ctx.sound('geluid-trein', ctx.audio.honk);
      const steamTimer = setInterval(() => { const q = fig.chimney(); fx.steam(q.x, q.y, 1); }, 220);
      const w = fig.el.getBoundingClientRect().width;
      await A.drive(fig, w * 0.45, 1800, ['wiel-1', 'wiel-2', 'wiel-3']);
      clearInterval(steamTimer);
      fig.later(() => ctx.say('trein', 'trein'), 100);
    }
  }
};
