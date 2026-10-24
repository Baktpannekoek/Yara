/* Kiekeboe: boerderij, wilde dieren en voertuigen in één scène, met onderin drie knopjes om te wisselen.
   Bewust ritme: een tik op het huisje opent de deuren, een tik op het dier herhaalt het geluid,
   een tik ergens anders sluit de deuren. Het volgende dier komt pas bij een nieuwe tik op het huisje. */

import { SETS } from '../words.js';
import { extraSounds } from '../sounds-extra.js';
import * as extra from '../art-extra.js';

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
    const art = (name) => (typeof extra[name] === 'function' ? extra[name]() : null) || ctx.art.byName(name);
    let set, animalEl, doorL, doorR, wrap;
    let open = false, busy = false, soundUntil = 0;

    function current() { return set.items[position[set.key] % set.items.length]; }

    function play(item, nameAfter = 900) {
      const now = performance.now();
      if (now < soundUntil) return;
      soundUntil = now + 1300;
      ctx.sound('geluid-' + item.key, sounds[item.key] || ctx.audio.tap);
      later(() => ctx.say(item.key, item.name), nameAfter);
    }

    function reveal() {
      const item = current();
      open = true; busy = true;
      animalEl.innerHTML = art(item.key);
      ctx.audio.creak();
      doorL.classList.add('open');
      doorR.classList.add('open');
      later(() => animalEl.classList.add('show'), 120);
      later(() => play(item), 220);
      later(() => { busy = false; }, 700);
      ctx.setHint(item.question);
    }

    function closeDoors(silent = false) {
      open = false; busy = true;
      animalEl.classList.remove('show');
      doorL.classList.remove('open');
      doorR.classList.remove('open');
      if (!silent) ctx.audio.thud();
      position[set.key] = (position[set.key] + 1) % set.items.length;
      later(() => { busy = false; }, 700);
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
      if (inside(animalEl, e, 0.4)) {
        ctx.animate(animalEl, 'anim-bounce');
        play(current(), 800);
      } else {
        closeDoors();
      }
    });

    build();
    this.unmount = () => { timers.forEach(clearTimeout); timers = []; };
  }
};
