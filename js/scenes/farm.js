/* Boerderij: kiekeboe met dieren.
   Eén tik is genoeg: dicht? dan gaat de deur open en komt er een dier. Open? dan is een tik
   op het dier "nog een keer" en een tik ergens anders "het volgende dier". Het hele scherm telt mee. */

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

    const animalEl = root.querySelector('#animal');
    const doorL = root.querySelector('#door-l');
    const doorR = root.querySelector('#door-r');
    let open = false;
    let busy = false;
    let timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));

    function current() { return ANIMALS[idx % ANIMALS.length]; }

    function playAnimal(a, nameAfter = 900) {
      ctx.sound('geluid-' + a.key, ctx.audio.animals[a.key]);
      later(() => ctx.say(a.key, a.name), nameAfter);
    }

    function reveal() {
      const a = current();
      open = true; busy = true;
      animalEl.innerHTML = ctx.art.byName(a.key);
      ctx.audio.creak();
      doorL.classList.add('open');
      doorR.classList.add('open');
      later(() => animalEl.classList.add('show'), 120);
      later(() => playAnimal(a), 220);
      later(() => { busy = false; }, 650);
      ctx.setHint(a.question);
    }

    function next() {
      open = false; busy = true;
      animalEl.classList.remove('show');
      doorL.classList.remove('open');
      doorR.classList.remove('open');
      ctx.audio.thud();
      idx = (idx + 1) % ANIMALS.length;
      later(reveal, 420);
    }

    // Het hele scherm is het tikvlak, zodat een peuter nergens "mis" kan tikken
    ctx.onTap(root, (e) => {
      if (busy) return;
      if (!open) { reveal(); return; }
      const r = animalEl.getBoundingClientRect();
      const pad = r.width * 0.2;
      const onAnimal = e.clientX >= r.left - pad && e.clientX <= r.right + pad && e.clientY >= r.top - pad && e.clientY <= r.bottom + pad;
      if (onAnimal) {
        ctx.animate(animalEl, 'anim-bounce');
        playAnimal(current(), 800);
      } else {
        next();
      }
    });

    ctx.setHint('Wie zit er in de schuur? Tik maar!');
    this.unmount = () => { timers.forEach(clearTimeout); timers = []; };
  }
};
