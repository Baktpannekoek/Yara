/* Kiekeboe: boerderij, wilde dieren en voertuigen. Eén scène, drie sets.
   Eén tik is genoeg: dicht? dan gaat de deur open en komt er iets tevoorschijn. Open? dan is een
   tik op het dier of voertuig "nog een keer" en een tik ergens anders "de volgende". Het hele
   scherm telt mee, zodat een peuter nergens mis kan tikken. */

import { SETS } from '../words.js';
import { extraSounds } from '../sounds-extra.js';
import * as extra from '../art-extra.js';

const position = {};   // per set onthouden waar ze was

function makeScene(setKey) {
  const set = SETS[setKey];
  return {
    id: setKey,
    mount(root, ctx) {
      const art = (name) => (typeof extra[name] === 'function' ? extra[name]() : null) || ctx.art.byName(name);
      const building = typeof extra[set.building] === 'function' ? extra[set.building]() : ctx.art[set.building]();
      const door = typeof extra[set.door] === 'function' ? extra[set.door]() : ctx.art[set.door]();
      const sounds = { ...ctx.audio.animals, ...extraSounds };

      root.innerHTML = `
        <div class="bg">${ctx.art.landscape()}</div>
        <div class="farm-wrap" id="farm">
          <div class="farm-barn">${building}</div>
          <div class="farm-animal" id="animal"></div>
          <div class="farm-door" id="door-l">${door}</div>
          <div class="farm-door right" id="door-r">${door}</div>
        </div>`;

      const animalEl = root.querySelector('#animal');
      const doorL = root.querySelector('#door-l');
      const doorR = root.querySelector('#door-r');
      let open = false;
      let busy = false;          // deur beweegt: even geen tikken
      let soundUntil = 0;        // rem tegen stapelende geluiden bij snel tikken op het dier
      let timers = [];
      const later = (fn, ms) => timers.push(setTimeout(fn, ms));
      if (position[setKey] === undefined) position[setKey] = 0;

      function current() { return set.items[position[setKey] % set.items.length]; }

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

      // Deuren dicht: het volgende dier staat klaar, maar komt pas bij een nieuwe tik op de deur
      function closeDoors() {
        open = false; busy = true;
        animalEl.classList.remove('show');
        doorL.classList.remove('open');
        doorR.classList.remove('open');
        ctx.audio.thud();
        position[setKey] = (position[setKey] + 1) % set.items.length;
        later(() => { busy = false; }, 700);
        ctx.setHint(set.hint);
      }

      const inside = (el, e, padFactor) => {
        const r = el.getBoundingClientRect();
        const pad = r.width * padFactor;
        return e.clientX >= r.left - pad && e.clientX <= r.right + pad && e.clientY >= r.top - pad && e.clientY <= r.bottom + pad;
      };

      ctx.onTap(root, (e) => {
        if (busy) return;
        if (!open) {
          // Alleen een bewuste tik op het huisje zelf opent de deuren
          if (inside(root.querySelector('#farm'), e, 0.05)) reveal();
          return;
        }
        if (inside(animalEl, e, 0.2)) {
          ctx.animate(animalEl, 'anim-bounce');
          play(current(), 800);
        } else {
          closeDoors();
        }
      });

      ctx.setHint(set.hint);
      this.unmount = () => { timers.forEach(clearTimeout); timers = []; };
    }
  };
}

export const farm = makeScene('farm');
export const wild = makeScene('wild');
export const vehicles = makeScene('vehicles');
