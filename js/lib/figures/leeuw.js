/* De leeuw: lijf, vier poten, staart met kwastje, kop met grote manen (apart deel), ronde oren,
   snuit en grote ogen. Rust: ademt, staart zwaait, knippert, schudt af en toe zacht de manen.
   Tik: brult (kop omhoog, mond wijd, manen schudden, lijf uitrekken) of schudt de manen en gaapt. */

import { INK, L, L2, PAL, shade, part, eye, cheeks, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';
import { extraSounds } from '../../sounds-extra.js';

const GOUD = '#f2bd57', GOUDS = shade(GOUD, -0.16), MANEN = PAL.oranje, MANENS = shade(PAL.oranje, -0.18);
const CREME = PAL.creme, MOND = '#e0646a';

function leg(name, x, px) {
  return part(name, px, 88, `
    <rect x="${x}" y="86" width="14" height="26" rx="6" fill="${GOUD}" ${L}/>
    <ellipse cx="${x + 7}" cy="108" rx="8" ry="4.5" fill="${GOUDS}" ${L2}/>
    <path d="M${x + 4} 106 v4 M${x + 7} 105 v5 M${x + 10} 106 v4" fill="none" ${L2}/>`);
}

function mane() {
  const n = 11, out = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = 60 + Math.cos(a) * 23, y = 46 + Math.sin(a) * 23;
    out.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11.5" fill="${y > 50 ? MANENS : MANEN}" ${L}/>`);
  }
  out.push(`<circle cx="60" cy="46" r="25" fill="${MANEN}"/>`);
  return out.join('');
}

export const leeuw = {
  key: 'leeuw',
  svg() {
    return svgWrap(`
      ${shadow(60, 114, 38)}
      ${leg('poot-la', 28, 35)}${leg('poot-ra', 78, 85)}
      ${part('staart', 94, 76, `
        <path d="M94 76 q20 -6 14 -24" fill="none" ${L}/>
        <ellipse cx="107" cy="48" rx="5" ry="7" fill="${PAL.donkerbruin}" ${L2} transform="rotate(14 107 48)"/>`)}
      ${part('lijf', 60, 110, `
        <ellipse cx="60" cy="86" rx="36" ry="24" fill="${GOUD}" ${L}/>
        <path d="M24 86 a36 24 0 0 0 72 0z" fill="${GOUDS}"/>
        <ellipse cx="62" cy="96" rx="17" ry="9" fill="${CREME}"/>
        <ellipse cx="60" cy="86" rx="36" ry="24" fill="none" ${L}/>`)}
      ${leg('poot-lv', 41, 48)}${leg('poot-rv', 65, 72)}
      ${part('kop', 60, 66, `
        ${part('manen', 60, 46, mane())}
        ${part('oor-l', 46, 32, `<circle cx="44" cy="29" r="7.5" fill="${GOUD}" ${L}/><circle cx="44" cy="29" r="3.5" fill="${GOUDS}"/>`)}
        ${part('oor-r', 74, 32, `<circle cx="76" cy="29" r="7.5" fill="${GOUD}" ${L}/><circle cx="76" cy="29" r="3.5" fill="${GOUDS}"/>`)}
        <circle cx="60" cy="46" r="20" fill="${GOUD}" ${L}/>
        <path d="M40 46 a20 20 0 0 0 40 0z" fill="${GOUDS}"/>
        <circle cx="60" cy="46" r="20" fill="none" ${L}/>
        ${eye('oog-l', 52, 43, 5.5)}${eye('oog-r', 68, 43, 5.5)}
        ${cheeks(46, 74, 52, 3.5)}
        <ellipse cx="60" cy="56" rx="11" ry="7" fill="${CREME}" ${L2}/>
        <circle cx="54" cy="56" r="1.2" fill="${GOUDS}"/><circle cx="66" cy="56" r="1.2" fill="${GOUDS}"/>
        <ellipse cx="60" cy="52.5" rx="4" ry="2.6" fill="${INK}"/>
        <path d="M60 55 v3" fill="none" ${L2}/>
        ${part('mond', 60, 58, `<path d="M54.5 58 q5.5 1 11 0 q-5.5 6.5 -11 0z" fill="${MOND}" ${L2}/>`)}`)}
    `);
  },

  idle(fig) {
    A.breathe(fig, 'lijf', 0.02, 3200);
    A.sway(fig, 'staart', 8, 2400);
    A.blinkLoop(fig, ['oog-l', 'oog-r']);
    A.occasionally(fig, [4000, 9000], () => {
      const r = Math.random();
      if (r < 0.3) A.wiggle(fig, Math.random() < 0.5 ? 'oor-l' : 'oor-r', 14, 2, 180);
      else if (r < 0.55) A.wiggle(fig, 'manen', 3, 2, 260);
      else if (r < 0.75) A.chew(fig, 'mond', 2);
      else A.lookAt(fig, ['oog-l-pupil', 'oog-r-pupil'], Math.random() * 2 - 1, Math.random() * 0.6 - 0.3, 1600);
    });
  },

  async react(fig, ctx, tap, world) {
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    A.lookAt(fig, ['oog-l-pupil', 'oog-r-pupil'], tap.x, tap.y, 900);
    if (n % 2 === 1) {
      // Brullen: kop omhoog, mond wijd open, manen schudden, lijf uitrekken
      ctx.sound('geluid-leeuw', extraSounds.leeuw);
      await A.par(
        () => A.tilt(fig, 'kop', -16, 350, 750),
        () => A.mouth(fig, 'mond', 3.2, 1100),
        () => A.wiggle(fig, 'manen', 6, 5, 180),
        () => A.tween(fig, fig.svg, [{ transform: 'scale(1,1)' }, { transform: 'scale(.97,1.05)', offset: 0.3 }, { transform: 'scale(1,1)' }], { duration: 1100, easing: A.ease.out }).finished.catch(() => {})
      );
      fig.later(() => ctx.say('leeuw', 'leeuw'), 100);
    } else {
      // Manen schudden en daarna gapen
      ctx.sound('geluid-leeuw', extraSounds.leeuw);
      await A.par(
        () => A.shake(fig, 'kop', 9, 650),
        () => A.wiggle(fig, 'manen', 12, 4, 160)
      );
      await A.par(
        () => A.tilt(fig, 'kop', -8, 300, 400),
        () => A.mouth(fig, 'mond', 2.6, 700)
      );
      fig.later(() => ctx.say('leeuw', 'leeuw'), 100);
    }
  }
};
