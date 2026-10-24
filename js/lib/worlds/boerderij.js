/* De boerderijwereld: lagen met diepte en vaste plekken.
   Staand (100 x 150) en liggend (200 x 100) hebben elk hun eigen indeling, zodat de vijver,
   het spoor en het hek altijd op een logische plek staan. */

import { svg, sky, tree, bush, flower, fence, barn, pond, track } from './parts.js';

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
  { id: 'vogel',  x: 76, y: 78,  zone: 'lucht', size: 9 },
  { id: 'schaap', x: 25, y: 108, zone: 'gras',  size: 17 },
  { id: 'kip',    x: 40, y: 110, zone: 'gras',  size: 13 },
  { id: 'eend',   x: 70, y: 116, zone: 'water', size: 13 },
  { id: 'kat',    x: 77, y: 120, zone: 'gras',  size: 13 },
  { id: 'kikker', x: 50, y: 124, zone: 'gras',  size: 10 },
  { id: 'koe',    x: 28, y: 142, zone: 'gras',  size: 27 },
  { id: 'varken', x: 54, y: 146, zone: 'gras',  size: 19 },
  { id: 'hond',   x: 74, y: 138, zone: 'gras',  size: 18 },
  { id: 'paard',  x: 72, y: 150, zone: 'gras',  size: 24 }
];

export const boerderij = {
  key: 'farm',
  // Vaste bewoners van deze wereld, naast de dieren uit de groep
  extras: [{ key: 'trein', name: 'trein', question: 'Wat zegt de trein? Tsjoeke tsjoeke!' }],
  landscape: { w: 200, h: 100, layers: landscapeLayers, spots: landscapeSpots },
  portrait: { w: 100, h: 150, layers: portraitLayers, spots: portraitSpots }
};
