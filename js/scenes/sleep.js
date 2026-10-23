/* Zacht einde: de zon gaat onder, de dieren zwaaien, een slaapliedje, dan donker */

import { ANIMALS } from '../words.js';

export default {
  id: 'sleep',
  mount(root, ctx) {
    root.classList.add('sleep');
    const picks = [...ANIMALS].sort(() => Math.random() - 0.5).slice(0, 3);
    const stars = Array.from({ length: 28 }, () =>
      `<div class="star" style="left:${(Math.random() * 100).toFixed(1)}%;top:${(Math.random() * 60).toFixed(1)}%;animation-delay:${(Math.random() * 3).toFixed(2)}s"></div>`).join('');
    root.innerHTML = `
      <div class="sleep-sky">
        <div class="sleep-stars">${stars}</div>
        <div class="sleep-sun">${ctx.art.sun(true)}</div>
      </div>
      <div class="sleep-moon" id="moon" style="pointer-events:auto">${ctx.art.moon()}</div>
      <div class="sleep-text">Dag dag!</div>
      <div class="sleep-animals">
        ${picks.map((a, i) => `<div class="wave" style="animation-delay:${i * 0.3}s">${ctx.art.byName(a.key)}</div>`).join('')}
      </div>`;

    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));

    ctx.audio.yawn();
    later(() => root.classList.add('night'), 200);
    later(() => ctx.speech.speak('Dag dag! Slaap lekker.'), 1800);
    later(() => ctx.audio.playLullaby({ onDone: () => root.classList.add('dark') }), 4500);

    const moon = root.querySelector('#moon');
    let restarting = false;
    ctx.onTap(moon, () => {
      if (restarting) return;
      restarting = true;
      ctx.audio.stopMelody();
      ctx.audio.chime();
      ctx.startSession();
      later(() => ctx.go('world'), 500);
    });

    this.unmount = () => { timers.forEach(clearTimeout); ctx.audio.stopMelody(); };
  }
};
