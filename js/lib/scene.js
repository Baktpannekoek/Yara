/* Wereldmotor: lagen met diepte en vaste plekken waar figuren horen.
   Een wereld tekent in een eigen assenstelsel (staand 100 x 150, liggend 200 x 100). Het veld
   rekent die coördinaten om naar pixels, zodat een eend echt in de vijver staat en een trein op het spoor. */

import * as fx from './fx.js';

/* Een eenvoudig podium voor scenes zonder wereld (kiekeboe, doe mee): alleen een effectenlaag
   en een manier om het middelpunt van een figuur te vinden. */
export function simpleStage(root) {
  let layer = root.querySelector('.world-fx');
  if (!layer) { layer = document.createElement('div'); layer.className = 'world-fx'; root.appendChild(layer); }
  fx.setLayer(layer);
  return {
    center(fig, fx0 = 0.5, fy0 = 0.5) {
      const r = fig.el.getBoundingClientRect();
      return { x: r.left + r.width * fx0, y: r.top + r.height * fy0 };
    },
    destroy() { layer.remove(); }
  };
}

export function mountWorld(root, world, ctx) {
  const portrait = window.innerHeight > window.innerWidth;
  const dims = portrait ? world.portrait : world.landscape;   // { w, h, layers(), spots }
  root.innerHTML = `
    <div class="world">
      ${dims.layers().map((svg, i) => `<div class="world-layer" data-layer="${i}">${svg}</div>`).join('')}
      <div class="world-field"></div>
      <div class="world-fx"></div>
    </div>`;
  const field = root.querySelector('.world-field');
  fx.setLayer(root.querySelector('.world-fx'));
  const placed = [];

  /* Omrekenen van wereldcoördinaten naar pixels (preserveAspectRatio xMidYMax slice) */
  function metrics() {
    const W = root.clientWidth || window.innerWidth, H = root.clientHeight || window.innerHeight;
    const scale = Math.max(W / dims.w, H / dims.h);
    return { scale, ox: (W - dims.w * scale) / 2, oy: H - dims.h * scale };
  }
  function toPx(x, y) { const m = metrics(); return { x: m.ox + x * m.scale, y: m.oy + y * m.scale, scale: m.scale }; }

  function layout() {
    placed.forEach(({ fig, spot }) => {
      const p = toPx(spot.x, spot.y);
      const size = (spot.size || 26) * p.scale;
      fig.el.style.left = `${p.x}px`;
      fig.el.style.top = `${p.y}px`;
      fig.el.style.width = `${size}px`;
      fig.el.style.height = `${size}px`;
      fig.el.style.zIndex = String(100 + Math.round(spot.y));
      if (spot.flip) fig.svg.style.setProperty('--flip', '-1');
    });
  }

  function place(fig, spot) {
    fig.el.classList.add('placed');
    field.appendChild(fig.el);
    placed.push({ fig, spot });
    fig.spot = spot;
    fig.zone = spot.zone || 'gras';
    layout();
    return fig;
  }

  /* Middelpunt van een figuur in pixels, voor effecten */
  function center(fig, fx = 0.5, fy = 0.5) {
    const r = fig.el.getBoundingClientRect();
    return { x: r.left + r.width * fx, y: r.top + r.height * fy };
  }

  const onResize = () => layout();
  window.addEventListener('resize', onResize);

  return {
    field, dims, place, center, toPx, layout,
    spot(id) { return dims.spots.find((s) => s.id === id); },
    destroy() {
      window.removeEventListener('resize', onResize);
      placed.forEach(({ fig }) => fig.destroy());
      placed.length = 0;
    }
  };
}
