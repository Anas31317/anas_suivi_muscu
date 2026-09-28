/**
 * Progrès : une courbe à la fois.
 *
 *   #/progression          le dernier exercice travaillé
 *   #/progression/:exId    un exercice précis
 *
 * Le choix se fait dans un sélecteur, comme pour le cardio : la liste complète
 * des exercices tenait sur plusieurs écrans et il fallait la traverser avant
 * d'arriver à une courbe.
 */

import * as store from '../store.js';
import { fmtNum, formatDate } from '../store.js';
import { mountSeriesChart } from '../charts.js';
import { h, icon, ICONS } from '../ui.js';
import { summarizeSets, sessionTitle, pageHead, emptyState, plural } from './common.js';

function deltaEl(delta, unit) {
  if (delta === null) return h('span', { class: 'delta' }, '—');
  if (delta === 0) return h('span', { class: 'delta' }, '= stable');
  const up = delta > 0;
  return h('span', { class: 'delta ' + (up ? 'up' : 'down') },
    icon(up ? ICONS.up : ICONS.down, 12), `${up ? '+' : ''}${fmtNum(delta, 1)} ${unit}`);
}

/** Dernier exercice enregistré, pour ouvrir la page sur quelque chose d'utile. */
function lastTrained(catalog) {
  const logs = store.getState().logs;
  for (let i = logs.length - 1; i >= 0; i--) {
    const log = logs[i];
    for (const en of log.entries) {
      if (catalog.some((e) => e.id === en.exerciseId)) return en.exerciseId;
    }
  }
  return catalog[0].id;
}

/** Sélecteur d'exercice, groupé par séance (comme le programme). */
function picker(catalog, currentId) {
  const sel = h('select', {
    class: 'filter-select', 'aria-label': 'Exercice',
    onchange: () => { location.hash = `#/progression/${encodeURIComponent(sel.value)}`; }
  });

  const groups = [];
  for (const sess of store.getState().sessions) {
    const items = catalog.filter((e) => e.sessionId === sess.id);
    if (items.length) groups.push([sessionTitle(sess), items]);
  }
  const orphans = catalog.filter((e) => !e.inProgramme);
  if (orphans.length) groups.push(['Retirés du programme', orphans]);

  for (const [label, items] of groups) {
    sel.append(h('optgroup', { label },
      items.map((e) => h('option', { value: e.id, selected: e.id === currentId }, e.name))));
  }
  return sel;
}

/* ----------------------------------------------------------------- page */

let chosenMetric = null;

export function viewProgression(exerciseId, ctx) {
  const catalog = store.exerciseCatalog();
  if (!catalog.length) {
    return h('div', { class: 'page' }, pageHead('Progrès'),
      emptyState('Aucun exercice', 'Ajoute des exercices à ton programme.',
        h('a', { class: 'btn primary', href: '#/programme' }, 'Créer mon programme')));
  }

  const id = catalog.some((e) => e.id === exerciseId) ? exerciseId : lastTrained(catalog);
  const exercise = catalog.find((e) => e.id === id);
  const sess = exercise.sessionId ? store.getSession(exercise.sessionId) : null;

  const metrics = store.metricsFor(exercise.mode);
  if (!chosenMetric || !metrics.some((m) => m.key === chosenMetric)) chosenMetric = metrics[0].key;
  const metric = metrics.find((m) => m.key === chosenMetric);
  const points = store.seriesFor(id, metric.key);
  const history = store.historyForExercise(id);

  /* --- tuiles -------------------------------------------------------- */
  const lastPt = points[points.length - 1];
  const prevPt = points[points.length - 2];
  const best = points.length ? Math.max(...points.map((p) => p.y)) : null;
  const first = points.length ? points[0].y : null;

  const tile = (label, value, unit, sub) =>
    h('div', { class: 'card tile' },
      h('div', { class: 'label' }, label),
      h('div', { class: 'value' }, value === null ? '—' : fmtNum(value, 1), unit ? h('span', { class: 'unit' }, unit) : null),
      sub || null
    );

  let progress = null;
  if (first && lastPt && points.length > 1) {
    const pct = ((lastPt.y - first) / Math.abs(first)) * 100;
    progress = h('div', { class: 'delta ' + (pct > 0 ? 'up' : pct < 0 ? 'down' : '') },
      `${pct > 0 ? '+' : ''}${fmtNum(pct, 0)} % depuis le début`);
  }

  // 1RM réalisés : saisis dans l'onglet 1RM, jamais dans les séances
  const isRM = metric.key === 'e1rm';
  const realRM = isRM ? store.oneRMForExercise(id) : [];
  const bestReal = isRM ? store.bestOneRM(id) : null;

  const tiles = h('div', { class: 'tiles' + (isRM ? ' tiles-4' : '') },
    tile('Dernière', lastPt ? lastPt.y : null, metric.unit,
      lastPt && prevPt ? h('div', {}, deltaEl(lastPt.y - prevPt.y, metric.unit)) : h('div', { class: 'delta' }, lastPt ? 'première mesure' : '')),
    tile(isRM ? 'Record estimé' : 'Record', best, metric.unit, progress),
    isRM
      ? tile('1RM réalisé', bestReal ? bestReal.weight : null, 'kg',
          h('div', { class: 'delta' }, bestReal ? `le ${formatDate(bestReal.date)}` : 'aucun maxi enregistré'))
      : null,
    tile('Séances', history.length, '',
      history.length ? h('div', { class: 'delta' }, `depuis le ${formatDate(history[0].date)}`) : null)
  );

  /* --- graphe -------------------------------------------------------- */
  const seg = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Valeur affichée' },
    metrics.map((m) =>
      h('button', {
        type: 'button', 'aria-pressed': m.key === metric.key ? 'true' : 'false',
        onclick: () => { chosenMetric = m.key; ctx.render(); }
      }, m.short)
    )
  );
  const chartHost = h('div', {});
  const rmPoints = realRM.map((r) => ({
    iso: r.date, x: new Date(r.date + 'T12:00:00'), y: r.weight,
    detail: r.note || 'maxi réalisé'
  }));
  const hasChart = points.length || rmPoints.length;

  const chartCard = h('section', { class: 'card chart-card' },
    h('div', { class: 'chart-head' },
      h('h2', { class: 'title' }, isRM ? '1RM estimé et réalisé' : metric.label),
      h('span', { class: 'spacer' }),
      isRM
        ? h('a', { class: 'btn small', href: `#/1rm/nouveau?ex=${encodeURIComponent(id)}` },
            icon(ICONS.plus, 14), 'Ajouter un 1RM')
        : null
    ),
    h('div', { class: 'chart-seg' }, seg),
    hasChart
      ? chartHost
      : h('p', { class: 'list-empty' }, 'Pas encore de données pour cet exercice.'),
    points.length === 1 && !rmPoints.length
      ? h('p', { class: 'chart-note' }, 'Une seule séance pour l’instant : la courbe se tracera dès la prochaine.')
      : null
  );
  if (hasChart) {
    const series = [{ label: isRM ? 'Estimé' : metric.short, points, cls: '' }];
    if (rmPoints.length) series.push({ label: 'Réalisé', points: rmPoints, cls: 'alt' });
    ctx.onCleanup(mountSeriesChart(chartHost, series, { unit: metric.unit, label: metric.label, mode: exercise.mode }));
  }

  /* --- tableau (équivalent texte du graphe) -------------------------- */
  const table = h('section', { class: 'card' },
    h('div', { class: 'list-head' }, h('h2', {}, 'Détail des séances')),
    history.length
      ? h('div', { class: 'table-wrap' },
          h('table', {},
            h('thead', {},
              h('tr', {},
                h('th', {}, 'Date'),
                h('th', {}, 'Séries'),
                h('th', { class: 'num' }, 'Charge max'),
                h('th', { class: 'num' }, 'Volume'),
                h('th', { class: 'num' }, 'Reps'),
                h('th', {}, 'Note')
              )
            ),
            h('tbody', {},
              [...history].reverse().map((entry) =>
                h('tr', {},
                  h('td', {}, formatDate(entry.date)),
                  h('td', {}, summarizeSets(entry.sets, entry.mode)),
                  h('td', { class: 'num' }, fmtNum(store.METRICS.topWeight.compute(entry.sets), 1)),
                  h('td', { class: 'num' }, fmtNum(store.METRICS.volume.compute(entry.sets), 0)),
                  h('td', { class: 'num' }, fmtNum(store.METRICS.reps.compute(entry.sets), 0)),
                  h('td', { class: 'note' }, entry.note || '')
                )
              )
            )
          )
        )
      : h('p', { class: 'list-empty' }, 'Aucun historique.')
  );

  /* --- les autres progressions --------------------------------------- */
  const state = store.getState();
  const rmCount = (state.oneRM || []).length;
  const cardioCount = (state.cardio || []).length;
  const navCard = (href, ic, name, meta) =>
    h('a', { class: 'card nav-card', href },
      h('span', { class: 'row-icon' }, icon(ic, 18)),
      h('div', { class: 'body' }, h('div', { class: 'name' }, name), h('div', { class: 'meta' }, meta)),
      h('span', { class: 'chev' }, icon(ICONS.chevron, 16))
    );

  return h('div', { class: 'page' },
    pageHead('Progrès', {
      sub: sess ? sessionTitle(sess) : 'Retiré du programme',
      actions: picker(catalog, id)
    }),
    h('div', { class: 'stack' },
      tiles,
      chartCard,
      table,
      h('div', { class: 'section-head' }, h('h2', {}, 'Voir aussi')),
      navCard('#/1rm', ICONS.trophy, '1RM',
        rmCount ? `${plural(rmCount, 'maxi enregistré', 'maxis enregistrés')} · réalisé et estimé`
          : 'enregistre un maxi réalisé, compare-le à l’estimation'),
      navCard('#/cardio', ICONS.pulse, 'Progression cardio',
        cardioCount ? `${plural(cardioCount, 'séance', 'séances')} · distance, durée, allure`
          : 'aucune séance cardio pour l’instant')
    )
  );
}
