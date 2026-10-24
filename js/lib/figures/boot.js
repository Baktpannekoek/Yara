/* De boot: rode romp met een witte streep, een crème stuurhut met patrijspoorten, een schoorsteen
   met gele band, een mast met vlaggetje en een reddingsboei. In het water: deint zonder schaduw,
   de vlag wappert, af en toe een stoomwolkje. Tik: toetert met stoom en deint diep met spetters,
   of vaart een stukje heen en terug. */

import { INK, L, L2, PAL, shade, part, shadow, svgWrap } from '../style.js';
import { pauseIdle, resumeIdle } from '../rig.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';
import { extraSounds } from '../../sounds-extra.js';

const ROOD = PAL.rood, ROODS = shade(PAL.rood, -0.18), CREME = PAL.creme, CREMES = shade(PAL.creme, -0.12), BLAUW = PAL.blauw, GEEL = PAL.geel;

const ROMP = 'M8 82 H104 q10 0 10 8 q0 8 -8 14 H26 q-8 0 -12 -8 L8 82z';

/* Punt op de tekening dat meebeweegt als de boot vaart */
function punt(fig, px, py) {
  const r = fig.svg.getBoundingClientRect();
  return { x: r.left + r.width * px, y: r.top + r.height * py };
}

export const boot = {
  key: 'boot',
  svg(opts = {}) {
    const inWater = opts.zone === 'water';
    return svgWrap(`
      ${inWater ? '' : shadow(60, 112, 48, 5)}
      ${part('lijf', 60, 100, `
        <path d="M98 82 V34" fill="none" ${L}/>
        ${part('vlag', 98, 36, `<path d="M98 34 l18 6 l-18 6z" fill="${GEEL}" ${L2}/>`)}
        ${part('schoorsteen', 36, 80, `<path d="M28 82 V58 q0 -4 4 -4 h8 q4 0 4 4 V82z" fill="${INK}"/><rect x="26" y="52" width="20" height="7" rx="3" fill="${GEEL}" ${L2}/>`)}
        <rect x="46" y="50" width="40" height="34" rx="5" fill="${CREME}" ${L}/>
        <path d="M46 70 H86 V79 q0 5 -5 5 H51 q-5 0 -5 -5z" fill="${CREMES}"/>
        <rect x="46" y="50" width="40" height="34" rx="5" fill="none" ${L}/>
        <rect x="42" y="45" width="48" height="8" rx="3" fill="${BLAUW}" ${L2}/>
        <circle cx="57" cy="64" r="5" fill="${BLAUW}" ${L2}/><circle cx="75" cy="64" r="5" fill="${BLAUW}" ${L2}/>
        <circle cx="58.5" cy="62.5" r="1.5" fill="#fff"/><circle cx="76.5" cy="62.5" r="1.5" fill="#fff"/>
        <path d="${ROMP}" fill="${ROOD}" ${L}/>
        <path d="M13 94 H113.5 q-1.5 5 -7.5 10 H26 q-8 0 -12 -8z" fill="${ROODS}"/>
        <path d="${ROMP}" fill="none" ${L}/>
        <path d="M14 89 H110" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".75"/>
        <circle cx="24" cy="95" r="4.5" fill="none" stroke="#fff" stroke-width="3.5"/>
        <circle cx="24" cy="95" r="4.5" fill="none" stroke="${INK}" stroke-width="1.5"/>`)}
      ${inWater ? `<path d="M14 104 q16 -4 32 0 t32 0 t32 0" fill="none" stroke="#fff" stroke-width="2.5" opacity=".9" stroke-linecap="round"/>` : ''}
    `);
  },

  idle(fig) {
    if (fig.zone === 'water') A.floatLoop(fig, fig.svg, 2.5, 3200);
    else A.bobLoop(fig, fig.part('lijf'), 0.8, 2400, 'lijf');
    A.sway(fig, 'vlag', 12, 1400);
    A.occasionally(fig, [5000, 11000], () => {
      const p = fig.chimney ? fig.chimney() : null;
      if (p) fx.steam(p.x, p.y, 1);
    });
  },

  async react(fig, ctx, tap, world) {
    fig.chimney = () => world.center(fig, 0.3, 0.44);
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    const c = world.center(fig, 0.5, 0.88);
    ctx.sound('geluid-boot', extraSounds.boot);
    if (n % 2 === 1) {
      // Toeteren: stoom uit de schoorsteen, diep deinen met spetters en rimpels
      const p = fig.chimney();
      fx.steam(p.x, p.y, 4);
      fx.splash(c.x, c.y, 7); fx.ripple(c.x, c.y);
      fig.later(() => fx.splash(c.x, c.y, 5), 450);
      A.wiggle(fig, 'schoorsteen', 4, 3, 220);
      pauseIdle(fig, 'root');
      await A.tween(fig, fig.svg, [
        { transform: 'translateY(0) rotate(0)' }, { transform: 'translateY(7px) rotate(3deg)', offset: 0.3 },
        { transform: 'translateY(-4px) rotate(-3deg)', offset: 0.62 }, { transform: 'translateY(2px) rotate(1deg)', offset: 0.85 }, { transform: 'translateY(0) rotate(0)' }
      ], { duration: 1300, easing: A.ease.out }).finished.catch(() => {});
      resumeIdle(fig, 'root');
      fig.later(() => ctx.say('boot', 'boot'), 100);
    } else {
      // Varen: een stukje heen en terug, met rimpels achter de boot en een wapperende vlag
      A.wiggle(fig, 'vlag', 22, 5, 160);
      const ripples = setInterval(() => { const q = punt(fig, 0.2, 0.86); fx.ripple(q.x, q.y); }, 320);
      const w = fig.el.getBoundingClientRect().width;
      await A.drive(fig, w * 0.35, 1600, []);
      clearInterval(ripples);
      fig.later(() => ctx.say('boot', 'boot'), 100);
    }
  }
};
