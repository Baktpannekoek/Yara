/* De giraf: lijf met vlekken, vier lange poten, staart met kwastje en een lange nek als apart
   deel (draaipunt onderaan bij het lijf) met manen, en daarop de kop met hoorntjes, oren en
   lichte snuit. Rust: ademt, nek wiegt heel zacht, staart zwaait, knippert, kauwt af en toe.
   Tik: buigt de nek naar beneden en kauwt alsof ze eet, of zwaait met de nek heen en weer en knikt. */

import { INK, L, L2, PAL, shade, part, eye, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';
import { extraSounds } from '../../sounds-extra.js';

const GEEL = '#f8cc62', GEELS = shade('#f8cc62', -0.16), VLEK = PAL.bruin, DONKER = PAL.donkerbruin, CREME = PAL.creme;

function leg(name, x, px) {
  return part(name, px, 84, `
    <rect x="${x}" y="82" width="11" height="30" rx="5" fill="${GEEL}" ${L}/>
    <circle cx="${x + 5.5}" cy="92" r="2.4" fill="${VLEK}"/>
    <rect x="${x}" y="104" width="11" height="8" rx="4" fill="${INK}"/>`);
}

export const giraf = {
  key: 'giraf',
  svg() {
    return svgWrap(`
      ${shadow(60, 114, 36)}
      ${leg('poot-la', 30, 35.5)}${leg('poot-ra', 72, 77.5)}
      ${part('staart', 28, 72, `
        <path d="M28 72 q-12 8 -8 26" fill="none" ${L}/>
        <ellipse cx="20" cy="99" rx="3.5" ry="5.5" fill="${DONKER}" ${L2} transform="rotate(-15 20 99)"/>`)}
      ${part('lijf', 56, 98, `
        <ellipse cx="56" cy="80" rx="30" ry="18" fill="${GEEL}" ${L}/>
        <path d="M26 80 a30 18 0 0 0 60 0z" fill="${GEELS}"/>
        <circle cx="40" cy="76" r="5" fill="${VLEK}"/><circle cx="54" cy="70" r="4.5" fill="${VLEK}"/><circle cx="66" cy="84" r="5" fill="${VLEK}"/>
        <circle cx="48" cy="88" r="4" fill="${VLEK}"/><circle cx="74" cy="74" r="3.5" fill="${VLEK}"/><circle cx="60" cy="93" r="3" fill="${VLEK}"/>
        <ellipse cx="56" cy="80" rx="30" ry="18" fill="none" ${L}/>`)}
      ${leg('poot-lv', 41, 46.5)}${leg('poot-rv', 60, 65.5)}
      ${part('nek', 76, 70, `
        <circle cx="70" cy="68" r="3.2" fill="${DONKER}" ${L2}/><circle cx="72" cy="60" r="3.2" fill="${DONKER}" ${L2}/><circle cx="73.5" cy="52" r="3.2" fill="${DONKER}" ${L2}/>
        <circle cx="75" cy="44" r="3.2" fill="${DONKER}" ${L2}/><circle cx="76.5" cy="36" r="3.2" fill="${DONKER}" ${L2}/>
        <path d="M76 72 L84 30" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round"/>
        <path d="M76 72 L84 30" fill="none" stroke="${GEEL}" stroke-width="14" stroke-linecap="round"/>
        <circle cx="76" cy="61" r="3" fill="${VLEK}"/><circle cx="83" cy="50" r="3" fill="${VLEK}"/><circle cx="80" cy="40" r="2.8" fill="${VLEK}"/>
        ${part('kop', 84, 32, `
          <path d="M80 18 l-2 -9 M90 18 l2 -9" fill="none" ${L}/>
          <circle cx="78" cy="8" r="3.5" fill="${VLEK}" ${L2}/><circle cx="92" cy="8" r="3.5" fill="${VLEK}" ${L2}/>
          ${part('oor-l', 74, 22, `<ellipse cx="69" cy="20" rx="7" ry="3.5" fill="${GEEL}" ${L} transform="rotate(-30 69 20)"/>`)}
          ${part('oor-r', 98, 21, `<ellipse cx="102" cy="18" rx="7" ry="3.5" fill="${GEEL}" ${L} transform="rotate(30 102 18)"/>`)}
          <ellipse cx="86" cy="27" rx="15" ry="12" fill="${GEEL}" ${L}/>
          <path d="M71 27 a15 12 0 0 0 30 0z" fill="${GEELS}"/>
          <circle cx="80" cy="18.5" r="2.4" fill="${VLEK}"/>
          <ellipse cx="86" cy="27" rx="15" ry="12" fill="none" ${L}/>
          <ellipse cx="96" cy="33" rx="9" ry="6" fill="${CREME}" ${L2}/>
          <circle cx="94" cy="31" r="1.2" fill="${INK}"/><circle cx="99" cy="31" r="1.2" fill="${INK}"/>
          ${eye('oog-l', 79, 25, 4.5)}${eye('oog-r', 90, 23, 4.5)}
          <circle cx="75" cy="31" r="2.8" fill="#f9a9c4" opacity=".75"/>
          ${part('mond', 97, 36, `<path d="M93 36 q4 3 8 0" fill="none" ${L2}/>`)}`)}`)}
    `);
  },

  idle(fig) {
    A.breathe(fig, 'lijf', 0.02, 3200);
    A.sway(fig, 'staart', 10, 2400);
    A.sway(fig, 'nek', 1.5, 3600);
    A.blinkLoop(fig, ['oog-l', 'oog-r']);
    A.occasionally(fig, [4000, 9000], () => {
      const r = Math.random();
      if (r < 0.3) A.wiggle(fig, Math.random() < 0.5 ? 'oor-l' : 'oor-r', 16, 2, 180);
      else if (r < 0.6) A.chew(fig, 'mond', 3);
      else if (r < 0.8) A.tilt(fig, 'kop', Math.random() < 0.5 ? 6 : -6, 400, 500);
      else A.lookAt(fig, ['oog-l-pupil', 'oog-r-pupil'], Math.random() * 2 - 1, Math.random() * 0.6 - 0.3, 1600);
    });
  },

  async react(fig, ctx, tap, world) {
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    if (n % 2 === 1) {
      // Eten: nek naar beneden buigen, kop iets omhoog, kauwen en weer omhoog
      ctx.sound('geluid-giraf', extraSounds.giraf);
      fig.later(() => { const p = world.center(fig, 0.95, 0.5); fx.sparkles(p.x, p.y, 4, '#8fd27a'); }, 500);
      await A.par(
        () => A.tilt(fig, 'nek', 55, 500, 800),
        () => A.tilt(fig, 'kop', 12, 500, 800),
        () => A.seq(() => A.wait(450), () => A.chew(fig, 'mond', 3))
      );
      fig.later(() => ctx.say('giraf', 'giraf'), 100);
    } else {
      // Zwaaien met de nek en knikken met de kop
      ctx.sound('geluid-giraf', extraSounds.giraf);
      A.lookAt(fig, ['oog-l-pupil', 'oog-r-pupil'], tap.x, tap.y, 1000);
      await A.par(
        () => A.wiggle(fig, 'nek', 9, 3, 420),
        () => A.seq(() => A.wait(200), () => A.wiggle(fig, 'kop', 12, 3, 300))
      );
      fig.later(() => ctx.say('giraf', 'giraf'), 100);
    }
  }
};
