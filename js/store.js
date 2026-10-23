/* Opslag op het apparaat zelf: instellingen en stemopnames in IndexedDB.
   Niets verlaat het apparaat. */

const DB_NAME = 'yara-wereld';
const DB_VERSION = 1;
let dbPromise = null;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings');
      if (!db.objectStoreNames.contains('recordings')) db.createObjectStore('recordings');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx(store, mode, fn) {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const s = t.objectStore(store);
    const req = fn(s);
    t.oncomplete = () => resolve(req && req.result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  }));
}

export const DEFAULTS = {
  childName: 'Yara',
  sessionMinutes: 10,     // 0 = geen einde
  volume: 0.8,
  scenes: { farm: true, music: true, bubbles: true, book: true, face: true }
};

let cache = { ...DEFAULTS, scenes: { ...DEFAULTS.scenes } };

export async function loadSettings() {
  try {
    const all = await tx('settings', 'readonly', (s) => s.getAll());
    const keys = await tx('settings', 'readonly', (s) => s.getAllKeys());
    const obj = {};
    keys.forEach((k, i) => { obj[k] = all[i]; });
    cache = { ...DEFAULTS, ...obj, scenes: { ...DEFAULTS.scenes, ...(obj.scenes || {}) } };
  } catch (e) {
    console.warn('Instellingen niet geladen, standaard gebruikt', e);
  }
  return cache;
}

export function settings() { return cache; }

export async function setSetting(key, value) {
  cache[key] = value;
  try { await tx('settings', 'readwrite', (s) => s.put(value, key)); } catch (e) { console.warn(e); }
}

export async function putRecording(key, blob) {
  return tx('recordings', 'readwrite', (s) => s.put({ blob, type: blob.type, at: Date.now() }, key));
}
export async function getRecording(key) {
  try { return await tx('recordings', 'readonly', (s) => s.get(key)); } catch { return null; }
}
export async function deleteRecording(key) {
  return tx('recordings', 'readwrite', (s) => s.delete(key));
}
export async function listRecordingKeys() {
  try { return await tx('recordings', 'readonly', (s) => s.getAllKeys()); } catch { return []; }
}
export async function clearAll() {
  await tx('recordings', 'readwrite', (s) => s.clear());
  await tx('settings', 'readwrite', (s) => s.clear());
  cache = { ...DEFAULTS, scenes: { ...DEFAULTS.scenes } };
}
