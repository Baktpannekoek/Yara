/* Animatiemotor: bouwstenen op basis van de Web Animations API.
   Loops voor rust (ademen, knipperen, wiebelen) en reacties op een tik (springen, roepen, fladderen).
   Reacties geven een promise terug en zetten alles netjes terug in rust. */

import { pauseIdle, resumeIdle, registerIdle } from './rig.js';

export const ease = {
  out: 'cubic-bezier(.2,.8,.3,1)',
  inOut: 'ease-in-out',
  spring: 'cubic-bezier(.34,1.56,.64,1)',
  linear: 'linear'
};

const rnd = (a, b) => a + Math.random() * (b - a);

/* Eén animatie op een element, geregistreerd bij het figuur */
export function tween(fig, el, keyframes, opts) {
  if (!el) return null;
  const a = el.animate(keyframes, { fill: 'none', ...opts });
  fig.anims.add(a);
  a.finished.catch(() => {}).finally(() => fig.anims.delete(a));
  return a;
}
const done = (a) => (a ? a.finished.catch(() => {}) : Promise.resolve());

/* ---------- Loops (rust) ---------- */

export function breathe(fig, name, amt = 0.025, dur = 2800) {
  const el = fig.part(name);
  return registerIdle(fig, name, tween(fig, el, [
    { transform: 'scale(1,1)' }, { transform: `scale(${1 + amt * 0.5},${1 + amt})` }, { transform: 'scale(1,1)' }
  ], { duration: dur, iterations: Infinity, easing: 'ease-in-out', delay: -rnd(0, dur) }));
}

export function sway(fig, name, deg = 4, dur = 2600) {
  const el = fig.part(name);
  return registerIdle(fig, name, tween(fig, el, [
    { transform: `rotate(${-deg}deg)` }, { transform: `rotate(${deg}deg)` }, { transform: `rotate(${-deg}deg)` }
  ], { duration: dur, iterations: Infinity, easing: 'ease-in-out', delay: -rnd(0, dur) }));
}

export function bobLoop(fig, el, px = 2, dur = 2400, name = 'root') {
  return registerIdle(fig, name, tween(fig, el, [
    { transform: 'translateY(0)' }, { transform: `translateY(${-px}px)` }, { transform: 'translateY(0)' }
  ], { duration: dur, iterations: Infinity, easing: 'ease-in-out', delay: -rnd(0, dur) }));
}

/* Deinen op het water: op en neer met een lichte kanteling */
export function floatLoop(fig, el, px = 2.5, dur = 3200) {
  return registerIdle(fig, 'root', tween(fig, el, [
    { transform: 'translateY(0) rotate(-2deg)' }, { transform: `translateY(${-px}px) rotate(2deg)` }, { transform: 'translateY(0) rotate(-2deg)' }
  ], { duration: dur, iterations: Infinity, easing: 'ease-in-out', delay: -rnd(0, dur) }));
}

export function spinLoop(fig, name, dur = 1600) {
  const el = fig.part(name);
  return registerIdle(fig, name, tween(fig, el, [{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { duration: dur, iterations: Infinity, easing: 'linear' }));
}

/* Knipperen op een onregelmatig ritme, soms twee keer */
export function blinkLoop(fig, names, every = [2200, 5200]) {
  const tick = () => {
    if (!fig.alive) return;
    const twice = Math.random() < 0.25;
    names.forEach((n) => tween(fig, fig.part(n), [
      { transform: 'scaleY(1)' }, { transform: 'scaleY(.08)', offset: 0.45 }, { transform: 'scaleY(1)' }
    ], { duration: 150, easing: 'ease-in-out', iterations: twice ? 2 : 1 }));
    fig.later(tick, rnd(every[0], every[1]));
  };
  fig.later(tick, rnd(600, every[1]));
}

/* Af en toe iets doen (oren wiebelen, rondkijken) */
export function occasionally(fig, every, fn) {
  const tick = () => {
    if (!fig.alive) return;
    if (!fig.busy) fn();
    fig.later(tick, rnd(every[0], every[1]));
  };
  fig.later(tick, rnd(every[0], every[1]));
}

/* ---------- Reacties ---------- */

/* Springen met aanzet, lucht en landing met platdrukken */
export async function hop(fig, height = 16, dur = 620) {
  const el = fig.svg;
  pauseIdle(fig, 'root');
  await done(tween(fig, el, [
    { transform: 'translateY(0) scale(1,1)' },
    { transform: 'translateY(0) scale(1.08,.9)', offset: 0.14 },
    { transform: `translateY(${-height}px) scale(.96,1.06)`, offset: 0.45 },
    { transform: 'translateY(0) scale(1.1,.88)', offset: 0.82 },
    { transform: 'translateY(0) scale(1,1)' }
  ], { duration: dur, easing: ease.out }));
  resumeIdle(fig, 'root');
}

export async function shake(fig, name = null, deg = 7, dur = 700) {
  const el = name ? fig.part(name) : fig.svg;
  pauseIdle(fig, name || 'root');
  await done(tween(fig, el, [
    { transform: 'rotate(0)' }, { transform: `rotate(${-deg}deg)`, offset: 0.15 }, { transform: `rotate(${deg}deg)`, offset: 0.35 },
    { transform: `rotate(${-deg * 0.7}deg)`, offset: 0.55 }, { transform: `rotate(${deg * 0.5}deg)`, offset: 0.75 }, { transform: 'rotate(0)' }
  ], { duration: dur, easing: 'ease-in-out' }));
  resumeIdle(fig, name || 'root');
}

export async function wiggle(fig, name, deg = 10, times = 3, dur = 160) {
  const el = fig.part(name);
  pauseIdle(fig, name);
  await done(tween(fig, el, [
    { transform: 'rotate(0)' }, { transform: `rotate(${deg}deg)` }, { transform: `rotate(${-deg}deg)` }, { transform: 'rotate(0)' }
  ], { duration: dur, iterations: times, easing: 'ease-in-out' }));
  resumeIdle(fig, name);
}

/* Draaien om het draaipunt en weer terug (kop omhoog, staart, vleugel) */
export async function tilt(fig, name, deg, dur = 400, hold = 300) {
  const el = fig.part(name);
  pauseIdle(fig, name);
  await done(tween(fig, el, [
    { transform: 'rotate(0)' }, { transform: `rotate(${deg}deg)`, offset: 0.3 }, { transform: `rotate(${deg}deg)`, offset: 0.3 + hold / (dur + hold) * 0.7 }, { transform: 'rotate(0)' }
  ], { duration: dur + hold, easing: ease.out }));
  resumeIdle(fig, name);
}

/* Mond open en dicht (scaleY vanuit de bovenkant) */
export async function mouth(fig, name = 'mond', scale = 2.2, dur = 500) {
  const el = fig.part(name);
  if (!el) return;
  await done(tween(fig, el, [
    { transform: 'scaleY(1)' }, { transform: `scaleY(${scale})`, offset: 0.25 }, { transform: `scaleY(${scale * 0.8})`, offset: 0.7 }, { transform: 'scaleY(1)' }
  ], { duration: dur, easing: ease.out }));
}

/* Kauwen: kaak zachtjes op en neer */
export async function chew(fig, name = 'mond', times = 3) {
  const el = fig.part(name);
  await done(tween(fig, el, [
    { transform: 'scaleY(1) translateX(0)' }, { transform: 'scaleY(1.5) translateX(1px)' }, { transform: 'scaleY(1) translateX(0)' }
  ], { duration: 320, iterations: times, easing: 'ease-in-out' }));
}

/* Fladderen: een deel snel heen en weer (vleugel, oor) */
export async function flap(fig, name, deg = 35, times = 4, dur = 140) {
  return wiggle(fig, name, deg, times, dur);
}

/* Een stukje rijden en weer terug, met snel draaiende wielen */
export async function drive(fig, dx = 40, dur = 1400, wheels = []) {
  const el = fig.svg;
  pauseIdle(fig, 'root');
  wheels.forEach((w) => tween(fig, fig.part(w), [{ transform: 'rotate(0)' }, { transform: 'rotate(720deg)' }], { duration: dur, easing: 'ease-in-out' }));
  await done(tween(fig, el, [
    { transform: 'translateX(0)' }, { transform: `translateX(${dx}px)`, offset: 0.5 }, { transform: 'translateX(0)' }
  ], { duration: dur, easing: 'ease-in-out' }));
  resumeIdle(fig, 'root');
}

/* Even kijken naar een punt (pupillen verschuiven) en weer terug */
export async function lookAt(fig, pupils, dx, dy, dur = 1200) {
  const k = 1.6;
  const x = Math.max(-k, Math.min(k, dx * k)), y = Math.max(-k, Math.min(k, dy * k));
  await Promise.all(pupils.map((n) => done(tween(fig, fig.part(n), [
    { transform: 'translate(0,0)' }, { transform: `translate(${x}px,${y}px)`, offset: 0.2 }, { transform: `translate(${x}px,${y}px)`, offset: 0.8 }, { transform: 'translate(0,0)' }
  ], { duration: dur, easing: ease.out }))));
}

/* Stappen achter elkaar of tegelijk */
export const seq = async (...steps) => { for (const s of steps) await s(); };
export const par = (...steps) => Promise.all(steps.map((s) => s()));
export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* Een reactie uitvoeren met rem: niet stapelen, altijd terug naar rust */
export async function react(fig, fn) {
  if (fig.busy) return false;
  fig.busy = true;
  try { await fn(); } catch (e) { console.warn(e); }
  fig.busy = false;
  return true;
}
