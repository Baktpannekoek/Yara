/* Het schaap: wollig lijf van cirkels, vier donkere pootjes, wolstaartje, zwart kopje met
   wolkuif, oren en grote ogen. Rust: ademt, knippert, kauwt af en toe, wiebelt met een oor.
   Tik: blaat met schuddende vacht, of maakt een sprong met stof. */

import { INK, L, PAL, shade, part, eye, cheeks, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';

const WOL = PAL.creme, WOLS = shade(PAL.creme, -0.12), DONKER = '#4d5467', DONKERS = shade('#4d5467', -0.22), LICHT = '#e4e8f0', ROZE = PAL.roze;
const PUPILS = ['oog-l-pupil', 'oog-r-pupil'];

function leg(name, x, px) {
  return part(name, px, 94, `<rect x="${x}" y="92" width="11" height="20" rx="5" fill="${DONKER}"/><rect x="${x}" y="106" width="11" height="6" rx="3" fill="${INK}"/><rect x="${x}" y="92" width="11" height="20" rx="5" fill="none" ${L}/>`);
}
const puff = (x, y, r, c, stroke = L) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${stroke}/>`;
const tuft = (stroke) => puff(51, 33, 7, WOL, stroke) + puff(60, 29, 8, WOL, stroke) + puff(69, 33, 7, WOL, stroke);

export const schaap = {
  key: 'schaap',
  svg() {
    return svgWrap(`
      ${shadow(60, 114, 36)}
      ${leg('poot-la', 33, 38)}${leg('poot-ra', 76, 81)}
      ${part('staart', 28, 76, puff(22, 72, 7, WOL))}
      ${part('lijf', 60, 110, `
        ${puff(32, 78, 11, WOL)}${puff(42, 67, 11, WOL)}${puff(56, 62, 11, WOL)}${puff(70, 63, 11, WOL)}${puff(82, 70, 11, WOL)}${puff(90, 82, 11, WOL)}
        ${puff(90, 94, 11, WOLS)}${puff(80, 102, 10, WOLS)}${puff(66, 106, 10, WOLS)}${puff(52, 106, 10, WOLS)}${puff(38, 101, 10, WOLS)}${puff(30, 90, 11, WOLS)}
        <ellipse cx="60" cy="86" rx="30" ry="20" fill="${WOL}"/>
        <path d="M30 86 a30 20 0 0 0 60 0z" fill="${WOLS}"/>`)}
      ${leg('poot-lv', 45, 50)}${leg('poot-rv', 64, 69)}
      ${part('kop', 60, 70, `
        ${part('oor-l', 42, 50, `<ellipse cx="34" cy="52" rx="10" ry="5" fill="${DONKER}" ${L} transform="rotate(-15 34 52)"/>`)}
        ${part('oor-r', 78, 50, `<ellipse cx="86" cy="52" rx="10" ry="5" fill="${DONKER}" ${L} transform="rotate(15 86 52)"/>`)}
        <circle cx="60" cy="50" r="20" fill="${DONKER}"/>
        <path d="M40 50 a20 20 0 0 0 40 0z" fill="${DONKERS}"/>
        <circle cx="60" cy="50" r="20" fill="none" ${L}/>
        ${tuft(L)}${tuft('')}
        ${eye('oog-l', 52, 49, 6.5)}${eye('oog-r', 68, 49, 6.5)}
        ${cheeks(46, 74, 58, 4)}
        <ellipse cx="60" cy="59" rx="3.5" ry="2.5" fill="${ROZE}"/>
        ${part('mond', 60, 63, `<path d="M55 63 q5 4 10 0" fill="none" stroke="${LICHT}" stroke-width="2" stroke-linecap="round"/>`)}`)}
    `);
  },

  idle(fig) {
    A.breathe(fig, 'lijf', 0.02, 3000);
    A.blinkLoop(fig, ['oog-l', 'oog-r']);
    A.occasionally(fig, [4000, 9000], () => {
      const r = Math.random();
      if (r < 0.3) A.wiggle(fig, Math.random() < 0.5 ? 'oor-l' : 'oor-r', 14, 2, 180);
      else if (r < 0.6) A.chew(fig, 'mond', 4);
      else if (r < 0.8) A.lookAt(fig, PUPILS, Math.random() * 2 - 1, Math.random() * 0.6 - 0.3, 1600);
      else A.wiggle(fig, 'staart', 12, 3, 150);
    });
  },

  async react(fig, ctx, tap, world) {
    const c = world.center(fig, 0.5, 0.95);
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    A.lookAt(fig, PUPILS, tap.x * 2, tap.y * 2, 800);
    ctx.sound('geluid-schaap', ctx.audio.animals.schaap);
    if (n % 2 === 1) {
      // Blaten: vacht schudt, mond open, kop omhoog, oren flappen
      await A.par(
        () => A.shake(fig, 'lijf', 5, 800),
        () => A.mouth(fig, 'mond', 2.6, 900),
        () => A.tilt(fig, 'kop', -10, 300, 600),
        () => A.flap(fig, 'oor-l', 16, 3, 160),
        () => A.flap(fig, 'oor-r', -16, 3, 160)
      );
      fig.later(() => ctx.say('schaap', 'schaap'), 100);
    } else {
      // Springen: een sprong met wapperende oren en staart, stof bij de landing
      await A.par(
        () => A.hop(fig, 20, 650),
        () => A.wiggle(fig, 'oor-l', 14, 3, 180),
        () => A.wiggle(fig, 'oor-r', -14, 3, 180),
        () => A.wiggle(fig, 'staart', 14, 3, 180)
      );
      fx.dust(c.x, c.y, 6);
      fig.later(() => ctx.say('schaap', 'schaap'), 150);
    }
  }
};
