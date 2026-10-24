/* Het stadje met haven: huisjes, een weg voor auto's, een spoor, water voor de boot en lucht
   voor het vliegtuig. Plekken voor auto, vliegtuig, trein, bus, tractor, boot, brandweerauto en fiets. */

import { svg, sky, tree, palm, house, road, track, water, bush, flower } from './parts.js';

function landscapeLayers() {
  const w = 200, h = 100;
  return [
    svg(w, h, sky(w, h, { id: 'stadsky' })),
    svg(w, h, `
      <ellipse cx="40" cy="58" rx="100" ry="18" fill="#c6e8b3"/><ellipse cx="150" cy="60" rx="90" ry="16" fill="#bfe4ab"/>
      ${house(12, 28, 0.8, '#ffd45c', '#f0766a')}${house(44, 24, 1, '#f9a9c4', '#5fae57')}${house(84, 30, 0.75, '#c9b1f2', '#f0766a')}
      ${tree(32, 38, 0.8, true)}${tree(110, 40, 0.9, true)}
      ${water(126, 200, 44, 100)}
      <path d="M126 44 V100" stroke="#ecd8a8" stroke-width="5"/>
      ${palm(132, 30, 1)}
      <rect x="0" y="52" width="126" height="48" fill="#9bd784"/>`),
    svg(w, h, `
      ${track(0, 126, 62)}
      ${road(0, 126, 80, 14)}
      <rect x="118" y="74" width="12" height="26" fill="#c58a52"/><path d="M118 80 H130 M118 88 H130 M118 96 H130" stroke="#a9733f" stroke-width="1.5"/>
      ${bush(6, 70, 0.9)}${bush(104, 70, 0.8)}
      <ellipse cx="60" cy="106" rx="90" ry="12" fill="#8fd27a"/>`),
    svg(w, h, `${flower(14, 96, '#f9a9c4')}${flower(50, 98, '#ffd45c')}${flower(96, 97, '#c9b1f2')}`)
  ];
}
const landscapeSpots = [
  { id: 'vliegtuig',     x: 150, y: 28, zone: 'lucht', size: 30 },
  { id: 'trein',         x: 40,  y: 63, zone: 'spoor', size: 26 },
  { id: 'tractor',       x: 96,  y: 64, zone: 'gras',  size: 24 },
  { id: 'boot',          x: 164, y: 72, zone: 'water', size: 30 },
  { id: 'auto',          x: 24,  y: 83, zone: 'weg',   size: 22 },
  { id: 'bus',           x: 66,  y: 84, zone: 'weg',   size: 30 },
  { id: 'brandweerauto', x: 108, y: 85, zone: 'weg',   size: 30 },
  { id: 'fiets',         x: 46,  y: 99, zone: 'gras',  size: 20 }
];

function portraitLayers() {
  const w = 100, h = 150;
  return [
    svg(w, h, sky(w, h, { id: 'stadsky2' })),
    svg(w, h, `
      <ellipse cx="30" cy="88" rx="70" ry="12" fill="#c6e8b3"/><ellipse cx="90" cy="90" rx="50" ry="10" fill="#bfe4ab"/>
      ${house(6, 64, 0.6, '#ffd45c', '#f0766a')}${house(30, 60, 0.75, '#f9a9c4', '#5fae57')}${house(58, 66, 0.55, '#c9b1f2', '#f0766a')}
      ${tree(24, 72, 0.6, true)}${tree(74, 74, 0.7, true)}
      <rect x="0" y="84" width="100" height="66" fill="#9bd784"/>
      ${water(0, 100, 118, 136)}
      <path d="M0 118 H100" stroke="#ecd8a8" stroke-width="4"/>
      ${palm(92, 100, 0.8)}`),
    svg(w, h, `
      ${track(0, 100, 92)}
      ${road(0, 100, 106, 11)}
      <rect x="0" y="136" width="100" height="14" fill="#9bd784"/>
      ${bush(4, 88, 0.7)}${bush(96, 88, 0.6)}
      <ellipse cx="50" cy="156" rx="80" ry="10" fill="#8fd27a"/>`),
    svg(w, h, `${flower(10, 146, '#f9a9c4')}${flower(60, 148, '#ffd45c')}`)
  ];
}
const portraitSpots = [
  { id: 'vliegtuig',     x: 72, y: 46,  zone: 'lucht', size: 24 },
  { id: 'trein',         x: 30, y: 93,  zone: 'spoor', size: 22 },
  { id: 'tractor',       x: 74, y: 94,  zone: 'gras',  size: 18 },
  { id: 'auto',          x: 26, y: 108, zone: 'weg',   size: 18 },
  { id: 'bus',           x: 52, y: 109, zone: 'weg',   size: 24 },
  { id: 'brandweerauto', x: 74, y: 109, zone: 'weg',   size: 22 },
  { id: 'boot',          x: 58, y: 130, zone: 'water', size: 26 },
  { id: 'fiets',         x: 27, y: 148, zone: 'gras',  size: 17 }
];

export const stadje = {
  key: 'vehicles',
  landscape: { w: 200, h: 100, layers: landscapeLayers, spots: landscapeSpots },
  portrait: { w: 100, h: 150, layers: portraitLayers, spots: portraitSpots }
};
