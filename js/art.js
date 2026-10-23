/* Alle tekeningen als SVG in de code: platte, ronde, vriendelijke vormen.
   Elke functie geeft een SVG-string terug (viewBox 0 0 100 100). */

const INK = '#3b4252';
const SW = 'stroke="#3b4252" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';

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

/* ---------- Iconen ---------- */

export function sun(big = false) {
  const rays = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const x1 = 50 + Math.cos(a) * 36, y1 = 50 + Math.sin(a) * 36;
    const x2 = 50 + Math.cos(a) * 46, y2 = 50 + Math.sin(a) * 46;
    rays.push(`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#ffb84d" stroke-width="5" stroke-linecap="round"/>`);
  }
  const face = big ? `${eyes(41, 59, 47, 3.4)}${smile(50, 56, 12)}${cheeks(35, 65, 55)}` : '';
  return svg(`<g class="sun-rays">${rays.join('')}</g><circle cx="50" cy="50" r="30" fill="#ffd66b"/>${face}`);
}

export function moon() {
  return svg(`<defs><mask id="moonmask"><rect width="100" height="100" fill="#fff"/><circle cx="70" cy="38" r="34" fill="#000"/></mask></defs>
    <circle cx="50" cy="50" r="42" fill="#fff3c2" mask="url(#moonmask)"/>
    <circle cx="30" cy="42" r="4" fill="#f3e3a8"/><circle cx="26" cy="64" r="6" fill="#f3e3a8"/><circle cx="44" cy="80" r="3.5" fill="#f3e3a8"/>
    <circle cx="36" cy="54" r="2.6" fill="${INK}"/><circle cx="37" cy="53" r=".9" fill="#fff"/>
    <path d="M40 66 q5 5 10 1" fill="none" ${SW}/>`);
}

export function star() {
  return svg(`<path d="M50 8 L61 38 L93 38 L67 57 L77 88 L50 70 L23 88 L33 57 L7 38 L39 38z" fill="#ffe69a" stroke="#ffd66b" stroke-width="3" stroke-linejoin="round"/>`);
}

export function gear() {
  const teeth = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * 360;
    teeth.push(`<rect x="44" y="6" width="12" height="18" rx="4" fill="#6b7280" transform="rotate(${a} 50 50)"/>`);
  }
  return svg(`${teeth.join('')}<circle cx="50" cy="50" r="30" fill="#6b7280"/><circle cx="50" cy="50" r="13" fill="#fff"/>`);
}

export function arrow(dir = 'right') {
  const d = dir === 'right' ? 'M30 20 L62 50 L30 80' : 'M70 20 L38 50 L70 80';
  return svg(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`);
}

export function noteIcon() {
  return svg(`<ellipse cx="32" cy="74" rx="14" ry="10" fill="#cdb4f0" ${SW}/><ellipse cx="68" cy="66" rx="14" ry="10" fill="#f7a8c4" ${SW}/>
    <path d="M46 72 V22 L82 14 V64" fill="none" ${SW} stroke-width="5"/>`);
}

export function bubbleIcon() {
  return svg(`<circle cx="42" cy="54" r="30" fill="#e3f2fb" ${SW}/><circle cx="32" cy="42" r="8" fill="#fff"/>
    <circle cx="76" cy="28" r="14" fill="#e3f2fb" ${SW}/><circle cx="72" cy="24" r="4" fill="#fff"/>`);
}

export function bookIcon() {
  return svg(`<path d="M12 20 Q30 14 50 24 V84 Q30 74 12 80z" fill="#fff7e6" ${SW}/><path d="M88 20 Q70 14 50 24 V84 Q70 74 88 80z" fill="#fff7e6" ${SW}/>
    <circle cx="31" cy="48" r="9" fill="#ffb79a"/><rect x="60" y="40" width="18" height="6" rx="3" fill="#cdb4f0"/><rect x="60" y="52" width="14" height="6" rx="3" fill="#cdb4f0"/>`);
}

export function barnIcon() {
  return svg(`<path d="M14 46 L50 16 L86 46 V86 H14z" fill="#f28b82" ${SW}/><path d="M8 48 L50 12 L92 48" fill="none" ${SW} stroke-width="4"/>
    <rect x="36" y="52" width="28" height="34" rx="3" fill="#8a5a3b" ${SW}/><path d="M36 52 L64 86 M64 52 L36 86" stroke="#fff7e6" stroke-width="2"/>
    <circle cx="50" cy="36" r="6" fill="#fff7e6" ${SW}/>`);
}

export function faceIcon() {
  return svg(`<circle cx="50" cy="52" r="34" fill="#ffd9b8" ${SW}/><path d="M20 44 Q30 10 50 18 Q70 10 80 44 Q65 34 50 36 Q35 34 20 44z" fill="#8a5a3b" ${SW}/>
    ${eyes(38, 62, 52)}${smile(50, 64, 14)}${cheeks(30, 70, 62)}`);
}

/* ---------- Muziekvormen ---------- */

export function shape(kind, color) {
  const map = {
    circle: `<circle cx="50" cy="50" r="40" fill="${color}" ${SW}/>`,
    square: `<rect x="12" y="12" width="76" height="76" rx="16" fill="${color}" ${SW}/>`,
    triangle: `<path d="M50 10 L92 84 H8z" fill="${color}" ${SW}/>`,
    star: `<path d="M50 6 L62 36 L94 38 L69 58 L78 90 L50 72 L22 90 L31 58 L6 38 L38 36z" fill="${color}" ${SW}/>`,
    heart: `<path d="M50 88 L16 54 A20 20 0 0 1 50 28 A20 20 0 0 1 84 54z" fill="${color}" ${SW}/>`,
    flower: `<g fill="${color}" ${SW}><circle cx="50" cy="22" r="16"/><circle cx="76" cy="40" r="16"/><circle cx="68" cy="72" r="16"/><circle cx="32" cy="72" r="16"/><circle cx="24" cy="40" r="16"/></g><circle cx="50" cy="50" r="15" fill="#fff7e6" ${SW}/>`
  };
  return svg(`${map[kind] || map.circle}${eyes(42, 58, 48, 3)}${smile(50, 57, 9)}`);
}

export function drum() {
  return svg(`<ellipse cx="50" cy="74" rx="36" ry="12" fill="#e36b6b" ${SW}/><rect x="14" y="34" width="72" height="40" fill="#e36b6b" stroke="none"/>
    <line x1="14" y1="34" x2="14" y2="74" ${SW}/><line x1="86" y1="34" x2="86" y2="74" ${SW}/>
    <path d="M14 40 L40 70 M86 40 L60 70 M40 40 L14 70 M60 40 L86 70" stroke="#fff7e6" stroke-width="3" fill="none"/>
    <ellipse cx="50" cy="34" rx="36" ry="12" fill="#fff7e6" ${SW}/>
    <line x1="30" y1="12" x2="48" y2="30" ${SW} stroke-width="4"/><circle cx="28" cy="10" r="5" fill="#8a5a3b"/>
    <line x1="70" y1="12" x2="52" y2="30" ${SW} stroke-width="4"/><circle cx="72" cy="10" r="5" fill="#8a5a3b"/>`);
}

export function bell() {
  return svg(`<path d="M30 68 V48 a20 20 0 0 1 40 0 V68 L78 80 H22z" fill="#ffd66b" ${SW}/><circle cx="50" cy="26" r="5" fill="#ffb84d" ${SW}/>
    <circle cx="50" cy="86" r="7" fill="#ffb84d" ${SW}/>`);
}

/* ---------- Dieren ---------- */

export function koe() {
  return svg(`<ellipse cx="50" cy="56" rx="34" ry="30" fill="#fff" ${SW}/>
    <path d="M24 44 q10 -8 16 4 q-6 10 -16 2z" fill="${INK}"/><path d="M66 36 q12 -4 14 8 q-10 8 -16 -2z" fill="${INK}"/>
    <ellipse cx="18" cy="54" rx="8" ry="6" fill="#ffd9b8" ${SW}/><ellipse cx="82" cy="54" rx="8" ry="6" fill="#ffd9b8" ${SW}/>
    <path d="M30 30 q-8 -12 2 -14 q4 6 4 12z" fill="#fff7e6" ${SW}/><path d="M70 30 q8 -12 -2 -14 q-4 6 -4 12z" fill="#fff7e6" ${SW}/>
    <ellipse cx="50" cy="72" rx="20" ry="12" fill="#f7b7c4" ${SW}/><circle cx="43" cy="71" r="2.6" fill="${INK}"/><circle cx="57" cy="71" r="2.6" fill="${INK}"/>
    ${eyes(40, 60, 52)}`);
}

export function hond() {
  return svg(`<ellipse cx="50" cy="56" rx="32" ry="30" fill="#d9a066" ${SW}/>
    <path d="M22 40 q-14 20 -2 40 q10 -4 12 -14z" fill="#a9733f" ${SW}/><path d="M78 40 q14 20 2 40 q-10 -4 -12 -14z" fill="#a9733f" ${SW}/>
    <ellipse cx="50" cy="68" rx="16" ry="12" fill="#fff7e6" ${SW}/><ellipse cx="50" cy="63" rx="6" ry="4.5" fill="${INK}"/>
    <path d="M50 67 V72 M44 74 q6 5 12 0" fill="none" ${SW}/><path d="M48 76 q2 8 6 4 q-2 -2 -2 -4z" fill="#f7a8c4" ${SW}/>
    ${eyes(39, 61, 50)}`);
}

export function kat() {
  return svg(`<path d="M22 44 L18 14 L40 30z" fill="#9a9aa8" ${SW}/><path d="M78 44 L82 14 L60 30z" fill="#9a9aa8" ${SW}/>
    <path d="M24 40 L22 22 L36 32z" fill="#f7b7c4"/><path d="M76 40 L78 22 L64 32z" fill="#f7b7c4"/>
    <ellipse cx="50" cy="56" rx="32" ry="28" fill="#9a9aa8" ${SW}/>
    <path d="M50 60 l-4 -4 h8z" fill="#f7a8c4" ${SW}/><path d="M50 61 V66 M44 69 q6 5 12 0" fill="none" ${SW}/>
    <path d="M14 60 L34 63 M14 68 L34 66 M86 60 L66 63 M86 68 L66 66" stroke="${INK}" stroke-width="1.5"/>
    ${eyes(39, 61, 50)}${cheeks(32, 68, 62)}`);
}

export function eend() {
  return svg(`<ellipse cx="46" cy="66" rx="34" ry="22" fill="#ffd66b" ${SW}/><path d="M72 64 q16 -4 18 -14 q-6 8 -16 6z" fill="#ffd66b" ${SW}/>
    <circle cx="36" cy="34" r="20" fill="#ffd66b" ${SW}/>
    <path d="M52 34 q20 -4 24 6 q-4 8 -24 4z" fill="#ffb84d" ${SW}/>
    <circle cx="40" cy="30" r="3.6" fill="${INK}"/><circle cx="41.2" cy="28.8" r="1.1" fill="#fff"/>
    <path d="M30 86 q8 6 16 0" fill="none" stroke="#ffb84d" stroke-width="4" stroke-linecap="round"/>`);
}

export function schaap() {
  const puffs = [[22, 48], [34, 36], [50, 32], [66, 36], [78, 48], [80, 64], [70, 78], [50, 84], [30, 78], [20, 64]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="#fff7e6" ${SW}/>`).join('');
  return svg(`${puffs}<ellipse cx="50" cy="58" rx="28" ry="24" fill="#fff7e6"/>
    <ellipse cx="50" cy="60" rx="18" ry="16" fill="#3b4252"/>
    <ellipse cx="28" cy="54" rx="8" ry="4" fill="#3b4252" transform="rotate(-20 28 54)"/><ellipse cx="72" cy="54" rx="8" ry="4" fill="#3b4252" transform="rotate(20 72 54)"/>
    <circle cx="43" cy="57" r="3.6" fill="#fff"/><circle cx="57" cy="57" r="3.6" fill="#fff"/><circle cx="43.8" cy="57.6" r="1.8" fill="${INK}"/><circle cx="57.8" cy="57.6" r="1.8" fill="${INK}"/>
    <path d="M46 68 q4 3 8 0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`);
}

export function paard() {
  return svg(`<path d="M30 28 q-6 -20 10 -22 q6 10 2 22z" fill="#a9733f" ${SW}/><path d="M64 28 q6 -20 -10 -22 q-6 10 -2 22z" fill="#a9733f" ${SW}/>
    <path d="M36 22 q14 -14 28 0 q4 14 -2 26 H38 q-6 -12 -2 -26z" fill="#6b4226" ${SW}/>
    <path d="M32 36 q18 -14 36 0 V74 q-18 12 -36 0z" fill="#c58a52" ${SW}/>
    <path d="M36 62 q14 -8 28 0 V78 q-14 8 -28 0z" fill="#e8c4a0" ${SW}/>
    <circle cx="44" cy="72" r="2.6" fill="${INK}"/><circle cx="56" cy="72" r="2.6" fill="${INK}"/>
    ${eyes(41, 59, 50)}`);
}

export function kip() {
  return svg(`<path d="M44 20 q2 -12 10 -8 q-2 -10 8 -6 q2 8 -4 12 q4 4 0 8z" fill="#f28b82" ${SW}/>
    <ellipse cx="50" cy="60" rx="32" ry="28" fill="#fff7e6" ${SW}/>
    <path d="M82 60 q12 -6 10 -16 q-8 4 -12 10z" fill="#fff7e6" ${SW}/>
    <path d="M52 52 l16 6 l-16 6z" fill="#ffb84d" ${SW}/><path d="M48 64 q6 8 0 12" fill="#f28b82" ${SW}/>
    <circle cx="42" cy="48" r="3.6" fill="${INK}"/><circle cx="43.2" cy="46.8" r="1.1" fill="#fff"/>
    <path d="M36 88 v6 M28 92 h8 M48 88 v6 M40 92 h8" stroke="#ffb84d" stroke-width="3" stroke-linecap="round"/>`);
}

export function varken() {
  return svg(`<path d="M22 36 L14 16 L38 26z" fill="#f7b7c4" ${SW}/><path d="M78 36 L86 16 L62 26z" fill="#f7b7c4" ${SW}/>
    <ellipse cx="50" cy="56" rx="34" ry="30" fill="#f9c6d2" ${SW}/>
    <ellipse cx="50" cy="66" rx="16" ry="11" fill="#f7a8c4" ${SW}/><circle cx="44" cy="66" r="3" fill="${INK}"/><circle cx="56" cy="66" r="3" fill="${INK}"/>
    ${eyes(38, 62, 50)}${cheeks(26, 74, 62)}`);
}

export function kikker() {
  return svg(`<circle cx="32" cy="30" r="12" fill="#8fcf7c" ${SW}/><circle cx="68" cy="30" r="12" fill="#8fcf7c" ${SW}/>
    <circle cx="32" cy="30" r="6" fill="#fff"/><circle cx="68" cy="30" r="6" fill="#fff"/><circle cx="33" cy="31" r="3" fill="${INK}"/><circle cx="67" cy="31" r="3" fill="${INK}"/>
    <ellipse cx="50" cy="60" rx="36" ry="26" fill="#8fcf7c" ${SW}/>
    <path d="M30 60 q20 18 40 0" fill="none" ${SW} stroke-width="3"/>
    ${cheeks(24, 76, 62)}
    <ellipse cx="22" cy="84" rx="10" ry="5" fill="#8fcf7c" ${SW}/><ellipse cx="78" cy="84" rx="10" ry="5" fill="#8fcf7c" ${SW}/>`);
}

export function vogel() {
  return svg(`<ellipse cx="50" cy="56" rx="30" ry="26" fill="#8fcbea" ${SW}/>
    <path d="M24 56 q-14 10 -8 24 q12 -6 18 -14z" fill="#5fb0dd" ${SW}/>
    <path d="M28 46 q10 14 20 10 q-6 -12 -20 -10z" fill="#5fb0dd" ${SW}/>
    <path d="M78 50 l14 4 l-14 6z" fill="#ffb84d" ${SW}/>
    <path d="M40 28 q6 -12 14 -4 q-6 2 -8 8z" fill="#5fb0dd" ${SW}/>
    <circle cx="64" cy="48" r="3.6" fill="${INK}"/><circle cx="65.2" cy="46.8" r="1.1" fill="#fff"/>
    <path d="M44 82 v8 M36 88 h8 M56 82 v8 M48 88 h8" stroke="#ffb84d" stroke-width="3" stroke-linecap="round"/>`);
}

export function vlinder() {
  return svg(`<path d="M50 50 q-30 -40 -40 -12 q0 18 20 20 q-24 6 -14 26 q14 10 34 -14z" fill="#f7a8c4" ${SW}/>
    <path d="M50 50 q30 -40 40 -12 q0 18 -20 20 q24 6 14 26 q-14 -10 -34 -14z" fill="#f7a8c4" ${SW}/>
    <circle cx="30" cy="40" r="5" fill="#cdb4f0"/><circle cx="70" cy="40" r="5" fill="#cdb4f0"/><circle cx="34" cy="66" r="4" fill="#ffd66b"/><circle cx="66" cy="66" r="4" fill="#ffd66b"/>
    <ellipse cx="50" cy="54" rx="5" ry="18" fill="${INK}"/><path d="M48 36 q-6 -10 -10 -12 M52 36 q6 -10 10 -12" fill="none" ${SW}/>`);
}

/* ---------- Voorwerpen ---------- */

export function appel() {
  return svg(`<path d="M50 30 q-26 -10 -32 16 q-4 30 20 42 q12 4 12 -2 q0 6 12 2 q24 -12 20 -42 q-6 -26 -32 -16z" fill="#f28b82" ${SW}/>
    <path d="M50 30 q2 -12 10 -16" fill="none" ${SW} stroke-width="3"/><path d="M52 22 q12 -12 20 -2 q-10 8 -20 2z" fill="#8fcf7c" ${SW}/>
    <path d="M30 44 q4 -8 10 -8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>`);
}

export function banaan() {
  return svg(`<path d="M20 30 q-6 44 36 56 q24 6 30 -8 q-30 2 -50 -22 q-10 -14 -8 -26z" fill="#ffd66b" ${SW}/>
    <path d="M20 30 l-4 -8 q6 -2 10 4z" fill="#8a5a3b" ${SW}/><path d="M86 78 l6 2 q-2 4 -8 2z" fill="#8a5a3b" ${SW}/>`);
}

export function brood() {
  return svg(`<path d="M16 50 q0 -24 34 -24 q34 0 34 24 V76 q0 8 -8 8 H24 q-8 0 -8 -8z" fill="#e0a86b" ${SW}/>
    <path d="M26 40 q10 -6 16 2 M46 36 q10 -6 16 2 M66 40 q6 -4 10 0" fill="none" stroke="#8a5a3b" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="16" y="64" width="68" height="20" rx="8" fill="#f2c68c" stroke="none"/><path d="M16 64 H84" stroke="${INK}" stroke-width="2"/>`);
}

export function melk() {
  return svg(`<path d="M30 30 L36 14 H64 L70 30 V84 q0 6 -6 6 H36 q-6 0 -6 -6z" fill="#fff" ${SW}/>
    <path d="M30 30 H70" ${SW}/><rect x="30" y="52" width="40" height="22" fill="#8fcbea" stroke="none"/><path d="M30 52 H70 M30 74 H70" stroke="${INK}" stroke-width="2"/>
    <circle cx="50" cy="63" r="6" fill="#fff"/>`);
}

export function koekje() {
  return svg(`<circle cx="50" cy="52" r="36" fill="#e0a86b" ${SW}/>
    <g fill="#6b4226"><circle cx="36" cy="40" r="5"/><circle cx="60" cy="36" r="4"/><circle cx="66" cy="58" r="5"/><circle cx="44" cy="64" r="4"/><circle cx="52" cy="50" r="3"/></g>
    <path d="M26 66 q-6 -8 -2 -16" fill="none" stroke="#f2c68c" stroke-width="3" stroke-linecap="round"/>`);
}

export function bal() {
  return svg(`<circle cx="50" cy="52" r="36" fill="#f28b82" ${SW}/>
    <path d="M14 52 q36 -20 72 0" fill="none" stroke="#fff7e6" stroke-width="12"/><path d="M14 52 q36 20 72 0" fill="none" stroke="#8fcbea" stroke-width="12"/>
    <circle cx="50" cy="52" r="36" fill="none" ${SW}/><circle cx="36" cy="34" r="6" fill="#fff" opacity=".7"/>`);
}

export function auto() {
  return svg(`<path d="M12 62 V52 q0 -6 6 -6 H26 L36 30 H64 L74 46 H82 q6 0 6 6 V62 q0 6 -6 6 H18 q-6 0 -6 -6z" fill="#8fcbea" ${SW}/>
    <path d="M34 46 L40 34 H60 L66 46z" fill="#e3f2fb" ${SW}/>
    <circle cx="30" cy="70" r="9" fill="${INK}"/><circle cx="30" cy="70" r="4" fill="#fff"/><circle cx="70" cy="70" r="9" fill="${INK}"/><circle cx="70" cy="70" r="4" fill="#fff"/>
    <circle cx="82" cy="56" r="3" fill="#ffd66b"/>`);
}

export function boek() {
  return svg(`<path d="M16 22 Q34 16 50 26 V82 Q34 72 16 78z" fill="#fff7e6" ${SW}/><path d="M84 22 Q66 16 50 26 V82 Q66 72 84 78z" fill="#fff7e6" ${SW}/>
    <path d="M12 26 V84 L50 90 L88 84 V26" fill="none" ${SW}/>
    <circle cx="33" cy="46" r="8" fill="#ffd66b"/><path d="M24 64 q10 -8 18 0" fill="none" stroke="#8fcf7c" stroke-width="3"/>
    <rect x="60" y="40" width="16" height="5" rx="2.5" fill="#cdb4f0"/><rect x="60" y="50" width="12" height="5" rx="2.5" fill="#cdb4f0"/><rect x="60" y="60" width="14" height="5" rx="2.5" fill="#cdb4f0"/>`);
}

export function schoen() {
  return svg(`<path d="M18 70 V40 q0 -8 8 -8 H46 q6 0 10 6 l8 12 q18 4 22 12 V72 q0 4 -4 4 H22 q-4 0 -4 -6z" fill="#f28b82" ${SW}/>
    <path d="M18 66 H86" stroke="${INK}" stroke-width="2"/><rect x="18" y="66" width="68" height="10" fill="#fff7e6" stroke="none"/><path d="M18 76 H86 M18 66 H86" stroke="${INK}" stroke-width="2"/>
    <path d="M30 40 l12 6 M30 48 l12 6 M42 40 l-12 6" stroke="#fff7e6" stroke-width="2.5" stroke-linecap="round"/>`);
}

export function beer() {
  return svg(`<circle cx="26" cy="28" r="11" fill="#c58a52" ${SW}/><circle cx="74" cy="28" r="11" fill="#c58a52" ${SW}/><circle cx="26" cy="28" r="5" fill="#e8c4a0"/><circle cx="74" cy="28" r="5" fill="#e8c4a0"/>
    <circle cx="50" cy="52" r="32" fill="#c58a52" ${SW}/>
    <ellipse cx="50" cy="64" rx="14" ry="10" fill="#e8c4a0" ${SW}/><ellipse cx="50" cy="60" rx="5" ry="3.8" fill="${INK}"/><path d="M50 64 V68 M45 70 q5 4 10 0" fill="none" ${SW}/>
    ${eyes(39, 61, 46)}`);
}

export function bad() {
  return svg(`<path d="M10 46 H90 V64 q0 18 -18 18 H28 q-18 0 -18 -18z" fill="#fff" ${SW}/>
    <path d="M14 46 q18 -8 36 0 q18 -8 36 0" fill="#8fcbea" stroke="none"/><path d="M10 46 H90" ${SW}/>
    <circle cx="30" cy="36" r="6" fill="#e3f2fb" ${SW}/><circle cx="46" cy="28" r="5" fill="#e3f2fb" ${SW}/><circle cx="66" cy="34" r="7" fill="#e3f2fb" ${SW}/>
    <path d="M78 46 V26 q0 -8 -8 -8 h-4" fill="none" ${SW} stroke-width="4"/>
    <path d="M20 82 v8 M80 82 v8" ${SW} stroke-width="4"/>
    <ellipse cx="52" cy="48" rx="12" ry="7" fill="#ffd66b" ${SW}/><circle cx="46" cy="40" r="7" fill="#ffd66b" ${SW}/><path d="M52 40 l8 2 l-8 3z" fill="#ffb84d"/>`);
}

export function bed() {
  return svg(`<rect x="12" y="30" width="16" height="50" rx="4" fill="#8a5a3b" ${SW}/><rect x="72" y="46" width="16" height="34" rx="4" fill="#8a5a3b" ${SW}/>
    <rect x="14" y="54" width="72" height="22" rx="6" fill="#cdb4f0" ${SW}/>
    <path d="M14 54 q24 -10 36 0 q12 -10 36 0" fill="#fff" stroke="none"/><path d="M14 54 H86" ${SW}/>
    <ellipse cx="32" cy="48" rx="12" ry="6" fill="#fff" ${SW}/>
    <rect x="46" y="56" width="40" height="20" rx="4" fill="#f7a8c4" stroke="none"/><path d="M46 56 V76 M46 56 H86" stroke="${INK}" stroke-width="2"/>`);
}

export function boom() {
  return svg(`<rect x="44" y="60" width="12" height="30" rx="4" fill="#8a5a3b" ${SW}/>
    <circle cx="50" cy="40" r="26" fill="#8fcf7c" ${SW}/><circle cx="30" cy="50" r="16" fill="#8fcf7c" ${SW}/><circle cx="70" cy="50" r="16" fill="#8fcf7c" ${SW}/>
    <circle cx="40" cy="36" r="4" fill="#f28b82"/><circle cx="60" cy="44" r="4" fill="#f28b82"/><circle cx="50" cy="56" r="4" fill="#f28b82"/>`);
}

export function bloem() {
  return svg(`<path d="M50 60 V92" stroke="#8fcf7c" stroke-width="5" stroke-linecap="round"/><path d="M50 78 q-14 -2 -16 -14 q12 0 16 14z" fill="#8fcf7c" ${SW}/>
    <g fill="#f7a8c4" ${SW}><circle cx="50" cy="22" r="13"/><circle cx="72" cy="38" r="13"/><circle cx="64" cy="64" r="13"/><circle cx="36" cy="64" r="13"/><circle cx="28" cy="38" r="13"/></g>
    <circle cx="50" cy="44" r="13" fill="#ffd66b" ${SW}/>`);
}

/* ---------- Decor ---------- */

export function cloud() {
  return svg(`<path d="M24 70 a14 14 0 0 1 4 -27 a18 18 0 0 1 34 -6 a14 14 0 0 1 20 12 a12 12 0 0 1 -4 21z" fill="#fff" opacity=".9"/>`);
}

/* Landschap: lucht, heuvels, wolkjes. Vult de hele achtergrond. */
export function landscape(opts = {}) {
  const { sun: withSun = true } = opts;
  return `<svg viewBox="0 0 200 100" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3f5"/><stop offset="1" stop-color="#e6f5fc"/></linearGradient></defs>
    <rect width="200" height="100" fill="url(#skyg)"/>
    ${withSun ? '<circle cx="168" cy="22" r="12" fill="#ffd66b"/>' : ''}
    <g fill="#fff" opacity=".85"><ellipse cx="40" cy="24" rx="14" ry="6"/><ellipse cx="48" cy="20" rx="9" ry="6"/><ellipse cx="120" cy="16" rx="12" ry="5"/><ellipse cx="128" cy="13" rx="7" ry="5"/></g>
    <ellipse cx="40" cy="104" rx="90" ry="34" fill="#b9e2a3"/>
    <ellipse cx="170" cy="108" rx="90" ry="38" fill="#a7d98f"/>
    <ellipse cx="100" cy="118" rx="140" ry="32" fill="#8fcf7c"/>
  </svg>`;
}

/* Schuur zonder deuren: de opening is donker, de deuren komen er als losse panelen voor. */
export function barn() {
  return svg(`<path d="M12 42 L50 12 L88 42 V92 H12z" fill="#f28b82" ${SW}/>
    <path d="M6 44 L50 8 L94 44" fill="none" ${SW} stroke-width="4"/>
    <rect x="28" y="36" width="44" height="44" fill="#5a3a26"/>
    <rect x="28" y="36" width="44" height="44" fill="none" ${SW}/>
    <circle cx="50" cy="26" r="6" fill="#fff7e6" ${SW}/>
    <rect x="12" y="80" width="76" height="12" fill="#e0a86b" ${SW}/>`);
}

export function barnDoor() {
  return svg(`<rect x="2" y="2" width="96" height="96" fill="#c9513f" ${SW} stroke-width="3"/>
    <path d="M2 2 L98 98 M98 2 L2 98" stroke="#fff7e6" stroke-width="5"/>
    <circle cx="80" cy="50" r="5" fill="#ffd66b" ${SW}/>`, 'preserveAspectRatio="none"');
}

/* Het gezichtje, met data-part op elk onderdeel */
export function face() {
  return svg(`
    <g data-part="haar" class="face-part"><path d="M18 46 Q22 8 50 12 Q78 8 82 46 Q70 30 50 34 Q30 30 18 46z" fill="#8a5a3b" ${SW}/>
      <circle cx="50" cy="12" r="5" fill="#8a5a3b" ${SW}/></g>
    <g data-part="oor" class="face-part"><ellipse cx="16" cy="56" rx="7" ry="10" fill="#ffd9b8" ${SW}/><ellipse cx="16" cy="56" rx="3" ry="5" fill="#f7b7c4"/></g>
    <g data-part="oor" class="face-part"><ellipse cx="84" cy="56" rx="7" ry="10" fill="#ffd9b8" ${SW}/><ellipse cx="84" cy="56" rx="3" ry="5" fill="#f7b7c4"/></g>
    <ellipse cx="50" cy="56" rx="32" ry="36" fill="#ffd9b8" ${SW}/>
    <path d="M18 46 Q22 24 50 24 Q78 24 82 46 Q70 32 50 36 Q30 32 18 46z" fill="#8a5a3b"/>
    <g data-part="wang" class="face-part"><circle cx="30" cy="66" r="7" fill="#f7a8c4" opacity=".75"/></g>
    <g data-part="wang" class="face-part"><circle cx="70" cy="66" r="7" fill="#f7a8c4" opacity=".75"/></g>
    <g data-part="oog" class="face-part"><circle cx="38" cy="54" r="8" fill="#fff" ${SW}/><g class="pupil"><circle cx="39" cy="55" r="4" fill="${INK}"/><circle cx="40.4" cy="53.6" r="1.4" fill="#fff"/></g></g>
    <g data-part="oog" class="face-part"><circle cx="62" cy="54" r="8" fill="#fff" ${SW}/><g class="pupil"><circle cx="63" cy="55" r="4" fill="${INK}"/><circle cx="64.4" cy="53.6" r="1.4" fill="#fff"/></g></g>
    <g data-part="neus" class="face-part"><path d="M50 60 q-6 8 0 10 q6 -2 0 -10z" fill="#f2c0a0" ${SW}/></g>
    <g data-part="mond" class="face-part"><path d="M38 76 q12 12 24 0z" fill="#e36b6b" ${SW}/><path d="M42 77 q8 4 16 0" fill="#fff" stroke="none"/></g>
  `);
}

/* Opzoeken op naam, voor het prentenboek en de boerderij */
const ART = { koe, hond, kat, eend, schaap, paard, kip, varken, kikker, vogel, vlinder,
  appel, banaan, brood, melk, koekje, bal, auto, boek, schoen, beer, bad, bed, boom, bloem, zon: () => sun(true), maan: moon };

export function byName(name) {
  const fn = ART[name];
  return fn ? fn() : shape('circle', '#cdb4f0');
}
