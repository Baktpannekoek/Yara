/* Ouderpoort en oudermenu: gewone UI voor volwassenen, achter een drempel die een peuter niet neemt */

import { settings, setSetting, putRecording, deleteRecording, putPhoto, deletePhoto, listPhotos, clearAll, DEFAULTS } from './store.js';
import { recordableItems, photoKey, isBuiltinKey } from './words.js';
import * as speech from './speech.js';
import * as audio from './audio.js';
import { mountBackupUI } from './backup.js';

const overlay = document.getElementById('overlay');
const HOLD_MS = 3000;
const MAX_REC_MS = 4000;
const MAX_PHOTO_PX = 800;   // langste zijde van een opgeslagen foto

let photoUrls = [];         // object-URL's van foto's in het menu, opgeruimd bij sluiten

function revokePhotoUrls() {
  photoUrls.forEach((u) => URL.revokeObjectURL(u));
  photoUrls = [];
}

function close() {
  overlay.hidden = true;
  overlay.innerHTML = '';
  stopStream();
  revokePhotoUrls();
}

/* ---------- Ouderpoort ---------- */

export function openGate(ctx) {
  overlay.hidden = false;
  overlay.innerHTML = `
    <div class="panel">
      <h2>Voor papa en mama</h2>
      <p>Houd de knop drie seconden ingedrukt.</p>
      <button class="gate-hold" id="hold"><div class="fill"></div><span>Ingedrukt houden</span></button>
      <div class="footer"><span></span><button class="btn ghost" id="cancel">Terug naar spelen</button></div>
    </div>`;
  const hold = overlay.querySelector('#hold');
  const fill = hold.querySelector('.fill');
  let t0 = 0, ticker = null;

  // Met een gewone timer, niet met requestAnimationFrame: die staat stil als iOS het scherm even niet tekent
  function tick() {
    const p = Math.min(1, (performance.now() - t0) / HOLD_MS);
    fill.style.width = `${p * 100}%`;
    if (p >= 1) { stop(); askSum(ctx); }
  }
  function start(e) { e.preventDefault(); t0 = performance.now(); clearInterval(ticker); ticker = setInterval(tick, 50); }
  function stop() { clearInterval(ticker); ticker = null; fill.style.width = '0'; }

  hold.addEventListener('pointerdown', start);
  hold.addEventListener('pointerup', stop);
  hold.addEventListener('pointercancel', stop);
  hold.addEventListener('pointerleave', stop);
  overlay.querySelector('#cancel').addEventListener('click', close);
  // Per ongeluk geopend door een peuter: na 20 seconden zonder succes vanzelf dicht
  armAutoClose(20000);
}

let autoCloseTimer = null;
function armAutoClose(ms) {
  clearTimeout(autoCloseTimer);
  autoCloseTimer = setTimeout(() => { if (!overlay.hidden && !overlay.querySelector('#done')) close(); }, ms);
}

const NUM = ['nul', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf', 'twaalf'];

function askSum(ctx) {
  const a = 2 + Math.floor(Math.random() * 5);
  const b = 2 + Math.floor(Math.random() * 5);
  const ok = a + b;
  const options = new Set([ok]);
  while (options.size < 4) options.add(Math.max(2, ok + Math.floor(Math.random() * 7) - 3));
  const list = [...options].sort(() => Math.random() - 0.5);
  overlay.innerHTML = `
    <div class="panel">
      <h2>Even rekenen</h2>
      <p>Hoeveel is ${NUM[a]} plus ${NUM[b]}?</p>
      <div class="gate-answers">${list.map((n) => `<button class="btn secondary" data-n="${n}">${n}</button>`).join('')}</div>
      <div class="footer"><span></span><button class="btn ghost" id="cancel">Terug naar spelen</button></div>
    </div>`;
  overlay.querySelectorAll('[data-n]').forEach((b) => b.addEventListener('click', () => {
    if (Number(b.dataset.n) === ok) { clearTimeout(autoCloseTimer); openMenu(ctx); } else close();
  }));
  overlay.querySelector('#cancel').addEventListener('click', close);
  armAutoClose(20000);
}

/* ---------- Oudermenu ---------- */

let stream = null;
let recorder = null;
let recTimer = null;

function isStandaloneApp() { return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches; }
function isIosDevice() { return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }

/* Microfoon loslaten. Dit gebeurt pas als het oudermenu sluit, net als in de eerste versie:
   elke opname opnieuw om de microfoon vragen gaf op iOS lege opnames. */
function releaseMic() {
  if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
  audio.setRecording(false);
}

function stopStream() {
  // Loopt er nog een opname? Dan netjes stoppen, onstop bewaart hem en ruimt op.
  if (recorder && recorder.state === 'recording') { try { recorder.stop(); } catch {} }
  recorder = null;
  clearTimeout(recTimer);
  releaseMic();
}

function pickMime() {
  if (!('MediaRecorder' in window)) return null;
  const types = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/aac'];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) || '';
}

export function openMenu(ctx) {
  const s = settings();
  audio.stopAmbient();
  const canRecord = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && 'MediaRecorder' in window);
  const groups = recordableItems(s.childName);

  overlay.innerHTML = `
    <div class="panel">
      <h2>Instellingen</h2>
      <p class="muted">Alles blijft op dit apparaat. Niets gaat naar internet.</p>
      ${isIosDevice() && !isStandaloneApp() ? `<p class="muted" style="color:#8a1c1c">Je gebruikt de app nu in Safari. Opnames, foto's en instellingen die je hier maakt zie je niet in de app op het beginscherm. Zet de app eerst op het beginscherm (Delen, dan "Zet op beginscherm") en maak ze daar.</p>` : ''}

      <div class="row"><label for="name">Naam</label><input type="text" id="name" value="${escapeHtml(s.childName)}" maxlength="20" autocomplete="off"></div>
      <div class="row"><label for="minutes">Speelduur</label>
        <select id="minutes">
          <option value="5">5 minuten</option><option value="10">10 minuten</option><option value="15">15 minuten</option><option value="0">Geen einde</option>
        </select></div>
      <div class="row"><label for="volume">Volume</label><input type="range" id="volume" min="0.2" max="1" step="0.05" value="${s.volume}"></div>
      <div class="row"><label>Zachte achtergrondmuziek</label><input class="toggle" type="checkbox" id="ambient" ${s.ambient !== false ? 'checked' : ''}></div>

      <h3>Plekjes</h3>
      ${[['speelwei', 'Speelwei'], ['kiekeboe', 'Kiekeboe (boerderij, wilde dieren, voertuigen)'], ['music', 'Muziek en liedjes'], ['move', 'Doe mee'], ['bubbles', 'Bellen'], ['stickers', 'Stickers'], ['book', 'Prentenboek'], ['face', 'Gezichtje']]
        .map(([k, label]) => `<div class="row"><label>${label}</label><input class="toggle" type="checkbox" data-scene="${k}" ${s.scenes[k] !== false ? 'checked' : ''}></div>`).join('')}
      <div class="row"><label for="bubble-level">Tempo bellen</label>
        <select id="bubble-level">
          <option value="rustig">Rustig</option><option value="gewoon">Gewoon</option><option value="druk">Druk</option>
        </select></div>

      <h3>Mijn spullen</h3>
      <p>Een foto van haar eigen beer, bekertje of schoenen, met de naam erbij. Zo krijgt het prentenboek een vijfde hoofdstuk met haar eigen wereld. Bij elke tik hoort ze de naam.</p>
      <div class="photo-add">
        <div class="pick">
          <label class="btn secondary" for="photo-cam">Foto maken</label>
          <label class="btn secondary" for="photo-pick">Foto kiezen</label>
        </div>
        <input type="file" id="photo-cam" accept="image/*" capture="environment">
        <input type="file" id="photo-pick" accept="image/*">
        <img class="photo-preview" id="photo-preview" alt="" hidden>
        <input type="text" id="photo-name" placeholder="Hoe heet het? Bijvoorbeeld: beer" maxlength="20" autocomplete="off" autocapitalize="none">
        <button class="btn" id="photo-save" disabled>In het prentenboek zetten</button>
        <span class="muted" id="photo-status"></span>
      </div>
      <div class="rec-list" id="photo-list"></div>

      <h3>Jullie eigen stem</h3>
      <p>Spreek woorden en dierengeluiden zelf in. Een bekende stem houdt haar aandacht beter vast dan een computerstem. Zonder opname gebruikt de app de Nederlandse stem van het apparaat${speech.hasDutchVoice() ? '' : ' (nog niet gevonden: zet in Instellingen > Toegankelijkheid > Gesproken materiaal een Nederlandse stem aan)'}.</p>
      ${canRecord ? '' : '<p class="muted">Opnemen werkt niet in deze browser. Op een iPhone of iPad werkt het in de app op het beginscherm.</p>'}
      <p class="muted">Vraagt de iPhone om toestemming voor de microfoon? Tik op Sta toe. Heb je eerder geweigerd, zet het dan aan via Instellingen > Safari > Microfoon.</p>
      <div class="rec-list" id="rec-list">
        ${groups.map((g) => `<div class="rec-section">${g.title}</div>${g.items.map((it) => recRow(it, canRecord)).join('')}`).join('')}
      </div>

      <div id="backup-ui"></div>

      <h3>Tips voor samen spelen</h3>
      <p>Zit erbij, benoem wat ze ziet en herhaal haar woorden. Een paar minuten per keer is genoeg. De app stopt vanzelf met een slaapliedje.</p>
      <p><strong>Vergrendelen op iPhone of iPad:</strong> zet "Begeleide toegang" aan via Instellingen > Toegankelijkheid. Druk daarna drie keer op de zijknop terwijl de app open staat. Zo kan ze de app niet verlaten.</p>

      <h3>Opruimen</h3>
      <button class="btn danger" id="wipe">Alle opnames, foto's en instellingen wissen</button>

      <div class="footer"><span></span><button class="btn big" id="done">Klaar</button></div>
    </div>`;

  overlay.querySelector('#minutes').value = String(s.sessionMinutes);
  overlay.querySelector('#ambient').addEventListener('change', (e) => { setSetting('ambient', e.target.checked); audio.setAmbientEnabled(e.target.checked); });
  overlay.querySelector('#bubble-level').value = s.bubbleLevel || 'gewoon';
  overlay.querySelector('#bubble-level').addEventListener('change', (e) => setSetting('bubbleLevel', e.target.value));

  overlay.querySelector('#name').addEventListener('change', (e) => {
    const v = e.target.value.trim() || DEFAULTS.childName;
    setSetting('childName', v);
  });
  overlay.querySelector('#minutes').addEventListener('change', (e) => { setSetting('sessionMinutes', Number(e.target.value)); ctx.startSession(); });
  overlay.querySelector('#volume').addEventListener('input', (e) => { const v = Number(e.target.value); audio.setVolume(v); setSetting('volume', v); });
  overlay.querySelector('#volume').addEventListener('change', () => audio.chime());
  overlay.querySelectorAll('[data-scene]').forEach((cb) => cb.addEventListener('change', () => {
    const scenes = { ...settings().scenes, [cb.dataset.scene]: cb.checked };
    setSetting('scenes', scenes);
  }));

  overlay.querySelectorAll('.rec-item').forEach((row) => {
    const key = row.dataset.key;
    const text = row.dataset.text;
    const status = row.querySelector('.status');
    const btnRec = row.querySelector('.rec');
    const btnPlay = row.querySelector('.play');
    const btnDel = row.querySelector('.del');
    const refresh = () => {
      const has = speech.hasRecording(key);
      status.textContent = has ? 'eigen stem' : 'computerstem';
      btnDel.disabled = !has;
    };
    refresh();
    btnPlay.addEventListener('click', () => { audio.unlock(); speech.say(key, text); });
    btnDel.addEventListener('click', async () => { await deleteRecording(key); speech.forget(key); refresh(); });
    if (btnRec) btnRec.addEventListener('click', () => toggleRecord(key, btnRec, status, refresh, Number(row.dataset.max) || MAX_REC_MS));
  });

  wirePhotos(canRecord);
  try {
    mountBackupUI(overlay.querySelector('#backup-ui'), { audio, refreshMenu: () => { revokePhotoUrls(); openMenu(ctx); } });
  } catch (e) { console.warn('Back-up niet beschikbaar', e); }

  overlay.querySelector('#wipe').addEventListener('click', async () => {
    if (!confirm("Alle opnames, foto's en instellingen wissen?")) return;
    await clearAll();
    location.reload();
  });
  overlay.querySelector('#done').addEventListener('click', () => { close(); ctx.go('world'); });
}

function recRow(it, canRecord) {
  return `<div class="rec-item" data-key="${it.key}" data-text="${escapeHtml(it.text)}" data-max="${it.max || ''}">
    <span class="name">${escapeHtml(it.label)}</span>
    <span class="status"></span>
    ${canRecord ? '<button class="btn rec">Opnemen</button>' : ''}
    <button class="btn secondary play">▶</button>
    <button class="btn secondary del">✕</button>
  </div>`;
}

const MIN_REC_MS = 1000;    // korter dan dit levert op iOS een leeg bestand op
let recStartedAt = 0;

function stopRecording(rec) {
  // Snel op Stop getikt? Dan nog even doorlopen tot een seconde, anders is het bestand leeg
  const rest = MIN_REC_MS - (performance.now() - recStartedAt);
  if (rest > 0) { setTimeout(() => { if (rec.state === 'recording') rec.stop(); }, rest); return; }
  if (rec.state === 'recording') rec.stop();
}

/* Opnemen. Bewust zo eenvoudig mogelijk gehouden, zoals in de eerste versie die op iPhone werkte:
   één microfoonstroom voor het hele menu, geen audiosessie-instellingen, de opname bewaren
   zodra de data binnen is. Het stille geluidselement staat tijdens het opnemen stil. */
async function toggleRecord(key, btn, status, refresh, maxMs = MAX_REC_MS) {
  if (recorder && recorder.state === 'recording') { stopRecording(recorder); return; }
  // Andere knoppen die nog op "Stop" staan terugzetten
  overlay.querySelectorAll('.btn.recording').forEach((b) => { b.classList.remove('recording'); b.textContent = 'Opnemen'; });
  audio.setRecording(true);
  if (!stream || !stream.active) {
    status.textContent = 'microfoon aan…';
    stream = null;
    // Even wachten tot iOS de audiosessie heeft losgelaten, dan vragen; bij een fout één keer opnieuw
    await new Promise((r) => setTimeout(r, 150));
    let lastErr = null;
    for (let poging = 0; poging < 2 && !stream; poging++) {
      try {
        // Zonder echo-onderdrukking klinkt een stem voller; iOS kiest anders de dunne telefoonstand
        stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true } });
      } catch (e) {
        lastErr = e;
        console.warn('getUserMedia', poging, e);
        if (e && e.name === 'NotAllowedError') break;
        await new Promise((r) => setTimeout(r, 500));
      }
    }
    if (!stream) {
      const naam = lastErr && lastErr.name ? lastErr.name : 'onbekend';
      status.textContent = naam === 'NotAllowedError' ? 'geen toestemming' : `microfoon niet beschikbaar (${naam})`;
      audio.setRecording(false);
      return;
    }
  }
  const mime = pickMime();
  const chunks = [];
  let rec = null;
  try {
    const opts = { audioBitsPerSecond: 128000 };
    if (mime) opts.mimeType = mime;
    rec = new MediaRecorder(stream, opts);
  } catch (e) {
    try { rec = new MediaRecorder(stream); } catch (e2) { status.textContent = 'opnemen lukt niet'; audio.setRecording(false); return; }
  }
  recorder = rec;
  // iOS levert de data soms pas na het stop-signaal; daar wachten we even op
  let gotData = null;
  const dataReady = new Promise((res) => { gotData = res; });
  rec.ondataavailable = (e) => { if (e.data && e.data.size) { chunks.push(e.data); gotData(); } };
  rec.onstop = async () => {
    clearTimeout(recTimer);
    if (recorder === rec) recorder = null;
    btn.classList.remove('recording');
    btn.textContent = 'Opnemen';
    status.textContent = 'opslaan…';
    await Promise.race([dataReady, new Promise((r) => setTimeout(r, 2500))]);
    const type = rec.mimeType || mime || 'audio/mp4';
    const blob = new Blob(chunks, { type });
    if (blob.size < 200) {
      status.textContent = 'niets opgenomen, probeer nog eens';
      releaseMic();
      return;
    }
    try {
      await putRecording(key, blob);
      const ok = await speech.loadOne(key);
      status.textContent = ok ? 'opgeslagen, tik op ▶' : 'opgeslagen, maar niet af te spelen';
      refresh();
      releaseMic();
    } catch (e) {
      console.warn(e);
      status.textContent = 'opslaan mislukt';
      audio.setRecording(false);
    }
  };
  try {
    recStartedAt = performance.now();
    rec.start();
    btn.classList.add('recording');
    btn.textContent = 'Stop';
    status.textContent = 'opnemen…';
    recTimer = setTimeout(() => { if (rec.state === 'recording') rec.stop(); }, maxMs);
  } catch (e) {
    console.warn(e);
    status.textContent = 'opnemen lukt niet';
    if (recorder === rec) recorder = null;
    audio.setRecording(false);
  }
}

/* ---------- Mijn spullen: foto's van eigen spullen ---------- */

function wirePhotos(canRecord) {
  const inputs = [overlay.querySelector('#photo-cam'), overlay.querySelector('#photo-pick')];
  const preview = overlay.querySelector('#photo-preview');
  const nameEl = overlay.querySelector('#photo-name');
  const btnSave = overlay.querySelector('#photo-save');
  const status = overlay.querySelector('#photo-status');
  const list = overlay.querySelector('#photo-list');
  let pending = null;   // verkleinde foto die nog niet is opgeslagen

  const updateSave = () => { btnSave.disabled = !(pending && photoKey(nameEl.value)); };

  async function onFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';   // zodat dezelfde foto later opnieuw gekozen kan worden
    if (!file) return;
    status.textContent = 'Foto verkleinen…';
    btnSave.disabled = true;
    try {
      pending = await resizeImage(file, MAX_PHOTO_PX);
      const url = URL.createObjectURL(pending);
      photoUrls.push(url);
      preview.src = url;
      preview.hidden = false;
      status.textContent = photoKey(nameEl.value) ? '' : 'Typ nu de naam erbij.';
    } catch (err) {
      console.warn(err);
      pending = null;
      preview.hidden = true;
      status.textContent = 'Deze foto lukt niet. Probeer een andere.';
    }
    updateSave();
  }
  inputs.forEach((inp) => inp.addEventListener('change', onFile));
  nameEl.addEventListener('input', updateSave);

  btnSave.addEventListener('click', async () => {
    const name = nameEl.value.trim();
    const key = photoKey(name);
    if (!pending || !key) return;
    btnSave.disabled = true;
    status.textContent = 'Opslaan…';
    try {
      const id = 'foto-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
      await putPhoto({ id, name, key, blob: pending, at: Date.now() });
      pending = null;
      preview.hidden = true;
      preview.removeAttribute('src');
      nameEl.value = '';
      status.textContent = `"${name}" staat nu in het prentenboek.`;
      await renderList();
    } catch (err) {
      console.warn(err);
      status.textContent = 'Opslaan mislukt.';
    }
    updateSave();
  });

  async function renderList() {
    const photos = await listPhotos();
    // De blob opnieuw in het geheugen zetten: op iOS 17.4 blijft een blob-URL uit IndexedDB anders leeg
    const rows = await Promise.all(photos.map(async (p) => {
      let blob = p.blob;
      try { blob = new Blob([await p.blob.arrayBuffer()], { type: p.blob.type }); } catch {}
      const url = URL.createObjectURL(blob);
      photoUrls.push(url);
      return photoRow(p, url, canRecord);
    }));
    if (!overlay.contains(list)) return;
    list.innerHTML = photos.length
      ? rows.join('')
      : "<p class=\"muted\">Nog geen foto's. Zodra er één is, krijgt het prentenboek een hoofdstuk met een camera.</p>";
    list.querySelectorAll('.photo-item').forEach((row) => {
      const { id, key, text } = row.dataset;
      const st = row.querySelector('.status');
      const btnRec = row.querySelector('.rec');
      const refresh = () => { st.textContent = speech.hasRecording(key) ? 'eigen stem' : 'computerstem'; };
      refresh();
      row.querySelector('.play').addEventListener('click', () => { audio.unlock(); speech.say(key, text); });
      if (btnRec) btnRec.addEventListener('click', () => toggleRecord(key, btnRec, st, refresh));
      row.querySelector('.del').addEventListener('click', async () => {
        if (!confirm(`Foto "${text}" weghalen?`)) return;
        await deletePhoto(id);
        // De opname gaat mee als geen andere foto en geen vast woord dezelfde sleutel gebruikt
        const rest = await listPhotos();
        if (!isBuiltinKey(key) && !rest.some((p) => p.key === key)) { await deleteRecording(key); speech.forget(key); }
        await renderList();
      });
    });
  }
  renderList().catch((e) => console.warn(e));
}

function photoRow(p, url, canRecord) {
  return `<div class="photo-item" data-id="${escapeHtml(p.id)}" data-key="${escapeHtml(p.key)}" data-text="${escapeHtml(p.name)}">
    <img src="${url}" alt="">
    <span class="name">${escapeHtml(p.name)}</span>
    <span class="status"></span>
    <span class="actions">
      ${canRecord ? '<button class="btn rec">Opnemen</button>' : ''}
      <button class="btn secondary play">▶</button>
      <button class="btn secondary del">✕</button>
    </span>
  </div>`;
}

/* Verklein een foto tot de langste zijde max px is en geef een JPEG-blob terug.
   De browser past de EXIF-oriëntatie zelf toe bij het tekenen, dus een staande foto blijft staand. */
function resizeImage(file, max) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const w0 = img.naturalWidth, h0 = img.naturalHeight;
      if (!w0 || !h0) { reject(new Error('Lege afbeelding')); return; }
      const scale = Math.min(1, max / Math.max(w0, h0));
      const w = Math.max(1, Math.round(w0 * scale));
      const h = Math.max(1, Math.round(h0 * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Verkleinen mislukt'))), 'image/jpeg', 0.85);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Afbeelding niet te lezen')); };
    img.src = url;
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
