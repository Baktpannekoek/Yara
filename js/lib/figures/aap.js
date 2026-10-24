/* De aap: rond lijf met lichte buik, twee korte benen, lange armen (arm-l, arm-r) met handen,
   krulstaart en een kop met flaporen, lichte snuit en een plukje haar. Rust: ademt, staart
   krult heen en weer, knippert, wiebelt af en toe met een oor of een arm. Tik: krabt zich op
   het hoofd en roept (mond open), of springt en klapt in zijn handen met noten. */

import { INK, L, L2, PAL, shade, part, eye, cheeks, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';
import { extraSounds } from '../../sounds-extra.js';

const BRUIN = PAL.bruin, BRUINS = shade(PAL.bruin, -0.16), HUID = '#ffe3c4', HUIDS = shade('#ffe3c4', -0.12), MOND = '#e0646a';

function leg(name, x, px) {
  return part(name, px, 92, `
    <rect x="${x}" y="90" width="13" height="18" rx="6" fill="${BRUIN}" ${L}/>
    <ellipse cx="${x + 7}" cy="108.5" rx="9" ry="3.8" fill="${HUID}" ${L2}/>`);
}

function arm(name, px, dir) {
  // dir -1 = linkerarm, 1 = rechterarm; hangt vanaf de schouder langs het lijf omlaag
  const hx = px + dir * 6;
  return part(name, px, 66, `
    <path d="M${px} 66 q${dir * 10} 18 ${dir * 6} 36" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>
    <path d="M${px} 66 q${dir * 10} 18 ${dir * 6} 36" fill="none" stroke="${BRUIN}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="${hx}" cy="103" r="6" fill="${HUID}" ${L2}/>`);
}

export const aap = {
  key: 'aap',
  svg() {
    return svgWrap(`
      ${shadow(60, 114, 30)}
      ${part('staart', 82, 88, `
        <path d="M82 88 q22 -2 20 -20 q-2 -12 -13 -9 q-7 3 -3 10" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
        <path d="M82 88 q22 -2 20 -20 q-2 -12 -13 -9 q-7 3 -3 10" fill="none" stroke="${BRUIN}" stroke-width="4.5" stroke-linecap="round"/>`)}
      ${leg('poot-l', 44, 50)}${leg('poot-r', 63, 70)}
      ${part('lijf', 60, 100, `
        <ellipse cx="60" cy="80" rx="24" ry="22" fill="${BRUIN}" ${L}/>
        <path d="M36 80 a24 22 0 0 0 48 0z" fill="${BRUINS}"/>
        <ellipse cx="60" cy="84" rx="14" ry="13" fill="${HUID}" ${L2}/>
        <ellipse cx="60" cy="80" rx="24" ry="22" fill="none" ${L}/>`)}
      ${part('kop', 60, 62, `
        ${part('oor-l', 42, 44, `<circle cx="38" cy="44" r="8" fill="${BRUIN}" ${L}/><circle cx="38" cy="44" r="4" fill="${HUID}"/>`)}
        ${part('oor-r', 78, 44, `<circle cx="82" cy="44" r="8" fill="${BRUIN}" ${L}/><circle cx="82" cy="44" r="4" fill="${HUID}"/>`)}
        <circle cx="60" cy="44" r="20" fill="${BRUIN}" ${L}/>
        <path d="M40 44 a20 20 0 0 0 40 0z" fill="${BRUINS}"/>
        <circle cx="60" cy="44" r="20" fill="none" ${L}/>
        <path d="M54 26 q2 -9 6 -4 q2 -7 6 0" fill="none" ${L2}/>
        <path d="M44 42 a8 8 0 0 1 16 0 a8 8 0 0 1 16 0 q0 18 -16 20 q-16 -2 -16 -20z" fill="${HUID}" ${L2}/>
        <path d="M46 50 q14 14 28 0 q-4 10 -14 11 q-10 -1 -14 -11z" fill="${HUIDS}"/>
        ${eye('oog-l', 52, 44, 5)}${eye('oog-r', 68, 44, 5)}
        ${cheeks(47, 73, 52, 3)}
        <circle cx="57.5" cy="52.5" r="1.4" fill="${INK}"/><circle cx="62.5" cy="52.5" r="1.4" fill="${INK}"/>
        ${part('mond', 60, 56, `<path d="M54 56 q6 1 12 0 q-6 6 -12 0z" fill="${MOND}" ${L2}/>`)}`)}
      ${arm('arm-l', 40, -1)}${arm('arm-r', 80, 1)}
    `);
  },

  idle(fig) {
    A.breathe(fig, 'lijf', 0.025, 2800);
    A.sway(fig, 'staart', 8, 2000);
    A.blinkLoop(fig, ['oog-l', 'oog-r']);
    A.occasionally(fig, [3500, 8000], () => {
      const r = Math.random();
      if (r < 0.3) A.wiggle(fig, Math.random() < 0.5 ? 'oor-l' : 'oor-r', 14, 2, 180);
      else if (r < 0.55) A.wiggle(fig, Math.random() < 0.5 ? 'arm-l' : 'arm-r', 6, 2, 240);
      else if (r < 0.75) A.tilt(fig, 'kop', Math.random() < 0.5 ? 8 : -8, 400, 500);
      else A.lookAt(fig, ['oog-l-pupil', 'oog-r-pupil'], Math.random() * 2 - 1, Math.random() * 0.6 - 0.3, 1600);
    });
  },

  async react(fig, ctx, tap, world) {
    const c = world.center(fig, 0.5, 0.95);
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    if (n % 2 === 1) {
      // Krabben op het hoofd en roepen: rechterarm omhoog, krabbelen, mond open, kop schuin
      ctx.sound('geluid-aap', extraSounds.aap);
      A.lookAt(fig, ['oog-l-pupil', 'oog-r-pupil'], 0.6, -0.8, 1000);
      await A.par(
        () => A.tween(fig, fig.part('arm-r'), [
          { transform: 'rotate(0)' }, { transform: 'rotate(150deg)', offset: 0.25 }, { transform: 'rotate(142deg)', offset: 0.4 },
          { transform: 'rotate(156deg)', offset: 0.55 }, { transform: 'rotate(142deg)', offset: 0.7 }, { transform: 'rotate(0)' }
        ], { duration: 1300, easing: A.ease.out }).finished.catch(() => {}),
        () => A.tilt(fig, 'kop', 10, 350, 600),
        () => A.mouth(fig, 'mond', 3, 900)
      );
      fig.later(() => ctx.say('aap', 'aap'), 100);
    } else {
      // Springen en klappen: hop, armen twee keer naar elkaar, noten en sterretjes
      ctx.sound('geluid-aap', extraSounds.aap);
      const top = world.center(fig, 0.5, 0.2);
      fx.notes(top.x, top.y, 3);
      const clap = (name, deg) => A.tween(fig, fig.part(name), [
        { transform: 'rotate(0)' }, { transform: `rotate(${deg}deg)`, offset: 0.25 }, { transform: 'rotate(0)', offset: 0.5 },
        { transform: `rotate(${deg}deg)`, offset: 0.75 }, { transform: 'rotate(0)' }
      ], { duration: 700, easing: 'ease-in-out' }).finished.catch(() => {});
      await A.par(
        () => A.hop(fig, 16, 700),
        () => clap('arm-l', -50),
        () => clap('arm-r', 50)
      );
      fx.dust(c.x, c.y, 5);
      fx.sparkles(top.x, top.y, 5);
      fig.later(() => ctx.say('aap', 'aap'), 150);
    }
  }
};
