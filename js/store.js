/* Opslag op het apparaat zelf: instellingen, stemopnames en foto's in IndexedDB.
   Niets verlaat het apparaat. */

const DB_NAME = 'yara-wereld';
const DB_VERSION = 2;   // 1: settings en recordings. 2: photos erbij.
let dbPromise = null;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      // Draait bij een nieuwe installatie en bij een versiesprong. Stores die er al zijn blijven staan.
      const db = req.result;
      if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings');
      if (!db.objectStoreNames.contains('recordings')) db.createObjectStore('recordings');
      if (!db.objectStoreNames.contains('photos')) db.createObjectStore('photos', { keyPath: 'id' });
    };
    req.onblocked = () => console.warn('Database-upgrade wacht tot een ander tabblad de app sluit');
    req.onsuccess = () => {
      const db = req.result;
      // Een nieuwere versie in een ander tabblad: deze verbinding loslaten, de volgende aanroep opent opnieuw
      db.onversionchange = () => { db.close(); dbPromise = null; };
      resolve(db);
    };
    req.onerror = () => { dbPromise = null; reject(req.error); };
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

/* ---------- Stemopnames ---------- */

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

/* ---------- Foto's van eigen spullen ----------
   Een foto is { id, name, key, blob, at }. key is de sleutel van de bijbehorende stemopname. */

export async function putPhoto(photo) {
  return tx('photos', 'readwrite', (s) => s.put(photo));
}
export async function deletePhoto(id) {
  return tx('photos', 'readwrite', (s) => s.delete(id));
}
export async function listPhotos() {
  try {
    const all = await tx('photos', 'readonly', (s) => s.getAll());
    return (all || []).filter((p) => p && p.blob).sort((a, b) => (a.at || 0) - (b.at || 0));
  } catch (e) {
    console.warn("Foto's niet geladen", e);
    return [];
  }
}

export async function clearAll() {
  await tx('recordings', 'readwrite', (s) => s.clear());
  await tx('photos', 'readwrite', (s) => s.clear());
  await tx('settings', 'readwrite', (s) => s.clear());
  cache = { ...DEFAULTS, scenes: { ...DEFAULTS.scenes } };
}
