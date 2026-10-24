/* De boerderijwereld: lagen met diepte en vaste plekken.
   Staand (100 x 150) en liggend (200 x 100) hebben elk hun eigen indeling, zodat de vijver,
   het spoor en het hek altijd op een logische plek staan. */

import { INK } from '../style.js';

const tree = (x, y, s = 1, dark = false) => `
  <g class="tree" style="transform-origin:${x}px ${y + 16 * s}px">
    <rect x="${x - 2.5 * s}" y="${y + 2 * s}" width="${5 * s}" height="${14 * s}" rx="2" fill="#8a5a3b"/>
    <circle cx="${x}" cy="${y - 2 * s}" r="${10 * s}" fill="${dark ? '#6fbe63' : '#8fd27a'}"/>
    <circle cx="${x - 7 * s}" cy="${y + 2 * s}" r="${7 * s}" fill="${dark ? '#6fbe63' : '#8fd27a'}"/>
    <circle cx="${x + 7 * s}" cy="${y + 2 * s}" r="${7 * s}" fill="${dark ? '#6fbe63' : '#8fd27a'}"/>
    <circle cx="${x - 3 * s}" cy="${y - 6 * s}" r="${4 * s}" fill="#a8e096" opacity=".7"/>
  </g>`;
const bush = (x, y, s = 1) => `<g><circle cx="${x}" cy="${y}" r="${6 * s}" fill="#a7d98f"/><circle cx="${x - 5 * s}" cy="${y + 2 * s}" r="${4.5 * s}" fill="#a7d98f"/><circle cx="${x + 5 * s}" cy="${y + 2 * s}" r="${4.5 * s}" fill="#9bd784"/></g>`;
const flower = (x, y, c) => `<g class="flower" style="transform-origin:${x}px ${y + 4}px"><path d="M${x} ${y} v4" stroke="#5fae57" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="2.4" fill="${c}"/><circle cx="${x}" cy="${y}" r="1" fill="#fff4dc"/></g>`;
const fence = (x0, x1, y, step = 14) => {
  let s = `<path d="M${x0} ${y - 6} H${x1}" stroke="#c58a52" stroke-width="2.2"/><path d="M${x0} ${y - 1} H${x1}" stroke="#c58a52" stroke-width="2.2"/>`;
  for (let x = x0; x <= x1; x += step) s += `<rect x="${x - 1.5}" y="${y - 10}" width="3" height="13" rx="1.5" fill="#d9a066" stroke="#a9733f" stroke-width=".8"/>`;
  return s;
};
const barn = (x, y, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 16 L20 2 L40 16 V40 H0z" fill="#f0766a"/><path d="M0 16 L20 2 L40 16" fill="none" stroke="${INK}" stroke-width="2.2"/>
    <path d="M0 40 H40" stroke="#c45b52" stroke-width="2"/>
    <rect x="13" y="22" width="14" height="18" fill="#7d5236"/><path d="M13 22 L27 40 M27 22 L13 40" stroke="#fff4dc" stroke-width="1.5"/>
    <circle cx="20" cy="12" r="3.5" fill="#fff4dc" stroke="${INK}" stroke-width="1.5"/>
  </g>`;
const pond = (cx, cy, rx, ry) => `
  <ellipse cx="${cx}" cy="${cy}" rx="${rx + 3}" ry="${ry + 1.5}" fill="#ecd8a8"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#8fcbea"/>
  <ellipse cx="${cx - rx * 0.3}" cy="${cy - ry * 0.2}" rx="${rx * 0.35}" ry="${ry * 0.3}" fill="#a9d8f0"/>
  <g class="ripple-still"><path d="M${cx - rx * 0.5} ${cy + ry * 0.4} q${rx * 0.2} -1.5 ${rx * 0.4} 0" fill="none" stroke="#fff" stroke-width="1" opacity=".8"/><path d="M${cx + rx * 0.1} ${cy - ry * 0.3} q${rx * 0.2} -1.5 ${rx * 0.4} 0" fill="none" stroke="#fff" stroke-width="1" opacity=".8"/></g>
  <ellipse cx="${cx + rx * 0.6}" cy="${cy + ry * 0.5}" rx="3" ry="1.4" fill="#6fbe63"/>`;
const track = (x0, x1, y) => {
  let s = `<path d="M${x0} ${y - 3} H${x1}" stroke="#aeb2c0" stroke-width="1.2"/><path d="M${x0} ${y} H${x1}" stroke="#aeb2c0" stroke-width="1.2"/>`;
  for (let x = x0; x <= x1; x += 5) s += `<rect x="${x}" y="${y - 4.5}" width="2.2" height="6" fill="#a9733f"/>`;
  return `<g>${s.split('<path').length ? s : s}</g>`.replace(/<rect[^>]*>/g, (m) => m) ;
};
const sky = (w, h) => `
  <defs><linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd4f3"/><stop offset="1" stop-color="#dff1fb"/></linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#bsky)"/>
  <g class="sun-glow"><circle cx="${w * 0.84}" cy="${h * 0.14}" r="${w * 0.07}" fill="#ffe08a" opacity=".5"/><circle cx="${w * 0.84}" cy="${h * 0.14}" r="${w * 0.05}" fill="#ffd45c"/></g>
  <g class="clouds" fill="#fff" opacity=".9">
    <ellipse cx="${w * 0.2}" cy="${h * 0.16}" rx="${w * 0.07}" ry="${w * 0.028}"/><ellipse cx="${w * 0.24}" cy="${h * 0.13}" rx="${w * 0.045}" ry="${w * 0.03}"/>
    <ellipse cx="${w * 0.58}" cy="${h * 0.1}" rx="${w * 0.06}" ry="${w * 0.024}"/><ellipse cx="${w * 0.62}" cy="${h * 0.08}" rx="${w * 0.035}" ry="${w * 0.025}"/>
  </g>`;

function svg(w, h, inner) {
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}

/* ---------- Liggend: 200 x 100 ---------- */
function landscapeLayers() {
  const w = 200, h = 100;
  return [
    svg(w, h, sky(w, h)),
    svg(w, h, `
      <ellipse cx="50" cy="60" rx="110" ry="22" fill="#c6e8b3"/><ellipse cx="160" cy="62" rx="100" ry="20" fill="#bfe4ab"/>
      ${tree(14, 36, 1.1, true)}${tree(36, 40, 0.8, true)}${tree(176, 34, 1.2, true)}${tree(196, 40, 0.9, true)}
      ${barn(128, 20, 0.9)}
      <rect x="0" y="48" width="200" height="52" fill="#9bd784"/>`),
    svg(w, h, `
      ${track(0, 200, 58)}
      ${fence(44, 120, 66, 12)}
      ${pond(152, 76, 30, 8)}
      ${bush(6, 72, 1.1)}${bush(104, 70, 0.9)}${bush(196, 74, 1)}
      <ellipse cx="100" cy="106" rx="140" ry="14" fill="#8fd27a"/>`),
    svg(w, h, `
      ${flower(22, 92, '#f9a9c4')}${flower(60, 96, '#ffd45c')}${flower(92, 90, '#c9b1f2')}${flower(130, 97, '#f9a9c4')}${flower(170, 94, '#ffd45c')}${flower(190, 98, '#c9b1f2')}`)
  ];
}
const landscapeSpots = [
  { id: 'trein',  x: 64,  y: 59,  zone: 'spoor', size: 30 },
  { id: 'schaap', x: 18,  y: 70,  zone: 'gras',  size: 20 },
  { id: 'kip',    x: 96,  y: 72,  zone: 'gras',  size: 15 },
  { id: 'kat',    x: 118, y: 73,  zone: 'gras',  size: 15 },
  { id: 'eend',   x: 150, y: 78,  zone: 'water', size: 15 },
  { id: 'kikker', x: 184, y: 82,  zone: 'gras',  size: 12 },
  { id: 'koe',    x: 44,  y: 96,  zone: 'gras',  size: 32 },
  { id: 'varken', x: 92,  y: 98,  zone: 'gras',  size: 22 },
  { id: 'hond',   x: 128, y: 98,  zone: 'gras',  size: 22 },
  { id: 'paard',  x: 172, y: 99,  zone: 'gras',  size: 30 },
  { id: 'vogel',  x: 36,  y: 44,  zone: 'lucht', size: 10 }
];

/* ---------- Staand: 100 x 150 ---------- */
function portraitLayers() {
  const w = 100, h = 150;
  return [
    svg(w, h, sky(w, h)),
    svg(w, h, `
      <ellipse cx="30" cy="92" rx="70" ry="18" fill="#c6e8b3"/><ellipse cx="90" cy="94" rx="60" ry="16" fill="#bfe4ab"/>
      ${tree(10, 70, 0.9, true)}${tree(92, 68, 1, true)}
      ${barn(56, 56, 0.6)}
      <rect x="0" y="84" width="100" height="66" fill="#9bd784"/>`),
    svg(w, h, `
      ${track(0, 100, 92)}
      ${fence(4, 62, 100, 10)}
      ${pond(72, 114, 22, 6)}
      ${bush(4, 106, 0.9)}${bush(96, 104, 0.8)}
      <ellipse cx="50" cy="156" rx="80" ry="12" fill="#8fd27a"/>`),
    svg(w, h, `${flower(8, 140, '#f9a9c4')}${flower(30, 146, '#ffd45c')}${flower(58, 142, '#c9b1f2')}${flower(88, 147, '#f9a9c4')}`)
  ];
}
const portraitSpots = [
  { id: 'trein',  x: 34, y: 93,  zone: 'spoor', size: 26 },
  { id: 'vogel',  x: 86, y: 78,  zone: 'lucht', size: 9 },
  { id: 'schaap', x: 12, y: 108, zone: 'gras',  size: 17 },
  { id: 'kip',    x: 40, y: 110, zone: 'gras',  size: 13 },
  { id: 'eend',   x: 70, y: 116, zone: 'water', size: 13 },
  { id: 'kat',    x: 92, y: 120, zone: 'gras',  size: 13 },
  { id: 'kikker', x: 50, y: 124, zone: 'gras',  size: 10 },
  { id: 'koe',    x: 24, y: 142, zone: 'gras',  size: 27 },
  { id: 'varken', x: 54, y: 146, zone: 'gras',  size: 19 },
  { id: 'hond',   x: 78, y: 140, zone: 'gras',  size: 18 },
  { id: 'paard',  x: 92, y: 150, zone: 'gras',  size: 24 }
];

export const boerderij = {
  key: 'farm',
  // Vaste bewoners van deze wereld, naast de dieren uit de groep
  extras: [{ key: 'trein', name: 'trein', question: 'Wat zegt de trein? Tsjoeke tsjoeke!' }],
  landscape: { w: 200, h: 100, layers: landscapeLayers, spots: landscapeSpots },
  portrait: { w: 100, h: 150, layers: portraitLayers, spots: portraitSpots }
};
