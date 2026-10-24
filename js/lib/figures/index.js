/* Alle figuren uit de bibliotheek. Ze worden pas geladen als ze nodig zijn; ontbreekt een figuur
   nog, dan valt de scene terug op de oude tekening. */

import { PERSONEN } from './persoon.js';

const LOADERS = {
  koe: () => import('./koe.js'), eend: () => import('./eend.js'), trein: () => import('./trein.js'),
  hond: () => import('./hond.js'), kat: () => import('./kat.js'), schaap: () => import('./schaap.js'), paard: () => import('./paard.js'),
  kip: () => import('./kip.js'), varken: () => import('./varken.js'), kikker: () => import('./kikker.js'), vogel: () => import('./vogel.js'),
  leeuw: () => import('./leeuw.js'), olifant: () => import('./olifant.js'), aap: () => import('./aap.js'), giraf: () => import('./giraf.js'),
  zebra: () => import('./zebra.js'), krokodil: () => import('./krokodil.js'),
  auto: () => import('./auto.js'), vliegtuig: () => import('./vliegtuig.js'), bus: () => import('./bus.js'), tractor: () => import('./tractor.js'),
  boot: () => import('./boot.js'), brandweerauto: () => import('./brandweerauto.js'), fiets: () => import('./fiets.js')
};
const cache = new Map();

export async function figureDef(key) {
  if (PERSONEN[key]) return PERSONEN[key];
  if (cache.has(key)) return cache.get(key);
  let def = null;
  if (LOADERS[key]) {
    try { const m = await LOADERS[key](); def = m[key] || null; }
    catch (e) { def = null; }
  }
  cache.set(key, def);
  return def;
}

export async function loadFigures(keys) {
  const out = {};
  await Promise.all(keys.map(async (k) => { out[k] = await figureDef(k); }));
  return out;
}
