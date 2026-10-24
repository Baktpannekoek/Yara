/* De olifant: dik lijf, vier stevige poten met teennagels, staartje, kop met grote flaporen
   (oor-l, oor-r), slagtandjes en een slurf als apart deel. Rust: ademt, slurf wiegt, knippert,
   flapt af en toe met een oor. Tik: tettert (slurf omhoog, oren flappen, spuit uit de slurf)
   of stampt (lage hop met veel stof). */

import { INK, L, L2, PAL, shade, part, eye, cheeks, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';
import { extraSounds } from '../../sounds-extra.js';

const GRIJS = '#a8bfd8', GRIJSS = shade(GRIJS, -0.16), ROZE = '#f6b7c6', CREME = PAL.creme;

function leg(name, x, px) {
  return part(name, px, 86, `
    <rect x="${x}" y="84" width="16" height="28" rx="7" fill="${GRIJS}" ${L}/>
    <path d="M${x} 100 h16 v5 a7 7 0 0 1 -7 7 h-2 a7 7 0 0 1 -7 -7z" fill="${GRIJSS}"/>
    <rect x="${x}" y="84" width="16" height="28" rx="7" fill="none" ${L}/>
    <circle cx="${x + 4}" cy="109.5" r="2.2" fill="${CREME}" ${L2}/><circle cx="${x + 8}" cy="110" r="2.2" fill="${CREME}" ${L2}/><circle cx="${x + 12}" cy="109.5" r="2.2" fill="${CREME}" ${L2}/>`);
}

export const olifant = {
  key: 'olifant',
  svg() {
    return svgWrap(`
      ${shadow(60, 114, 42)}
      ${leg('poot-la', 25, 33)}${leg('poot-ra', 79, 87)}
      ${part('staart', 97, 78, `<path d="M97 78 q10 6 6 20" fill="none" ${L}/><path d="M101 96 l4 4 M103 97 l-1 5 M103 98 l5 1" fill="none" ${L2}/>`)}
      ${part('lijf', 60, 110, `
        <ellipse cx="60" cy="84" rx="38" ry="26" fill="${GRIJS}" ${L}/>
        <path d="M22 84 a38 26 0 0 0 76 0z" fill="${GRIJSS}"/>
        <ellipse cx="60" cy="84" rx="38" ry="26" fill="none" ${L}/>`)}
      ${leg('poot-lv', 42, 50)}${leg('poot-rv', 62, 70)}
      ${part('kop', 60, 66, `
        ${part('oor-l', 42, 44, `<ellipse cx="31" cy="46" rx="14" ry="17" fill="${GRIJS}" ${L}/><ellipse cx="29" cy="47" rx="8" ry="11" fill="${ROZE}"/>`)}
        ${part('oor-r', 78, 44, `<ellipse cx="89" cy="46" rx="14" ry="17" fill="${GRIJS}" ${L}/><ellipse cx="91" cy="47" rx="8" ry="11" fill="${ROZE}"/>`)}
        <circle cx="60" cy="46" r="22" fill="${GRIJS}" ${L}/>
        <path d="M38 46 a22 22 0 0 0 44 0z" fill="${GRIJSS}"/>
        <circle cx="60" cy="46" r="22" fill="none" ${L}/>
        ${eye('oog-l', 51, 42, 5.5)}${eye('oog-r', 69, 42, 5.5)}
        ${cheeks(44, 76, 51, 3.5)}
        <ellipse cx="50" cy="63" rx="3" ry="5.5" fill="${CREME}" ${L2} transform="rotate(22 50 63)"/>
        <ellipse cx="70" cy="63" rx="3" ry="5.5" fill="${CREME}" ${L2} transform="rotate(-22 70 63)"/>
        ${part('slurf', 60, 58, `
          <path d="M60 56 q-3 18 5 30 q4 6 13 2" fill="none" stroke="${INK}" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M60 56 q-3 18 5 30 q4 6 13 2" fill="none" stroke="${GRIJS}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M53 64 h10 M52 73 h10 M55 82 h10" fill="none" stroke="${GRIJSS}" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="79" cy="88" r="2" fill="${INK}"/>`)}`)}
    `);
  },

  idle(fig) {
    A.breathe(fig, 'lijf', 0.02, 3400);
    A.sway(fig, 'staart', 10, 2400);
    A.sway(fig, 'slurf', 4, 2800);
    A.blinkLoop(fig, ['oog-l', 'oog-r']);
    A.occasionally(fig, [4000, 9000], () => {
      const r = Math.random();
      if (r < 0.4) A.wiggle(fig, Math.random() < 0.5 ? 'oor-l' : 'oor-r', 12, 2, 200);
      else if (r < 0.7) A.lookAt(fig, ['oog-l-pupil', 'oog-r-pupil'], Math.random() * 2 - 1, Math.random() * 0.6 - 0.3, 1600);
      else A.tilt(fig, 'kop', Math.random() < 0.5 ? 6 : -6, 400, 500);
    });
  },

  async react(fig, ctx, tap, world) {
    const c = world.center(fig, 0.5, 0.95);
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    A.lookAt(fig, ['oog-l-pupil', 'oog-r-pupil'], tap.x, tap.y, 900);
    if (n % 2 === 1) {
      // Tetteren: slurf omhoog zwaaien, oren flappen, spuit uit de slurf
      ctx.sound('geluid-olifant', extraSounds.olifant);
      fig.later(() => { const p = world.center(fig, 0.78, 0.36); fx.splash(p.x, p.y, 8); fx.steam(p.x, p.y, 2); }, 380);
      await A.par(
        () => A.tilt(fig, 'slurf', -75, 350, 750),
        () => A.tilt(fig, 'kop', -8, 350, 750),
        () => A.flap(fig, 'oor-l', 16, 4, 160),
        () => A.flap(fig, 'oor-r', 16, 4, 160)
      );
      fig.later(() => ctx.say('olifant', 'olifant'), 100);
    } else {
      // Stampen: lage hop met veel stof, twee keer
      ctx.sound('geluid-olifant', extraSounds.olifant);
      await A.hop(fig, 8, 420);
      fx.dust(c.x, c.y, 12);
      await A.hop(fig, 8, 420);
      fx.dust(c.x, c.y, 12);
      fig.later(() => ctx.say('olifant', 'olifant'), 150);
    }
  }
};
