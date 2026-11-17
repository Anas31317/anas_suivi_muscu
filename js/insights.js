/**
 * Calculs pour l'accueil et la vue d'ensemble : prochaine séance, compteurs,
 * activité par semaine, volume, muscles travaillés.
 */

import * as store from './store.js';
import { libraryEntry } from './exercise-library.js';

const pad = (n) => String(n).padStart(2, '0');
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromISO = (iso) => new Date(iso + 'T12:00:00');

/** Lundi de la semaine d'une date. */
export function mondayOf(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

/** Séance enregistrée la plus récente (à date égale, la dernière saisie). */
export function lastLog() {
  const logs = store.getState().logs;
  let best = null;
  logs.forEach((l) => { if (!best || l.date >= best.date) best = l; });
  return best;
}

/** La séance qui suit la dernière faite, dans l'ordre du programme. */
export function nextSession() {
  const { sessions } = store.getState();
  if (!sessions.length) return null;
  const last = lastLog();
  if (!last) return sessions[0];
  const i = sessions.findIndex((s) => s.id === last.sessionId);
  return sessions[(i + 1) % sessions.length] || sessions[0];
}

export function counts() {
  const logs = store.getState().logs;
  const now = new Date();
  const weekStart = toISO(mondayOf(now));
  const monthStart = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
  return {
    week: logs.filter((l) => l.date >= weekStart).length,
    month: logs.filter((l) => l.date >= monthStart).length,
    total: logs.length
  };
}

/** Nombre de jours écoulés depuis une date ISO (0 = aujourd'hui). */
export function daysSince(iso) {
  const today = fromISO(toISO(new Date()));
  return Math.round((today - fromISO(iso)) / 86400000);
}

export function relativeDay(iso) {
  const n = daysSince(iso);
  if (n <= 0) return 'aujourd’hui';
  if (n === 1) return 'hier';
  if (n < 7) return `il y a ${n} jours`;
  if (n < 14) return 'il y a 1 semaine';
  if (n < 60) return `il y a ${Math.floor(n / 7)} semaines`;
  return `il y a ${Math.floor(n / 30)} mois`;
}

/** Séances par semaine sur les `n` dernières semaines (la dernière = semaine en cours). */
export function weeklyActivity(n = 8) {
  const logs = store.getState().logs;
  const current = mondayOf(new Date());
  const weeks = [];
  for (let i = n - 1; i >= 0; i--) {
    const start = new Date(current);
    start.setDate(start.getDate() - 7 * i);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const a = toISO(start);
    const b = toISO(end);
    weeks.push({ iso: a, count: logs.filter((l) => l.date >= a && l.date < b).length });
  }
  return weeks;
}

/** Cardio sur les `days` derniers jours (aujourd'hui compris) : nombre, minutes, km. */
export function cardioStats(days) {
  const from = new Date();
  from.setDate(from.getDate() - (days - 1));
  const since = toISO(from);
  const items = (store.getState().cardio || []).filter((c) => c.date >= since);
  return {
    count: items.length,
    minutes: items.reduce((a, c) => a + (c.duration || 0), 0),
    km: items.reduce((a, c) => a + (c.distance || 0), 0)
  };
}

/**
 * Muscles travaillés sur les `days` derniers jours, d'après les fiches du
 * catalogue : { primary, secondary }, un muscle principal une fois n'est pas
 * répété en secondaire. Un exercice sans fiche ne compte pas.
 */
export function recentMuscles(days = 7) {
  const from = new Date();
  from.setDate(from.getDate() - (days - 1));
  const since = toISO(from);
  const libOf = new Map(store.exerciseCatalog().map((e) => [e.id, e.libId]));
  const primary = new Set();
  const secondary = new Set();
  for (const log of store.getState().logs) {
    if (log.date < since) continue;
    for (const en of log.entries) {
      const lib = en.sets.length ? libraryEntry(libOf.get(en.exerciseId)) : null;
      if (!lib) continue;
      lib.primary.forEach((m) => primary.add(m));
      lib.secondary.forEach((m) => secondary.add(m));
    }
  }
  return { primary: [...primary], secondary: [...secondary].filter((m) => !primary.has(m)) };
}

/**
 * Tonnage (charge × reps) depuis lundi, et sur la même période la semaine
 * d'avant (lundi → même jour) : on compare ce qui est comparable.
 */
export function weekVolume() {
  const monday = mondayOf(new Date());
  const prevMonday = new Date(monday);
  prevMonday.setDate(prevMonday.getDate() - 7);
  const sameDay = new Date();
  sameDay.setDate(sameDay.getDate() - 7);
  const [a, b, c] = [toISO(monday), toISO(prevMonday), toISO(sameDay)];
  let current = 0;
  let previous = 0;
  for (const log of store.getState().logs) {
    const v = log.entries.reduce((t, en) => t + (store.METRICS.volume.compute(en.sets) || 0), 0);
    if (log.date >= a) current += v;
    else if (log.date >= b && log.date <= c) previous += v;
  }
  return { current, previous };
}

/** Prénom déduit de l'email : « anas.hadouche@… » -> « Anas ». */
export function firstName(email) {
  const local = String(email || '').split('@')[0].split(/[._-]/)[0];
  return local ? local.charAt(0).toUpperCase() + local.slice(1) : '';
}
