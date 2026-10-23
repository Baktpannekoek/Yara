/* Bellenweide: zeepbellen stijgen langzaam op, een tik laat ze ploppen */

const MAX = 5;

export default {
  id: 'bubbles',
  mount(root, ctx) {
    root.innerHTML = `
      <div class="bg">${ctx.art.landscape()}</div>
      <div class="bubble-field" id="field"></div>`;
    const field = root.querySelector('#field');
    let count = 0;
    let spawned = 0;
    let alive = true;
    let spawnTimer = null;

    function vmin() { return Math.min(window.innerWidth, window.innerHeight) / 100; }
    // De veilige randen (notch, ronde hoeken) zitten al in de padding van het scherm
    function pad() {
      const cs = getComputedStyle(root);
      return { l: parseFloat(cs.paddingLeft) || 0, r: parseFloat(cs.paddingRight) || 0 };
    }

    function spawn() {
      if (!alive) return;
      if (count >= MAX) { schedule(); return; }
      count++; spawned++;
      const size = (22 + Math.random() * 14) * vmin();
      const el = document.createElement('div');
      el.className = 'bubble';
      el.style.setProperty('--size', `${size}px`);
      const p = pad();
      const x = p.l + Math.random() * Math.max(0, window.innerWidth - p.l - p.r - size);
      el.style.left = `${x}px`;
      el.style.top = `${window.innerHeight}px`;
      const hasFlyer = spawned % 4 === 0;
      if (hasFlyer) el.innerHTML = spawned % 8 === 0 ? ctx.art.vogel() : ctx.art.vlinder();
      field.appendChild(el);

      const dur = 11000 + Math.random() * 6000;
      const sway = (Math.random() > 0.5 ? 1 : -1) * (4 + Math.random() * 6) * vmin();
      const anim = el.animate([
        { transform: 'translate(0, 0)' },
        { transform: `translate(${sway}px, ${-(window.innerHeight * 0.5 + size)}px)` },
        { transform: `translate(0, ${-(window.innerHeight + size * 1.5)}px)` }
      ], { duration: dur, easing: 'linear', fill: 'forwards' });
      anim.onfinish = () => { if (el.isConnected) { el.remove(); count--; } };

      let popped = false;
      ctx.onTap(el, (e) => {
        if (popped) return;
        popped = true;
        ctx.audio.pop();
        const r = el.getBoundingClientRect();
        anim.pause();
        el.classList.add('popped');
        droplets(r);
        if (hasFlyer) {
          const fl = document.createElement('div');
          fl.className = 'flyer';
          fl.innerHTML = el.innerHTML;
          fl.style.left = `${r.left + r.width / 2 - 7 * vmin()}px`;
          fl.style.top = `${r.top + r.height / 2 - 7 * vmin()}px`;
          fl.style.setProperty('--fx', `${(Math.random() > 0.5 ? 1 : -1) * 40 * vmin()}px`);
          fl.style.setProperty('--fy', `${-60 * vmin()}px`);
          field.appendChild(fl);
          setTimeout(() => ctx.audio.sparkle(), 150);
          setTimeout(() => fl.remove(), 3600);
        }
        setTimeout(() => { el.remove(); count--; }, 360);
      });
      schedule();
    }

    function droplets(r) {
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      for (let i = 0; i < 7; i++) {
        const d = document.createElement('div');
        d.className = 'droplet';
        const a = (i / 7) * Math.PI * 2;
        d.style.left = `${cx - 7}px`;
        d.style.top = `${cy - 7}px`;
        d.style.setProperty('--dx', `${Math.cos(a) * r.width * 0.7}px`);
        d.style.setProperty('--dy', `${Math.sin(a) * r.width * 0.7}px`);
        field.appendChild(d);
        setTimeout(() => d.remove(), 650);
      }
    }

    function schedule() {
      clearTimeout(spawnTimer);
      spawnTimer = setTimeout(spawn, 1400 + Math.random() * 1400);
    }

    spawn();
    setTimeout(spawn, 600);
    ctx.setHint('Tik op de bellen');
    this.unmount = () => { alive = false; clearTimeout(spawnTimer); };
  }
};
