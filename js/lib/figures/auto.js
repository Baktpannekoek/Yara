/* De auto: een blauwe auto van opzij, met twee wielen, raampjes, koplamp, achterlicht
   en een antenne met een balletje. Rust: de motor trilt zachtjes, de antenne wiebelt af en toe.
   Tik: toetert met knipperende koplamp en rijdt een stukje met stof achter de wielen,
   of stuitert twee keer op zijn vering. */

import { INK, L, L2, PAL, shade, part, shadow, svgWrap } from '../style.js';
import * as A from '../anim.js';
import * as fx from '../fx.js';
import { extraSounds } from '../../sounds-extra.js';

const BLAUW = PAL.blauw, BLAUWS = shade(PAL.blauw, -0.18), GRIJS = PAL.grijs, RAAM = '#e3f2fb';

function wheel(name, cx, cy, r) {
  return part(name, cx, cy, `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${INK}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.6}" fill="${GRIJS}" ${L2}/>
    <path d="M${cx} ${cy - r * 0.6} V${cy + r * 0.6} M${cx - r * 0.6} ${cy} H${cx + r * 0.6}" stroke="${INK}" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.2}" fill="${INK}"/>`);
}

/* Punt op de tekening dat meebeweegt als de auto rijdt (de svg verschuift, het vakje eromheen niet) */
function punt(fig, px, py) {
  const r = fig.svg.getBoundingClientRect();
  return { x: r.left + r.width * px, y: r.top + r.height * py };
}

const BODY = 'M10 100 V82 q0 -8 8 -8 H28 L40 54 H78 L94 74 H104 q8 0 8 8 V100 q0 4 -4 4 H14 q-4 0 -4 -4z';

export const auto = {
  key: 'auto',
  svg() {
    return svgWrap(`
      ${shadow(60, 112, 46, 5)}
      ${part('lijf', 60, 100, `
        <rect x="4" y="96" width="112" height="8" rx="3" fill="${GRIJS}" ${L2}/>
        <path d="${BODY}" fill="${BLAUW}" ${L}/>
        <path d="M10 88 H112 V100 q0 4 -4 4 H14 q-4 0 -4 -4z" fill="${BLAUWS}"/>
        <path d="${BODY}" fill="none" ${L}/>
        <path d="M33 72 L42 58 H57 V72z" fill="${RAAM}" ${L2}/>
        <path d="M61 58 H76 L88 72 H61z" fill="${RAAM}" ${L2}/>
        <path d="M59 74 V96" fill="none" ${L2}/>
        <rect x="62" y="80" width="7" height="3" rx="1.5" fill="${INK}"/>
        <path d="M16 93 H106" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>
        <rect x="8" y="80" width="6" height="7" rx="2" fill="${PAL.rood}" ${L2}/>
        ${part('antenne', 44, 54, `<path d="M44 54 L38 34" fill="none" ${L2}/><circle cx="38" cy="32" r="3.5" fill="${PAL.rood}" ${L2}/>`)}
        ${part('lamp', 109, 84, `<circle cx="109" cy="84" r="5" fill="${PAL.geel}" ${L2}/><circle cx="109" cy="84" r="2" fill="#fff"/>`)}`)}
      ${wheel('wiel-1', 32, 102, 10)}${wheel('wiel-2', 88, 102, 10)}
    `);
  },

  idle(fig) {
    // Motor die stationair draait: een heel klein, snel trillinkje
    A.bobLoop(fig, fig.part('lijf'), 0.6, 160, 'lijf');
    A.occasionally(fig, [5000, 10000], () => A.wiggle(fig, 'antenne', 8, 2, 220));
  },

  async react(fig, ctx, tap, world) {
    const n = (fig.reactCount = (fig.reactCount || 0) + 1);
    ctx.sound('geluid-auto', extraSounds.auto);
    if (n % 2 === 1) {
      // Toeteren: koplamp knippert, een stukje rijden met stof achter de wielen
      A.tween(fig, fig.part('lamp'), [{ transform: 'scale(1)' }, { transform: 'scale(1.7)' }, { transform: 'scale(1)' }], { duration: 260, iterations: 5 });
      const dustTimer = setInterval(() => { const q = punt(fig, 0.22, 0.95); fx.dust(q.x, q.y, 2); }, 180);
      const w = fig.el.getBoundingClientRect().width;
      await A.drive(fig, w * 0.4, 1500, ['wiel-1', 'wiel-2']);
      clearInterval(dustTimer);
      fig.later(() => ctx.say('auto', 'auto'), 100);
    } else {
      // Stuiteren op de vering: twee lage hupjes
      const c = world.center(fig, 0.5, 0.95);
      A.wiggle(fig, 'antenne', 16, 4, 180);
      await A.hop(fig, 7, 420);
      fx.dust(c.x, c.y, 4);
      await A.hop(fig, 4, 340);
      fig.later(() => ctx.say('auto', 'auto'), 100);
    }
  }
};
