/* Ouderpoort en oudermenu: gewone UI voor volwassenen, achter een drempel die een peuter niet neemt */

import { settings, setSetting, putRecording, deleteRecording, clearAll, DEFAULTS } from './store.js';
import { recordableItems } from './words.js';
import * as speech from './speech.js';
import * as audio from './audio.js';

const overlay = document.getElementById('overlay');
const HOLD_MS = 3000;
const MAX_REC_MS = 4000;

function close() {
  overlay.hidden = true;
  overlay.innerHTML = '';
  stopStream();
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
  let t0 = 0, raf = null;

  function tick() {
    const p = Math.min(1, (performance.now() - t0) / HOLD_MS);
    fill.style.width = `${p * 100}%`;
    if (p >= 1) { stop(); askSum(ctx); return; }
    raf = requestAnimationFrame(tick);
  }
  function start(e) { e.preventDefault(); t0 = performance.now(); cancelAnimationFrame(raf); tick(); }
  function stop() { cancelAnimationFrame(raf); fill.style.width = '0'; }

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

function stopStream() {
  if (recorder && recorder.state !== 'inactive') { try { recorder.stop(); } catch {} }
  recorder = null;
  if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
  clearTimeout(recTimer);
}

function pickMime() {
  if (!('MediaRecorder' in window)) return null;
  const types = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/aac'];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) || '';
}

export function openMenu(ctx) {
  const s = settings();
  const canRecord = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && 'MediaRecorder' in window);
  const groups = recordableItems(s.childName);

  overlay.innerHTML = `
    <div class="panel">
      <h2>Instellingen</h2>
      <p class="muted">Alles blijft op dit apparaat. Niets gaat naar internet.</p>

      <div class="row"><label for="name">Naam</label><input type="text" id="name" value="${escapeHtml(s.childName)}" maxlength="20" autocomplete="off"></div>
      <div class="row"><label for="minutes">Speelduur</label>
        <select id="minutes">
          <option value="5">5 minuten</option><option value="10">10 minuten</option><option value="15">15 minuten</option><option value="0">Geen einde</option>
        </select></div>
      <div class="row"><label for="volume">Volume</label><input type="range" id="volume" min="0.2" max="1" step="0.05" value="${s.volume}"></div>

      <h3>Plekjes</h3>
      <div class="row"><label>Boerderij</label><input class="toggle" type="checkbox" data-scene="farm" ${s.scenes.farm !== false ? 'checked' : ''}></div>
      <div class="row"><label>Muziek</label><input class="toggle" type="checkbox" data-scene="music" ${s.scenes.music !== false ? 'checked' : ''}></div>
      <div class="row"><label>Bellen</label><input class="toggle" type="checkbox" data-scene="bubbles" ${s.scenes.bubbles !== false ? 'checked' : ''}></div>
      <div class="row"><label>Prentenboek</label><input class="toggle" type="checkbox" data-scene="book" ${s.scenes.book !== false ? 'checked' : ''}></div>
      <div class="row"><label>Gezichtje</label><input class="toggle" type="checkbox" data-scene="face" ${s.scenes.face !== false ? 'checked' : ''}></div>

      <h3>Jullie eigen stem</h3>
      <p>Spreek woorden en dierengeluiden zelf in. Een bekende stem houdt haar aandacht beter vast dan een computerstem. Zonder opname gebruikt de app de Nederlandse stem van het apparaat${speech.hasDutchVoice() ? '' : ' (nog niet gevonden: zet in Instellingen > Toegankelijkheid > Gesproken materiaal een Nederlandse stem aan)'}.</p>
      ${canRecord ? '' : '<p class="muted">Opnemen werkt niet in deze browser. Op een iPhone of iPad werkt het in Safari.</p>'}
      <div class="rec-list" id="rec-list">
        ${groups.map((g) => `<div class="rec-section">${g.title}</div>${g.items.map((it) => recRow(it, canRecord)).join('')}`).join('')}
      </div>

      <h3>Tips voor samen spelen</h3>
      <p>Zit erbij, benoem wat ze ziet en herhaal haar woorden. Een paar minuten per keer is genoeg. De app stopt vanzelf met een slaapliedje.</p>
      <p><strong>Vergrendelen op iPhone of iPad:</strong> zet "Begeleide toegang" aan via Instellingen > Toegankelijkheid. Druk daarna drie keer op de zijknop terwijl de app open staat. Zo kan ze de app niet verlaten.</p>

      <h3>Opruimen</h3>
      <button class="btn danger" id="wipe">Alle opnames en instellingen wissen</button>

      <div class="footer"><span></span><button class="btn big" id="done">Klaar</button></div>
    </div>`;

  overlay.querySelector('#minutes').value = String(s.sessionMinutes);

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
    if (btnRec) btnRec.addEventListener('click', () => toggleRecord(key, btnRec, status, refresh));
  });

  overlay.querySelector('#wipe').addEventListener('click', async () => {
    if (!confirm('Alle opnames en instellingen wissen?')) return;
    await clearAll();
    location.reload();
  });
  overlay.querySelector('#done').addEventListener('click', () => { close(); ctx.go('world'); });
}

function recRow(it, canRecord) {
  return `<div class="rec-item" data-key="${it.key}" data-text="${escapeHtml(it.text)}">
    <span class="name">${escapeHtml(it.label)}</span>
    <span class="status"></span>
    ${canRecord ? '<button class="btn rec">Opnemen</button>' : ''}
    <button class="btn secondary play">▶</button>
    <button class="btn secondary del">✕</button>
  </div>`;
}

async function toggleRecord(key, btn, status, refresh) {
  if (recorder && recorder.state === 'recording') { recorder.stop(); return; }
  // Andere knoppen die nog op "Stop" staan terugzetten
  overlay.querySelectorAll('.btn.recording').forEach((b) => { b.classList.remove('recording'); b.textContent = 'Opnemen'; });
  try {
    if (!stream) stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (e) {
    status.textContent = 'geen microfoon';
    console.warn(e);
    return;
  }
  const mime = pickMime();
  const chunks = [];
  try {
    recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
  } catch (e) {
    recorder = new MediaRecorder(stream);
  }
  recorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
  recorder.onstop = async () => {
    clearTimeout(recTimer);
    btn.classList.remove('recording');
    btn.textContent = 'Opnemen';
    const type = recorder.mimeType || mime || 'audio/mp4';
    recorder = null;
    const blob = new Blob(chunks, { type });
    if (blob.size < 200) { status.textContent = 'te kort'; return; }
    status.textContent = 'opslaan…';
    try {
      await putRecording(key, blob);
      const ok = await speech.loadOne(key);
      if (!ok) { status.textContent = 'mislukt'; return; }
      refresh();
      speech.say(key, '');
    } catch (e) {
      console.warn(e);
      status.textContent = 'mislukt';
    }
  };
  recorder.start();
  btn.classList.add('recording');
  btn.textContent = 'Stop';
  status.textContent = 'opnemen…';
  recTimer = setTimeout(() => { if (recorder && recorder.state === 'recording') recorder.stop(); }, MAX_REC_MS);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
