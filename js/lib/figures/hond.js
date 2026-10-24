/* De hond: lijf met halsband, vier poten, kwispelstaart, kop met flaporen, vlek om het oog,
   snuit met neus en tong. Rust: ademt, kwispelt, knippert, wiebelt af en toe met een oor of
   de tong, kijkt rond. Tik: blaft (kop omhoog, mond open, oren flappen) of springt op met
   stof en hartjes. */

import { INK, L, L2, PAL, shade, part, eye, cheeks, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';

const BRUIN = PAL.bruin, BRUINS = shade(PAL.bruin, -0.16), DONKER = PAL.donkerbruin, CREME = PAL.creme, ROZE = PAL.roze, ROOD = PAL.rood;
const PUPILS = ['oog-l-pupil', 'oog-r-pupil'];

function leg(name, x, px) {
  return part(name, px, 88, `<rect x="${x}" y="86" width="13" height="26" rx="6" fill="${BRUIN}"/><rect x="${x}" y="104" width="13" height="8" rx="4" fill="${DONKER}"/><rect x="${x}" y="86" width="13" height="26" rx="6" fill="none" ${L}/>`);
}
const run = (fig, el, kf, opts) => { const a = A.tween(fig, el, kf, opts); return a ? a.finished.catch(() => {}) : Promise.resolve(); };

export const hond = {
  key: 'hond',
  svg() {
    return svgWrap(`
      ${shadow(60, 114, 36)}
      ${leg('poot-la', 30, 36)}${leg('poot-ra', 77, 83)}
      ${part('staart', 92, 76, `<path d="M92 76 q16 -6 14 -26" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M92 76 q16 -6 14 -26" fill="none" stroke="${BRUIN}" stroke-width="5" stroke-linecap="round"/><circle cx="106" cy="50" r="3" fill="${DONKER}"/>`)}
      ${part('lijf', 60, 110, `
        <ellipse cx="60" cy="86" rx="34" ry="24" fill="${BRUIN}"/>
        <path d="M26 86 a34 24 0 0 0 68 0z" fill="${BRUINS}"/>
        <ellipse cx="60" cy="82" rx="12" ry="11" fill="${CREME}"/>
        <path d="M74 68 q14 -4 18 10 q-10 6 -18 -2z" fill="${DONKER}"/>
        <ellipse cx="60" cy="86" rx="34" ry="24" fill="none" ${L}/>
        <path d="M38 66 q22 18 44 0" fill="none" stroke="${ROOD}" stroke-width="5" stroke-linecap="round"/>`)}
      ${leg('poot-lv', 42, 48)}${leg('poot-rv', 65, 71)}
      ${part('kop', 60, 66, `
        ${part('oor-l', 42, 30, `<path d="M42 30 q-16 10 -12 34 q10 4 14 -6 q2 -16 -2 -28z" fill="${DONKER}" ${L}/>`)}
        ${part('oor-r', 78, 30, `<path d="M78 30 q16 10 12 34 q-10 4 -14 -6 q-2 -16 2 -28z" fill="${DONKER}" ${L}/>`)}
        <circle cx="60" cy="48" r="24" fill="${BRUIN}"/>
        <path d="M36 48 a24 24 0 0 0 48 0z" fill="${BRUINS}" opacity=".4"/>
        <circle cx="71" cy="44" r="10" fill="${DONKER}"/>
        <circle cx="60" cy="48" r="24" fill="none" ${L}/>
        ${eye('oog-l', 50, 44, 6)}${eye('oog-r', 70, 44, 6)}
        ${cheeks(42, 78, 56, 4)}
        <ellipse cx="60" cy="60" rx="14" ry="10" fill="${CREME}" ${L}/>
        <ellipse cx="60" cy="55" rx="5.5" ry="4" fill="${INK}"/><circle cx="58" cy="54" r="1.4" fill="#fff" opacity=".8"/>
        <path d="M60 59 v3" fill="none" ${L2}/>
        ${part('tong', 65, 64, `<path d="M62 64 q0 9 4 9 q4 0 3 -9z" fill="${ROZE}" ${L2}/>`)}
        ${part('mond', 60, 62, `<path d="M53 62 q7 6 14 0" fill="none" ${L2}/>`)}`)}
    `);
  },

  idle(fig) {
    A.breathe(fig, 'lijf', 0.02, 2800);
    A.sway(fig, 'staart', 16, 650);
    A.blinkLoop(fig, ['oog-l', 'oog-r']);
    A.occasionally(fig, [3500, 8000], () => {
      const r = Math.random();
      if (r < 0.3) A.wiggle(fig, Math.random() < 0.5 ? 'oor-l' : 'oor-r', 14, 2, 180);
      else if (r < 0.55) A.lookAt(fig, PUPILS, Math.random() * 2 - 1, Math.random() * 0.6 - 0.3, 1600);
      else if (r < 0.8) A.tilt(fig, 'kop', Math.random() < 0.5 ? 8 : -8, 400, 500);
      else A.wiggle(fig, 'tong', 10, 3, 140);
    });
  },

  async react(fig, ctx, tap, world) {
    const c = world.center(fig, 0.5, 0.95);
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    A.lookAt(fig, PUPILS, tap.x * 2, tap.y * 2, 800);
    ctx.sound('geluid-hond', ctx.audio.animals.hond);
    if (n % 2 === 1) {
      // Blaffen: kop omhoog, mond open, oren flappen, staart kwispelt hard, lijfje veert
      await A.par(
        () => A.tilt(fig, 'kop', -12, 300, 600),
        () => A.mouth(fig, 'mond', 2.6, 800),
        () => A.flap(fig, 'oor-l', 22, 3, 150),
        () => A.flap(fig, 'oor-r', -22, 3, 150),
        () => A.wiggle(fig, 'staart', 24, 5, 120),
        () => run(fig, fig.svg, [{ transform: 'translateY(0)' }, { transform: 'translateY(-4px)', offset: 0.2 }, { transform: 'translateY(0)' }], { duration: 500, easing: A.ease.out })
      );
      fig.later(() => ctx.say('hond', 'hond'), 100);
    } else {
      // Opspringen: hoge sprong met kwispelende staart, stof bij de landing en hartjes
      const h = world.center(fig, 0.5, 0.3);
      await A.par(
        () => A.hop(fig, 24, 700),
        () => A.wiggle(fig, 'staart', 20, 4, 150),
        () => A.wiggle(fig, 'tong', 12, 4, 150)
      );
      fx.dust(c.x, c.y, 6);
      fx.hearts(h.x, h.y, 3);
      fig.later(() => ctx.say('hond', 'hond'), 150);
    }
  }
};
