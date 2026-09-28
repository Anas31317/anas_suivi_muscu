/**
 * Muscu : le programme (les séances à faire) puis l'historique des séances
 * enregistrées. Même logique que la page Cardio : ce qu'on fait maintenant en
 * haut, ce qu'on a déjà fait en dessous.
 *
 *   #/muscu[?seance=id]   séances du programme + historique filtrable
 *
 * Une séance se lance sur sa page de saisie (workout.js) ; une séance passée se
 * modifie ou se supprime depuis l'historique (#/log/:id).
 */

import * as store from '../store.js';
import * as insights from '../insights.js';
import { h, icon, ICONS } from '../ui.js';
import { sessionTitle, sessionNumber, monthLabel, plural, pageHead, emptyState, logCard } from './common.js';

/** « Reprendre » si la séance a déjà été commencée aujourd'hui. */
export function startLabel(sessionId) {
  return store.logForSessionOn(sessionId, store.todayISO()) ? 'Reprendre' : 'Commencer';
}

/* ------------------------------------------------------------ programme */

function programmeSection(state) {
  if (!state.sessions.length) {
    return emptyState('Aucune séance', 'Crée ton programme pour commencer.',
      h('a', { class: 'btn primary', href: '#/programme' }, 'Créer mon programme'));
  }

  const next = insights.nextSession();
  const cards = state.sessions.map((sess) => {
    const last = store.lastLogForSession(sess.id);
    const isNext = next && next.id === sess.id && state.logs.length > 0;
    const href = `#/seance/${sess.id}`;
    return h('div', { class: 'card session-card' + (isNext ? ' is-next' : '') },
      h('a', { class: 'session-link', href },
        h('span', { class: 'session-num' }, String(sessionNumber(sess.id))),
        h('div', { class: 'body' },
          h('div', { class: 'name' }, sess.name, isNext ? h('span', { class: 'badge' }, 'Prochaine') : null),
          h('div', { class: 'meta' },
            plural(sess.exercises.length, 'exercice', 'exercices'),
            last ? ` · ${insights.relativeDay(last.date)}` : ' · jamais faite'
          )
        )
      ),
      h('a', { class: 'btn primary small start-btn', href, 'aria-label': `${startLabel(sess.id)} ${sessionTitle(sess)}` },
        icon(ICONS.play, 13), startLabel(sess.id))
    );
  });

  return h('div', { class: 'session-list' }, cards);
}

/* ----------------------------------------------------------- historique */

function historySection(state, query) {
  const filter = state.sessions.some((s) => s.id === query.seance) ? query.seance : '';

  const select = h('select', {
    class: 'filter-select', 'aria-label': 'Filtrer l’historique par séance',
    onchange: () => {
      location.hash = select.value ? `#/muscu?seance=${encodeURIComponent(select.value)}` : '#/muscu';
    }
  },
    h('option', { value: '' }, 'Toutes les séances'),
    state.sessions.map((s) => h('option', { value: s.id, selected: s.id === filter }, sessionTitle(s)))
  );

  const head = h('div', { class: 'section-head' },
    h('h2', {}, 'Historique'),
    state.logs.length ? select : h('span', { class: 'muted' }, 'aucune séance enregistrée')
  );

  if (!state.logs.length) {
    return h('div', { class: 'stack' }, head,
      h('div', { class: 'card' },
        h('p', { class: 'list-empty' }, 'Ton historique se remplira à chaque séance enregistrée.')));
  }

  const logs = state.logs
    .map((l, i) => [l, i])
    .filter(([l]) => !filter || l.sessionId === filter)
    .sort(([a, i], [b, j]) => (a.date < b.date ? 1 : a.date > b.date ? -1 : j - i))
    .map(([l]) => l);

  if (!logs.length) {
    return h('div', { class: 'stack' }, head,
      h('div', { class: 'card' }, h('p', { class: 'list-empty' }, 'Rien pour cette séance.')));
  }

  const groups = [];
  for (const log of logs) {
    const key = log.date.slice(0, 7);
    if (!groups.length || groups[groups.length - 1].key !== key) groups.push({ key, logs: [] });
    groups[groups.length - 1].logs.push(log);
  }

  return h('div', { class: 'stack' }, head,
    groups.map((g) =>
      h('section', { class: 'month-group' },
        h('div', { class: 'month-head' },
          h('h3', {}, monthLabel(g.key)),
          h('span', { class: 'muted' }, plural(g.logs.length, 'séance', 'séances'))
        ),
        h('div', { class: 'stack' }, g.logs.map((log) => logCard(log)))
      )
    )
  );
}

/* ----------------------------------------------------------------- page */

export function viewMuscu(query = {}) {
  const state = store.getState();

  return h('div', { class: 'page' },
    pageHead('Muscu', {
      sub: 'Choisis ta séance du jour.',
      actions: h('a', { class: 'btn', href: '#/programme' }, icon(ICONS.edit, 14), 'Modifier le programme')
    }),
    h('div', { class: 'stack' },
      programmeSection(state),
      historySection(state, query)
    )
  );
}
