/* Het mensfiguur: hoofd met haar, ogen en mond, romp, armen met handen, benen met schoenen.
   Uiterlijk (haar, huid, kleding, kapsel, bril, knotje, speen) komt uit een look-object, zodat
   mama, papa, opa, oma, baby en kindje dezelfde rig delen. Acties: springen, klappen, zwaaien,
   draaien, stampen, dansen, scheetje, boertje, giechelen. */

import { INK, L, L2, PAL, shade, part, eye, cheeks, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';
import { funSounds, moveSounds } from '../../sounds-more.js';

const DEFAULT_LOOK = { haar: '#8a5a3b', huid: '#ffd9b8', trui: '#f0766a', broek: '#7fc4ef', schoen: '#7d5236', kapsel: 'kort' };

function hair(look) {
  const H = look.haar, HS = shade(look.haar, -0.18);
  switch (look.kapsel) {
    case 'lang': return `<path d="M36 34 Q36 10 60 10 Q84 10 84 34 V56 Q80 60 76 54 L76 36 Q60 28 44 36 V54 Q40 60 36 56z" fill="${H}" ${L}/><path d="M44 36 Q60 28 76 36" fill="none" ${L2}/>`;
    case 'knot': return `<path d="M38 36 Q40 12 60 12 Q80 12 82 36 Q70 26 60 30 Q50 26 38 36z" fill="${H}" ${L}/><circle cx="60" cy="10" r="8" fill="${H}" ${L}/><circle cx="60" cy="10" r="3" fill="${HS}"/>`;
    case 'kaal': return `<path d="M40 34 Q46 20 60 18 Q74 20 80 34 Q72 28 60 28 Q48 28 40 34z" fill="${H}" ${L} opacity=".9"/>`;
    case 'pluk': return `<path d="M54 20 q4 -10 10 -6 q2 -8 8 -4 q-2 8 -8 10 q-4 2 -10 0z" fill="${H}" ${L}/>`;
    case 'krullen': return `<g fill="${H}" ${L}><circle cx="42" cy="34" r="8"/><circle cx="52" cy="22" r="9"/><circle cx="66" cy="20" r="9"/><circle cx="78" cy="32" r="8"/><circle cx="60" cy="30" r="9"/></g>`;
    default: return `<path d="M38 36 Q40 12 60 12 Q80 12 82 36 Q70 26 60 30 Q50 26 38 36z" fill="${H}" ${L}/><path d="M58 14 q0 -6 6 -6" fill="none" ${L2}/>`;
  }
}

function extras(look) {
  let s = '';
  if (look.bril) s += `<circle cx="51" cy="42" r="7" fill="none" ${L2}/><circle cx="69" cy="42" r="7" fill="none" ${L2}/><path d="M58 42 h4" ${L2}/>`;
  if (look.snor) s += `<path d="M52 52 q8 -4 16 0" fill="none" stroke="${shade(look.haar, -0.1)}" stroke-width="3" stroke-linecap="round"/>`;
  if (look.speen) s += `<circle cx="60" cy="54" r="5" fill="#f9a9c4" ${L2}/><circle cx="60" cy="54" r="2" fill="#fff"/>`;
  if (look.strik) s += `<path d="M70 18 l8 -6 v12z M70 18 l-8 -6 v12z" fill="#f9a9c4" ${L2}/>`;
  return s;
}

function build(look) {
  const T = look.trui, TS = shade(look.trui, -0.16), B = look.broek, BS = shade(look.broek, -0.16), S = look.schoen || '#7d5236', HUID = look.huid;
  return svgWrap(`
    ${shadow(60, 114, 24)}
    ${part('been-l', 52, 96, `<path d="M46 94 h12 v14 h-12z" fill="${B}" ${L}/><rect x="42" y="106" width="18" height="8" rx="4" fill="${S}" ${L}/>`)}
    ${part('been-r', 68, 96, `<path d="M62 94 h12 v14 h-12z" fill="${BS}" ${L}/><rect x="60" y="106" width="18" height="8" rx="4" fill="${S}" ${L}/>`)}
    ${part('romp', 60, 96, `
      <path d="M42 72 Q42 62 52 62 H68 Q78 62 78 72 V96 H42z" fill="${T}" ${L}/>
      <path d="M42 84 H78 V96 H42z" fill="${TS}"/><path d="M42 72 Q42 62 52 62 H68 Q78 62 78 72 V96 H42z" fill="none" ${L}/>
      <path d="M52 62 q8 8 16 0" fill="${HUID}" ${L}/>
      ${look.embleem ? `<path d="M60 76 l2.5 5.5 6 .5 -4.5 4 1.5 6 -5.5 -3 -5.5 3 1.5 -6 -4.5 -4 6 -.5z" fill="#ffd45c" ${L2}/>` : `<circle cx="60" cy="80" r="3" fill="${TS}"/>`}`)}
    ${part('arm-l', 44, 68, `<path d="M38 66 H48 L44 90 A4 4 0 0 1 36 90z" fill="${T}" ${L}/><circle cx="40" cy="93" r="5" fill="${HUID}" ${L}/>`)}
    ${part('arm-r', 76, 68, `<path d="M72 66 H82 L84 90 A4 4 0 0 1 76 90z" fill="${TS}" ${L}/><circle cx="80" cy="93" r="5" fill="${HUID}" ${L}/>`)}
    ${part('hoofd', 60, 60, `
      <circle cx="42" cy="44" r="4" fill="${HUID}" ${L}/><circle cx="78" cy="44" r="4" fill="${HUID}" ${L}/>
      <circle cx="60" cy="40" r="22" fill="${HUID}" ${L}/>
      ${hair(look)}
      ${eye('oog-l', 51, 42, 5)}${eye('oog-r', 69, 42, 5)}
      ${cheeks(46, 74, 50, 3.5)}
      ${part('mond', 60, 53, `<path d="M54 53 q6 6 12 0" fill="none" ${L2}/>`)}
      ${extras(look)}`)}
  `);
}

/* Maak een mensfiguur met een eigen uiterlijk. key wordt ook de opnamesleutel (mama, papa, ...). */
export function persoon(key, name, lookIn = {}, opts = {}) {
  const look = { ...DEFAULT_LOOK, ...lookIn };
  const scale = opts.scale || 1;

  const def = {
    key, name, look,
    svg() {
      const inner = build(look);
      if (scale === 1) return inner;
      // Kleinere mensen (baby, kindje): tekening schalen vanaf de voeten
      return inner.replace(/^<svg[^>]*>/, (m) => m + `<g transform="translate(${60 - 60 * scale} ${114 - 114 * scale}) scale(${scale})">`).replace('</svg>', '</g></svg>');
    },
    idle(fig) {
      A.breathe(fig, 'romp', 0.02, 2800);
      A.blinkLoop(fig, ['oog-l', 'oog-r']);
      A.sway(fig, 'arm-l', 3, 3000);
      A.sway(fig, 'arm-r', -3, 3200);
      A.occasionally(fig, [4000, 9000], () => {
        const r = Math.random();
        if (r < 0.5) A.lookAt(fig, ['oog-l-pupil', 'oog-r-pupil'], Math.random() * 2 - 1, Math.random() * 0.6 - 0.3, 1600);
        else A.tilt(fig, 'hoofd', Math.random() < 0.5 ? 6 : -6, 500, 600);
      });
    },
    actions: {
      async spring(fig, ctx, world) {
        const c = world.center(fig, 0.5, 0.95);
        ctx.sound('fx-sprong', funSounds.sprong);
        await A.par(
          () => A.hop(fig, 20, 700),
          () => A.tilt(fig, 'arm-l', -150, 250, 300),
          () => A.tilt(fig, 'arm-r', 150, 250, 300)
        );
        fx.dust(c.x, c.y, 6);
      },
      async klap(fig, ctx, world) {
        const c = world.center(fig, 0.5, 0.75);
        ctx.sound('fx-klap', moveSounds.klap);
        fx.sparkles(c.x, c.y, 6);
        await A.par(
          () => A.tween(fig, fig.part('arm-l'), [{ transform: 'rotate(0)' }, { transform: 'rotate(-75deg)' }, { transform: 'rotate(-45deg)' }, { transform: 'rotate(-75deg)' }, { transform: 'rotate(0)' }], { duration: 800, easing: 'ease-in-out' }).finished.catch(() => {}),
          () => A.tween(fig, fig.part('arm-r'), [{ transform: 'rotate(0)' }, { transform: 'rotate(75deg)' }, { transform: 'rotate(45deg)' }, { transform: 'rotate(75deg)' }, { transform: 'rotate(0)' }], { duration: 800, easing: 'ease-in-out' }).finished.catch(() => {})
        );
      },
      async zwaai(fig, ctx, world) {
        await A.par(
          () => A.tween(fig, fig.part('arm-r'), [{ transform: 'rotate(0)' }, { transform: 'rotate(160deg)', offset: 0.25 }, { transform: 'rotate(190deg)', offset: 0.45 }, { transform: 'rotate(160deg)', offset: 0.65 }, { transform: 'rotate(185deg)', offset: 0.85 }, { transform: 'rotate(0)' }], { duration: 1100, easing: 'ease-in-out' }).finished.catch(() => {}),
          () => A.mouth(fig, 'mond', 1.8, 600)
        );
      },
      async draai(fig, ctx, world) {
        ctx.sound('fx-draai', moveSounds.draai);
        await A.par(
          () => A.tween(fig, fig.svg, [{ transform: 'scaleX(1)' }, { transform: 'scaleX(.1)', offset: 0.25 }, { transform: 'scaleX(-1)', offset: 0.5 }, { transform: 'scaleX(.1)', offset: 0.75 }, { transform: 'scaleX(1)' }], { duration: 1000, easing: 'ease-in-out' }).finished.catch(() => {}),
          () => A.tilt(fig, 'arm-l', -150, 300, 400),
          () => A.tilt(fig, 'arm-r', 150, 300, 400)
        );
      },
      async stamp(fig, ctx, world) {
        const c = world.center(fig, 0.5, 0.95);
        ctx.sound('fx-stamp', moveSounds.stamp);
        await A.seq(
          () => A.tilt(fig, 'been-l', 38, 180, 60).then(() => fx.dust(c.x - 10, c.y, 4)),
          () => A.tilt(fig, 'been-r', -38, 180, 60).then(() => fx.dust(c.x + 10, c.y, 4))
        );
      },
      async dans(fig, ctx, world) {
        const c = world.center(fig, 0.5, 0.3);
        fx.notes(c.x, c.y, 3);
        await A.par(
          () => A.tween(fig, fig.svg, [{ transform: 'rotate(-6deg) translateY(0)' }, { transform: 'rotate(6deg) translateY(-4px)' }, { transform: 'rotate(-6deg) translateY(0)' }], { duration: 500, iterations: 3, easing: 'ease-in-out' }).finished.catch(() => {}),
          () => A.wiggle(fig, 'arm-l', -40, 3, 500),
          () => A.wiggle(fig, 'arm-r', 40, 3, 500)
        );
      },
      async scheetje(fig, ctx, world) {
        const c = world.center(fig, 0.3, 0.8);
        ctx.sound('fx-scheetje', funSounds.scheetje);
        fx.dust(c.x, c.y, 5);
        await A.par(() => A.shake(fig, null, 5, 600), () => A.tween(fig, fig.part('hoofd'), [{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(0)' }], { duration: 600 }).finished.catch(() => {}));
      },
      async boertje(fig, ctx, world) {
        ctx.sound('fx-boertje', funSounds.boertje);
        await A.par(() => A.tilt(fig, 'hoofd', -12, 200, 500), () => A.mouth(fig, 'mond', 2.4, 700), () => A.tween(fig, fig.part('romp'), [{ transform: 'scale(1,1)' }, { transform: 'scale(1.08,1.05)', offset: 0.3 }, { transform: 'scale(1,1)' }], { duration: 700 }).finished.catch(() => {}));
      },
      async giechel(fig, ctx, world) {
        const c = world.center(fig, 0.5, 0.3);
        ctx.sound('fx-giechel', funSounds.giechel);
        fx.hearts(c.x, c.y, 3);
        await A.par(
          () => A.tween(fig, fig.svg, [{ transform: 'translateY(0) scale(1,1)' }, { transform: 'translateY(-3px) scale(1.03,.97)' }, { transform: 'translateY(0) scale(1,1)' }], { duration: 220, iterations: 4, easing: 'ease-in-out' }).finished.catch(() => {}),
          () => A.mouth(fig, 'mond', 1.8, 900)
        );
      }
    },
    async react(fig, ctx, tap, world) {
      const names = Object.keys(def.actions);
      const pick = names[Math.floor(Math.random() * names.length)];
      await def.actions[pick](fig, ctx, world);
      fig.later(() => ctx.say(key, (key === 'yara' && ctx.childName) || name), 100);
      return pick;
    }
  };
  return def;
}

/* De vaste bewoners */
export const PERSONEN = {
  mama:   persoon('mama', 'mama', { haar: '#8a5a3b', huid: '#ffd9b8', trui: '#f9a9c4', broek: '#7fc4ef', kapsel: 'lang' }),
  papa:   persoon('papa', 'papa', { haar: '#5a3a26', huid: '#ffd9b8', trui: '#7fc4ef', broek: '#2f3542', kapsel: 'kort' }),
  opa:    persoon('opa', 'opa', { haar: '#d5d9e0', huid: '#f2c0a0', trui: '#8fd27a', broek: '#7d5236', kapsel: 'kaal', bril: true, snor: true }),
  oma:    persoon('oma', 'oma', { haar: '#eceff3', huid: '#ffe1c9', trui: '#c9b1f2', broek: '#a9733f', kapsel: 'knot', bril: true }),
  baby:   persoon('baby', 'baby', { haar: '#f2c14e', huid: '#ffe1c9', trui: '#fff4dc', broek: '#f9a9c4', kapsel: 'pluk', speen: true }, { scale: 0.7 }),
  kindje: persoon('kindje', 'kindje', { haar: '#2e2a2a', huid: '#c68642', trui: '#ffd45c', broek: '#7fc4ef', kapsel: 'krullen', embleem: true }, { scale: 0.86 }),
  yara:   persoon('yara', 'Yara', { haar: '#8a5a3b', huid: '#ffd9b8', trui: '#f0766a', broek: '#7fc4ef', kapsel: 'kort', embleem: true, strik: true }, { scale: 0.86 })
};
