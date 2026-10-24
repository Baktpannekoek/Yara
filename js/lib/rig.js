/* Rig: zet een figuurdefinitie om in een levend element.
   Een figuurdefinitie heeft: key, svg(opts) met data-part en data-pivot, idle(fig) en react(fig, ctx). */

export function createFigure(def, opts = {}) {
  const el = document.createElement('div');
  el.className = 'fig';
  el.dataset.key = def.key;
  el.innerHTML = def.svg(opts);
  const svg = el.querySelector('svg');
  svg.style.transformBox = 'view-box';
  svg.style.transformOrigin = '50% 100%';
  const parts = {};
  svg.querySelectorAll('[data-part]').forEach((g) => {
    const [px, py] = (g.dataset.pivot || '0 0').split(' ').map(Number);
    g.style.transformBox = 'view-box';
    g.style.transformOrigin = `${px}px ${py}px`;
    parts[g.dataset.part] = g;
  });

  const fig = {
    def, el, svg, parts, opts,
    zone: opts.zone || 'gras',
    anims: new Set(),       // alle lopende animaties
    idle: {},               // per deel: idle-animaties die bij een reactie even pauzeren
    timers: new Set(),
    busy: false,
    alive: true,
    part(name) { return parts[name] || null; },
    later(fn, ms) {
      const t = setTimeout(() => { fig.timers.delete(t); if (fig.alive) fn(); }, ms);
      fig.timers.add(t);
      return t;
    },
    destroy() {
      fig.alive = false;
      fig.timers.forEach(clearTimeout);
      fig.timers.clear();
      fig.anims.forEach((a) => { try { a.cancel(); } catch {} });
      fig.anims.clear();
      el.remove();
    }
  };
  return fig;
}

/* Idle-animaties van een deel even stilzetten tijdens een reactie, daarna weer aan */
export function pauseIdle(fig, name) {
  (fig.idle[name] || []).forEach((a) => { try { a.pause(); } catch {} });
}
export function resumeIdle(fig, name) {
  (fig.idle[name] || []).forEach((a) => { try { a.play(); } catch {} });
}
export function registerIdle(fig, name, anim) {
  (fig.idle[name] = fig.idle[name] || []).push(anim);
  return anim;
}
