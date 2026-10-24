/* Kiekeboe: boerderij, wilde dieren en voertuigen in één scène, met onderin drie knopjes om te wisselen.
   Bewust ritme: een tik op het huisje opent de deuren, een tik op het dier laat het iets doen,
   een tik ergens anders sluit de deuren. Het dier achter de deur is een levend bibliotheekfiguur. */

import { SETS } from '../words.js';
import { extraSounds } from '../sounds-extra.js';
import * as extra from '../art-extra.js';
import { simpleStage } from '../lib/scene.js';
import { createFigure } from '../lib/rig.js';
import * as A from '../lib/anim.js';
import { figureDef } from '../lib/figures/index.js';

const ORDER = ['farm', 'wild', 'vehicles'];
const ICONS = { farm: (art) => art.barnIcon(), wild: () => extra.wildIcon(), vehicles: () => extra.vehicleIcon() };
const position = { farm: 0, wild: 0, vehicles: 0 };
let currentSet = 'farm';

export default {
  id: 'kiekeboe',
  mount(root, ctx) {
    let timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const sounds = { ...ctx.audio.animals, ...extraSounds };
    let set, animalEl, doorL, doorR, wrap, stage;
    let open = false, busy = false, fig = null;

    function current() { return set.items[position[set.key] % set.items.length]; }

    function legacyDef(item) {
      return {
        key: item.key,
        svg: () => (typeof extra[item.key] === 'function' ? extra[item.key]() : null) || ctx.art.byName(item.key),
        idle(f) { A.bobLoop(f, f.svg, 1.5, 2600); },
        async react(f, c) {
          c.sound('geluid-' + item.key, sounds[item.key] || c.audio.tap);
          await A.hop(f, 10, 600);
          f.later(() => c.say(item.key, item.name), 150);
        }
      };
    }

    async function reveal() {
      const item = current();
      open = true; busy = true;
      if (fig) { fig.destroy(); fig = null; }
      const def = (await figureDef(item.key)) || legacyDef(item);
      if (!open || !root.isConnected) return;
      fig = createFigure(def, { zone: 'gras' });
      fig.el.classList.add('in-barn');
      animalEl.innerHTML = '';
      animalEl.appendChild(fig.el);
      ctx.audio.creak();
      doorL.classList.add('open');
      doorR.classList.add('open');
      later(() => animalEl.classList.add('show'), 120);
      later(() => {
        if (!fig) return;
        try { def.idle(fig); } catch (e) { console.warn(e); }
        A.react(fig, () => def.react(fig, ctx, { x: 0, y: 0 }, stage));
      }, 350);
      later(() => { busy = false; }, 900);
      ctx.setHint(item.question);
    }

    function closeDoors() {
      open = false; busy = true;
      animalEl.classList.remove('show');
      doorL.classList.remove('open');
      doorR.classList.remove('open');
      ctx.audio.thud();
      position[set.key] = (position[set.key] + 1) % set.items.length;
      later(() => { if (fig) { fig.destroy(); fig = null; } busy = false; }, 700);
      ctx.setHint(set.hint);
    }

    const inside = (el, e, padFactor) => {
      const r = el.getBoundingClientRect();
      const pad = r.width * padFactor;
      return e.clientX >= r.left - pad && e.clientX <= r.right + pad && e.clientY >= r.top - pad && e.clientY <= r.bottom + pad;
    };

    function build() {
      set = SETS[currentSet];
      const building = typeof extra[set.building] === 'function' ? extra[set.building]() : ctx.art[set.building]();
      const door = typeof extra[set.door] === 'function' ? extra[set.door]() : ctx.art[set.door]();
      open = false; busy = false;
      if (fig) { fig.destroy(); fig = null; }
      root.innerHTML = `
        <div class="bg">${ctx.art.landscape()}</div>
        <div class="farm-wrap" id="farm">
          <div class="farm-barn">${building}</div>
          <div class="farm-animal" id="animal"></div>
          <div class="farm-door" id="door-l">${door}</div>
          <div class="farm-door right" id="door-r">${door}</div>
        </div>
        <div class="set-switch">
          ${ORDER.map((k) => `<div class="set-btn ${k === currentSet ? 'active' : ''}" data-set="${k}" aria-label="${SETS[k].title}">${ICONS[k](ctx.art)}</div>`).join('')}
        </div>`;
      stage = simpleStage(root);
      wrap = root.querySelector('#farm');
      animalEl = root.querySelector('#animal');
      doorL = root.querySelector('#door-l');
      doorR = root.querySelector('#door-r');
      root.querySelectorAll('.set-btn').forEach((b) => {
        ctx.onTap(b, (e) => {
          e.stopPropagation();
          if (b.dataset.set === currentSet) { ctx.animate(b, 'anim-wiggle'); return; }
          currentSet = b.dataset.set;
          ctx.audio.tap();
          timers.forEach(clearTimeout); timers = [];
          build();
          ctx.animate(root.querySelector('.set-btn.active'), 'anim-pop');
        });
      });
      ctx.setHint(set.hint);
    }

    ctx.onTap(root, (e) => {
      if (busy) return;
      if (!open) {
        // Alleen een bewuste tik op het huisje zelf opent de deuren
        if (inside(wrap, e, 0.05)) reveal();
        return;
      }
      if (fig && inside(animalEl, e, 0.25)) {
        const r = fig.el.getBoundingClientRect();
        const tap = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
        A.react(fig, () => fig.def.react(fig, ctx, tap, stage));
      } else {
        closeDoors();
      }
    });

    build();
    this.unmount = () => { timers.forEach(clearTimeout); timers = []; if (fig) { fig.destroy(); fig = null; } };
  }
};
