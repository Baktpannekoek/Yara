/* Gedeelde bouwstenen voor werelden: lucht, bomen, struiken, bloemen, hekken, water, wegen */

import { INK } from '../style.js';

export const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

export const sky = (w, h, { top = '#9fd4f3', bottom = '#dff1fb', sun = true, id = 'sky' } = {}) => `
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#${id})"/>
  ${sun ? `<g class="sun-glow"><circle cx="${w * 0.84}" cy="${h * 0.14}" r="${w * 0.07}" fill="#ffe08a" opacity=".5"/><circle cx="${w * 0.84}" cy="${h * 0.14}" r="${w * 0.05}" fill="#ffd45c"/></g>` : ''}
  <g class="clouds" fill="#fff" opacity=".9">
    <ellipse cx="${w * 0.2}" cy="${h * 0.16}" rx="${w * 0.07}" ry="${w * 0.028}"/><ellipse cx="${w * 0.24}" cy="${h * 0.13}" rx="${w * 0.045}" ry="${w * 0.03}"/>
    <ellipse cx="${w * 0.58}" cy="${h * 0.1}" rx="${w * 0.06}" ry="${w * 0.024}"/><ellipse cx="${w * 0.62}" cy="${h * 0.08}" rx="${w * 0.035}" ry="${w * 0.025}"/>
  </g>`;

export const tree = (x, y, s = 1, dark = false) => `
  <g class="tree" style="transform-origin:${x}px ${y + 16 * s}px">
    <rect x="${x - 2.5 * s}" y="${y + 2 * s}" width="${5 * s}" height="${14 * s}" rx="2" fill="#8a5a3b"/>
    <circle cx="${x}" cy="${y - 2 * s}" r="${10 * s}" fill="${dark ? '#6fbe63' : '#8fd27a'}"/>
    <circle cx="${x - 7 * s}" cy="${y + 2 * s}" r="${7 * s}" fill="${dark ? '#6fbe63' : '#8fd27a'}"/>
    <circle cx="${x + 7 * s}" cy="${y + 2 * s}" r="${7 * s}" fill="${dark ? '#6fbe63' : '#8fd27a'}"/>
    <circle cx="${x - 3 * s}" cy="${y - 6 * s}" r="${4 * s}" fill="#a8e096" opacity=".7"/>
  </g>`;

/* Acacia voor de savanne: platte kruin op een dunne stam */
export const acacia = (x, y, s = 1) => `
  <g class="tree" style="transform-origin:${x}px ${y + 18 * s}px">
    <path d="M${x} ${y + 18 * s} q${-2 * s} ${-10 * s} ${-6 * s} ${-14 * s} M${x} ${y + 18 * s} q${2 * s} ${-10 * s} ${6 * s} ${-14 * s}" fill="none" stroke="#8a5a3b" stroke-width="${2.5 * s}" stroke-linecap="round"/>
    <rect x="${x - 2 * s}" y="${y + 2 * s}" width="${4 * s}" height="${16 * s}" rx="2" fill="#8a5a3b"/>
    <ellipse cx="${x}" cy="${y + 2 * s}" rx="${16 * s}" ry="${5 * s}" fill="#7cc06c"/><ellipse cx="${x - 4 * s}" cy="${y - 1 * s}" rx="${9 * s}" ry="${4 * s}" fill="#8fd27a"/>
  </g>`;

/* Palm voor de haven */
export const palm = (x, y, s = 1) => `
  <g class="tree" style="transform-origin:${x}px ${y + 20 * s}px">
    <path d="M${x} ${y + 20 * s} q${-2 * s} ${-12 * s} ${2 * s} ${-20 * s}" fill="none" stroke="#a9733f" stroke-width="${3 * s}" stroke-linecap="round"/>
    ${[-150, -110, -70, -30, 10].map((a) => `<path d="M${x + 2 * s} ${y} q${8 * s * Math.cos(a * Math.PI / 180)} ${8 * s * Math.sin(a * Math.PI / 180)} ${16 * s * Math.cos(a * Math.PI / 180)} ${16 * s * Math.sin(a * Math.PI / 180) + 4 * s}" fill="none" stroke="#6fbe63" stroke-width="${3.5 * s}" stroke-linecap="round"/>`).join('')}
  </g>`;

export const bush = (x, y, s = 1) => `<g><circle cx="${x}" cy="${y}" r="${6 * s}" fill="#a7d98f"/><circle cx="${x - 5 * s}" cy="${y + 2 * s}" r="${4.5 * s}" fill="#a7d98f"/><circle cx="${x + 5 * s}" cy="${y + 2 * s}" r="${4.5 * s}" fill="#9bd784"/></g>`;

export const flower = (x, y, c) => `<g class="flower" style="transform-origin:${x}px ${y + 4}px"><path d="M${x} ${y} v4" stroke="#5fae57" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="2.4" fill="${c}"/><circle cx="${x}" cy="${y}" r="1" fill="#fff4dc"/></g>`;

export const grassTuft = (x, y, s = 1) => `<path d="M${x - 3 * s} ${y} q1 -5 3 -8 M${x} ${y} q0 -6 1 -9 M${x + 3 * s} ${y} q-1 -5 -3 -8" fill="none" stroke="#6fbe63" stroke-width="1.2" stroke-linecap="round"/>`;

export const fence = (x0, x1, y, step = 14) => {
  let s = `<path d="M${x0} ${y - 6} H${x1}" stroke="#c58a52" stroke-width="2.2"/><path d="M${x0} ${y - 1} H${x1}" stroke="#c58a52" stroke-width="2.2"/>`;
  for (let x = x0; x <= x1; x += step) s += `<rect x="${x - 1.5}" y="${y - 10}" width="3" height="13" rx="1.5" fill="#d9a066" stroke="#a9733f" stroke-width=".8"/>`;
  return s;
};

export const barn = (x, y, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 16 L20 2 L40 16 V40 H0z" fill="#f0766a"/><path d="M0 16 L20 2 L40 16" fill="none" stroke="${INK}" stroke-width="2.2"/>
    <path d="M0 40 H40" stroke="#c45b52" stroke-width="2"/>
    <rect x="13" y="22" width="14" height="18" fill="#7d5236"/><path d="M13 22 L27 40 M27 22 L13 40" stroke="#fff4dc" stroke-width="1.5"/>
    <circle cx="20" cy="12" r="3.5" fill="#fff4dc" stroke="${INK}" stroke-width="1.5"/>
  </g>`;

export const house = (x, y, s = 1, color = '#ffd45c', roof = '#f0766a') => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <rect x="2" y="14" width="30" height="26" fill="${color}"/><path d="M0 15 L17 2 L34 15z" fill="${roof}" stroke="${INK}" stroke-width="2"/>
    <rect x="2" y="14" width="30" height="26" fill="none" stroke="${INK}" stroke-width="2"/>
    <rect x="7" y="20" width="7" height="7" fill="#e3f2fb" stroke="${INK}" stroke-width="1.2"/><rect x="20" y="20" width="7" height="7" fill="#e3f2fb" stroke="${INK}" stroke-width="1.2"/>
    <rect x="13" y="29" width="8" height="11" fill="#7d5236" stroke="${INK}" stroke-width="1.2"/>
  </g>`;

export const pond = (cx, cy, rx, ry) => `
  <ellipse cx="${cx}" cy="${cy}" rx="${rx + 3}" ry="${ry + 1.5}" fill="#ecd8a8"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#8fcbea"/>
  <ellipse cx="${cx - rx * 0.3}" cy="${cy - ry * 0.2}" rx="${rx * 0.35}" ry="${ry * 0.3}" fill="#a9d8f0"/>
  <path d="M${cx - rx * 0.5} ${cy + ry * 0.4} q${rx * 0.2} -1.5 ${rx * 0.4} 0" fill="none" stroke="#fff" stroke-width="1" opacity=".8"/><path d="M${cx + rx * 0.1} ${cy - ry * 0.3} q${rx * 0.2} -1.5 ${rx * 0.4} 0" fill="none" stroke="#fff" stroke-width="1" opacity=".8"/>
  <ellipse cx="${cx + rx * 0.6}" cy="${cy + ry * 0.5}" rx="3" ry="1.4" fill="#6fbe63"/>`;

/* Open water (haven, rivier) als band */
export const water = (x0, x1, y0, y1) => `
  <rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="#8fcbea"/>
  <g class="waves">${[0.2, 0.45, 0.7].map((f) => `<path d="M${x0} ${y0 + (y1 - y0) * f} q6 -2 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0" fill="none" stroke="#fff" stroke-width="1" opacity=".7"/>`).join('')}</g>`;

export const track = (x0, x1, y) => {
  let s = `<path d="M${x0} ${y - 3} H${x1}" stroke="#aeb2c0" stroke-width="1.2"/><path d="M${x0} ${y} H${x1}" stroke="#aeb2c0" stroke-width="1.2"/>`;
  for (let x = x0; x <= x1; x += 5) s += `<rect x="${x}" y="${y - 4.5}" width="2.2" height="6" fill="#a9733f"/>`;
  return `<g>${s}</g>`;
};

export const road = (x0, x1, y, h = 12) => `
  <rect x="${x0}" y="${y - h / 2}" width="${x1 - x0}" height="${h}" fill="#9a9eaa"/>
  <path d="M${x0} ${y} H${x1}" stroke="#fff4dc" stroke-width="1.4" stroke-dasharray="5 4"/>`;

export const path = (d, w = 6) => `<path d="${d}" fill="none" stroke="#ecd8a8" stroke-width="${w}" stroke-linecap="round"/>`;

export const bench = (x, y, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <rect x="0" y="0" width="30" height="4" rx="1.5" fill="#c58a52" stroke="${INK}" stroke-width="1"/><rect x="0" y="7" width="30" height="4" rx="1.5" fill="#c58a52" stroke="${INK}" stroke-width="1"/>
    <rect x="3" y="11" width="3" height="8" fill="#7d5236"/><rect x="24" y="11" width="3" height="8" fill="#7d5236"/>
  </g>`;

export const sandbox = (x, y, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <rect x="0" y="0" width="34" height="14" rx="3" fill="#ecd8a8" stroke="#c58a52" stroke-width="2"/>
    <circle cx="10" cy="6" r="3" fill="#f0766a"/><rect x="20" y="3" width="7" height="6" fill="#7fc4ef"/>
  </g>`;

export const rock = (x, y, s = 1) => `<ellipse cx="${x}" cy="${y}" rx="${8 * s}" ry="${4 * s}" fill="#b8bcc8"/><ellipse cx="${x - 2 * s}" cy="${y - 1.5 * s}" rx="${4 * s}" ry="${2 * s}" fill="#cfd3dd"/>`;

export const mountain = (x, y, w, h, c = '#c4ccd6') => `<path d="M${x - w / 2} ${y} L${x} ${y - h} L${x + w / 2} ${y}z" fill="${c}"/><path d="M${x - w * 0.18} ${y - h * 0.62} L${x} ${y - h} L${x + w * 0.18} ${y - h * 0.62} q-${w * 0.09} ${h * 0.08} -${w * 0.18} 0z" fill="#fff"/>`;
