/**
 * Partage entre utilisateurs (« Suivi Amis »).
 *
 * Chacun publie une copie de son suivi dans la table `shares`, associée à un
 * code. Cette copie n'est lisible que par quelqu'un qui envoie le code exact
 * (en-tête `x-share-code`, vérifié par les règles RLS) : impossible de lister
 * les suivis des autres. Changer de code coupe l'accès aux anciens.
 *
 * Voir supabase/partage.sql.
 */

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { client } from './auth.js';
import * as store from './store.js';

const TABLE = 'shares';

/** Copie publiée : le suivi, sans les réglages ni la liste d'amis. */
export function snapshot() {
  const st = store.getState();
  return {
    sessions: st.sessions,
    logs: st.logs,
    cardio: st.cardio || [],
    oneRM: st.oneRM || [],
    updatedAt: st.updatedAt
  };
}

/** Publie (ou met à jour) ma copie partagée. Sans partage activé : ne fait rien. */
export async function push(userId) {
  const share = store.getShare();
  if (!share.enabled || !share.code) return false;
  const { error } = await client
    .from(TABLE)
    .upsert({ user_id: userId, code: share.code, name: share.name, data: snapshot() }, { onConflict: 'user_id' });
  if (error) throw error;
  return true;
}

/** Retire ma copie : plus personne ne peut voir mon suivi. */
export async function stopSharing(userId) {
  const { error } = await client.from(TABLE).delete().eq('user_id', userId);
  if (error) throw error;
}

/**
 * Lit le suivi partagé correspondant à un code.
 * Renvoie { code, name, data, updated_at } ou null si le code est inconnu.
 */
export async function fetchByCode(rawCode) {
  const code = store.normalizeShareCode(rawCode);
  if (code.length < 6) throw new Error('code_court');
  const { data } = await client.auth.getSession();
  const token = data && data.session ? data.session.access_token : null;
  if (!token) throw new Error('session');

  const url = `${SUPABASE_URL}/rest/v1/${TABLE}?code=eq.${encodeURIComponent(code)}&select=code,name,data,updated_at`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: 'Bearer ' + token,
      'x-share-code': code,     // lu par la règle RLS
      Accept: 'application/json'
    }
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    if (/relation .*shares.* does not exist/i.test(body)) throw new Error('table_absente');
    throw new Error(`HTTP ${res.status}`);
  }
  const rows = await res.json();
  return rows.length ? rows[0] : null;
}

/** Message lisible pour une erreur de partage. */
export function explain(err) {
  const msg = String((err && err.message) || err || '');
  if (msg === 'code_court') return 'Code incomplet.';
  if (msg === 'session') return 'Reconnecte-toi pour utiliser le partage.';
  if (msg === 'table_absente') return 'Le partage n’est pas encore activé sur le serveur (voir docs/SUPABASE.md).';
  if (!navigator.onLine || /fetch|network/i.test(msg)) return 'Pas de connexion : réessaie une fois en ligne.';
  return 'Impossible de récupérer ce suivi pour le moment.';
}

/* ------------------------------------------------------------- cache */

/*
 * Dernière copie récupérée de chaque ami, gardée sur l'appareil : le suivi
 * d'un ami reste consultable hors ligne, et l'ouverture est instantanée.
 * Ce cache n'est pas synchronisé et part avec la déconnexion.
 */
const cacheKey = (userId) => `suivi-muscu:friends:${userId}`;

export function readCache(userId) {
  try {
    return JSON.parse(localStorage.getItem(cacheKey(userId)) || '{}');
  } catch {
    return {};
  }
}

export function writeCache(userId, code, row) {
  try {
    const all = readCache(userId);
    all[store.normalizeShareCode(code)] = { ...row, fetchedAt: new Date().toISOString() };
    localStorage.setItem(cacheKey(userId), JSON.stringify(all));
  } catch { /* stockage plein ou indisponible : on s'en passe */ }
}

export function clearCache(userId) {
  try { localStorage.removeItem(cacheKey(userId)); } catch { /* ignore */ }
}
