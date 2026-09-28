/** Progression : vue d'ensemble de tous les exercices, puis détail d'un exercice. */

import * as store from '../store.js';
import { fmtNum, formatDate } from '../store.js';
import * as insights from '../insights.js';
import { mountSeriesChart, sparkline } from '../charts.js';
import { h, icon, ICONS } from '../ui.js';
import { summarizeSets, sessionTitle, pageHead, emptyState, plural } from './common.js';


function deltaEl(delta, unit) {
  if (delta === null) return h('span', { class: 'delta' }, '—');
  if (delta === 0) return h('span', { class: 'delta' }, '= stable');
  const up = delta > 0;
  return h('span', { class: 'delta ' + (up ? 'up' : 'down') },
    icon(up ? ICONS.up : ICONS.down, 12), `${up ? '+' : ''}${fmtNum(delta, 1)} ${unit}`);
}

/* --------------------------------------------------- vue d'ensemble */

export function viewProgressionIndex() {
  const state = store.getState();
  const catalog = store.exerciseCatalog();
  const orphans = catalog.filter((e) => !e.inProgramme);
  if (!catalog.length) {
    return h('div', { class: 'page' }, pageHead('Progression'),
      emptyState('Aucun exercice', 'Ajoute des exercices à ton programme.'));
  }

  const row = (ex) => {
    const s = insights.exerciseSummary(ex.id, ex.mode);
    return h('a', { class: 'list-row prog-row', href: `#/progression/${encodeURIComponent(ex.id)}` },
      h('div', { class: 'body' },
        h('div', { class: 'name' }, ex.name),
        h('div', { class: 'meta' },
          s.values.length ? `${s.metric.short} · ${plural(s.values.length, 'séance', 'séances')}` : 'aucune donnée')
      ),
      s.values.length > 1 ? sparkline(s.values.slice(-10)) : h('span', { class: 'spark-empty' }),
      h('div', { class: 'row-value' },
        h('span', { class: 'v' }, s.last === null ? '—' : `${fmtNum(s.last, 1)} ${s.metric.unit}`),
        s.values.length > 1 ? deltaEl(s.delta, s.metric.unit) : null
      ),
      h('span', { class: 'chev' }, icon(ICONS.chevron, 16))
    );
  };

  const groups = state.sessions
    .filter((sess) => sess.exercises.length)
    .map((sess) =>
      h('section', { class: 'card list-card' },
        h('div', { class: 'list-head' }, h('h2', {}, sessionTitle(sess))),
        sess.exercises.map((ex) => row(ex))
      )
    );
  if (orphans.length) {
    groups.push(h('section', { class: 'card list-card' },
      h('div', { class: 'list-head' }, h('h2', {}, 'Retirés du programme')),
      orphans.map(row)));
  }

  const rmCount = (state.oneRM || []).length;
  groups.push(h('a', { class: 'card nav-card', href: '#/1rm' },
    h('span', { class: 'row-icon' }, icon(ICONS.trophy, 18)),
    h('div', { class: 'body' },
      h('div', { class: 'name' }, '1RM'),
      h('div', { class: 'meta' }, rmCount
        ? `${plural(rmCount, 'maxi enregistré', 'maxis enregistrés')} · réalisé et estimé`
        : 'enregistre un maxi réalisé, compare-le à l\u2019estimation')
    ),
    h('span', { class: 'chev' }, icon(ICONS.chevron, 16))
  ));

  const cardioCount = (state.cardio || []).length;
  groups.push(h('a', { class: 'card nav-card', href: '#/cardio' },
    h('span', { class: 'row-icon' }, icon(ICONS.pulse, 18)),
    h('div', { class: 'body' },
      h('div', { class: 'name' }, 'Progression cardio'),
      h('div', { class: 'meta' }, cardioCount ? `${plural(cardioCount, 'séance', 'séances')} · distance, durée, allure` : 'aucune séance cardio pour l’instant')
    ),
    h('span', { class: 'chev' }, icon(ICONS.chevron, 16))
  ));

  return h('div', { class: 'page' },
    pageHead('Progression', { sub: 'Touche un exercice pour voir sa courbe.' }),
    h('div', { class: 'stack' }, groups)
  );
}

/* ------------------------------------------------------------- détail */

let chosenMetric = null;

export function viewProgressionDetail(exerciseId, ctx) {
  const exercise = store.exerciseCatalog().find((e) => e.id === exerciseId);
  if (!exercise) {
    return emptyState('Exercice introuvable', null, h('a', { class: 'btn', href: '#/progression' }, 'Progression'));
  }
  const sess = exercise.sessionId ? store.getSession(exercise.sessionId) : null;

  const metrics = store.metricsFor(exercise.mode);
  if (!chosenMetric || !metrics.some((m) => m.key === chosenMetric)) chosenMetric = metrics[0].key;
  const metric = metrics.find((m) => m.key === chosenMetric);
  const points = store.seriesFor(exerciseId, metric.key);
  const history = store.historyForExercise(exerciseId);

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
  const realRM = isRM ? store.oneRMForExercise(exerciseId) : [];
  const bestReal = isRM ? store.bestOneRM(exerciseId) : null;

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
        ? h('a', { class: 'btn small', href: `#/1rm/nouveau?ex=${encodeURIComponent(exerciseId)}` },
            icon(ICONS.plus, 14), 'Ajouter un 1RM')
        : null,
      seg
    ),
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

  return h('div', { class: 'page' },
    pageHead(exercise.name, {
      back: { href: '#/progression', label: 'Progression' },
      sub: sess ? sessionTitle(sess) : 'Retiré du programme'
    }),
    h('div', { class: 'stack' }, tiles, chartCard, table)
  );
}
