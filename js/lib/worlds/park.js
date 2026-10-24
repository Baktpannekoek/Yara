/* Het park: bomen, een paadje, een bankje voor opa en oma, een zandbak en bloemen.
   Plekken voor mama, papa, opa, oma, baby en kindje. */

import { svg, sky, tree, bush, flower, path, bench, sandbox, pond } from './parts.js';

function landscapeLayers() {
  const w = 200, h = 100;
  return [
    svg(w, h, sky(w, h, { id: 'parksky' })),
    svg(w, h, `
      <ellipse cx="50" cy="60" rx="110" ry="20" fill="#c6e8b3"/><ellipse cx="160" cy="62" rx="100" ry="18" fill="#bfe4ab"/>
      ${tree(12, 32, 1.3, true)}${tree(60, 40, 0.9, true)}${tree(140, 36, 1.1, true)}${tree(190, 42, 0.9, true)}
      <rect x="0" y="54" width="200" height="46" fill="#9bd784"/>`),
    svg(w, h, `
      ${path('M-10 68 Q60 60 110 72 T210 66', 7)}
      ${pond(176, 84, 22, 6)}
      ${bench(118, 56, 1)}
      ${sandbox(14, 84, 1.1)}
      ${bush(70, 64, 1)}${bush(150, 68, 0.8)}
      <ellipse cx="100" cy="106" rx="140" ry="14" fill="#8fd27a"/>`),
    svg(w, h, `${flower(26, 96, '#f9a9c4')}${flower(62, 98, '#ffd45c')}${flower(100, 94, '#c9b1f2')}${flower(140, 97, '#f9a9c4')}${flower(194, 96, '#ffd45c')}`)
  ];
}
const landscapeSpots = [
  { id: 'opa',    x: 124, y: 66,  zone: 'bank', size: 22 },
  { id: 'oma',    x: 140, y: 67,  zone: 'bank', size: 22 },
  { id: 'papa',   x: 78,  y: 78,  zone: 'gras', size: 30 },
  { id: 'baby',   x: 30,  y: 90,  zone: 'zand', size: 16 },
  { id: 'kindje', x: 52,  y: 100, zone: 'gras', size: 22 },
  { id: 'mama',   x: 112, y: 100, zone: 'gras', size: 30 },
  { id: 'yara',   x: 168, y: 99,  zone: 'gras', size: 22 }
];

function portraitLayers() {
  const w = 100, h = 150;
  return [
    svg(w, h, sky(w, h, { id: 'parksky2' })),
    svg(w, h, `
      <ellipse cx="30" cy="92" rx="70" ry="14" fill="#c6e8b3"/><ellipse cx="90" cy="94" rx="60" ry="12" fill="#bfe4ab"/>
      ${tree(10, 68, 1, true)}${tree(90, 66, 1.1, true)}
      <rect x="0" y="86" width="100" height="64" fill="#9bd784"/>`),
    svg(w, h, `
      ${path('M-5 104 Q50 96 105 106', 6)}
      ${bench(58, 90, 0.8)}
      ${sandbox(6, 126, 0.9)}
      ${bush(40, 98, 0.7)}${bush(94, 118, 0.7)}
      <ellipse cx="50" cy="156" rx="80" ry="12" fill="#8fd27a"/>`),
    svg(w, h, `${flower(14, 144, '#f9a9c4')}${flower(50, 148, '#ffd45c')}${flower(84, 146, '#c9b1f2')}`)
  ];
}
const portraitSpots = [
  { id: 'opa',    x: 62, y: 98,  zone: 'bank', size: 18 },
  { id: 'oma',    x: 76, y: 99,  zone: 'bank', size: 18 },
  { id: 'papa',   x: 30, y: 112, zone: 'gras', size: 26 },
  { id: 'baby',   x: 24, y: 130, zone: 'zand', size: 14 },
  { id: 'kindje', x: 46, y: 126, zone: 'gras', size: 18 },
  { id: 'mama',   x: 72, y: 146, zone: 'gras', size: 26 },
  { id: 'yara',   x: 40, y: 150, zone: 'gras', size: 20 }
];

export const park = {
  key: 'people',
  extras: [{ key: 'yara', name: 'yara', question: 'Waar is Yara?' }],
  landscape: { w: 200, h: 100, layers: landscapeLayers, spots: landscapeSpots },
  portrait: { w: 100, h: 150, layers: portraitLayers, spots: portraitSpots }
};
