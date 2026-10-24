/* De koe: lijf, vier poten, staart, kop met oren, hoorns, ogen en snuit.
   Rust: ademt, staart zwaait, knippert, kauwt af en toe, wiebelt met een oor.
   Tik: loeit (kop omhoog, mond open) of maakt een sprongetje met stof. */

import { INK, L, L2, PAL, shade, part, eye, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';

const WIT = PAL.wit, WITS = '#e4e8f0', ROZE = '#f6b7c6', ROZES = shade('#f6b7c6', -0.14);

function leg(name, x, px) {
  return part(name, px, 88, `<rect x="${x}" y="86" width="13" height="26" rx="6" fill="${WIT}" ${L}/><rect x="${x}" y="104" width="13" height="8" rx="4" fill="${INK}"/>`);
}

export const koe = {
  key: 'koe',
  svg() {
    return svgWrap(`
      ${shadow(60, 114, 36)}
      ${leg('poot-la', 30, 36)}${leg('poot-ra', 77, 83)}
      ${part('staart', 92, 70, `<path d="M92 70 q14 6 10 22" fill="none" ${L}/><ellipse cx="101" cy="92" rx="4" ry="5.5" fill="${INK}"/>`)}
      ${part('lijf', 60, 110, `
        <ellipse cx="60" cy="84" rx="36" ry="25" fill="${WIT}" ${L}/>
        <path d="M24 84 a36 25 0 0 0 72 0z" fill="${WITS}"/>
        <ellipse cx="60" cy="84" rx="36" ry="25" fill="none" ${L}/>
        <path d="M34 72 q8 -10 18 -2 q-4 12 -16 10z" fill="${INK}"/><path d="M70 90 q12 -8 18 4 q-8 10 -18 2z" fill="${INK}"/>
        <ellipse cx="60" cy="100" rx="11" ry="6" fill="${ROZE}" ${L2}/><circle cx="55" cy="100" r="1.6" fill="${ROZES}"/><circle cx="60" cy="101" r="1.6" fill="${ROZES}"/><circle cx="65" cy="100" r="1.6" fill="${ROZES}"/>`)}
      ${leg('poot-lv', 42, 48)}${leg('poot-rv', 65, 71)}
      ${part('kop', 60, 62, `
        ${part('oor-l', 38, 44, `<ellipse cx="30" cy="46" rx="11" ry="6" fill="${WIT}" ${L} transform="rotate(-20 30 46)"/><ellipse cx="30" cy="46" rx="6" ry="3" fill="${ROZE}" transform="rotate(-20 30 46)"/>`)}
        ${part('oor-r', 82, 44, `<ellipse cx="90" cy="46" rx="11" ry="6" fill="${WIT}" ${L} transform="rotate(20 90 46)"/><ellipse cx="90" cy="46" rx="6" ry="3" fill="${ROZE}" transform="rotate(20 90 46)"/>`)}
        <path d="M44 32 q-10 -12 -2 -16 q6 6 6 14z" fill="${PAL.creme}" ${L}/><path d="M76 32 q10 -12 2 -16 q-6 6 -6 14z" fill="${PAL.creme}" ${L}/>
        <circle cx="60" cy="48" r="25" fill="${WIT}" ${L}/>
        <path d="M66 26 q12 -2 14 10 q-10 6 -16 -2z" fill="${INK}"/>
        ${eye('oog-l', 50, 46, 6)}${eye('oog-r', 70, 46, 6)}
        <ellipse cx="60" cy="63" rx="15" ry="9" fill="${ROZE}" ${L}/>
        <ellipse cx="54" cy="62" rx="2.2" ry="2.8" fill="${ROZES}"/><ellipse cx="66" cy="62" rx="2.2" ry="2.8" fill="${ROZES}"/>
        ${part('mond', 60, 68, `<path d="M55 68 q5 4 10 0" fill="none" ${L2}/>`)}`)}
    `);
  },

  idle(fig) {
    A.breathe(fig, 'lijf', 0.02, 3000);
    A.sway(fig, 'staart', 10, 2200);
    A.blinkLoop(fig, ['oog-l', 'oog-r']);
    A.occasionally(fig, [4000, 9000], () => {
      const r = Math.random();
      if (r < 0.35) A.wiggle(fig, Math.random() < 0.5 ? 'oor-l' : 'oor-r', 14, 2, 180);
      else if (r < 0.7) A.chew(fig, 'mond', 4);
      else A.lookAt(fig, ['oog-l-pupil', 'oog-r-pupil'], Math.random() * 2 - 1, Math.random() * 0.6 - 0.3, 1600);
    });
  },

  async react(fig, ctx, tap, world) {
    const c = world.center(fig, 0.5, 0.95);
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    if (n % 2 === 1) {
      // Loeien: kop omhoog, mond open, lijf iets uitrekken
      ctx.sound('geluid-koe', ctx.audio.animals.koe);
      await A.par(
        () => A.tilt(fig, 'kop', -14, 350, 700),
        () => A.mouth(fig, 'mond', 2.6, 900),
        () => A.tween(fig, fig.svg, [{ transform: 'scale(1,1)' }, { transform: 'scale(.98,1.04)', offset: 0.3 }, { transform: 'scale(1,1)' }], { duration: 1000, easing: A.ease.out }).finished.catch(() => {})
      );
      fig.later(() => ctx.say('koe', 'koe'), 100);
    } else {
      ctx.sound('geluid-koe', ctx.audio.animals.koe);
      await A.hop(fig, 18, 650);
      fx.dust(c.x, c.y, 6);
      fig.later(() => ctx.say('koe', 'koe'), 200);
    }
  }
};
