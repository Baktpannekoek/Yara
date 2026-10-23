/* Boerderij: kiekeboe met dieren. Deur open, dier erachter, geluid en naam. */

import { ANIMALS } from '../words.js';

let idx = 0;

export default {
  id: 'farm',
  mount(root, ctx) {
    root.innerHTML = `
      <div class="bg">${ctx.art.landscape()}</div>
      <div class="farm-wrap" id="farm">
        <div class="farm-barn">${ctx.art.barn()}</div>
        <div class="farm-animal" id="animal"></div>
        <div class="farm-door" id="door-l">${ctx.art.barnDoor()}</div>
        <div class="farm-door right" id="door-r">${ctx.art.barnDoor()}</div>
      </div>`;

    const wrap = root.querySelector('#farm');
    const animalEl = root.querySelector('#animal');
    const doorL = root.querySelector('#door-l');
    const doorR = root.querySelector('#door-r');
    let open = false;
    let busy = false;
    let timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));

    function current() { return ANIMALS[idx % ANIMALS.length]; }

    function playAnimal(a) {
      ctx.sound('geluid-' + a.key, ctx.audio.animals[a.key]);
      later(() => ctx.say(a.key, a.name), 1100);
    }

    function openDoor() {
      const a = current();
      open = true; busy = true;
      animalEl.innerHTML = ctx.art.byName(a.key);
      ctx.audio.creak();
      doorL.classList.add('open');
      doorR.classList.add('open');
      later(() => animalEl.classList.add('show'), 250);
      later(() => playAnimal(a), 500);
      later(() => { busy = false; }, 900);
      ctx.setHint(a.question);
    }

    function closeDoor() {
      open = false; busy = true;
      animalEl.classList.remove('show');
      doorL.classList.remove('open');
      doorR.classList.remove('open');
      ctx.audio.thud();
      idx = (idx + 1) % ANIMALS.length;
      later(() => { busy = false; }, 800);
      ctx.setHint('Wie zit er in de schuur?');
    }

    ctx.onTap(wrap, (e) => {
      if (busy) return;
      if (!open) { openDoor(); return; }
      // Open: tik op het dier = nog een keer, tik ernaast = deur dicht
      const r = animalEl.getBoundingClientRect();
      const onAnimal = e.clientX >= r.left - 20 && e.clientX <= r.right + 20 && e.clientY >= r.top - 20 && e.clientY <= r.bottom + 20;
      if (onAnimal) {
        ctx.animate(animalEl, 'anim-bounce');
        playAnimal(current());
      } else {
        closeDoor();
      }
    });

    ctx.setHint('Wie zit er in de schuur?');
    this.unmount = () => { timers.forEach(clearTimeout); timers = []; };
  }
};
