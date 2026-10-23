/* Opnames, foto's en instellingen bewaren als één bestand en weer terugzetten.

   Opnames staan per apparaat en per app in IndexedDB. Wie de app opnieuw op het beginscherm
   zet, of de opnames ook op de iPad wil, moest tot nu toe alles opnieuw inspreken. Dit bestand
   lost dat op: alles in één JSON-bestand, bewaren in Bestanden of naar jezelf sturen, en op een
   ander apparaat weer terugzetten. Niets gaat over het netwerk. */

import { settings, setSetting, putRecording, getRecording, listRecordingKeys, putPhoto, listPhotos, DEFAULTS } from './store.js';
import * as speech from './speech.js';

const APP = 'yara-wereld';
const VERSIE = 1;
const INSTELLINGEN = ['childName', 'sessionMinutes', 'volume', 'scenes'];

/* Een fout met een tekst die de ouder mag zien */
class BackupFout extends Error {}

/* ---------- Omzetten tussen blob en base64 ---------- */

/* Blob naar base64 via FileReader.readAsDataURL: dat werkt op iOS zonder grote tussenstrings.
   Bij de controle in Node is er geen FileReader; dan via Buffer. */
function blobNaarBase64(blob) {
  if (typeof FileReader === 'undefined') {
    return blob.arrayBuffer().then((buf) => Buffer.from(buf).toString('base64'));
  }
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      // Resultaat is "data:<type>;base64,<data>", alleen het deel na de komma is nodig
      const s = String(r.result || '');
      const i = s.indexOf(',');
      resolve(i >= 0 ? s.slice(i + 1) : '');
    };
    r.onerror = () => reject(r.error || new Error('Blob niet te lezen'));
    r.readAsDataURL(blob);
  });
}

/* Base64 terug naar een Blob met het juiste type. Handmatig gedecodeerd, dus geen fetch van een data-URL nodig. */
function base64NaarBlob(data, type) {
  const bin = atob(String(data || '').replace(/\s+/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: type || '' });
}

/* ---------- Bewaren ---------- */

/* Leest alle opnames, foto's en instellingen en geeft één JSON-blob terug */
export async function maakBackup() {
  const opnames = [];
  for (const key of await listRecordingKeys()) {
    const rec = await getRecording(key);
    if (!rec || !rec.blob) continue;
    opnames.push({ key, type: rec.type || rec.blob.type || '', data: await blobNaarBase64(rec.blob) });
  }

  const fotos = [];
  for (const p of await listPhotos()) {
    fotos.push({ id: p.id, name: p.name, key: p.key, at: p.at || 0, type: p.blob.type || 'image/jpeg', data: await blobNaarBase64(p.blob) });
  }

  const s = settings();
  const instellingen = {};
  INSTELLINGEN.forEach((k) => { if (s[k] !== undefined) instellingen[k] = s[k]; });

  const inhoud = { app: APP, versie: VERSIE, gemaakt: new Date().toISOString(), instellingen, opnames, fotos };
  return new Blob([JSON.stringify(inhoud)], { type: 'application/json' });
}

/* yara-opnames-JJJJ-MM-DD.json, met de datum van het apparaat */
export function bestandsnaamVandaag(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `yara-opnames-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.json`;
}

function isIOS() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  // Een iPad met iPadOS meldt zich als Mac, maar heeft een aanraakscherm
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

/* Op iOS via het deelvenster (naar Bestanden, AirDrop of mail), anders als download.
   Geeft de gebruikte route terug: 'delen', 'download' of 'geannuleerd'. */
export async function deelOfDownload(blob, bestandsnaam = bestandsnaamVandaag()) {
  if (isIOS() && typeof navigator.share === 'function') {
    try {
      const file = new File([blob], bestandsnaam, { type: 'application/json' });
      if (!navigator.canShare || navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: bestandsnaam });
        return 'delen';
      }
    } catch (e) {
      if (e && e.name === 'AbortError') return 'geannuleerd';
      console.warn('Delen mislukt, dan als download', e);
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = bestandsnaam;
  a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Niet meteen vrijgeven: sommige browsers beginnen de download pas na dit event
  setTimeout(() => URL.revokeObjectURL(url), 60000);
  return 'download';
}

/* ---------- Terugzetten ---------- */

/* Leest een bewaard bestand en zet alles terug. Opnames met dezelfde sleutel en foto's met
   hetzelfde id worden overschreven, andere blijven staan. Geeft { opnames, fotos } met aantallen terug. */
export async function zetTerug(file) {
  let inhoud;
  try {
    inhoud = JSON.parse(await file.text());
  } catch {
    throw new BackupFout('Het bestand is niet te lezen.');
  }
  if (!inhoud || typeof inhoud !== 'object' || inhoud.app !== APP || !Number.isInteger(inhoud.versie)) {
    throw new BackupFout("Dit is geen bestand van Yara's wereld.");
  }
  if (inhoud.versie > VERSIE) {
    throw new BackupFout('Dit bestand komt uit een nieuwere versie van de app. Werk de app eerst bij.');
  }

  let opnames = 0;
  for (const o of Array.isArray(inhoud.opnames) ? inhoud.opnames : []) {
    if (!o || typeof o.key !== 'string' || !o.key || typeof o.data !== 'string' || !o.data) continue;
    const blob = veiligBlob(o.data, o.type, 'audio/mp4');
    if (!blob) continue;
    await putRecording(o.key, blob);
    opnames++;
  }

  let fotos = 0;
  for (const f of Array.isArray(inhoud.fotos) ? inhoud.fotos : []) {
    if (!f || typeof f.id !== 'string' || !f.id || typeof f.key !== 'string' || !f.key || typeof f.data !== 'string' || !f.data) continue;
    const blob = veiligBlob(f.data, f.type, 'image/jpeg');
    if (!blob) continue;
    await putPhoto({
      id: f.id,
      name: typeof f.name === 'string' && f.name ? f.name : f.key,
      key: f.key,
      blob,
      at: typeof f.at === 'number' ? f.at : Date.now()
    });
    fotos++;
  }

  await zetInstellingen(inhoud.instellingen);
  await speech.loadRecordings();
  return { opnames, fotos };
}

/* Eén kapotte regel in het bestand mag de rest niet tegenhouden */
function veiligBlob(data, type, standaardType) {
  try {
    const blob = base64NaarBlob(data, typeof type === 'string' && type ? type : standaardType);
    return blob.size ? blob : null;
  } catch (e) {
    console.warn('Onderdeel overgeslagen, geen geldige base64', e);
    return null;
  }
}

/* Alleen bekende sleutels, en alleen met een waarde die de app aankan */
async function zetInstellingen(inst) {
  if (!inst || typeof inst !== 'object') return;
  if (typeof inst.childName === 'string' && inst.childName.trim()) {
    await setSetting('childName', inst.childName.trim().slice(0, 20));
  }
  if (Number.isFinite(inst.sessionMinutes) && inst.sessionMinutes >= 0) {
    await setSetting('sessionMinutes', inst.sessionMinutes);
  }
  if (Number.isFinite(inst.volume) && inst.volume >= 0 && inst.volume <= 1) {
    await setSetting('volume', inst.volume);
  }
  if (inst.scenes && typeof inst.scenes === 'object') {
    const scenes = { ...DEFAULTS.scenes };
    Object.keys(DEFAULTS.scenes).forEach((k) => { if (typeof inst.scenes[k] === 'boolean') scenes[k] = inst.scenes[k]; });
    await setSetting('scenes', scenes);
  }
}

/* ---------- Blok in het oudermenu ---------- */

function aantalTekst(o, f) {
  return `${o} ${o === 1 ? 'opname' : 'opnames'} en ${f} ${f === 1 ? 'foto' : "foto's"}`;
}

let teller = 0;

/* Maakt in container een blok met uitleg, aantallen, twee knoppen en een statusregel.
   ctx.refreshMenu() wordt na het terugzetten aangeroepen als die bestaat.
   Geeft { el, refresh } terug zodat de aantallen van buitenaf bijgewerkt kunnen worden. */
export function mountBackupUI(container, ctx = {}) {
  const inputId = 'backup-bestand-' + (++teller);
  const blok = document.createElement('div');
  blok.className = 'backup';
  blok.innerHTML = `
    <h3>Opnames bewaren</h3>
    <p>Opnames en foto's staan alleen op dit apparaat, en alleen in deze app. Haal je de app van het beginscherm, dan zijn ze weg. Op een ander apparaat staan ze er niet vanzelf.</p>
    <p>Bewaren als bestand zet alles in één bestand. Dat bewaar je in Bestanden of stuur je naar jezelf. Terugzetten uit bestand zet het op een andere iPhone of iPad weer in de app. De instellingen gaan mee.</p>
    <div class="row"><label>Op dit apparaat</label><span class="backup-aantal muted">…</span></div>
    <div class="backup-knoppen" style="display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 6px">
      <button type="button" class="btn backup-bewaar">Bewaren als bestand</button>
      <label class="btn secondary" for="${inputId}">Terugzetten uit bestand</label>
      <input type="file" id="${inputId}" accept=".json,application/json" style="position:absolute;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none">
    </div>
    <span class="muted backup-status"></span>`;
  container.appendChild(blok);

  const aantalEl = blok.querySelector('.backup-aantal');
  const btnBewaar = blok.querySelector('.backup-bewaar');
  const input = blok.querySelector('input[type="file"]');
  const status = blok.querySelector('.backup-status');
  let bezig = false;

  async function refresh() {
    try {
      const [keys, fotos] = await Promise.all([listRecordingKeys(), listPhotos()]);
      aantalEl.textContent = aantalTekst(keys.length, fotos.length);
    } catch (e) {
      console.warn(e);
      aantalEl.textContent = '';
    }
  }

  btnBewaar.addEventListener('click', async () => {
    if (bezig) return;
    bezig = true;
    btnBewaar.disabled = true;
    status.textContent = 'Bestand maken…';
    try {
      const blob = await maakBackup();
      const route = await deelOfDownload(blob, bestandsnaamVandaag());
      status.textContent = route === 'delen' ? 'Bestand gedeeld.' : route === 'geannuleerd' ? 'Delen afgebroken.' : 'Bestand gemaakt.';
    } catch (e) {
      console.warn(e);
      status.textContent = 'Het bestand maken is niet gelukt.';
    }
    btnBewaar.disabled = false;
    bezig = false;
  });

  input.addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';   // zodat hetzelfde bestand later opnieuw gekozen kan worden
    if (!file || bezig) return;
    bezig = true;
    btnBewaar.disabled = true;
    status.textContent = 'Terugzetten…';
    try {
      const r = await zetTerug(file);
      status.textContent = `${aantalTekst(r.opnames, r.fotos)} teruggezet.`;
      await refresh();
      // Het teruggezette volume meteen laten gelden, niet pas na een herstart
      if (ctx.audio && typeof ctx.audio.setVolume === 'function') ctx.audio.setVolume(settings().volume);
      if (typeof ctx.refreshMenu === 'function') ctx.refreshMenu();
    } catch (err) {
      console.warn(err);
      status.textContent = err instanceof BackupFout ? err.message : 'Terugzetten is niet gelukt.';
    }
    btnBewaar.disabled = false;
    bezig = false;
  });

  refresh();
  return { el: blok, refresh };
}
