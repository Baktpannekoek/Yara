/* Speelwei: een wei vol figuurtjes die een beetje bewegen en elk hun eigen geluid maken.
   Bovenin wissel je van groep (boerderij, wilde dieren, voertuigen), onderin zet je figuurtjes
   op de wei. Een tik op een figuurtje: het springt op en maakt zijn geluid, soms een gek geluidje. */

import { SETS } from '../words.js';
import { extraSounds, funSounds } from '../sounds-extra-bundel.js';
import * as extra from '../art-extra.js';

const ORDER = ['farm', 'wild', 'vehicles'];
const ICONS = { farm: (art) => art.barnIcon(), wild: () => extra.wildIcon(), vehicles: () => extra.vehicleIcon() };
const MAX_ACTORS = 10;
const IDLE = ['idle-bob', 'idle-sway', 'idle-breathe'];
const FUN = ['scheetje', 'boertje', 'giechel', 'sprong', 'kus'];

let currentSet = 'farm';
const placed = { farm: ['koe', 'eend', 'hond'], wild: ['leeuw', 'aap'], vehicles: ['auto', 'trein'] };

export default {
  id: 'speelwei',
  mount(root, ctx) {
    let timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const sounds = { ...ctx.audio.animals, ...extraSounds };
    const art = (name) => (typeof extra[name] === 'function' ? extra[name]() : null) || ctx.art.byName(name);
    let field, strip;
    let lastTap = 0;

    function vmin() { return Math.min(window.innerWidth, window.innerHeight) / 100; }

    function area() {
      // De wei: tussen de bovenbalk en de strook onderin
      const r = field.getBoundingClientRect();
      const size = 22 * vmin();
      return { x0: r.left + 4, x1: r.right - size - 4, y0: r.top + 4, y1: r.bottom - size - 4, size };
    }

    function wander(el) {
      if (!el.isConnected) return;
      const a = area();
      const x = a.x0 + Math.random() * Math.max(1, a.x1 - a.x0);
      const y = a.y0 + Math.random() * Math.max(1, a.y1 - a.y0);
      const dur = 5000 + Math.random() * 6000;
      const flip = x < parseFloat(el.style.left) ? -1 : 1;
      el.style.setProperty('--flip', flip);
      el.animate([{ left: el.style.left, top: el.style.top }, { left: `${x}px`, top: `${y}px` }], { duration: dur, easing: 'ease-in-out', fill: 'forwards' })
        .onfinish = () => { el.style.left = `${x}px`; el.style.top = `${y}px`; later(() => wander(el), 1500 + Math.random() * 5000); };
    }

    function addActor(key, { announce = true } = {}) {
      const item = SETS[currentSet].items.find((i) => i.key === key);
      if (!item) return;
      const existing = field.querySelector(`.actor[data-key="${key}"]`);
      if (existing) { poke(existing, item); return; }
      const all = field.querySelectorAll('.actor');
      if (all.length >= MAX_ACTORS) all[0].remove();
      const a = area();
      const el = document.createElement('div');
      el.className = 'actor anim-appear ' + IDLE[Math.floor(Math.random() * IDLE.length)];
      el.dataset.key = key;
      el.style.setProperty('--s', `${a.size}px`);
      el.style.left = `${a.x0 + Math.random() * Math.max(1, a.x1 - a.x0)}px`;
      el.style.top = `${a.y0 + Math.random() * Math.max(1, a.y1 - a.y0)}px`;
      el.style.animationDelay = `${(Math.random() * 2).toFixed(2)}s`;
      el.innerHTML = art(key);
      field.appendChild(el);
      ctx.onTap(el, (e) => { e.stopPropagation(); poke(el, item); });
      later(() => wander(el), 2000 + Math.random() * 4000);
      if (announce) { ctx.audio.pop(); later(() => ctx.say(key, item.name), 150); }
      if (!placed[currentSet].includes(key)) placed[currentSet].push(key);
      ctx.setHint(`Daar is de ${item.name}! Tik er maar op`);
    }

    function poke(el, item) {
      const now = performance.now();
      if (now - lastTap < 350) return;
      lastTap = now;
      ctx.animate(el, 'anim-bounce');
      // Meestal het eigen geluid, soms een gek geluidje
      if (Math.random() < 0.3) {
        const f = FUN[Math.floor(Math.random() * FUN.length)];
        ctx.sound('fx-' + f, funSounds[f]);
        ctx.setHint(f === 'scheetje' ? `Oei, een scheetje van de ${item.name}!` : f === 'boertje' ? `Een boertje! Zeg je pardon, ${item.name}?` : item.question);
      } else {
        ctx.sound('geluid-' + item.key, sounds[item.key] || ctx.audio.tap);
        if (Math.random() < 0.5) later(() => ctx.say(item.key, item.name), 900);
        ctx.setHint(item.question);
      }
    }

    function build() {
      const set = SETS[currentSet];
      timers.forEach(clearTimeout); timers = [];
      root.innerHTML = `
        <div class="bg">${ctx.art.landscape()}</div>
        <div class="wei-top">
          ${ORDER.map((k) => `<div class="set-btn ${k === currentSet ? 'active' : ''}" data-set="${k}" aria-label="${SETS[k].title}">${ICONS[k](ctx.art)}</div>`).join('')}
        </div>
        <div class="wei-field" id="field"></div>
        <div class="wei-strip" id="strip">
          ${set.items.map((it) => `<div class="wei-pick" data-key="${it.key}" aria-label="${it.name}">${art(it.key)}</div>`).join('')}
        </div>`;
      field = root.querySelector('#field');
      strip = root.querySelector('#strip');
      root.querySelectorAll('.set-btn').forEach((b) => ctx.onTap(b, (e) => {
        e.stopPropagation();
        if (b.dataset.set === currentSet) { ctx.animate(b, 'anim-wiggle'); return; }
        currentSet = b.dataset.set;
        ctx.audio.tap();
        build();
      }));
      root.querySelectorAll('.wei-pick').forEach((p) => ctx.onTap(p, (e) => {
        e.stopPropagation();
        ctx.animate(p, 'anim-pop');
        addActor(p.dataset.key);
      }));
      // Wie er al stond komt terug
      placed[currentSet].forEach((k) => addActor(k, { announce: false }));
      ctx.setHint(`${set.title}: tik op een figuurtje, of zet er een bij met de strook onderin`);
    }

    // Tik op lege wei: dichtstbijzijnde figuurtje reageert niet, wel een zacht tikje
    ctx.onTap(root, () => ctx.audio.tap());

    build();
    this.unmount = () => { timers.forEach(clearTimeout); timers = []; };
  }
};
