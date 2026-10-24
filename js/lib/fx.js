/* Effecten: korte deeltjes bij een tik. Stoom, stof, sterretjes, spetters, hartjes, noten.
   Alles tekent in een eigen laag boven de figuren en ruimt zichzelf op. */

const INK = '#2f3542';
let layer = null;

export function setLayer(el) { layer = el; }

function spawn(x, y, size, inner, keyframes, opts) {
  if (!layer) return;
  const el = document.createElement('div');
  el.className = 'fx';
  el.style.left = `${x - size / 2}px`;
  el.style.top = `${y - size / 2}px`;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.innerHTML = inner;
  layer.appendChild(el);
  const a = el.animate(keyframes, { fill: 'forwards', ...opts });
  a.onfinish = () => el.remove();
  setTimeout(() => el.remove(), (opts.duration || 800) + (opts.delay || 0) + 200);
}

const vmin = () => Math.min(window.innerWidth, window.innerHeight) / 100;

/* Stoomwolkjes die opstijgen en uitwaaieren */
export function steam(x, y, n = 4) {
  for (let i = 0; i < n; i++) {
    const s = (5 + Math.random() * 4) * vmin();
    spawn(x + (Math.random() - 0.5) * 2 * vmin(), y, s,
      `<svg viewBox="0 0 40 40"><circle cx="20" cy="22" r="12" fill="#fff" opacity=".95"/><circle cx="11" cy="26" r="8" fill="#fff" opacity=".95"/><circle cx="29" cy="26" r="8" fill="#fff" opacity=".95"/></svg>`,
      [{ transform: 'translate(0,0) scale(.4)', opacity: 0 }, { opacity: 0.9, offset: 0.2 }, { transform: `translate(${(Math.random() - 0.3) * 6 * vmin()}px, ${-(14 + Math.random() * 8) * vmin()}px) scale(1.4)`, opacity: 0 }],
      { duration: 1400 + Math.random() * 600, delay: i * 160, easing: 'ease-out' });
  }
}

/* Stof bij een landing: naar opzij en omlaag uitdovend */
export function dust(x, y, n = 6) {
  for (let i = 0; i < n; i++) {
    const s = (2 + Math.random() * 2) * vmin();
    const dir = i % 2 ? 1 : -1;
    spawn(x, y, s, `<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#e6d3a3" opacity=".9"/></svg>`,
      [{ transform: 'translate(0,0) scale(.6)', opacity: 0.9 }, { transform: `translate(${dir * (4 + Math.random() * 6) * vmin()}px, ${-(1 + Math.random() * 3) * vmin()}px) scale(1.2)`, opacity: 0 }],
      { duration: 500 + Math.random() * 300, easing: 'ease-out' });
  }
}

export function sparkles(x, y, n = 7, color = '#ffd45c') {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + Math.random() * 0.5;
    const d = (6 + Math.random() * 8) * vmin();
    const s = (2.2 + Math.random() * 2) * vmin();
    spawn(x, y, s, `<svg viewBox="0 0 20 20"><path d="M10 1 L12.5 7.5 L19 10 L12.5 12.5 L10 19 L7.5 12.5 L1 10 L7.5 7.5z" fill="${color}" stroke="${INK}" stroke-width="1"/></svg>`,
      [{ transform: 'translate(0,0) scale(.2) rotate(0)', opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px) scale(1) rotate(90deg)`, opacity: 0 }],
      { duration: 650 + Math.random() * 250, easing: 'ease-out' });
  }
}

export function hearts(x, y, n = 4) {
  for (let i = 0; i < n; i++) {
    const s = (3 + Math.random() * 2.5) * vmin();
    spawn(x + (Math.random() - 0.5) * 8 * vmin(), y, s, `<svg viewBox="0 0 20 20"><path d="M10 18 L3 11 A4 4 0 0 1 10 6 A4 4 0 0 1 17 11z" fill="#f9a9c4" stroke="${INK}" stroke-width="1"/></svg>`,
      [{ transform: 'translateY(0) scale(.5)', opacity: 0 }, { opacity: 1, offset: 0.2 }, { transform: `translateY(${-(10 + Math.random() * 6) * vmin()}px) scale(1.1)`, opacity: 0 }],
      { duration: 1100 + Math.random() * 400, delay: i * 120, easing: 'ease-out' });
  }
}

export function notes(x, y, n = 3) {
  for (let i = 0; i < n; i++) {
    const s = (3 + Math.random() * 2) * vmin();
    spawn(x + (Math.random() - 0.5) * 6 * vmin(), y, s, `<svg viewBox="0 0 20 20"><ellipse cx="7" cy="15" rx="4" ry="3" fill="#c9b1f2" stroke="${INK}" stroke-width="1"/><path d="M11 15 V3 l5 2" fill="none" stroke="${INK}" stroke-width="1.6"/></svg>`,
      [{ transform: 'translate(0,0) rotate(-10deg)', opacity: 0 }, { opacity: 1, offset: 0.2 }, { transform: `translate(${(Math.random() - 0.5) * 6 * vmin()}px, ${-12 * vmin()}px) rotate(10deg)`, opacity: 0 }],
      { duration: 1200, delay: i * 150, easing: 'ease-out' });
  }
}

/* Spetters uit het water */
export function splash(x, y, n = 7) {
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i / (n - 1) - 0.5) * 1.6;
    const d = (5 + Math.random() * 6) * vmin();
    const s = (1.6 + Math.random() * 1.6) * vmin();
    spawn(x, y, s, `<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#8fcbea" stroke="${INK}" stroke-width="1"/></svg>`,
      [{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px)`, opacity: 1, offset: 0.5 }, { transform: `translate(${Math.cos(a) * d * 1.1}px, ${Math.sin(a) * d * 0.2 + 3 * vmin()}px)`, opacity: 0 }],
      { duration: 550 + Math.random() * 200, easing: 'ease-out' });
  }
}

/* Rimpels op het water */
export function ripple(x, y) {
  for (let i = 0; i < 2; i++) {
    const s = 6 * vmin();
    spawn(x, y, s, `<svg viewBox="0 0 40 20"><ellipse cx="20" cy="10" rx="18" ry="7" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/></svg>`,
      [{ transform: 'scale(.3)', opacity: 0.9 }, { transform: 'scale(2.2)', opacity: 0 }],
      { duration: 900, delay: i * 250, easing: 'ease-out' });
  }
}

/* Veertjes die dwarrelen */
export function feathers(x, y, n = 3) {
  for (let i = 0; i < n; i++) {
    const s = (2.5 + Math.random() * 1.5) * vmin();
    spawn(x + (Math.random() - 0.5) * 8 * vmin(), y, s, `<svg viewBox="0 0 20 20"><path d="M10 2 q6 6 0 16 q-6 -10 0 -16z" fill="#fff4dc" stroke="${INK}" stroke-width="1"/></svg>`,
      [{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: `translate(${(Math.random() - 0.5) * 10 * vmin()}px, ${8 * vmin()}px) rotate(${(Math.random() - 0.5) * 180}deg)`, opacity: 0 }],
      { duration: 1300 + Math.random() * 500, delay: i * 100, easing: 'ease-in-out' });
  }
}
