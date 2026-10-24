/* Het varken: dik roze lijf, vier poten met hoefjes, krulstaart, kop met flaporen, grote ogen,
   snuit met neusgaten. Rust: ademt, staart wiebelt, knippert, wiebelt af en toe met snuit of oor.
   Tik: knort met wiebelende snuit en rolt heen en weer met stof, of maakt een sprong. */

import { INK, L, L2, PAL, shade, part, eye, cheeks, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';

const ROZE = PAL.roze, ROZES = shade(PAL.roze, -0.16), SNUIT = '#f58cae', SNUITS = shade('#f58cae', -0.2);
const PUPILS = ['oog-l-pupil', 'oog-r-pupil'];
const TAIL = 'M93 80 q12 -8 6 -16 q-6 -4 -5 4 q1 7 9 1';

function leg(name, x, px) {
  return part(name, px, 90, `<rect x="${x}" y="88" width="13" height="24" rx="6" fill="${ROZE}"/><rect x="${x}" y="104" width="13" height="8" rx="4" fill="${INK}"/><rect x="${x}" y="88" width="13" height="24" rx="6" fill="none" ${L}/>`);
}

export const varken = {
  key: 'varken',
  svg() {
    return svgWrap(`
      ${shadow(60, 114, 38)}
      ${leg('poot-la', 30, 36)}${leg('poot-ra', 77, 83)}
      ${part('staart', 93, 80, `<path d="${TAIL}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="${TAIL}" fill="none" stroke="${ROZE}" stroke-width="3.5" stroke-linecap="round"/>`)}
      ${part('lijf', 60, 110, `
        <ellipse cx="60" cy="86" rx="36" ry="25" fill="${ROZE}"/>
        <path d="M24 86 a36 25 0 0 0 72 0z" fill="${ROZES}"/>
        <ellipse cx="60" cy="86" rx="36" ry="25" fill="none" ${L}/>`)}
      ${leg('poot-lv', 42, 48)}${leg('poot-rv', 65, 71)}
      ${part('kop', 60, 64, `
        ${part('oor-l', 44, 32, `<path d="M46 34 q-14 -14 -8 -24 q10 4 14 20z" fill="${ROZE}" ${L}/><path d="M46 32 q-8 -10 -5 -16 q5 4 8 14z" fill="${SNUIT}"/>`)}
        ${part('oor-r', 76, 32, `<path d="M74 34 q14 -14 8 -24 q-10 4 -14 20z" fill="${ROZE}" ${L}/><path d="M74 32 q8 -10 5 -16 q-5 4 -8 14z" fill="${SNUIT}"/>`)}
        <circle cx="60" cy="48" r="24" fill="${ROZE}"/>
        <path d="M36 48 a24 24 0 0 0 48 0z" fill="${ROZES}" opacity=".4"/>
        <circle cx="60" cy="48" r="24" fill="none" ${L}/>
        ${eye('oog-l', 50, 41, 6)}${eye('oog-r', 70, 41, 6)}
        ${cheeks(41, 79, 54, 4.5)}
        ${part('snuit', 60, 58, `<ellipse cx="60" cy="58" rx="14" ry="9" fill="${SNUIT}" ${L}/><ellipse cx="54" cy="58" rx="2.6" ry="3.4" fill="${SNUITS}"/><ellipse cx="66" cy="58" rx="2.6" ry="3.4" fill="${SNUITS}"/>`)}
        ${part('mond', 60, 69, `<path d="M54 69 q6 4 12 0" fill="none" ${L2}/>`)}`)}
    `);
  },

  idle(fig) {
    A.breathe(fig, 'lijf', 0.02, 2800);
    A.sway(fig, 'staart', 14, 1600);
    A.blinkLoop(fig, ['oog-l', 'oog-r']);
    A.occasionally(fig, [3500, 8000], () => {
      const r = Math.random();
      if (r < 0.35) A.wiggle(fig, 'snuit', 8, 3, 110);
      else if (r < 0.6) A.wiggle(fig, Math.random() < 0.5 ? 'oor-l' : 'oor-r', 14, 2, 180);
      else if (r < 0.8) A.lookAt(fig, PUPILS, Math.random() * 2 - 1, Math.random() * 0.6 - 0.3, 1600);
      else A.tilt(fig, 'kop', Math.random() < 0.5 ? 8 : -8, 400, 500);
    });
  },

  async react(fig, ctx, tap, world) {
    const c = world.center(fig, 0.5, 0.95);
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    A.lookAt(fig, PUPILS, tap.x * 2, tap.y * 2, 800);
    ctx.sound('geluid-varken', ctx.audio.animals.varken);
    if (n % 2 === 1) {
      // Knorren en rollen: snuit wiebelt, mond open, hele varken schudt heen en weer, stof
      fx.dust(c.x, c.y, 4);
      await A.par(
        () => A.wiggle(fig, 'snuit', 12, 5, 110),
        () => A.mouth(fig, 'mond', 2.2, 700),
        () => A.shake(fig, null, 9, 800),
        () => A.wiggle(fig, 'staart', 20, 4, 150)
      );
      fx.dust(c.x, c.y, 5);
      fig.later(() => ctx.say('varken', 'varken'), 100);
    } else {
      // Springen: een sprong met flappende oren, stof bij de landing
      await A.par(
        () => A.hop(fig, 18, 650),
        () => A.wiggle(fig, 'oor-l', 16, 3, 150),
        () => A.wiggle(fig, 'oor-r', -16, 3, 150)
      );
      fx.dust(c.x, c.y, 6);
      fig.later(() => ctx.say('varken', 'varken'), 150);
    }
  }
};
