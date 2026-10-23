/* Extra tekeningen voor de beweegscene, de stickers, de muziekinstrumenten en het liedje over de paddenstoel.
   Zelfde stijl als art.js en art-extra.js: platte, ronde, vriendelijke vormen in een viewBox van 0 0 100 100.
   De helpers staan hier nog een keer, want de andere bestanden exporteren ze niet. */

const INK = '#3b4252';
const SW = 'stroke="#3b4252" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';

/* Zelfde lijn als SW, maar met een andere dikte. Een attribuut mag maar één keer in een element staan. */
function stroke(w) {
  return `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
}

function svg(inner, extra = '') {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" ${extra}>${inner}</svg>`;
}

function eyes(lx, rx, y, r = 3.6) {
  return `<circle cx="${lx}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${rx}" cy="${y}" r="${r}" fill="${INK}"/>
  <circle cx="${lx + 1.2}" cy="${y - 1.2}" r="1.1" fill="#fff"/><circle cx="${rx + 1.2}" cy="${y - 1.2}" r="1.1" fill="#fff"/>`;
}
function smile(x, y, w = 8) {
  return `<path d="M${x - w / 2} ${y} q${w / 2} ${w * 0.7} ${w} 0" fill="none" ${SW}/>`;
}
function cheeks(lx, rx, y) {
  return `<circle cx="${lx}" cy="${y}" r="4" fill="#f7a8c4" opacity=".7"/><circle cx="${rx}" cy="${y}" r="4" fill="#f7a8c4" opacity=".7"/>`;
}

/* Een ster met vijf punten als pad. R is de buitenste straal, r de binnenste. */
function starPath(cx, cy, R, r) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? R : r;
    pts.push(`${(cx + Math.cos(a) * rad).toFixed(1)} ${(cy + Math.sin(a) * rad).toFixed(1)}`);
  }
  return `M${pts.join(' L')}z`;
}

/* Een hartje, dezelfde vorm als het hart in art.js maar kleiner. Bij s = 1 is het 68 breed. */
function heartPath(cx, cy, s) {
  const r = (20 * s).toFixed(1);
  const f = (v) => v.toFixed(1);
  return `M${cx} ${f(cy + 30 * s)} L${f(cx - 34 * s)} ${f(cy - 4 * s)} A${r} ${r} 0 0 1 ${cx} ${f(cy - 30 * s)} A${r} ${r} 0 0 1 ${f(cx + 34 * s)} ${f(cy - 4 * s)}z`;
}

/* Een bloemetje met vijf ronde blaadjes rond een hartje */
function flower(cx, cy, r, color, heart = '#ffd66b') {
  const petals = [];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
    petals.push(`<circle cx="${(cx + Math.cos(a) * r).toFixed(1)}" cy="${(cy + Math.sin(a) * r).toFixed(1)}" r="${(r * 0.75).toFixed(1)}"/>`);
  }
  return `<g fill="${color}" ${SW}>${petals.join('')}</g><circle cx="${cx}" cy="${cy}" r="${(r * 0.6).toFixed(1)}" fill="${heart}" ${SW}/>`;
}

/* Een klein muzieknootje, voor bij de instrumenten */
function noteMark(x, y, color) {
  return `<ellipse cx="${x}" cy="${y}" rx="3.6" ry="2.6" fill="${color}" ${SW} transform="rotate(-20 ${x} ${y})"/>
    <path d="M${x + 3} ${y - 1} V${y - 13} q6 1 7 6" fill="none" ${stroke(2)}/>`;
}

/* Een lijn met een gekleurde vulling en een inktrand eromheen: eerst dik in inkt, dan dunner in kleur */
function tube(d, w, color) {
  return `<path d="${d}" fill="none" ${stroke(w + 4)}/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/* ---------- Het kind ----------
   Elk lichaamsdeel staat in een eigen groep met een data-part. Elke groep begint bovenaan bij het draaipunt:
   de schouder voor een arm, de heup voor een been. De CSS draait de groep om dat bovenste punt. */

const TRUI = '#f28b82';
const BROEK = '#8fcbea';
const HUID = '#ffd9b8';
const HAAR = '#8a5a3b';
const SCHOEN = '#8a5a3b';

function kidHead() {
  return `<g data-part="hoofd">
    <circle cx="34" cy="29" r="3.5" fill="${HUID}" ${SW}/><circle cx="66" cy="29" r="3.5" fill="${HUID}" ${SW}/>
    <circle cx="50" cy="28" r="16" fill="${HUID}" ${SW}/>
    <path d="M34 28 A16 16 0 0 1 66 28 Q60 21 50 23 Q40 21 34 28z" fill="${HAAR}" ${SW}/>
    <path d="M49 13 q0 -6 5 -6" fill="none" ${SW}/>
    ${eyes(44, 56, 30, 2.6)}${smile(50, 35, 7)}
    <circle cx="39" cy="34" r="3" fill="#f7a8c4" opacity=".7"/><circle cx="61" cy="34" r="3" fill="#f7a8c4" opacity=".7"/>
  </g>`;
}

/* Het truitje: ronde schouders bovenaan, recht van onderen zodat de broek er netjes op aansluit */
function kidBody() {
  return `<g data-part="romp">
    <path d="M37 52 Q37 44 45 44 H55 Q63 44 63 52 V70 H37z" fill="${TRUI}" ${SW}/>
    <path d="M44 44 q6 7 12 0" fill="${HUID}" ${SW}/>
    <path d="${starPath(50, 59, 6, 2.6)}" fill="#ffd66b" ${stroke(1.5)}/>
  </g>`;
}

/* Een been: de heup is het bovenste punt (y 70), daaronder de broekspijp en het schoentje */
function kidLeg(side) {
  const hx = side < 0 ? 45 : 55;
  return `<g data-part="been-${side < 0 ? 'l' : 'r'}">
    <path d="M${hx - 4} 70 H${hx + 4} V85 H${hx - 4}z" fill="${BROEK}" ${SW}/>
    <rect x="${hx - 7}" y="84" width="14" height="8" rx="4" fill="${SCHOEN}" ${SW}/>
  </g>`;
}

/* Een arm: de schouder is het bovenste punt (y 46). Hangend of omhoog (voor het springende kind). */
function kidArm(side, up = false) {
  const name = side < 0 ? 'arm-l' : 'arm-r';
  if (up) {
    const sx = side < 0 ? 38 : 62;
    const ex = side < 0 ? 28 : 72;
    const hx = side < 0 ? 26 : 74;
    return `<g data-part="${name}">
    ${tube(`M${sx} 48 L${ex} 30`, 6, TRUI)}
    <circle cx="${hx}" cy="24" r="4.5" fill="${HUID}" ${SW}/>
  </g>`;
  }
  const d = side < 0 ? 'M34 46 H42 L38 66 A4 4 0 0 1 30 66z' : 'M58 46 H66 L70 66 A4 4 0 0 1 62 66z';
  const hx = side < 0 ? 34 : 66;
  return `<g data-part="${name}">
    <path d="${d}" fill="${TRUI}" ${SW}/>
    <circle cx="${hx}" cy="69.5" r="4.5" fill="${HUID}" ${SW}/>
  </g>`;
}

/* Een vrolijk kind van voren, voor de beweegscene. Volgorde: romp, benen, armen, hoofd. */
export function poppetje() {
  return svg(`${kidBody()}${kidLeg(-1)}${kidLeg(1)}${kidArm(-1)}${kidArm(1)}${kidHead()}`);
}

/* Hetzelfde kind, klein en springend met de armen omhoog, als tegel-icoon */
export function doeMeeIcon() {
  const sparkle = (x, y, s) => `<path d="M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s}z" fill="#ffd66b" ${stroke(1.5)}/>`;
  return svg(`<g transform="translate(50 44) scale(.8) translate(-50 -50)">
      ${kidBody()}
      <g transform="rotate(-14 45 70)">${kidLeg(-1)}</g><g transform="rotate(14 55 70)">${kidLeg(1)}</g>
      ${kidArm(-1, true)}${kidArm(1, true)}${kidHead()}
    </g>
    <path d="M28 90 q11 -6 22 0 M50 90 q11 -6 22 0" fill="none" ${stroke(3)}/>
    ${sparkle(12, 24, 5)}${sparkle(88, 20, 5)}${sparkle(16, 60, 3.5)}${sparkle(86, 56, 3.5)}`);
}

/* ---------- Stickers ---------- */

/* Een stickervel met een ster, een hart en een bloem */
export function stickerIcon() {
  return svg(`<rect x="14" y="8" width="72" height="84" rx="6" fill="#fff7e6" ${SW}/>
    <path d="${starPath(35, 32, 14, 6.5)}" fill="#ffd66b" ${SW}/>
    <path d="${heartPath(66, 33, 0.4)}" fill="#f28b82" ${SW}/>
    ${flower(50, 68, 9, '#cdb4f0')}`);
}

/* Een open kartonnen doos van voren, met een vriendelijk gezichtje en twee stickers erop */
export function opruimdoos() {
  return svg(`<path d="M24 36 L26 10 H74 L76 36z" fill="#f2c68c" ${SW}/>
    <path d="M16 48 H84 L76 36 H24z" fill="#8a5a3b" ${SW}/>
    <path d="M16 48 L24 36 L10 26 L2 38z" fill="#e0a86b" ${SW}/>
    <path d="M84 48 L76 36 L90 26 L98 38z" fill="#e0a86b" ${SW}/>
    <rect x="16" y="48" width="68" height="40" rx="3" fill="#e0a86b" ${SW}/>
    ${eyes(42, 58, 66, 3)}${smile(50, 74, 10)}${cheeks(34, 72, 72)}
    <path d="${starPath(74, 58, 5, 2.2)}" fill="#ffd66b" ${stroke(1.5)}/>
    <path d="${heartPath(26, 58, 0.17)}" fill="#f7a8c4" ${stroke(1.5)}/>`);
}

/* ---------- Instrumenten ---------- */

export function gitaar() {
  const strings = [46, 50, 54].map((x) => `<path d="M${x} 12 V77" stroke="#fff7e6" stroke-width="1.2"/>`).join('');
  const frets = [18, 24, 30].map((y) => `M45 ${y} H55`).join(' ');
  return svg(`<rect x="45" y="8" width="10" height="30" fill="#8a5a3b" ${SW}/>
    <rect x="42" y="2" width="16" height="12" rx="4" fill="#8a5a3b" ${SW}/>
    <circle cx="40" cy="5" r="2.2" fill="#ffd66b"/><circle cx="40" cy="10" r="2.2" fill="#ffd66b"/>
    <circle cx="60" cy="5" r="2.2" fill="#ffd66b"/><circle cx="60" cy="10" r="2.2" fill="#ffd66b"/>
    <path d="${frets}" stroke="#fff7e6" stroke-width="1.5"/>
    <path d="M50 30 C68 30 70 46 63 52 C76 56 78 90 50 90 C22 90 24 56 37 52 C30 46 32 30 50 30z" fill="#e0a86b" ${SW}/>
    <circle cx="50" cy="60" r="8" fill="#8a5a3b" ${SW}/>
    <rect x="41" y="74" width="18" height="5" rx="2.5" fill="#8a5a3b" ${SW}/>
    ${strings}`);
}

/* Een klein toetsenbord van voren, met zeven witte en vijf zwarte toetsen */
export function piano() {
  const w = 76 / 7;
  const lines = [1, 2, 3, 4, 5, 6].map((i) => `M${(12 + i * w).toFixed(1)} 46 V72`).join(' ');
  const blacks = [0, 1, 3, 4, 5].map((i) => `<rect x="${(12 + (i + 1) * w - 3).toFixed(1)}" y="46" width="6" height="15" rx="1.5" fill="${INK}"/>`).join('');
  return svg(`<path d="M18 78 V88 M82 78 V88" ${stroke(5)}/>
    <rect x="8" y="28" width="84" height="50" rx="7" fill="#cdb4f0" ${SW}/>
    <rect x="12" y="46" width="76" height="26" rx="3" fill="#fff" ${SW}/>
    <path d="${lines}" ${stroke(1.5)}/>
    ${blacks}
    <circle cx="20" cy="37" r="3.5" fill="#f28b82" ${SW}/><circle cx="30" cy="37" r="3.5" fill="#ffd66b" ${SW}/><circle cx="40" cy="37" r="3.5" fill="#8fcf7c" ${SW}/>
    <rect x="60" y="33" width="26" height="8" rx="4" fill="#fff7e6" ${SW}/>`);
}

/* Een trompet van opzij: mondstuk links, drie ventielen bovenop, beker rechts */
export function trompet() {
  const valve = (x) => `<rect x="${x - 3.5}" y="40" width="7" height="18" rx="2.5" fill="#ffb84d" ${SW}/>
    <path d="M${x} 40 V32" ${stroke(3)}/><circle cx="${x}" cy="30" r="3.5" fill="#fff7e6" ${SW}/>`;
  return svg(`${tube('M24 54 V64 Q24 72 32 72 H56 Q64 72 64 64 V54', 6, '#ffd66b')}
    <rect x="8" y="44" width="58" height="12" rx="6" fill="#ffd66b" ${SW}/>
    <rect x="2" y="43" width="10" height="14" rx="3" fill="#ffb84d" ${SW}/>
    <path d="M62 44 C72 44 76 30 82 24 Q96 18 96 50 Q96 82 82 76 C76 70 72 56 62 56z" fill="#ffd66b" ${SW}/>
    ${valve(36)}${valve(46)}${valve(56)}`);
}

/* Een babyrammelaar: een bolletje met een band en een ster, een handvat en een ring onderaan */
export function rammelaar() {
  return svg(`<path d="M12 20 l5 5 M9 32 h7 M12 44 l5 -5 M88 20 l-5 5 M91 32 h-7 M88 44 l-5 -5" ${stroke(2.5)}/>
    <rect x="45" y="50" width="10" height="34" rx="5" fill="#ffd66b" ${SW}/>
    <circle cx="50" cy="86" r="7" fill="#ffb84d" ${SW}/><circle cx="50" cy="86" r="2.5" fill="#fff7e6"/>
    <circle cx="50" cy="32" r="22" fill="#f7a8c4" ${SW}/>
    <path d="M33 41 Q50 49 67 41" fill="none" stroke="#cdb4f0" stroke-width="6" stroke-linecap="round"/>
    <path d="${starPath(50, 27, 7, 3)}" fill="#ffd66b" ${stroke(1.5)}/>`);
}

/* Een blokfluit met gaatjes, een beetje schuin */
export function fluit() {
  const holes = [34, 42, 50, 58, 66, 74].map((y) => `<circle cx="50" cy="${y}" r="2.5" fill="${INK}"/>`).join('');
  return svg(`<g transform="rotate(22 50 50)">
    <path d="M44 20 H56 L58 84 Q58 92 50 92 Q42 92 42 84z" fill="#f2c68c" ${SW}/>
    <path d="M45 6 Q50 3 55 6 L56 22 H44z" fill="#e0a86b" ${SW}/>
    <rect x="47" y="12" width="6" height="4" rx="1" fill="${INK}"/>
    <path d="M44 26 H56 M43 80 H57" stroke="${INK}" stroke-width="1.5"/>
    ${holes}
  </g>
  ${noteMark(80, 22, '#cdb4f0')}${noteMark(16, 70, '#f7a8c4')}`);
}

/* Een tamboerijn van voren: een houten ring, een vel en zes rinkelschijfjes, met een strikje bovenaan */
export function tamboerijn() {
  const jingles = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const x = (50 + Math.cos(a) * 34).toFixed(1), y = (50 + Math.sin(a) * 34).toFixed(1);
    jingles.push(`<circle cx="${x}" cy="${y}" r="4.5" fill="#ffd66b" ${SW}/><circle cx="${x}" cy="${y}" r="1.5" fill="#ffb84d"/>`);
  }
  return svg(`<circle cx="50" cy="50" r="40" fill="#e0a86b" ${SW}/>
    <circle cx="50" cy="50" r="30" fill="#fff7e6" ${SW}/>
    ${jingles.join('')}
    <path d="M50 12 q-10 -8 -13 2 q5 6 13 -2z M50 12 q10 -8 13 2 q-5 6 -13 -2z" fill="#f28b82" ${SW}/>
    <circle cx="50" cy="12" r="2.5" fill="#f28b82" ${SW}/>`);
}

/* Een xylofoon met zes gekleurde plankjes op twee houten latten, en een stokje */
export function xylofoon() {
  const colors = ['#f28b82', '#ffd66b', '#8fcf7c', '#8fcbea', '#f7a8c4', '#cdb4f0'];
  const bars = colors.map((c, i) => {
    const h = 52 - i * 4, x = 9 + i * 14, y = 50 - h / 2;
    return `<rect x="${x}" y="${y}" width="11" height="${h}" rx="3.5" fill="${c}" ${SW}/>
      <circle cx="${x + 5.5}" cy="${y + 5}" r="1.5" fill="${INK}"/><circle cx="${x + 5.5}" cy="${y + h - 5}" r="1.5" fill="${INK}"/>`;
  }).join('');
  return svg(`${tube('M6 30 L94 40 M6 70 L94 60', 5, '#e0a86b')}
    ${bars}
    ${tube('M8 94 L40 66', 3.5, '#e0a86b')}
    <circle cx="41" cy="64" r="5" fill="#8a5a3b" ${SW}/>`);
}

/* ---------- Iconen voor de muziekstanden ---------- */

/* Een trommel met een stokje */
export function instrumentIcon() {
  return svg(`<path d="M16 42 V70 Q50 86 84 70 V42z" fill="#8fcbea" ${SW}/>
    <path d="M16 50 L50 66 L84 50 M16 66 L50 50 L84 66" fill="none" stroke="#f28b82" stroke-width="3"/>
    <ellipse cx="50" cy="42" rx="34" ry="11" fill="#fff7e6" ${SW}/>
    ${tube('M74 16 L54 38', 3.5, '#e0a86b')}
    <circle cx="76" cy="13" r="4.5" fill="#f28b82" ${SW}/>`);
}

/* Een muzieknoot met een hartje */
export function liedjeIcon() {
  return svg(`<path d="M48 70 V18" ${stroke(5)}/>
    <path d="M48 18 Q70 24 66 46 Q66 34 48 36z" fill="#cdb4f0" ${SW}/>
    <ellipse cx="36" cy="72" rx="14" ry="10" fill="#cdb4f0" ${SW} transform="rotate(-15 36 72)"/>
    <path d="${heartPath(76, 62, 0.42)}" fill="#f7a8c4" ${SW}/>
    <path d="${heartPath(84, 30, 0.2)}" fill="#f7a8c4" ${SW}/>`);
}

/* ---------- Liedje ---------- */

/* Een rode paddenstoel met witte stippen en een gezichtje op de steel */
export function paddenstoel() {
  return svg(`<path d="M40 56 Q36 90 44 92 H56 Q64 90 60 56z" fill="#fff7e6" ${SW}/>
    <path d="M10 56 Q10 12 50 12 Q90 12 90 56 Q50 64 10 56z" fill="#f28b82" ${SW}/>
    <g fill="#fff" ${SW}><circle cx="30" cy="40" r="5"/><circle cx="50" cy="26" r="6.5"/><circle cx="70" cy="40" r="5"/>
      <circle cx="42" cy="50" r="3"/><circle cx="62" cy="52" r="3"/><circle cx="20" cy="52" r="2.5"/><circle cx="80" cy="52" r="2.5"/></g>
    ${eyes(45, 55, 70, 2.6)}${smile(50, 76, 7)}
    <g fill="#8fcf7c" ${stroke(1.5)}><path d="M6 94 Q8 80 16 78 Q14 90 8 94z"/><path d="M16 94 Q20 84 28 84 Q24 92 18 94z"/>
      <path d="M94 94 Q92 80 84 78 Q86 90 92 94z"/><path d="M84 94 Q80 84 72 84 Q76 92 82 94z"/></g>`);
}

/* Opzoeken op naam, voor de muziekscene en de beweegscene */
export const MORE = { gitaar, piano, trompet, rammelaar, fluit, tamboerijn, xylofoon, paddenstoel, poppetje, opruimdoos };

export function byNameMore(name) {
  const fn = MORE[name];
  return fn ? fn() : null;
}
