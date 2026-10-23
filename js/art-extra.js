/* Extra tekeningen voor de wilde dieren, de voertuigen en twee nieuwe kiekeboe-gebouwen.
   Zelfde stijl als art.js: platte, ronde, vriendelijke vormen in een viewBox van 0 0 100 100.
   De helpers staan hier nog een keer, want art.js exporteert ze niet. */

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

/* Een wiel zoals bij de auto in art.js: donker met een lichte naaf */
function wheel(cx, cy, r = 9, hub = '#fff') {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${INK}"/><circle cx="${cx}" cy="${cy}" r="${(r * 0.45).toFixed(1)}" fill="${hub}"/>`;
}

/* ---------- Wilde dieren ---------- */

export function leeuw() {
  const mane = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const x = 50 + Math.cos(a) * 32, y = 52 + Math.sin(a) * 32;
    mane.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="12" fill="#ffb84d" ${SW}/>`);
  }
  return svg(`${mane.join('')}<circle cx="50" cy="52" r="30" fill="#ffb84d"/>
    <circle cx="30" cy="30" r="7" fill="#ffd66b" ${SW}/><circle cx="70" cy="30" r="7" fill="#ffd66b" ${SW}/>
    <circle cx="30" cy="30" r="3" fill="#ffb84d"/><circle cx="70" cy="30" r="3" fill="#ffb84d"/>
    <circle cx="50" cy="52" r="27" fill="#ffd66b" ${SW}/>
    <ellipse cx="50" cy="64" rx="13" ry="9" fill="#fff7e6" ${SW}/>
    <ellipse cx="50" cy="60" rx="4.5" ry="3.2" fill="${INK}"/>
    <path d="M50 63 V67 M45 69 q5 4 10 0" fill="none" ${SW}/>
    ${eyes(40, 60, 48)}${cheeks(31, 69, 59)}`);
}

export function olifant() {
  return svg(`<ellipse cx="18" cy="50" rx="16" ry="20" fill="#8fcbea" ${SW}/><ellipse cx="82" cy="50" rx="16" ry="20" fill="#8fcbea" ${SW}/>
    <ellipse cx="18" cy="50" rx="9" ry="13" fill="#f7a8c4"/><ellipse cx="82" cy="50" rx="9" ry="13" fill="#f7a8c4"/>
    <circle cx="50" cy="48" r="30" fill="#8fcbea" ${SW}/>
    <ellipse cx="37" cy="68" rx="3.5" ry="6" fill="#fff7e6" ${SW} transform="rotate(25 37 68)"/>
    <ellipse cx="63" cy="68" rx="3.5" ry="6" fill="#fff7e6" ${SW} transform="rotate(-25 63 68)"/>
    <path d="M50 58 Q46 76 42 86 Q46 94 56 88" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M50 58 Q46 76 42 86 Q46 94 56 88" fill="none" stroke="#8fcbea" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M44 70 h8 M42 78 h8" stroke="${INK}" stroke-width="1.5" stroke-linecap="round"/>
    ${eyes(40, 60, 44)}${cheeks(33, 67, 55)}`);
}

export function aap() {
  return svg(`<circle cx="18" cy="48" r="11" fill="#e0a86b" ${SW}/><circle cx="82" cy="48" r="11" fill="#e0a86b" ${SW}/>
    <circle cx="18" cy="48" r="5" fill="#fff7e6"/><circle cx="82" cy="48" r="5" fill="#fff7e6"/>
    <circle cx="50" cy="50" r="32" fill="#e0a86b" ${SW}/>
    <path d="M46 20 q2 -8 6 -4 q2 -6 6 0" fill="none" ${SW}/>
    <path d="M30 44 a10 10 0 0 1 20 0 a10 10 0 0 1 20 0 Q76 76 50 78 Q24 76 30 44z" fill="#fff7e6" ${SW}/>
    <circle cx="47" cy="60" r="1.8" fill="${INK}"/><circle cx="53" cy="60" r="1.8" fill="${INK}"/>
    ${eyes(41, 59, 46)}${smile(50, 66, 12)}${cheeks(36, 64, 63)}`);
}

export function giraf() {
  const mane = [44, 52, 60, 68, 76, 84, 92].map((y) => `<circle cx="61" cy="${y}" r="4.5" fill="#e0a86b" ${SW}/>`).join('');
  return svg(`${mane}<rect x="40" y="36" width="20" height="60" rx="8" fill="#ffd66b" ${SW}/>
    <circle cx="47" cy="52" r="4.5" fill="#e0a86b"/><circle cx="54" cy="66" r="4" fill="#e0a86b"/><circle cx="46" cy="80" r="4.5" fill="#e0a86b"/><circle cx="54" cy="91" r="3" fill="#e0a86b"/>
    <path d="M41 14 L39 6 M59 14 L61 6" ${stroke(3)}/>
    <circle cx="39" cy="6" r="3.5" fill="#e0a86b" ${SW}/><circle cx="61" cy="6" r="3.5" fill="#e0a86b" ${SW}/>
    <ellipse cx="29" cy="22" rx="8" ry="4" fill="#ffd66b" ${SW} transform="rotate(-30 29 22)"/>
    <ellipse cx="71" cy="22" rx="8" ry="4" fill="#ffd66b" ${SW} transform="rotate(30 71 22)"/>
    <ellipse cx="50" cy="28" rx="20" ry="16" fill="#ffd66b" ${SW}/>
    <ellipse cx="50" cy="38" rx="12" ry="7" fill="#fff7e6" ${SW}/>
    <circle cx="46" cy="36" r="1.6" fill="${INK}"/><circle cx="54" cy="36" r="1.6" fill="${INK}"/>
    ${smile(50, 40, 7)}${eyes(43, 57, 26, 3.2)}`);
}

export function zebra() {
  return svg(`<path d="M34 24 q16 -16 32 0 q2 10 -4 16 H38 q-6 -6 -4 -16z" fill="${INK}" ${SW}/>
    <path d="M44 16 v6 M50 13 v6 M56 16 v6" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M32 34 q-8 -18 6 -18 q4 8 2 18z" fill="#fff" ${SW}/><path d="M68 34 q8 -18 -6 -18 q-4 8 -2 18z" fill="#fff" ${SW}/>
    <path d="M34 32 q-4 -10 3 -12 q2 5 1 12z" fill="#f7a8c4"/><path d="M66 32 q4 -10 -3 -12 q-2 5 -1 12z" fill="#f7a8c4"/>
    <ellipse cx="50" cy="54" rx="26" ry="30" fill="#fff" ${SW}/>
    <path d="M38 37 q12 -5 24 0 M32 45 q18 -6 36 0 M27 61 q5 -2 11 0 M62 61 q6 -2 11 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="50" cy="76" rx="14" ry="9" fill="${INK}"/>
    <circle cx="45" cy="75" r="2" fill="#fff"/><circle cx="55" cy="75" r="2" fill="#fff"/>
    <path d="M46 80 q4 3 8 0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    ${eyes(40, 60, 54)}`);
}

export function krokodil() {
  const teeth = [30, 44, 58, 72].map((x) => `<path d="M${x - 3} 58 l3 6 l3 -6z" fill="#fff" ${stroke(1.5)}/>`).join('');
  return svg(`<circle cx="22" cy="32" r="9" fill="#8fcf7c" ${SW}/><circle cx="40" cy="30" r="9" fill="#8fcf7c" ${SW}/>
    <path d="M8 48 q0 -16 16 -16 h30 q24 0 40 14 q4 4 0 10 q-16 14 -40 14 H24 q-16 0 -16 -16z" fill="#8fcf7c" ${SW}/>
    <circle cx="22" cy="31" r="5" fill="#fff"/><circle cx="40" cy="29" r="5" fill="#fff"/>
    <circle cx="23" cy="31.5" r="2.6" fill="${INK}"/><circle cx="41" cy="29.5" r="2.6" fill="${INK}"/>
    <circle cx="23.8" cy="30.6" r=".9" fill="#fff"/><circle cx="41.8" cy="28.6" r=".9" fill="#fff"/>
    <path d="M14 58 H80 q6 0 10 -6" fill="none" ${SW}/>
    ${teeth}
    <circle cx="86" cy="44" r="1.8" fill="${INK}"/>
    <circle cx="28" cy="49" r="4" fill="#f7a8c4" opacity=".7"/>
    <circle cx="58" cy="40" r="2.2" fill="#fff7e6" opacity=".8"/><circle cx="68" cy="43" r="2.2" fill="#fff7e6" opacity=".8"/>`);
}

/* ---------- Voertuigen ---------- */

export function vliegtuig() {
  const windows = [36, 48, 60].map((x) => `<circle cx="${x}" cy="49" r="3.5" fill="#fff" ${SW}/>`).join('');
  return svg(`<path d="M14 42 L10 20 H24 L32 42z" fill="#f28b82" ${SW}/>
    <path d="M8 52 Q10 38 26 38 H66 Q86 38 92 50 Q86 62 66 62 H26 Q10 62 8 52z" fill="#8fcbea" ${SW}/>
    <path d="M76 42 Q86 42 90 48 H76z" fill="#fff" ${SW}/>
    ${windows}
    <path d="M40 52 L26 74 H46 L62 52z" fill="#f28b82" ${SW}/>
    <rect x="91" y="38" width="4" height="24" rx="2" fill="${INK}"/><circle cx="93" cy="50" r="3" fill="#ffd66b" ${SW}/>`);
}

export function trein() {
  const smoke = `<circle cx="66" cy="18" r="6" fill="#fff" ${SW}/><circle cx="75" cy="12" r="5" fill="#fff" ${SW}/><circle cx="84" cy="8" r="4" fill="#fff" ${SW}/>`;
  return svg(`${smoke}
    <rect x="60" y="30" width="12" height="18" fill="#8a5a3b" ${SW}/><rect x="57" y="26" width="18" height="7" rx="2" fill="#8a5a3b" ${SW}/>
    <rect x="40" y="44" width="48" height="28" rx="8" fill="#8fcbea" ${SW}/>
    <circle cx="88" cy="56" r="6" fill="#ffd66b" ${SW}/>
    <rect x="6" y="26" width="38" height="8" rx="3" fill="#8a5a3b" ${SW}/>
    <rect x="10" y="30" width="30" height="42" rx="4" fill="#f28b82" ${SW}/>
    <rect x="16" y="36" width="18" height="16" rx="3" fill="#fff" ${SW}/>
    <path d="M88 72 L96 86 H84z" fill="#ffb84d" ${SW}/>
    ${wheel(24, 80)}${wheel(54, 80)}${wheel(78, 80)}
    <path d="M2 92 H98" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`);
}

export function bus() {
  const windows = [12, 32, 52, 72].map((x) => `<rect x="${x}" y="36" width="16" height="16" rx="3" fill="#8fcbea" ${SW}/>`).join('');
  return svg(`<rect x="6" y="28" width="88" height="48" rx="10" fill="#ffd66b" ${SW}/>
    <rect x="7" y="58" width="86" height="6" fill="#ffb84d"/><path d="M7 58 H93 M7 64 H93" stroke="${INK}" stroke-width="2"/>
    ${windows}
    <circle cx="90" cy="70" r="3" fill="#fff"/><circle cx="10" cy="70" r="3" fill="#f28b82"/>
    ${wheel(26, 78)}${wheel(74, 78)}`);
}

export function tractor() {
  return svg(`<circle cx="30" cy="68" r="22" fill="${INK}"/>
    <rect x="48" y="60" width="40" height="8" rx="3" fill="#8a5a3b" ${SW}/>
    <rect x="62" y="24" width="5" height="16" rx="2" fill="#8a5a3b" ${SW}/>
    <rect x="24" y="20" width="30" height="36" rx="4" fill="#f28b82" ${SW}/>
    <rect x="30" y="26" width="18" height="16" rx="3" fill="#fff" ${SW}/>
    <path d="M54 40 H84 q8 0 8 8 V62 H54z" fill="#f28b82" ${SW}/>
    <circle cx="88" cy="50" r="3" fill="#ffd66b"/>
    <circle cx="30" cy="68" r="11" fill="#ffd66b"/><circle cx="30" cy="68" r="4" fill="${INK}"/>
    ${wheel(78, 78, 12, '#ffd66b')}`);
}

export function boot() {
  const wave = (y) => `<path d="M2 ${y} q8 -6 16 0 t16 0 t16 0 t16 0 t16 0 t16 0" fill="none" stroke="#8fcbea" stroke-width="4" stroke-linecap="round"/>`;
  return svg(`<path d="M50 36 V12" ${stroke(3)}/><path d="M50 12 l14 5 l-14 5z" fill="#ffd66b" ${SW}/>
    <rect x="34" y="36" width="32" height="24" rx="4" fill="#fff7e6" ${SW}/>
    <circle cx="44" cy="48" r="4" fill="#8fcbea" ${SW}/><circle cx="56" cy="48" r="4" fill="#8fcbea" ${SW}/>
    <path d="M8 58 H92 L82 78 Q80 80 76 80 H24 Q20 80 18 78z" fill="#f28b82" ${SW}/>
    <path d="M14 67 H86" stroke="#fff7e6" stroke-width="3"/>
    ${wave(82)}${wave(92)}`);
}

export function brandweerauto() {
  const rungs = [16, 24, 32, 40, 48, 56].map((x) => `M${x} 28 V34`).join(' ');
  return svg(`<rect x="8" y="24" width="54" height="4" rx="2" fill="#ffd66b" ${SW}/>
    <path d="${rungs}" fill="none" ${stroke(2.5)}/>
    <rect x="8" y="34" width="54" height="4" rx="2" fill="#ffd66b" ${SW}/>
    <rect x="6" y="40" width="88" height="36" rx="6" fill="#f28b82" ${SW}/>
    <rect x="7" y="56" width="86" height="6" fill="#fff7e6"/><path d="M7 56 H93 M7 62 H93" stroke="${INK}" stroke-width="2"/>
    <rect x="74" y="18" width="10" height="7" rx="3" fill="#8fcbea" ${SW}/>
    <rect x="64" y="24" width="30" height="20" rx="5" fill="#f28b82" ${SW}/>
    <rect x="70" y="29" width="14" height="12" rx="3" fill="#fff" ${SW}/>
    <circle cx="90" cy="50" r="3" fill="#ffd66b"/>
    ${wheel(26, 78)}${wheel(74, 78)}`);
}

export function fiets() {
  const spokes = (cx, cy) => `<path d="M${cx} ${cy - 20} V${cy + 20} M${cx - 17.3} ${cy - 10} L${cx + 17.3} ${cy + 10} M${cx - 17.3} ${cy + 10} L${cx + 17.3} ${cy - 10}" stroke="${INK}" stroke-width="1.5"/>`;
  const tyre = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="20" fill="none" stroke="${INK}" stroke-width="4"/>${spokes(cx, cy)}<circle cx="${cx}" cy="${cy}" r="3" fill="${INK}"/>`;
  return svg(`${tyre(24, 68)}${tyre(76, 68)}
    <path d="M24 68 L44 36 L66 36 L76 68 M44 36 L50 70 L24 68 M66 36 L50 70" fill="none" stroke="#f28b82" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="50" cy="70" r="6" fill="#ffd66b" ${SW}/>
    <path d="M44 36 V30 M38 30 h12 M66 36 V28 M60 28 h12" fill="none" ${stroke(4)}/>`);
}

/* ---------- Gebouwen voor kiekeboe ----------
   Zelfde opening als barn() in art.js: x 28 tot 72, y 36 tot 80. De deuren komen er in CSS overheen. */

export function jungle() {
  const leaf = (x, y, rot) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="3.5" fill="#8fcf7c" ${SW} transform="rotate(${rot} ${x} ${y})"/>`;
  const leaves = [[32, 38, -40], [44, 34, 20], [58, 34, -20], [70, 38, 40], [28, 52, 70], [72, 54, -70], [28, 68, 80], [72, 70, -80]]
    .map(([x, y, r]) => leaf(x, y, r)).join('');
  return svg(`<circle cx="50" cy="44" r="40" fill="#8fcf7c" ${SW}/>
    <circle cx="18" cy="60" r="16" fill="#8fcf7c" ${SW}/><circle cx="82" cy="60" r="16" fill="#8fcf7c" ${SW}/>
    <circle cx="28" cy="24" r="14" fill="#8fcf7c" ${SW}/><circle cx="72" cy="24" r="14" fill="#8fcf7c" ${SW}/><circle cx="50" cy="14" r="12" fill="#8fcf7c" ${SW}/>
    <circle cx="20" cy="40" r="3.5" fill="#f28b82"/><circle cx="80" cy="40" r="3.5" fill="#f28b82"/>
    <circle cx="36" cy="14" r="3.5" fill="#ffd66b"/><circle cx="64" cy="14" r="3.5" fill="#f7a8c4"/>
    <circle cx="12" cy="70" r="3.5" fill="#ffd66b"/><circle cx="88" cy="72" r="3.5" fill="#f28b82"/>
    <rect x="28" y="36" width="44" height="44" fill="#2f5d3a"/>
    <rect x="28" y="36" width="44" height="44" fill="none" ${SW}/>
    ${leaves}
    <rect x="10" y="80" width="80" height="12" rx="3" fill="#e0a86b" ${SW}/>`);
}

export function garage() {
  return svg(`<rect x="32" y="6" width="36" height="14" rx="4" fill="#ffd66b" ${SW}/>
    <path d="M40 13 H60" stroke="#ffb84d" stroke-width="3" stroke-linecap="round"/>
    <rect x="12" y="26" width="76" height="66" rx="3" fill="#8fcbea" ${SW}/>
    <rect x="6" y="20" width="88" height="8" rx="3" fill="#fff7e6" ${SW}/>
    <rect x="15" y="42" width="9" height="9" rx="2" fill="#fff7e6" ${SW}/><rect x="76" y="42" width="9" height="9" rx="2" fill="#fff7e6" ${SW}/>
    <circle cx="50" cy="32" r="3" fill="#ffd66b" ${SW}/>
    <rect x="28" y="36" width="44" height="44" fill="#5a3a26"/>
    <rect x="28" y="36" width="44" height="44" fill="none" ${SW}/>
    <rect x="8" y="80" width="84" height="12" rx="3" fill="#fff7e6" ${SW}/>`);
}

/* Deurpanelen, net als barnDoor(): ze worden in CSS uitgerekt tot een smalle hoge deur */

export function leafDoor() {
  return svg(`<rect x="2" y="2" width="96" height="96" fill="#8fcf7c" ${stroke(3)}/>
    <path d="M50 6 V94" stroke="#fff7e6" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 20 L22 34 M50 36 L22 50 M50 52 L22 66 M50 68 L22 82 M50 20 L78 34 M50 36 L78 50 M50 52 L78 66 M50 68 L78 82" stroke="#fff7e6" stroke-width="3" stroke-linecap="round"/>`,
    'preserveAspectRatio="none"');
}

export function garageDoor() {
  const lines = [14, 26, 38, 50, 62, 74, 86].map((y) => `M2 ${y} H98`).join(' ');
  return svg(`<rect x="2" y="2" width="96" height="96" fill="#e3f2fb" ${stroke(3)}/>
    <path d="${lines}" stroke="#8fcbea" stroke-width="3"/>
    <circle cx="50" cy="80" r="6" fill="#ffd66b" ${SW}/>`,
    'preserveAspectRatio="none"');
}

/* ---------- Tegel-iconen voor de wereld ---------- */

export function wildIcon() {
  const mane = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const x = 50 + Math.cos(a) * 30, y = 52 + Math.sin(a) * 30;
    mane.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13" fill="#ffb84d" ${SW}/>`);
  }
  return svg(`${mane.join('')}<circle cx="50" cy="52" r="29" fill="#ffb84d"/>
    <circle cx="50" cy="52" r="26" fill="#ffd66b" ${SW}/>
    <ellipse cx="50" cy="63" rx="12" ry="8" fill="#fff7e6" ${SW}/>
    <ellipse cx="50" cy="59" rx="4" ry="3" fill="${INK}"/>
    <path d="M46 68 q4 4 8 0" fill="none" ${SW}/>
    ${eyes(41, 59, 48)}`);
}

export function vehicleIcon() {
  return svg(`<path d="M16 44 L12 22 H26 L34 44z" fill="#f28b82" ${SW}/>
    <path d="M8 54 Q10 40 28 40 H66 Q88 40 94 52 Q88 64 66 64 H28 Q10 64 8 54z" fill="#8fcbea" ${SW}/>
    <path d="M78 44 Q88 44 92 50 H78z" fill="#fff" ${SW}/>
    <circle cx="40" cy="51" r="4" fill="#fff" ${SW}/><circle cx="54" cy="51" r="4" fill="#fff" ${SW}/>
    <path d="M42 54 L28 78 H50 L66 54z" fill="#f28b82" ${SW}/>`);
}

/* Opzoeken op naam, voor het prentenboek en de kiekeboe-scènes */
export const EXTRA = { leeuw, olifant, aap, giraf, zebra, krokodil, vliegtuig, trein, bus, tractor, boot, brandweerauto, fiets };

export function byNameExtra(name) {
  const fn = EXTRA[name];
  return fn ? fn() : null;
}
