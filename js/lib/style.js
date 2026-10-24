/* Tekenstijl van de bibliotheek: dikke lijnen, twee tinten per kleur, grote ogen.
   Elk figuur is opgebouwd uit delen (data-part) met een eigen draaipunt (data-pivot),
   zodat de animatiemotor ze apart kan bewegen. */

export const INK = '#2f3542';
export const SW = 3;
export const L = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;
export const L2 = `stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;

export const PAL = {
  wit: '#ffffff', creme: '#fff4dc', geel: '#ffd45c', oranje: '#ffa640', rood: '#f0766a', roze: '#f9a9c4',
  lila: '#c9b1f2', blauw: '#7fc4ef', groen: '#8fd27a', donkergroen: '#5fae57', bruin: '#c58a52', donkerbruin: '#7d5236',
  grijs: '#aeb2c0', huid: '#ffd9b8', zwart: '#2f3542', water: '#8fcbea', gras: '#9bd784', zand: '#ecd8a8'
};

/* Donkerder of lichter maken van een hex-kleur, voor de schaduwtint */
export function shade(hex, amt = -0.16) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v + (amt < 0 ? v * amt : (255 - v) * amt))));
  const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255);
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

/* Een deel met draaipunt. De rig zet daar later transform-origin op. */
export function part(name, px, py, inner, extra = '') {
  return `<g data-part="${name}" data-pivot="${px} ${py}" ${extra}>${inner}</g>`;
}

/* Een oog dat kan knipperen (hele oog) en kijken (pupil) */
export function eye(name, cx, cy, r = 6, lid = null) {
  return part(name, cx, cy, `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" ${L2}/>
    ${part(name + '-pupil', cx, cy, `
      <circle cx="${cx + r * 0.15}" cy="${cy + r * 0.12}" r="${r * 0.52}" fill="${INK}"/>
      <circle cx="${cx + r * 0.38}" cy="${cy - r * 0.3}" r="${r * 0.2}" fill="#fff"/>`)}
    ${lid ? `<path d="M${cx - r} ${cy - r * 0.2} q${r} ${-r * 1.1} ${r * 2} 0" fill="none" ${L2}/>` : ''}`);
}

/* Blosjes */
export function cheeks(lx, rx, y, r = 4.5) {
  return `<circle cx="${lx}" cy="${y}" r="${r}" fill="#f9a9c4" opacity=".75"/><circle cx="${rx}" cy="${y}" r="${r}" fill="#f9a9c4" opacity=".75"/>`;
}

/* Grondschaduw */
export function shadow(cx, cy, rx, ry = rx * 0.22) {
  return `<ellipse data-shadow="1" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="rgba(47,53,66,.14)"/>`;
}

export function svgWrap(inner, vb = '0 0 120 120', extra = '') {
  return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" ${extra}>${inner}</svg>`;
}
