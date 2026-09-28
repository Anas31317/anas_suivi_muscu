/**
 * Suivi Amis : consulter le programme et la progression de quelqu'un qui
 * t'a donné son code de partage. Lecture seule, et ses données ne touchent
 * jamais aux tiennes.
 *
 *   #/amis         mon code, ajout d'un ami, liste
 *   #/amis/:code   le suivi d'un ami
 */

import * as store from '../store.js';
import { fmtNum, formatDate } from '../store.js';
import * as share from '../share.js';
import * as insights from '../insights.js';
import { sparkline } from '../charts.js';
import { h, toast, icon, ICONS } from '../ui.js';
import { pageHead, emptyState, plural, longDate, summarizeSets } from './common.js';

/* --------------------------------------- calculs sur le suivi d'un ami */

const pad = (n) => String(n).padStart(2, '0');
const isoDaysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** Historique d'un exercice dans le suivi d'un ami, du plus ancien au plus récent. */
function historyOf(data, exerciseId) {
  const out = [];
  for (const log of data.logs || []) {
    const entry = (log.entries || []).find((e) => e.exerciseId === exerciseId);
    if (!entry) continue;
    const sets = (entry.sets || []).filter((s) => s.reps !== null || s.weight !== null);
    if (sets.length) out.push({ date: log.date, mode: entry.mode, sets });
  }
  return out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

/** Tous les exercices d'un suivi ami : ceux du programme, puis les autres. */
function catalogOf(data) {
  const seen = new Set();
  const out = [];
  for (const sess of data.sessions || []) {
    for (const ex of sess.exercises || []) {
      if (seen.has(ex.id)) continue;
      seen.add(ex.id);
      out.push({ ...ex, sessionName: sess.name });
    }
  }
  for (const log of data.logs || []) {
    for (const en of log.entries || []) {
      if (seen.has(en.exerciseId)) continue;
      seen.add(en.exerciseId);
      out.push({ id: en.exerciseId, name: en.name, mode: en.mode, sessionName: null });
    }
  }
  return out;
}

function lastLogOf(data) {
  let best = null;
  for (const l of data.logs || []) if (!best || l.date >= best.date) best = l;
  return best;
}

/* ------------------------------------------------------- liste des amis */

/** Mon code : activer le partage, le copier, le renouveler, choisir son nom. */
function codeCard(ctx) {
  const cfg = store.getShare();
  const defaultName = insights.firstName(ctx.user.email);

  const enabledIn = h('input', { type: 'checkbox', id: 'share-on', checked: cfg.enabled });
  const nameIn = h('input', {
    type: 'text', maxlength: 40, id: 'share-name', value: cfg.name || defaultName,
    placeholder: 'Le nom que verront tes amis'
  });

  const apply = async (patch) => {
    const next = { ...store.getShare(), ...patch };
    if (next.enabled && !next.code) next.code = store.newShareCode();
    next.name = nameIn.value.trim() || defaultName;
    store.setShare(next);
    try {
      if (next.enabled) await share.push(ctx.user.id);
      else await share.stopSharing(ctx.user.id);
      toast(next.enabled ? 'Partage activé' : 'Partage désactivé');
    } catch (err) {
      toast(share.explain(err));
    }
  };

  enabledIn.addEventListener('change', () => apply({ enabled: enabledIn.checked }));
  nameIn.addEventListener('change', () => { if (store.getShare().enabled) apply({}); });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(store.formatShareCode(store.getShare().code));
      toast('Code copié');
    } catch {
      toast('Copie impossible : note le code à la main.');
    }
  };

  const regenerate = () => {
    if (!confirm('Générer un nouveau code ?\n\nCeux qui ont l’ancien ne verront plus ton suivi.')) return;
    apply({ code: store.newShareCode() });
  };

  return h('section', { class: 'card section' },
    h('h2', {}, 'Mon code'),
    h('p', { class: 'desc' },
      cfg.enabled
        ? 'Donne ton code à qui tu veux : il verra ton programme, tes séances, ton cardio et tes 1RM, en lecture seule.'
        : 'Le partage est désactivé : personne ne peut voir ton suivi.'),
    h('label', { class: 'check' }, enabledIn, 'Partager mon suivi'),
    cfg.enabled
      ? h('div', { class: 'stack share-block' },
          h('div', { class: 'code-row' },
            h('span', { class: 'share-code' }, store.formatShareCode(cfg.code)),
            h('button', { class: 'btn small', type: 'button', onclick: copy }, 'Copier'),
            h('button', { class: 'btn small ghost', type: 'button', onclick: regenerate }, 'Nouveau code')
          ),
          h('div', { class: 'field' }, h('label', { for: 'share-name' }, 'Nom affiché'), nameIn)
        )
      : null
  );
}

export function viewFriends(ctx) {
  const list = store.friends();
  const cache = share.readCache(ctx.user.id);

  const codeIn = h('input', {
    type: 'text', id: 'friend-code', placeholder: 'ex : K7P4-M2QX', maxlength: 20, autocomplete: 'off',
    autocapitalize: 'characters', spellcheck: 'false', 'aria-label': 'Code d’un ami'
  });
  const msg = h('div', { class: 'auth-msg error', role: 'alert', hidden: true });
  const addBtn = h('button', { class: 'btn primary', type: 'button' }, icon(ICONS.plus, 14), 'Ajouter');

  const add = async () => {
    msg.hidden = true;
    const code = store.normalizeShareCode(codeIn.value);
    if (code.length < 6) { msg.textContent = 'Code incomplet.'; msg.hidden = false; return; }
    if (code === store.getShare().code) { msg.textContent = 'C’est ton propre code.'; msg.hidden = false; return; }
    addBtn.disabled = true;
    try {
      const row = await share.fetchByCode(code);
      if (!row) {
        msg.textContent = 'Aucun suivi ne correspond à ce code.';
        msg.hidden = false;
        return;
      }
      share.writeCache(ctx.user.id, code, row);
      store.addFriend({ code, name: row.name || 'Ami' });
      toast(`${row.name || 'Ami'} ajouté`);
      location.hash = `#/amis/${encodeURIComponent(code)}`;
    } catch (err) {
      msg.textContent = share.explain(err);
      msg.hidden = false;
    } finally {
      addBtn.disabled = false;
    }
  };
  addBtn.addEventListener('click', add);
  codeIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });

  const addCard = h('section', { class: 'card section' },
    h('h2', {}, 'Ajouter un ami'),
    h('p', { class: 'desc' }, 'Entre le code que ton ami t’a donné.'),
    h('div', { class: 'inline' }, codeIn, addBtn),
    msg
  );

  const friendsCard = list.length
    ? h('section', { class: 'card list-card' },
        h('div', { class: 'list-head' },
          h('h2', {}, 'Mes amis'),
          h('span', { class: 'muted' }, plural(list.length, 'ami', 'amis'))
        ),
        list.map((f) => {
          const cached = cache[f.code];
          const last = cached ? lastLogOf(cached.data) : null;
          return h('a', { class: 'list-row', href: `#/amis/${encodeURIComponent(f.code)}` },
            h('span', { class: 'avatar small' }, (f.name || '?').charAt(0).toUpperCase()),
            h('div', { class: 'body' },
              h('div', { class: 'name' }, f.name || 'Ami'),
              h('div', { class: 'meta' },
                last ? `dernière séance ${insights.relativeDay(last.date)}` : 'suivi pas encore chargé')
            ),
            h('span', { class: 'chev' }, icon(ICONS.chevron, 16))
          );
        })
      )
    : emptyState('Aucun ami suivi', 'Demande son code à quelqu’un pour voir son programme et sa progression.');

  return h('div', { class: 'page' },
    pageHead('Suivi Amis', { sub: 'Le suivi de tes amis, en lecture seule.' }),
    h('div', { class: 'stack' }, codeCard(ctx), addCard, friendsCard)
  );
}

/* --------------------------------------------------- le suivi d'un ami */

function renderFriend(row, ctx, code) {
  const data = row.data || {};
  const logs = data.logs || [];
  const week = logs.filter((l) => l.date >= isoDaysAgo(6)).length;
  const month = logs.filter((l) => l.date >= isoDaysAgo(29)).length;
  const last = lastLogOf(data);

  const tile = (label, value, sub) =>
    h('div', { class: 'card tile' },
      h('div', { class: 'label' }, label),
      h('div', { class: 'value' }, value),
      sub ? h('div', { class: 'delta' }, sub) : null);

  const tiles = h('div', { class: 'tiles' },
    tile('7 derniers jours', String(week), plural(week, 'séance', 'séances')),
    tile('30 derniers jours', String(month), plural(month, 'séance', 'séances')),
    tile('Dernière séance', last ? insights.relativeDay(last.date) : '—', last ? formatDate(last.date) : 'aucune')
  );

  /* --- progression par exercice ------------------------------------- */
  const progression = h('section', { class: 'card list-card' },
    h('div', { class: 'list-head' }, h('h2', {}, 'Progression')),
    (() => {
      const rows = catalogOf(data)
        .map((ex) => {
          const metric = ex.mode === 'bw' ? store.METRICS.reps : store.METRICS.topWeight;
          const values = historyOf(data, ex.id).map((entry) => metric.compute(entry.sets)).filter((v) => v !== null);
          return { ex, metric, values };
        })
        .filter((r) => r.values.length);
      if (!rows.length) return h('p', { class: 'list-empty' }, 'Aucune séance enregistrée pour l’instant.');
      return rows.map(({ ex, metric, values }) => {
        const lastVal = values[values.length - 1];
        const prev = values.length > 1 ? values[values.length - 2] : null;
        const delta = prev === null ? null : lastVal - prev;
        return h('div', { class: 'list-row prog-row' },
          h('div', { class: 'body' },
            h('div', { class: 'name' }, ex.name),
            h('div', { class: 'meta' }, `${metric.short} · ${plural(values.length, 'séance', 'séances')}`)
          ),
          values.length > 1 ? sparkline(values.slice(-10)) : h('span', { class: 'spark-empty' }),
          h('div', { class: 'row-value' },
            h('span', { class: 'v' }, `${fmtNum(lastVal, 1)} ${metric.unit}`),
            delta === null
              ? null
              : h('span', { class: 'delta ' + (delta > 0 ? 'up' : delta < 0 ? 'down' : '') },
                  `${delta > 0 ? '+' : ''}${fmtNum(delta, 1)} ${metric.unit}`)
          )
        );
      });
    })()
  );

  /* --- programme ----------------------------------------------------- */
  const programme = (data.sessions || []).length
    ? h('section', { class: 'card list-card' },
        h('div', { class: 'list-head' }, h('h2', {}, 'Programme')),
        data.sessions.map((sess, i) =>
          h('div', { class: 'list-row' },
            h('span', { class: 'session-num' }, String(i + 1)),
            h('div', { class: 'body' },
              h('div', { class: 'name' }, sess.name),
              h('div', { class: 'meta' },
                (sess.exercises || []).length ? sess.exercises.map((e) => e.name).join(' · ') : 'aucun exercice')
            )
          )
        )
      )
    : null;

  /* --- 1RM et cardio -------------------------------------------------- */
  const rm = (data.oneRM || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  const rmCard = rm.length
    ? h('section', { class: 'card list-card' },
        h('div', { class: 'list-head' }, h('h2', {}, '1RM réalisés')),
        rm.slice(0, 8).map((r) =>
          h('div', { class: 'list-row' },
            h('span', { class: 'row-icon' }, icon(ICONS.trophy, 16)),
            h('div', { class: 'body' },
              h('div', { class: 'name' }, r.name),
              h('div', { class: 'meta' }, formatDate(r.date))
            ),
            h('div', { class: 'row-value' }, h('span', { class: 'v' }, `${fmtNum(r.weight, 1)} kg`))
          )
        )
      )
    : null;

  const cardio = (data.cardio || []).filter((c) => c.date >= isoDaysAgo(29));
  const cardioCard = cardio.length
    ? h('section', { class: 'card section' },
        h('h2', {}, 'Cardio · 30 derniers jours'),
        h('p', { class: 'desc' },
          `${plural(cardio.length, 'séance', 'séances')} · ` +
          `${store.formatDuration(cardio.reduce((a, c) => a + (c.duration || 0), 0))} · ` +
          `${fmtNum(cardio.reduce((a, c) => a + (c.distance || 0), 0), 1)} km`)
      )
    : null;

  /* --- dernières séances --------------------------------------------- */
  const recent = logs.slice().sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);
  const recentCard = recent.length
    ? h('section', { class: 'stack' },
        h('div', { class: 'section-head' }, h('h2', {}, 'Dernières séances')),
        recent.map((log) => {
          const sess = (data.sessions || []).find((x) => x.id === log.sessionId);
          return h('details', { class: 'card log-item' },
            h('summary', {},
              h('div', { class: 'log-main' },
                h('span', { class: 'log-title' }, sess ? sess.name : 'Séance'),
                h('span', { class: 'log-meta' }, longDate(log.date))
              ),
              h('span', { class: 'log-count' }, plural((log.entries || []).length, 'exo', 'exos')),
              h('span', { class: 'chev' }, icon(ICONS.chevron, 16))
            ),
            h('div', { class: 'log-body' },
              h('div', { class: 'table-wrap' },
                h('table', {}, h('tbody', {},
                  (log.entries || []).map((en) =>
                    h('tr', {},
                      h('td', { class: 'wrap strong' }, en.name),
                      h('td', { class: 'num' }, summarizeSets(en.sets, en.mode))
                    ))
                ))
              )
            )
          );
        })
      )
    : null;

  const remove = () => {
    if (!confirm(`Ne plus suivre ${row.name || 'cet ami'} ?`)) return;
    store.removeFriend(code);
    toast('Ami retiré');
    location.hash = '#/amis';
  };

  return [
    tiles,
    progression,
    programme,
    rmCard,
    cardioCard,
    recentCard,
    h('div', { class: 'btn-row section-actions' },
      h('button', { class: 'btn danger', type: 'button', onclick: remove }, 'Ne plus suivre'))
  ].filter(Boolean);
}

export function viewFriend(code, ctx) {
  const clean = store.normalizeShareCode(code);
  const friend = store.getFriend(clean);
  const cached = share.readCache(ctx.user.id)[clean];
  const body = h('div', { class: 'stack' });
  const status = h('span', { class: 'save-status busy' }, 'Mise à jour…');

  const paint = (row) => {
    body.textContent = '';
    body.append(...renderFriend(row, ctx, clean));
  };

  if (cached) paint(cached);
  else body.append(h('div', { class: 'loading' }, 'Chargement du suivi…'));

  share.fetchByCode(clean)
    .then((row) => {
      if (!row) {
        status.className = 'save-status err';
        status.textContent = 'Code inconnu : ton ami a peut-être changé de code.';
        if (!cached) {
          body.textContent = '';
          body.append(emptyState('Suivi introuvable',
            'Ce code ne correspond plus à personne. Demande-lui son nouveau code.'));
        }
        return;
      }
      share.writeCache(ctx.user.id, clean, row);
      if (friend && row.name && row.name !== friend.name) store.addFriend({ code: clean, name: row.name });
      status.className = 'save-status ok';
      status.textContent = 'À jour';
      paint(row);
    })
    .catch((err) => {
      status.className = 'save-status err';
      status.textContent = share.explain(err);
      if (!cached) {
        body.textContent = '';
        body.append(emptyState('Suivi indisponible', share.explain(err)));
      }
    });

  return h('div', { class: 'page' },
    pageHead(friend ? friend.name : (cached && cached.name) || 'Ami', {
      back: { href: '#/amis', label: 'Suivi Amis' },
      sub: cached ? `Copie du ${formatDate((cached.updated_at || '').slice(0, 10))}` : 'Lecture seule',
      actions: status
    }),
    body
  );
}
