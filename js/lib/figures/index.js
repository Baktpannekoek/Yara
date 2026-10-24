/* Alle figuren uit de bibliotheek op één plek. Een figuur dat hier nog niet in staat,
   wordt nog op de oude manier getekend. */

import { koe } from './koe.js';
import { eend } from './eend.js';
import { trein } from './trein.js';

export const FIGURES = { koe, eend, trein };
export function figureDef(key) { return FIGURES[key] || null; }
