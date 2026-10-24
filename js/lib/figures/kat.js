/* De kat: lijf met strepen en witte sokjes, vier poten, krulstaart, kop met puntoren, snorharen,
   roze neus. Rust: ademt, staart krult, knippert, wiebelt af en toe met een oor, kijkt rond.
   Tik: rekt zich uit (lijf langer, kop laag) en miauwt, of spint met gesloten ogen en hartjes. */

import { INK, L, L2, PAL, shade, part, eye, cheeks, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';

const GRIJS = PAL.grijs, GRIJSS = shade(PAL.grijs, -0.16), DONKER = shade(PAL.grijs, -0.42), CREME = PAL.creme, ROZE = PAL.roze;
const PUPILS = ['oog-l-pupil', 'oog-r-pupil'];
const TAIL = 'M90 84 q24 -2 22 -24 q-2 -10 -12 -8';

function leg(name, x, px) {
  return part(name, px, 88, `<rect x="${x}" y="86" width="13" height="26" rx="6" fill="${GRIJS}"/><rect x="${x}" y="104" width="13" height="8" rx="4" fill="${CREME}"/><rect x="${x}" y="86" width="13" height="26" rx="6" fill="none" ${L}/>`);
}
const run = (fig, el, kf, opts) => { const a = A.tween(fig, el, kf, opts); return a ? a.finished.catch(() => {}) : Promise.resolve(); };

export const kat = {
  key: 'kat',
  svg() {
    return svgWrap(`
      ${shadow(60, 114, 34)}
      ${leg('poot-la', 31, 37)}${leg('poot-ra', 76, 82)}
      ${part('staart', 90, 84, `<path d="${TAIL}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="${TAIL}" fill="none" stroke="${GRIJS}" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="52" r="3.5" fill="${DONKER}"/>`)}
      ${part('lijf', 60, 110, `
        <ellipse cx="60" cy="86" rx="32" ry="23" fill="${GRIJS}"/>
        <path d="M28 86 a32 23 0 0 0 64 0z" fill="${GRIJSS}"/>
        <ellipse cx="60" cy="82" rx="11" ry="10" fill="${CREME}"/>
        <path d="M31 78 q5 6 3 13 M89 76 q6 6 4 14" fill="none" stroke="${DONKER}" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="60" cy="86" rx="32" ry="23" fill="none" ${L}/>`)}
      ${leg('poot-lv', 43, 49)}${leg('poot-rv', 64, 70)}
      ${part('kop', 60, 66, `
        ${part('oor-l', 46, 36, `<path d="M44 38 l-8 -22 l22 10z" fill="${GRIJS}" ${L}/><path d="M45 35 l-5 -13 l13 6z" fill="${ROZE}"/>`)}
        ${part('oor-r', 74, 36, `<path d="M76 38 l8 -22 l-22 10z" fill="${GRIJS}" ${L}/><path d="M75 35 l5 -13 l-13 6z" fill="${ROZE}"/>`)}
        <circle cx="60" cy="50" r="23" fill="${GRIJS}"/>
        <path d="M37 50 a23 23 0 0 0 46 0z" fill="${GRIJSS}" opacity=".35"/>
        <circle cx="60" cy="50" r="23" fill="none" ${L}/>
        <path d="M54 31 v7 M60 29 v8 M66 31 v7" fill="none" stroke="${DONKER}" stroke-width="3" stroke-linecap="round"/>
        ${eye('oog-l', 50, 48, 6.5)}${eye('oog-r', 70, 48, 6.5)}
        ${cheeks(44, 76, 59, 4)}
        <path d="M56 56 h8 l-4 4z" fill="${ROZE}" ${L2}/>
        ${part('mond', 60, 60, `<path d="M60 60 v2 M54 62 q3 4 6 0 q3 4 6 0" fill="none" ${L2}/>`)}
        <path d="M28 54 l14 2 M28 61 l14 -2 M92 54 l-14 2 M92 61 l-14 -2" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`)}
    `);
  },

  idle(fig) {
    A.breathe(fig, 'lijf', 0.02, 3000);
    A.sway(fig, 'staart', 10, 2800);
    A.blinkLoop(fig, ['oog-l', 'oog-r']);
    A.occasionally(fig, [4000, 9000], () => {
      const r = Math.random();
      if (r < 0.3) A.wiggle(fig, Math.random() < 0.5 ? 'oor-l' : 'oor-r', 12, 2, 160);
      else if (r < 0.6) A.lookAt(fig, PUPILS, Math.random() * 2 - 1, Math.random() * 0.6 - 0.3, 1600);
      else if (r < 0.8) A.tilt(fig, 'kop', Math.random() < 0.5 ? 9 : -9, 400, 600);
      else A.wiggle(fig, 'staart', 8, 2, 320);
    });
  },

  async react(fig, ctx, tap, world) {
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    A.lookAt(fig, PUPILS, tap.x * 2, tap.y * 2, 800);
    ctx.sound('geluid-kat', ctx.audio.animals.kat);
    if (n % 2 === 1) {
      // Uitrekken: lijf langer en lager, kop zakt, mond open voor een miauw, staart omhoog
      await A.par(
        () => run(fig, fig.part('lijf'), [{ transform: 'scale(1,1)' }, { transform: 'scale(1.16,.86)', offset: 0.35 }, { transform: 'scale(1.16,.86)', offset: 0.7 }, { transform: 'scale(1,1)' }], { duration: 1200, easing: A.ease.out }),
        () => run(fig, fig.part('kop'), [{ transform: 'translateY(0) rotate(0)' }, { transform: 'translateY(9px) rotate(-6deg)', offset: 0.35 }, { transform: 'translateY(9px) rotate(-6deg)', offset: 0.7 }, { transform: 'translateY(0) rotate(0)' }], { duration: 1200, easing: A.ease.out }),
        () => A.mouth(fig, 'mond', 2.4, 700),
        () => A.tilt(fig, 'staart', 18, 400, 500)
      );
      fig.later(() => ctx.say('kat', 'kat'), 100);
    } else {
      // Spinnen: ogen dicht, kopje schuin, zacht trillen, hartjes
      const h = world.center(fig, 0.5, 0.25);
      fx.hearts(h.x, h.y, 4);
      const closed = [{ transform: 'scaleY(1)' }, { transform: 'scaleY(.1)', offset: 0.12 }, { transform: 'scaleY(.1)', offset: 0.85 }, { transform: 'scaleY(1)' }];
      await A.par(
        () => run(fig, fig.part('oog-l'), closed, { duration: 1400, easing: 'ease-in-out' }),
        () => run(fig, fig.part('oog-r'), closed, { duration: 1400, easing: 'ease-in-out' }),
        () => run(fig, fig.svg, [{ transform: 'rotate(0)' }, { transform: 'rotate(-1.5deg)' }, { transform: 'rotate(1.5deg)' }, { transform: 'rotate(0)' }], { duration: 180, iterations: 7 }),
        () => A.tilt(fig, 'kop', 10, 400, 700),
        () => A.wiggle(fig, 'staart', 12, 3, 300)
      );
      fig.later(() => ctx.say('kat', 'kat'), 100);
    }
  }
};
