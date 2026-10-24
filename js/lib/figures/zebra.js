/* De zebra: wit lijf met zwarte strepen, vier poten met strepen en hoeven, staart met kwastje,
   kop met manen (apart deel), spitse oren, strepen op het voorhoofd en een donkere snuit.
   Rust: ademt, staart zwaait, knippert, kauwt en wiebelt af en toe met een oor of de manen.
   Tik: hinnikt met de kop omhoog en huppelt twee keer met stof, of schudt zijn manen. */

import { INK, L, L2, PAL, part, eye, cheeks, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';
import { extraSounds } from '../../sounds-extra.js';

const WIT = PAL.wit, WITS = '#e4e8f0', ROZE = '#f6b7c6', MOND = '#e0646a';
const STREEP = `stroke="${INK}" stroke-width="4.5" stroke-linecap="round" fill="none"`;

function leg(name, x, px) {
  return part(name, px, 88, `
    <rect x="${x}" y="86" width="13" height="26" rx="6" fill="${WIT}" ${L}/>
    <path d="M${x + 1} 93 h11 M${x + 1} 99 h11" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="${x}" y="104" width="13" height="8" rx="4" fill="${INK}"/>`);
}

export const zebra = {
  key: 'zebra',
  svg() {
    return svgWrap(`
      ${shadow(60, 114, 36)}
      ${leg('poot-la', 30, 36.5)}${leg('poot-ra', 77, 83.5)}
      ${part('staart', 92, 70, `
        <path d="M92 70 q14 6 10 22" fill="none" ${L}/>
        <ellipse cx="101" cy="95" rx="4" ry="6.5" fill="${INK}"/>`)}
      ${part('lijf', 60, 110, `
        <ellipse cx="60" cy="84" rx="36" ry="25" fill="${WIT}" ${L}/>
        <path d="M24 84 a36 25 0 0 0 72 0z" fill="${WITS}"/>
        <path d="M30 72 q8 8 6 18" ${STREEP}/><path d="M42 64 q8 10 4 22" ${STREEP}/><path d="M56 62 q6 12 2 24" ${STREEP}/>
        <path d="M70 63 q6 12 0 22" ${STREEP}/><path d="M84 68 q6 10 0 18" ${STREEP}/>
        <ellipse cx="60" cy="84" rx="36" ry="25" fill="none" ${L}/>`)}
      ${leg('poot-lv', 42, 48.5)}${leg('poot-rv', 65, 71.5)}
      ${part('kop', 60, 64, `
        ${part('manen', 60, 36, `
          <circle cx="47" cy="31" r="6" fill="${INK}" ${L2}/><circle cx="53" cy="27" r="6" fill="${WIT}" ${L2}/><circle cx="60" cy="24" r="6.5" fill="${INK}" ${L2}/>
          <circle cx="67" cy="27" r="6" fill="${WIT}" ${L2}/><circle cx="73" cy="31" r="6" fill="${INK}" ${L2}/>`)}
        ${part('oor-l', 46, 34, `<path d="M46 34 q-9 -16 1 -19 q6 6 5 19z" fill="${WIT}" ${L}/><path d="M47 32 q-5 -10 0 -13 q3 5 3 13z" fill="${ROZE}"/>`)}
        ${part('oor-r', 74, 34, `<path d="M74 34 q9 -16 -1 -19 q-6 6 -5 19z" fill="${WIT}" ${L}/><path d="M73 32 q5 -10 0 -13 q-3 5 -3 13z" fill="${ROZE}"/>`)}
        <ellipse cx="60" cy="49" rx="21" ry="23" fill="${WIT}" ${L}/>
        <path d="M39 49 a21 23 0 0 0 42 0z" fill="${WITS}"/>
        <path d="M52 31 q8 -3 16 0" stroke="${INK}" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M54 38 q6 4 12 0" stroke="${INK}" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M42 40 q-2 6 1 12 M78 40 q2 6 -1 12" stroke="${INK}" stroke-width="4" stroke-linecap="round" fill="none"/>
        <ellipse cx="60" cy="49" rx="21" ry="23" fill="none" ${L}/>
        ${eye('oog-l', 50, 49, 6)}${eye('oog-r', 70, 49, 6)}
        ${cheeks(44, 76, 58, 3)}
        <ellipse cx="60" cy="64" rx="14" ry="8" fill="${INK}"/>
        <circle cx="54" cy="62" r="1.8" fill="#fff" opacity=".6"/><circle cx="66" cy="62" r="1.8" fill="#fff" opacity=".6"/>
        ${part('mond', 60, 67, `<path d="M54 67 q6 1 12 0 q-6 5.5 -12 0z" fill="${MOND}" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>`)}`)}
    `);
  },

  idle(fig) {
    A.breathe(fig, 'lijf', 0.02, 3000);
    A.sway(fig, 'staart', 10, 2200);
    A.blinkLoop(fig, ['oog-l', 'oog-r']);
    A.occasionally(fig, [4000, 9000], () => {
      const r = Math.random();
      if (r < 0.3) A.wiggle(fig, Math.random() < 0.5 ? 'oor-l' : 'oor-r', 14, 2, 180);
      else if (r < 0.5) A.wiggle(fig, 'manen', 5, 2, 220);
      else if (r < 0.75) A.chew(fig, 'mond', 3);
      else A.lookAt(fig, ['oog-l-pupil', 'oog-r-pupil'], Math.random() * 2 - 1, Math.random() * 0.6 - 0.3, 1600);
    });
  },

  async react(fig, ctx, tap, world) {
    const c = world.center(fig, 0.5, 0.95);
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    A.lookAt(fig, ['oog-l-pupil', 'oog-r-pupil'], tap.x, tap.y, 900);
    if (n % 2 === 1) {
      // Hinniken en huppelen: kop omhoog, mond open, twee hops met stof
      ctx.sound('geluid-zebra', extraSounds.zebra);
      await A.par(
        () => A.tilt(fig, 'kop', -14, 300, 500),
        () => A.mouth(fig, 'mond', 2.6, 700),
        () => A.seq(
          () => A.hop(fig, 12, 450), () => { fx.dust(c.x, c.y, 5); },
          () => A.hop(fig, 12, 450), () => { fx.dust(c.x, c.y, 5); }
        )
      );
      fig.later(() => ctx.say('zebra', 'zebra'), 100);
    } else {
      // Manen schudden: kop schudt, manen en staart wapperen
      ctx.sound('geluid-zebra', extraSounds.zebra);
      await A.par(
        () => A.shake(fig, 'kop', 10, 750),
        () => A.wiggle(fig, 'manen', 14, 5, 150),
        () => A.wiggle(fig, 'staart', 16, 3, 250)
      );
      fig.later(() => ctx.say('zebra', 'zebra'), 100);
    }
  }
};
