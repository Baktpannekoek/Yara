/* De savanne: warme lucht, bergen in de verte, acacia's, een drinkplaats en rotsen.
   Plekken voor leeuw, olifant, aap, giraf, zebra en krokodil. */

import { svg, sky, acacia, bush, grassTuft, pond, rock, mountain } from './parts.js';

function landscapeLayers() {
  const w = 200, h = 100;
  return [
    svg(w, h, sky(w, h, { top: '#ffd9a0', bottom: '#fff1d6', id: 'savsky' })),
    svg(w, h, `
      ${mountain(40, 62, 90, 34, '#d9c8a8')}${mountain(150, 62, 110, 40, '#cfbf9f')}${mountain(100, 62, 70, 24, '#e0d2b4')}
      <ellipse cx="60" cy="66" rx="120" ry="14" fill="#e8d894"/><ellipse cx="170" cy="68" rx="90" ry="12" fill="#e2d08a"/>
      ${acacia(16, 40, 1.2)}${acacia(118, 44, 0.9)}${acacia(190, 38, 1.1)}
      <rect x="0" y="58" width="200" height="42" fill="#d9c26e"/>`),
    svg(w, h, `
      ${pond(60, 80, 34, 8).replace('#ecd8a8', '#b9a96e')}
      ${rock(122, 70, 1.2)}${rock(184, 90, 1)}${bush(100, 66, 0.9)}${bush(150, 64, 1)}
      ${grassTuft(20, 92)}${grassTuft(90, 96)}${grassTuft(140, 94)}${grassTuft(170, 98)}
      <ellipse cx="100" cy="106" rx="140" ry="14" fill="#d0ba62"/>`),
    svg(w, h, `${grassTuft(34, 99, 1.2)}${grassTuft(110, 100, 1.2)}${grassTuft(196, 99)}`)
  ];
}
const landscapeSpots = [
  { id: 'giraf',    x: 150, y: 70,  zone: 'gras',  size: 34 },
  { id: 'zebra',    x: 108, y: 74,  zone: 'gras',  size: 22 },
  { id: 'aap',      x: 22,  y: 64,  zone: 'gras',  size: 18 },
  { id: 'krokodil', x: 60,  y: 84,  zone: 'water', size: 26 },
  { id: 'leeuw',    x: 170, y: 97,  zone: 'gras',  size: 32 },
  { id: 'olifant',  x: 40,  y: 100, zone: 'gras',  size: 36 }
];

function portraitLayers() {
  const w = 100, h = 150;
  return [
    svg(w, h, sky(w, h, { top: '#ffd9a0', bottom: '#fff1d6', id: 'savsky2' })),
    svg(w, h, `
      ${mountain(20, 92, 60, 26, '#d9c8a8')}${mountain(78, 92, 70, 32, '#cfbf9f')}
      <ellipse cx="30" cy="96" rx="70" ry="10" fill="#e8d894"/><ellipse cx="90" cy="98" rx="60" ry="9" fill="#e2d08a"/>
      ${acacia(10, 74, 0.9)}${acacia(90, 70, 1)}
      <rect x="0" y="92" width="100" height="58" fill="#d9c26e"/>`),
    svg(w, h, `
      ${pond(32, 118, 24, 6).replace('#ecd8a8', '#b9a96e')}
      ${rock(70, 104, 1)}${rock(94, 130, 0.9)}${bush(58, 100, 0.8)}
      ${grassTuft(12, 134)}${grassTuft(50, 140)}${grassTuft(84, 146)}
      <ellipse cx="50" cy="156" rx="80" ry="12" fill="#d0ba62"/>`),
    svg(w, h, `${grassTuft(24, 149, 1.2)}${grassTuft(70, 150, 1.2)}`)
  ];
}
const portraitSpots = [
  { id: 'giraf',    x: 70, y: 104, zone: 'gras',  size: 30 },
  { id: 'aap',      x: 24, y: 102, zone: 'gras',  size: 16 },
  { id: 'zebra',    x: 50, y: 110, zone: 'gras',  size: 20 },
  { id: 'krokodil', x: 32, y: 121, zone: 'water', size: 22 },
  { id: 'leeuw',    x: 70, y: 146, zone: 'gras',  size: 28 },
  { id: 'olifant',  x: 31, y: 150, zone: 'gras',  size: 32 }
];

export const savanne = {
  key: 'wild',
  landscape: { w: 200, h: 100, layers: landscapeLayers, spots: landscapeSpots },
  portrait: { w: 100, h: 150, layers: portraitLayers, spots: portraitSpots }
};
