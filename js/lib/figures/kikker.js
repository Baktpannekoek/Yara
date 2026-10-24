/* De kikker: hurkend groen lijf met lichte buik, grote ogen bovenop, brede glimlach, gevouwen
   achterpoten en korte voorpootjes met zwemvliezen. Rust: ademt, knippert, keel pulseert af en toe,
   kijkt rond. Tik: springt hoog en ver (weg en weer terug) met spetters, of blaast zijn wangen op
   en kwaakt. */

import { INK, L, L2, PAL, shade, part, eye, cheeks, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';

const GROEN = PAL.groen, GROENS = shade(PAL.groen, -0.16), DONKER = PAL.donkergroen, BUIK = '#eaf7d6';
const PUPILS = ['oog-l-pupil', 'oog-r-pupil'];
const run = (fig, el, kf, opts) => { const a = A.tween(fig, el, kf, opts); return a ? a.finished.catch(() => {}) : Promise.resolve(); };

/* Een dubbele lijn: eerst inkt, dan kleur, zodat tenen en pootjes een omlijning krijgen */
const strokes = (d, w) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 3.5}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${GROEN}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

function hind(name, cx, px, dir) {
  const tx = cx - dir * 8;
  const toes = `M${tx} 104 l${-12 * dir} 5 M${tx} 104 l${-3 * dir} 8 M${tx} 104 l${6 * dir} 7`;
  return part(name, px, 92, `
    ${strokes(toes, 3.5)}
    <ellipse cx="${cx}" cy="98" rx="14" ry="11" fill="${GROEN}"/>
    <path d="M${cx - 14} 98 a14 11 0 0 0 28 0z" fill="${GROENS}"/>
    <ellipse cx="${cx}" cy="98" rx="14" ry="11" fill="none" ${L}/>`);
}
function front(name, x) {
  return part(name, x, 98, strokes(`M${x} 98 v10 M${x} 108 l-6 3 M${x} 108 v4 M${x} 108 l6 3`, 4.5));
}

export const kikker = {
  key: 'kikker',
  svg() {
    return svgWrap(`
      ${shadow(60, 114, 42)}
      ${hind('poot-la', 28, 34, 1)}${hind('poot-ra', 92, 86, -1)}
      ${part('lijf', 60, 110, `
        <ellipse cx="60" cy="86" rx="36" ry="24" fill="${GROEN}"/>
        <path d="M24 86 a36 24 0 0 0 72 0z" fill="${GROENS}"/>
        ${part('keel', 60, 100, `<ellipse cx="60" cy="100" rx="20" ry="9" fill="${BUIK}"/>`)}
        <circle cx="34" cy="74" r="3" fill="${DONKER}"/><circle cx="86" cy="72" r="3.5" fill="${DONKER}"/><circle cx="60" cy="68" r="2.5" fill="${DONKER}"/><circle cx="44" cy="92" r="2" fill="${DONKER}"/><circle cx="78" cy="94" r="2.2" fill="${DONKER}"/>
        <ellipse cx="60" cy="86" rx="36" ry="24" fill="none" ${L}/>
        ${cheeks(34, 86, 86, 4.5)}
        ${part('mond', 60, 83, `<path d="M42 83 q18 12 36 0" fill="none" ${L}/>`)}`)}
      ${front('poot-lv', 46)}${front('poot-rv', 74)}
      ${part('kop', 60, 70, `
        <circle cx="44" cy="60" r="12" fill="${GROEN}" ${L}/><circle cx="76" cy="60" r="12" fill="${GROEN}" ${L}/>
        ${eye('oog-l', 44, 60, 8)}${eye('oog-r', 76, 60, 8)}`)}
    `);
  },

  idle(fig) {
    A.breathe(fig, 'lijf', 0.03, 2600);
    A.blinkLoop(fig, ['oog-l', 'oog-r']);
    A.occasionally(fig, [3500, 8000], () => {
      const r = Math.random();
      if (r < 0.4) A.lookAt(fig, PUPILS, Math.random() * 2 - 1, Math.random() * 0.6 - 0.3, 1600);
      else if (r < 0.75) run(fig, fig.part('keel'), [{ transform: 'scale(1)' }, { transform: 'scale(1.25,1.4)' }, { transform: 'scale(1)' }], { duration: 320, iterations: 2, easing: 'ease-in-out' });
      else A.tilt(fig, 'kop', Math.random() < 0.5 ? 6 : -6, 350, 400);
    });
  },

  async react(fig, ctx, tap, world) {
    const c = world.center(fig, 0.5, 0.95);
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    A.lookAt(fig, PUPILS, tap.x * 2, tap.y * 2, 800);
    ctx.sound('geluid-kikker', ctx.audio.animals.kikker);
    if (n % 2 === 1) {
      // Springen: hoog en ver opzij (weg van de tik) en weer terug, spetters bij elke landing
      const w = fig.el.getBoundingClientRect().width;
      const dx = (tap.x < 0 ? 1 : -1) * w * 0.7, h = w * 0.9;
      const leap = (x0, x1) => run(fig, fig.svg, [
        { transform: `translate(${x0}px,0) scale(1,1)` },
        { transform: `translate(${x0}px,0) scale(1.1,.86)`, offset: 0.14 },
        { transform: `translate(${(x0 + x1) / 2}px,${-h}px) scale(.94,1.1)`, offset: 0.5 },
        { transform: `translate(${x1}px,0) scale(1.1,.88)`, offset: 0.86 },
        { transform: `translate(${x1}px,0) scale(1,1)` }
      ], { duration: 700, easing: A.ease.out });
      fx.splash(c.x, c.y, 5);
      await leap(0, dx);
      fx.splash(c.x + dx, c.y, 6);
      await leap(dx, 0);
      fx.splash(c.x, c.y, 6);
      fig.later(() => ctx.say('kikker', 'kikker'), 100);
    } else {
      // Wangen opblazen en kwaken: lijf en keel zwellen op, mond open, ogen iets omhoog
      await A.par(
        () => run(fig, fig.part('lijf'), [{ transform: 'scale(1,1)' }, { transform: 'scale(1.14,1.12)', offset: 0.3 }, { transform: 'scale(1.14,1.12)', offset: 0.7 }, { transform: 'scale(1,1)' }], { duration: 1100, easing: A.ease.out }),
        () => run(fig, fig.part('keel'), [{ transform: 'scale(1)' }, { transform: 'scale(1.5,1.8)', offset: 0.3 }, { transform: 'scale(1.5,1.8)', offset: 0.7 }, { transform: 'scale(1)' }], { duration: 1100, easing: A.ease.out }),
        () => A.mouth(fig, 'mond', 1.7, 900),
        () => run(fig, fig.part('kop'), [{ transform: 'translateY(0)' }, { transform: 'translateY(-4px)', offset: 0.3 }, { transform: 'translateY(-4px)', offset: 0.7 }, { transform: 'translateY(0)' }], { duration: 1100, easing: A.ease.out })
      );
      fig.later(() => ctx.say('kikker', 'kikker'), 100);
    }
  }
};
