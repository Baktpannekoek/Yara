/* Het paard: lijf, vier lange poten met hoeven, lange staart, kop met manen, kuif, puntoren,
   lichte snuit met neusgaten. Rust: ademt, staart zwaait, knippert, kauwt, wiebelt met oor of manen.
   Tik: hinnikt met kop omhoog en wapperende manen, of steigert (voorpoten omhoog) met stof. */

import { INK, L, L2, PAL, shade, part, eye, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';

const BRUIN = PAL.bruin, BRUINS = shade(PAL.bruin, -0.16), MANEN = PAL.donkerbruin, CREME = PAL.creme, ROZE = PAL.roze;
const PUPILS = ['oog-l-pupil', 'oog-r-pupil'];

function leg(name, x, px) {
  return part(name, px, 78, `<rect x="${x}" y="76" width="12" height="36" rx="6" fill="${BRUIN}"/><rect x="${x}" y="104" width="12" height="8" rx="4" fill="${INK}"/><rect x="${x}" y="76" width="12" height="36" rx="6" fill="none" ${L}/>`);
}
const run = (fig, el, kf, opts) => { const a = A.tween(fig, el, kf, opts); return a ? a.finished.catch(() => {}) : Promise.resolve(); };

export const paard = {
  key: 'paard',
  svg() {
    return svgWrap(`
      ${shadow(60, 114, 38)}
      ${leg('poot-la', 28, 34)}${leg('poot-ra', 80, 86)}
      ${part('staart', 92, 66, `<path d="M92 66 q16 8 12 42 q-8 2 -12 -6 q8 -14 0 -36z" fill="${MANEN}" ${L}/>`)}
      ${part('lijf', 60, 110, `
        <ellipse cx="60" cy="76" rx="34" ry="22" fill="${BRUIN}"/>
        <path d="M26 76 a34 22 0 0 0 68 0z" fill="${BRUINS}"/>
        <ellipse cx="60" cy="88" rx="14" ry="8" fill="${CREME}"/>
        <ellipse cx="60" cy="76" rx="34" ry="22" fill="none" ${L}/>`)}
      ${leg('poot-lv', 40, 46)}${leg('poot-rv', 68, 74)}
      ${part('kop', 60, 62, `
        ${part('manen', 60, 24, `
          <path d="M44 30 q-12 14 -8 38 q6 -4 8 -14 q-2 -12 0 -24z" fill="${MANEN}" ${L}/>
          <path d="M40 30 q6 -18 20 -16 q14 -2 20 16 q-10 -6 -20 -4 q-10 -2 -20 4z" fill="${MANEN}" ${L}/>`)}
        ${part('oor-l', 48, 24, `<path d="M48 26 l-6 -16 l14 8z" fill="${BRUIN}" ${L}/><path d="M48 24 l-3 -8 l7 4z" fill="${ROZE}"/>`)}
        ${part('oor-r', 72, 24, `<path d="M72 26 l6 -16 l-14 8z" fill="${BRUIN}" ${L}/><path d="M72 24 l3 -8 l-7 4z" fill="${ROZE}"/>`)}
        <circle cx="60" cy="40" r="21" fill="${BRUIN}"/>
        <path d="M39 40 a21 21 0 0 0 42 0z" fill="${BRUINS}" opacity=".4"/>
        <circle cx="60" cy="40" r="21" fill="none" ${L}/>
        <path d="M50 22 q6 -4 10 6 q4 -8 12 -2 q-4 10 -11 10 q-8 0 -11 -14z" fill="${MANEN}" ${L}/>
        ${eye('oog-l', 51, 41, 6)}${eye('oog-r', 69, 41, 6)}
        <ellipse cx="60" cy="58" rx="14" ry="11" fill="${CREME}" ${L}/>
        <ellipse cx="54" cy="58" rx="2.6" ry="3.4" fill="${INK}"/><ellipse cx="66" cy="58" rx="2.6" ry="3.4" fill="${INK}"/>
        ${part('mond', 60, 64, `<path d="M54 64 q6 5 12 0" fill="none" ${L2}/>`)}`)}
    `);
  },

  idle(fig) {
    A.breathe(fig, 'lijf', 0.02, 3000);
    A.sway(fig, 'staart', 7, 2600);
    A.blinkLoop(fig, ['oog-l', 'oog-r']);
    A.occasionally(fig, [4000, 9000], () => {
      const r = Math.random();
      if (r < 0.3) A.wiggle(fig, Math.random() < 0.5 ? 'oor-l' : 'oor-r', 14, 2, 180);
      else if (r < 0.55) A.chew(fig, 'mond', 4);
      else if (r < 0.8) A.lookAt(fig, PUPILS, Math.random() * 2 - 1, Math.random() * 0.6 - 0.3, 1600);
      else A.wiggle(fig, 'manen', 5, 2, 220);
    });
  },

  async react(fig, ctx, tap, world) {
    const c = world.center(fig, 0.5, 0.95);
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    A.lookAt(fig, PUPILS, tap.x * 2, tap.y * 2, 800);
    ctx.sound('geluid-paard', ctx.audio.animals.paard);
    if (n % 2 === 1) {
      // Hinniken: kop omhoog, mond open, manen wapperen, lijf rekt iets uit
      await A.par(
        () => A.tilt(fig, 'kop', -16, 350, 700),
        () => A.mouth(fig, 'mond', 2.4, 900),
        () => A.wiggle(fig, 'manen', 8, 4, 140),
        () => run(fig, fig.svg, [{ transform: 'scale(1,1)' }, { transform: 'scale(.98,1.04)', offset: 0.3 }, { transform: 'scale(1,1)' }], { duration: 1000, easing: A.ease.out })
      );
      fig.later(() => ctx.say('paard', 'paard'), 100);
    } else {
      // Steigeren: lijf omhoog, voorpoten naar buiten en omhoog, kop omhoog, dan landen met stof
      const hold = (kf) => [{ transform: kf[0] }, { transform: kf[1], offset: 0.3 }, { transform: kf[1], offset: 0.65 }, { transform: kf[0] }];
      await A.par(
        () => run(fig, fig.svg, hold(['translateY(0) scale(1,1)', 'translateY(-12px) scale(1,1.06)']), { duration: 1100, easing: A.ease.out }),
        () => run(fig, fig.part('poot-lv'), hold(['rotate(0)', 'rotate(55deg)']), { duration: 1100, easing: A.ease.out }),
        () => run(fig, fig.part('poot-rv'), hold(['rotate(0)', 'rotate(-55deg)']), { duration: 1100, easing: A.ease.out }),
        () => A.tilt(fig, 'kop', -10, 350, 500),
        () => A.wiggle(fig, 'manen', 7, 4, 160)
      );
      fx.dust(c.x, c.y, 7);
      fig.later(() => ctx.say('paard', 'paard'), 100);
    }
  }
};
