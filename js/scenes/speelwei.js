/* Speelwei: vier werelden op de bibliotheek. Figuren staan op vaste plekken die bij ze passen,
   leven zachtjes en reageren elk op hun eigen manier op een tik. Bovenin wissel je van wereld. */

import { SETS } from '../words.js';
import { extraSounds } from '../sounds-extra-bundel.js';
import * as extra from '../art-extra.js';
import * as more from '../art-more.js';
import { mountWorld } from '../lib/scene.js';
import { createFigure } from '../lib/rig.js';
import * as A from '../lib/anim.js';
import * as fx from '../lib/fx.js';
import { boerderij } from '../lib/worlds/boerderij.js';
import { savanne } from '../lib/worlds/savanne.js';
import { stadje } from '../lib/worlds/stadje.js';
import { park } from '../lib/worlds/park.js';
import { loadFigures } from '../lib/figures/index.js';

const ORDER = ['farm', 'wild', 'vehicles', 'people'];
const WORLDS = { farm: boerderij, wild: savanne, vehicles: stadje, people: park };
const ICONS = { farm: (art) => art.barnIcon(), wild: () => extra.wildIcon(), vehicles: () => extra.vehicleIcon(), people: () => more.doeMeeIcon() };
let currentSet = 'farm';

export default {
  id: 'speelwei',
  mount(root, ctx) {
    const scene = this;
    scene.ambient = currentSet;
    let world = null;
    let buildId = 0;
    const sounds = { ...ctx.audio.animals, ...extraSounds };

    /* Figuren die nog niet in de bibliotheek staan: oude tekening met eenvoudig gedrag */
    function legacyDef(item) {
      return {
        key: item.key,
        svg: () => (typeof extra[item.key] === 'function' ? extra[item.key]() : null) || ctx.art.byName(item.key),
        idle(fig) { A.bobLoop(fig, fig.svg, 1.5, 2400 + Math.random() * 800); },
        async react(fig, c, tap, w) {
          const pt = w.center(fig, 0.5, 0.95);
          c.sound('geluid-' + item.key, sounds[item.key] || c.audio.tap);
          await A.hop(fig, 12, 600);
          fx.dust(pt.x, pt.y, 5);
          fig.later(() => c.say(item.key, item.name), 150);
        }
      };
    }

    function topBar() {
      return `<div class="wei-top">
          ${ORDER.map((k) => `<div class="set-btn ${k === currentSet ? 'active' : ''}" data-set="${k}" aria-label="${SETS[k].title}">${ICONS[k](ctx.art)}</div>`).join('')}
        </div>`;
    }

    async function build() {
      const id = ++buildId;
      const set = SETS[currentSet];
      const wdef = WORLDS[currentSet];
      if (world) { world.destroy(); world = null; }
      root.innerHTML = `<div class="world-root"></div>${topBar()}`;
      root.querySelectorAll('.set-btn').forEach((b) => ctx.onTap(b, (e) => {
        e.stopPropagation();
        if (b.dataset.set === currentSet) { ctx.animate(b, 'anim-wiggle'); return; }
        currentSet = b.dataset.set;
        ctx.audio.tap();
        scene.ambient = currentSet;
        ctx.audio.startAmbient(currentSet);
        build();
      }));
      world = mountWorld(root.querySelector('.world-root'), wdef, ctx);
      const items = [...set.items, ...(wdef.extras || [])];
      const defs = await loadFigures(items.map((i) => i.key));
      if (id !== buildId || !root.isConnected) return;   // intussen gewisseld
      items.forEach((item) => {
        const spot = world.spot(item.key);
        if (!spot) return;
        const def = defs[item.key] || legacyDef(item);
        const fig = createFigure(def, { zone: spot.zone });
        world.place(fig, spot);
        try { def.idle(fig); } catch (e) { console.warn(e); }
        ctx.onTap(fig.el, (e) => {
          e.stopPropagation();
          const r = fig.el.getBoundingClientRect();
          const tap = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
          A.react(fig, async () => {
            A.lookAt(fig, ['oog-l-pupil', 'oog-r-pupil', 'oog-pupil'].filter((n) => fig.part(n)), tap.x, tap.y, 900);
            await def.react(fig, ctx, tap, world);
          });
          ctx.setHint((item.question || `Dat is de ${item.name}!`).replace('Yara', ctx.childName));
        });
      });
      ctx.setHint(`${set.title}: tik op een figuurtje`);
    }

    // Een tik naast de figuren: een zacht tikje, zodat elke tik iets doet
    ctx.onTap(root, (e) => { ctx.audio.tap(); fx.sparkles(e.clientX, e.clientY, 3, '#ffffff'); });

    build();
    this.unmount = () => { buildId++; if (world) { world.destroy(); world = null; } };
  }
};
