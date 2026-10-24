/* Speelwei: figuurtjes met een lijf en pootjes staan netjes verdeeld op de wei. Ze bewegen alleen
   zachtjes op hun plek. Een tik laat dat ene figuurtje springen of schudden en zijn geluid maken,
   soms met een gek geluidje. Bovenin wissel je van groep. */

import { SETS } from '../words.js';
import { extraSounds, funSounds, moveSounds } from '../sounds-extra-bundel.js';
import * as extra from '../art-extra.js';
import * as more from '../art-more.js';
import { PEOPLE } from '../words.js';
import { mountWorld } from '../lib/scene.js';
import { createFigure } from '../lib/rig.js';
import * as A from '../lib/anim.js';
import * as fx from '../lib/fx.js';
import { boerderij } from '../lib/worlds/boerderij.js';
import { figureDef } from '../lib/figures/index.js';

const ORDER = ['farm', 'wild', 'vehicles', 'people'];
const ICONS = { farm: (art) => art.barnIcon(), wild: () => extra.wildIcon(), vehicles: () => extra.vehicleIcon(), people: () => more.doeMeeIcon() };
const IDLE = ['idle-bob', 'idle-sway', 'idle-breathe'];
const TRICKS = ['trick-hop', 'trick-shake', 'trick-wiggle', 'trick-peek'];
const FUN = ['scheetje', 'boertje', 'giechel'];

// Lijfkleur per dier; het kopje uit de tekeningen komt erbovenop
const BODY = {
  koe: ['#fff', '#3b4252'], hond: ['#d9a066', '#a9733f'], kat: ['#9a9aa8', '#7c7c8a'], eend: ['#ffd66b', '#ffb84d'],
  schaap: ['#fff7e6', '#e8dcc4'], paard: ['#c58a52', '#a9733f'], kip: ['#fff7e6', '#ffb84d'], varken: ['#f9c6d2', '#f7a8c4'],
  kikker: ['#8fcf7c', '#6fb565'], vogel: ['#8fcbea', '#5fb0dd'], leeuw: ['#ffd66b', '#e0a86b'], olifant: ['#b8bcc8', '#9a9eaa'],
  aap: ['#a9733f', '#8a5a3b'], giraf: ['#ffd66b', '#e0a86b'], zebra: ['#fff', '#3b4252'], krokodil: ['#8fcf7c', '#6fb565']
};

const POP = { trui: '#f28b82', broek: '#8fcbea', haar: '#8a5a3b', huid: '#ffd9b8' };
let currentSet = 'farm';

/* Het landschap met diepte: lucht, verre heuvels, bomen, een middenstuk per groep en gras vooraan */
function sceneArt(setKey) {
  const trees = (xs, scale = 1, dark = false) => xs.map((x) => `
    <g transform="translate(${x} 0) scale(${scale})">
      <rect x="-2" y="44" width="4" height="12" fill="#8a5a3b"/>
      <circle cx="0" cy="40" r="9" fill="${dark ? '#7cc06c' : '#8fcf7c'}"/><circle cx="-6" cy="44" r="6" fill="${dark ? '#7cc06c' : '#8fcf7c'}"/><circle cx="6" cy="44" r="6" fill="${dark ? '#7cc06c' : '#8fcf7c'}"/>
    </g>`).join('');
  const bushes = (xs) => xs.map((x) => `<g transform="translate(${x} 0)"><circle cx="0" cy="66" r="6" fill="#a7d98f"/><circle cx="-5" cy="68" r="4.5" fill="#a7d98f"/><circle cx="5" cy="68" r="4.5" fill="#a7d98f"/></g>`).join('');
  const flowers = [12, 40, 75, 118, 150, 183].map((x, i) => `<g transform="translate(${x} ${88 + (i % 2) * 6})"><circle r="2.2" fill="${['#f7a8c4', '#ffd66b', '#cdb4f0'][i % 3]}"/><circle r=".9" fill="#fff7e6"/></g>`).join('');
  let mid = '';
  if (setKey === 'farm') {
    mid = `<path d="M0 62 H200" stroke="#c58a52" stroke-width="2"/><path d="M0 57 H200" stroke="#c58a52" stroke-width="2"/>
      ${[8, 24, 40, 56, 72, 88, 104, 120, 136, 152, 168, 184].map((x) => `<rect x="${x}" y="53" width="3" height="13" rx="1.5" fill="#d9a066"/>`).join('')}
      <g transform="translate(168 20) scale(.75)"><path d="M0 28 L18 14 L36 28 V52 H0z" fill="#f28b82"/><path d="M-3 29 L18 11 L39 29" fill="none" stroke="#3b4252" stroke-width="2"/><rect x="12" y="34" width="12" height="18" fill="#8a5a3b"/></g>`;
  } else if (setKey === 'wild') {
    mid = `<ellipse cx="150" cy="70" rx="34" ry="7" fill="#8fcbea"/><ellipse cx="150" cy="70" rx="26" ry="4.5" fill="#a9d8f0"/>
      <g transform="translate(26 0)"><rect x="-1.5" y="34" width="3" height="26" fill="#8a5a3b"/><ellipse cx="0" cy="33" rx="16" ry="5" fill="#7cc06c"/></g>
      <g transform="translate(96 0)"><rect x="-1.5" y="40" width="3" height="20" fill="#8a5a3b"/><ellipse cx="0" cy="39" rx="12" ry="4" fill="#7cc06c"/></g>
      <ellipse cx="60" cy="68" rx="9" ry="3" fill="#b8bcc8"/>`;
  } else if (setKey === 'people') {
    mid = `<path d="M0 76 Q60 62 120 70 T200 66 V74 Q140 76 100 78 T0 84z" fill="#e8d5b0"/>
      <g transform="translate(150 50)"><rect x="0" y="0" width="34" height="5" rx="2" fill="#c58a52"/><rect x="0" y="9" width="34" height="5" rx="2" fill="#c58a52"/><rect x="3" y="14" width="3" height="8" fill="#8a5a3b"/><rect x="28" y="14" width="3" height="8" fill="#8a5a3b"/></g>
      <ellipse cx="30" cy="68" rx="10" ry="3" fill="#8fcbea"/>`;
  } else {
    mid = `<path d="M0 72 Q100 60 200 72 V84 Q100 72 0 84z" fill="#9a9eaa"/><path d="M0 78 Q100 66 200 78" stroke="#fff7e6" stroke-width="1.5" stroke-dasharray="6 5" fill="none"/>
      <g transform="translate(176 40)"><rect x="-6" y="0" width="12" height="20" rx="2" fill="#f28b82"/><rect x="-3" y="4" width="6" height="6" fill="#e3f2fb"/></g>`;
  }
  return `<svg viewBox="0 0 200 100" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="wsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3f5"/><stop offset="1" stop-color="#e6f5fc"/></linearGradient></defs>
    <rect width="200" height="100" fill="url(#wsky)"/>
    <circle cx="170" cy="18" r="11" fill="#ffd66b"/>
    <g class="clouds" fill="#fff" opacity=".85"><ellipse cx="40" cy="20" rx="14" ry="6"/><ellipse cx="48" cy="16" rx="9" ry="6"/><ellipse cx="120" cy="14" rx="12" ry="5"/></g>
    <ellipse cx="60" cy="70" rx="110" ry="30" fill="#c6e8b3"/><ellipse cx="170" cy="74" rx="90" ry="26" fill="#b9e2a3"/>
    ${trees([10, 46, 80, 118, 140, 192], 1, true)}
    <rect x="0" y="56" width="200" height="44" fill="#a7d98f"/>
    ${mid}
    ${bushes([4, 70, 132, 196])}
    <ellipse cx="100" cy="104" rx="130" ry="20" fill="#8fcf7c"/>
    ${flowers}
    <g class="wei-vlinder"><path d="M0 0 q-6 -8 -8 -2 q0 4 4 4 q-4 2 -2 5 q3 2 6 -4z M0 0 q6 -8 8 -2 q0 4 -4 4 q4 2 2 5 q-3 2 -6 -4z" fill="#f7a8c4" stroke="#3b4252" stroke-width=".6"/></g>
  </svg>`;
}

/* Lijf per soort: vier poten voor de meeste dieren, een vogellijf voor eend, vogel en kip,
   een hurkend lijf voor de kikker, een lang lijf voor de krokodil en een nek voor de giraf. */
const KIND = { eend: 'bird', vogel: 'bird', kip: 'bird', kikker: 'frog', krokodil: 'croc', giraf: 'giraf' };

function standing(ctx, key) {
  const head = (typeof extra[key] === 'function' ? extra[key]() : null) || ctx.art.byName(key);
  const [fill, leg] = BODY[key] || ['#cdb4f0', '#3b4252'];
  const kind = KIND[key] || 'quad';
  const G = 'stroke="#3b4252" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';
  let body = '';
  let headBox = 'x="12" y="2" width="76" height="76"';
  if (kind === 'bird') {
    const legColor = key === 'vogel' ? '#ffb84d' : '#ffb84d';
    body = `<g ${G}>
      <path d="M50 118 V130 M44 130 H56 M62 118 V130 M56 130 H68" stroke="${legColor}" stroke-width="3" fill="none"/>
      <path d="M26 92 q-12 -10 -10 -18 q10 2 14 12z" fill="${leg}"/>
      <ellipse cx="56" cy="100" rx="26" ry="18" fill="${fill}"/>
      <path d="M44 96 q10 -6 22 2 q-10 10 -22 -2z" fill="${leg}" opacity=".9"/>
    </g>`;
    headBox = 'x="18" y="8" width="70" height="70"';
  } else if (kind === 'frog') {
    body = `<g ${G}>
      <ellipse cx="50" cy="104" rx="30" ry="16" fill="${fill}"/>
      <ellipse cx="22" cy="116" rx="12" ry="7" fill="${leg}"/><ellipse cx="78" cy="116" rx="12" ry="7" fill="${leg}"/>
      <ellipse cx="50" cy="108" rx="16" ry="8" fill="#d6f0c6"/>
    </g>`;
    headBox = 'x="12" y="10" width="76" height="76"';
  } else if (kind === 'croc') {
    body = `<g ${G}>
      <path d="M22 100 q-14 -2 -20 10 q10 0 20 6z" fill="${fill}"/>
      <ellipse cx="58" cy="106" rx="36" ry="14" fill="${fill}"/>
      <path d="M34 94 l6 -8 l6 8 M50 92 l6 -8 l6 8 M66 94 l6 -8 l6 8" fill="${leg}"/>
      <rect x="30" y="112" width="10" height="16" rx="5" fill="${leg}"/><rect x="48" y="114" width="10" height="16" rx="5" fill="${leg}"/>
      <rect x="66" y="114" width="10" height="16" rx="5" fill="${leg}"/><rect x="84" y="112" width="10" height="16" rx="5" fill="${leg}"/>
    </g>`;
    headBox = 'x="26" y="12" width="70" height="70"';
  } else if (kind === 'giraf') {
    body = `<g ${G}>
      <path d="M42 66 q4 24 6 32 H62 q0 -14 2 -32z" fill="${fill}"/>
      <circle cx="50" cy="80" r="4" fill="#e0a86b"/><circle cx="58" cy="92" r="3" fill="#e0a86b"/>
      <rect x="28" y="110" width="10" height="24" rx="5" fill="${leg}"/><rect x="42" y="112" width="10" height="24" rx="5" fill="${leg}"/>
      <rect x="58" y="112" width="10" height="24" rx="5" fill="${leg}"/><rect x="72" y="110" width="10" height="24" rx="5" fill="${leg}"/>
      <path d="M84 100 q12 -4 10 8" fill="none"/>
      <ellipse cx="55" cy="102" rx="30" ry="16" fill="${fill}"/>
      <circle cx="42" cy="100" r="5" fill="#e0a86b"/><circle cx="62" cy="106" r="6" fill="#e0a86b"/>
    </g>`;
    headBox = 'x="18" y="-4" width="64" height="64"';
  } else {
    const spots = key === 'koe' ? '<ellipse cx="38" cy="92" rx="9" ry="6" fill="#3b4252"/><ellipse cx="62" cy="100" rx="7" ry="5" fill="#3b4252"/>'
      : key === 'zebra' ? '<path d="M34 84 q4 10 0 20 M46 82 q4 12 0 24 M58 82 q4 12 0 24 M70 84 q4 10 0 20" stroke="#3b4252" stroke-width="3" fill="none"/>' : '';
    body = `<g ${G}>
      <rect x="30" y="104" width="11" height="26" rx="5" fill="${leg}"/><rect x="43" y="106" width="11" height="26" rx="5" fill="${leg}"/>
      <rect x="56" y="106" width="11" height="26" rx="5" fill="${leg}"/><rect x="69" y="104" width="11" height="26" rx="5" fill="${leg}"/>
      <path d="M80 88 q14 -4 12 8" fill="none"/>
      <ellipse cx="54" cy="94" rx="30" ry="20" fill="${fill}"/>
      ${spots}
    </g>`;
  }
  const headSvg = head.replace('<svg viewBox="0 0 100 100"', `<svg ${headBox} viewBox="0 0 100 100"`);
  return `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="132" rx="30" ry="5" fill="rgba(0,0,0,.08)"/>
    ${body}
    ${headSvg}
  </svg>`;
}

/* Een mens: het poppetje met eigen haar, huid en kleding */
function person(item) {
  let svg = more.poppetje();
  const L = item.look || {};
  const swap = (from, to) => { if (to) svg = svg.split(`fill="${from}"`).join(`fill="${to}"`); };
  // Volgorde: eerst de trui (anders raakt de huid in de war), dan broek, haar, huid
  swap(POP.trui, L.trui); swap(POP.broek, L.broek); swap(POP.haar, L.haar); swap(POP.huid, L.huid);
  if (item.key === 'opa') svg = svg.replace('</svg>', '<path d="M44 38 q6 3 12 0" fill="none" stroke="#d5d9e0" stroke-width="2.5" stroke-linecap="round"/><circle cx="44" cy="30" r="4.5" fill="none" stroke="#3b4252" stroke-width="1.5"/><circle cx="56" cy="30" r="4.5" fill="none" stroke="#3b4252" stroke-width="1.5"/></svg>');
  if (item.key === 'oma') svg = svg.replace('</svg>', '<circle cx="50" cy="11" r="6" fill="#eceff3" stroke="#3b4252" stroke-width="2"/></svg>');
  if (item.key === 'baby') svg = svg.replace('</svg>', '<circle cx="50" cy="36" r="3.5" fill="#f7a8c4" stroke="#3b4252" stroke-width="1.5"/></svg>');
  const sc = item.scale || 1;
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="94" rx="22" ry="4" fill="rgba(0,0,0,.08)"/><g transform="translate(${(50 - 50 * sc).toFixed(1)} ${(94 - 94 * sc).toFixed(1)}) scale(${sc})">${svg.replace(/^<svg[^>]*>/, '').replace('</svg>', '')}</g></svg>`;
}

function figureArt(ctx, key, setKey) {
  if (setKey === 'people') return person(PEOPLE.find((m) => m.key === key));
  if (setKey === 'vehicles') return (typeof extra[key] === 'function' ? extra[key]() : null) || ctx.art.byName(key);
  return standing(ctx, key);
}

export default {
  id: 'speelwei',
  mount(root, ctx) {
    let timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const sounds = { ...ctx.audio.animals, ...extraSounds };
    let lastTap = 0;

    const PERSON_ACTS = [
      { anim: 'do-spring', fx: 'sprong', say: 'Hup!' },
      { anim: 'do-klap', fx: 'klap', say: 'Klap klap!' },
      { anim: 'do-zwaai', fx: null, say: 'Dag dag!' },
      { anim: 'do-draai', fx: 'draai', say: 'Rondje!' },
      { anim: 'trick-shake', fx: 'scheetje', say: 'Oeps, een scheetje!' },
      { anim: 'trick-peek', fx: 'boertje', say: 'Boer! Pardon!' },
      { anim: 'trick-wiggle', fx: 'giechel', say: null }
    ];

    function poke(el, item) {
      const now = performance.now();
      if (now - lastTap < 400) return;
      lastTap = now;
      const allAnims = [...TRICKS, 'do-spring', 'do-klap', 'do-zwaai', 'do-draai'];
      el.classList.remove(...allAnims);
      void el.offsetWidth;
      if (currentSet === 'people') {
        const act = PERSON_ACTS[Math.floor(Math.random() * PERSON_ACTS.length)];
        el.classList.add(act.anim);
        later(() => el.classList.remove(act.anim), 1100);
        if (act.fx) ctx.sound('fx-' + act.fx, funSounds[act.fx] || moveSounds[act.fx]);
        later(() => ctx.say(item.key, item.name), act.fx ? 900 : 100);
        if (act.say) later(() => ctx.speech.speak(act.say), act.fx ? 1700 : 900);
        ctx.setHint(`${item.name}: ${act.say || 'hihi!'}`);
        return;
      }
      const t = TRICKS[Math.floor(Math.random() * TRICKS.length)];
      el.classList.add(t);
      later(() => el.classList.remove(t), 1000);
      // Meestal het eigen geluid, af en toe een gek geluidje
      if (Math.random() < 0.25) {
        const f = FUN[Math.floor(Math.random() * FUN.length)];
        ctx.sound('fx-' + f, funSounds[f]);
        ctx.setHint(f === 'scheetje' ? `Oei, een scheetje van de ${item.name}!` : f === 'boertje' ? `Een boertje! Zeg je pardon, ${item.name}?` : `De ${item.name} moet lachen!`);
      } else {
        ctx.sound('geluid-' + item.key, sounds[item.key] || ctx.audio.tap);
        later(() => ctx.say(item.key, item.name), 900);
        ctx.setHint(item.question);
      }
    }

    let world = null;

    /* Figuren die nog niet in de bibliotheek staan, krijgen een eenvoudige rig om de oude tekening */
    function legacyDef(item) {
      return {
        key: item.key,
        svg: () => standing(ctx, item.key),
        idle(fig) { A.bobLoop(fig, fig.svg, 1.5, 2400 + Math.random() * 800); },
        async react(fig, c, tap, w) {
          const pt = w.center(fig, 0.5, 0.95);
          c.sound('geluid-' + item.key, sounds[item.key] || c.audio.tap);
          await A.hop(fig, 12, 600);
          fx.dust(pt.x, pt.y, 5);
          fig.later(() => c.say(item.key, item.name), 150);
          c.setHint(item.question);
        }
      };
    }

    function topBar() {
      return `<div class="wei-top">
          ${ORDER.map((k) => `<div class="set-btn ${k === currentSet ? 'active' : ''}" data-set="${k}" aria-label="${SETS[k].title}">${ICONS[k](ctx.art)}</div>`).join('')}
        </div>`;
    }

    function wireTop() {
      root.querySelectorAll('.set-btn').forEach((b) => ctx.onTap(b, (e) => {
        e.stopPropagation();
        if (b.dataset.set === currentSet) { ctx.animate(b, 'anim-wiggle'); return; }
        currentSet = b.dataset.set;
        ctx.audio.tap();
        build();
      }));
    }

    /* De boerderij op de bibliotheek: wereld met lagen en plekken, figuren uit delen */
    function buildWorld(set) {
      root.innerHTML = `<div class="world-root"></div>${topBar()}`;
      world = mountWorld(root.querySelector('.world-root'), boerderij, ctx);
      [...set.items, ...(boerderij.extras || [])].forEach((item) => {
        const spot = world.spot(item.key);
        if (!spot) return;
        const def = figureDef(item.key) || legacyDef(item);
        const fig = createFigure(def, { zone: spot.zone });
        world.place(fig, spot);
        try { def.idle(fig); } catch (e) { console.warn(e); }
        ctx.onTap(fig.el, (e) => {
          e.stopPropagation();
          const r = fig.el.getBoundingClientRect();
          const tap = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
          const ok = A.react(fig, () => def.react(fig, ctx, tap, world));
          if (ok) ctx.setHint(item.question);
        });
      });
      wireTop();
      ctx.setHint(`${set.title}: tik op een dier`);
    }

    function build() {
      const set = SETS[currentSet];
      timers.forEach(clearTimeout); timers = [];
      if (world) { world.destroy(); world = null; }
      if (currentSet === 'farm') { buildWorld(set); return; }
      const n = set.items.length;
      const backCount = Math.floor(n / 2);
      const back = set.items.slice(0, backCount);
      const front = set.items.slice(backCount);
      const fig = (it, i) => `<div class="wei-figure ${IDLE[i % IDLE.length]} ${currentSet === 'vehicles' ? 'vehicle' : ''} ${currentSet === 'people' ? 'person' : ''}" data-key="${it.key}" style="animation-delay:${(i * 0.37 % 2).toFixed(2)}s" aria-label="${it.name}">${figureArt(ctx, it.key, currentSet)}</div>`;
      root.innerHTML = `
        <div class="bg">${sceneArt(currentSet)}</div>
        ${topBar()}
        <div class="wei-stage">
          <div class="wei-row back" style="--per-row:${Math.max(back.length, 1)}">${back.map((it, i) => fig(it, i)).join('')}</div>
          <div class="wei-row front" style="--per-row:${Math.max(front.length, 1)}">${front.map((it, i) => fig(it, i + backCount)).join('')}</div>
        </div>`;
      wireTop();
      root.querySelectorAll('.wei-figure').forEach((el) => {
        const item = set.items.find((i) => i.key === el.dataset.key);
        ctx.onTap(el, (e) => { e.stopPropagation(); poke(el, item); });
      });
      ctx.setHint(`${set.title}: tik op een figuurtje`);
    }

    ctx.onTap(root, () => ctx.audio.tap());
    build();
    this.unmount = () => { timers.forEach(clearTimeout); timers = []; if (world) { world.destroy(); world = null; } };
  }
};
