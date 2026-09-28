/**
 * Progrès : une courbe à la fois, muscu ou cardio.
 *
 *   #/progression                    le dernier exercice travaillé
 *   #/progression/:exId              un exercice de musculation
 *   #/progression/cardio:<activité>  une activité cardio (tapis, vélo…)
 *
 * Le choix se fait dans un sélecteur : la liste complète des exercices tenait
 * sur plusieurs écrans et il fallait la traverser avant d'arriver à une courbe.
 * Les activités cardio y figurent comme une séance de plus, à la fin.
 */

import * as store from '../store.js';
import { fmtNum, formatDate } from '../store.js';
import { mountSeriesChart } from '../charts.js';
import { h, icon, ICONS } from '../ui.js';
import { summarizeSets, sessionTitle, pageHead, emptyState, plural } from './common.js';
import { CARDIO_METRICS, cardioActivities, cardioEntries, cardioUsableMetrics, cardioPoints } from './cardio.js';

/** Préfixe des activités cardio dans le sélecteur, pour ne pas les confondre avec un exercice. */
const CARDIO = 'cardio:';

/**
 * Écart entre deux mesures. La flèche donne le sens, la couleur dit si c'est un
 * progrès : pour une allure, descendre est un progrès.
 */
function deltaEl(delta, unit, { lowerIsBetter = false, format = null } = {}) {
  if (delta === null) return h('span', { class: 'delta' }, '—');
  if (delta === 0) return h('span', { class: 'delta' }, '= stable');
  const up = delta > 0;
  const better = lowerIsBetter ? !up : up;
  const value = format ? format(Math.abs(delta)) : `${fmtNum(Math.abs(delta), 1)} ${unit}`;
  return h('span', { class: 'delta ' + (better ? 'up' : 'down') },
    icon(up ? ICONS.up : ICONS.down, 12), `${up ? '+' : '-'}${value}`);
}

function tile(label, value, sub) {
  return h('div', { class: 'card tile' },
    h('div', { class: 'label' }, label),
    h('div', { class: 'value' }, value),
    sub || null
  );
}

/** Carte vers une autre page de suivi. */
function navCard(href, ic, name, meta) {
  return h('a', { class: 'card nav-card', href },
    h('span', { class: 'row-icon' }, icon(ic, 18)),
    h('div', { class: 'body' }, h('div', { class: 'name' }, name), h('div', { class: 'meta' }, meta)),
    h('span', { class: 'chev' }, icon(ICONS.chevron, 16))
  );
}

function voirAussi() {
  const state = store.getState();
  const rmCount = (state.oneRM || []).length;
  return [
    h('div', { class: 'section-head' }, h('h2', {}, 'Voir aussi')),
    navCard('#/1rm', ICONS.trophy, '1RM',
      rmCount ? `${plural(rmCount, 'maxi enregistré', 'maxis enregistrés')} · estimé et réalisé`
        : 'enregistre un maxi réalisé, compare-le à l’estimation'),
    navCard('#/cardio', ICONS.pulse, 'Cardio',
      'chiffres de la semaine, ajouter une séance')
  ];
}

/** Sélecteur : les exercices groupés par séance, puis les activités cardio. */
function picker(catalog, activities, currentId) {
  const sel = h('select', {
    class: 'filter-select', 'aria-label': 'Exercice ou activité',
    onchange: () => { location.hash = `#/progression/${encodeURIComponent(sel.value)}`; }
  });

  const groups = [];
  for (const sess of store.getState().sessions) {
    const items = catalog.filter((e) => e.sessionId === sess.id).map((e) => [e.id, e.name]);
    if (items.length) groups.push([sessionTitle(sess), items]);
  }
  const orphans = catalog.filter((e) => !e.inProgramme);
  if (orphans.length) groups.push(['Retirés du programme', orphans.map((e) => [e.id, e.name])]);
  if (activities.length) groups.push(['Séance cardio', activities.map((a) => [CARDIO + a.key, a.name])]);

  for (const [label, items] of groups) {
    sel.append(h('optgroup', { label },
      items.map(([value, name]) => h('option', { value, selected: value === currentId }, name))));
  }
  return sel;
}

/** Dernier exercice enregistré, pour ouvrir la page sur quelque chose d'utile. */
function lastTrained(catalog, activities) {
  const logs = store.getState().logs;
  for (let i = logs.length - 1; i >= 0; i--) {
    for (const en of logs[i].entries) {
      if (catalog.some((e) => e.id === en.exerciseId)) return en.exerciseId;
    }
  }
  if (catalog.length) return catalog[0].id;
  return CARDIO + activities[0].key;
}

/* ------------------------------------------------------------ muscu */

let chosenMetric = null;

function exerciseView(exercise, ctx, head) {
  const id = exercise.id;
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

  const numTile = (label, value, unit, sub) =>
    tile(label, [value === null ? '—' : fmtNum(value, 1), unit ? h('span', { class: 'unit' }, unit) : null], sub);

  let progress = null;
  if (first && lastPt && points.length > 1) {
    const pct = ((lastPt.y - first) / Math.abs(first)) * 100;
    progress = h('div', { class: 'delta ' + (pct > 0 ? 'up' : pct < 0 ? 'down' : '') },
      `${pct > 0 ? '+' : ''}${fmtNum(pct, 0)} % depuis le début`);
  }

  const tiles = h('div', { class: 'tiles' },
    numTile('Dernière', lastPt ? lastPt.y : null, metric.unit,
      lastPt && prevPt ? h('div', {}, deltaEl(lastPt.y - prevPt.y, metric.unit)) : h('div', { class: 'delta' }, lastPt ? 'première mesure' : '')),
    numTile('Record', best, metric.unit, progress),
    numTile('Séances', history.length, '',
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
  const chartCard = h('section', { class: 'card chart-card' },
    h('div', { class: 'chart-head' }, h('h2', { class: 'title' }, metric.label)),
    h('div', { class: 'chart-seg' }, seg),
    points.length
      ? chartHost
      : h('p', { class: 'list-empty' }, 'Pas encore de données pour cet exercice.'),
    points.length === 1
      ? h('p', { class: 'chart-note' }, 'Une seule séance pour l’instant : la courbe se tracera dès la prochaine.')
      : null
  );
  if (points.length) {
    ctx.onCleanup(mountSeriesChart(chartHost, [{ label: metric.short, points, cls: '' }],
      { unit: metric.unit, label: metric.label, mode: exercise.mode }));
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

  return h('div', { class: 'page' }, head, h('div', { class: 'stack' }, tiles, chartCard, table, ...voirAussi()));
}

/* ----------------------------------------------------------- cardio */

let chosenCardioMetric = null;

function cardioView(activity, ctx, head) {
  const entries = cardioEntries(activity.key);
  const usable = cardioUsableMetrics(activity.typeId, entries);
  if (!usable.some(([k]) => k === chosenCardioMetric)) {
    chosenCardioMetric = usable.length ? usable[0][0] : 'duration';
  }
  const metric = CARDIO_METRICS[chosenCardioMetric];
  const points = cardioPoints(entries, metric);
  const opts = { lowerIsBetter: Boolean(metric.lowerIsBetter), format: metric.format };

  /* --- tuiles -------------------------------------------------------- */
  const values = points.map((p) => p.y);
  const lastPt = points[points.length - 1];
  const prevPt = points[points.length - 2];
  const best = values.length ? (metric.lowerIsBetter ? Math.min(...values) : Math.max(...values)) : null;

  const tiles = h('div', { class: 'tiles' },
    tile('Dernière', lastPt ? metric.format(lastPt.y) : '—',
      lastPt && prevPt
        ? h('div', {}, deltaEl(lastPt.y - prevPt.y, metric.unit, opts))
        : h('div', { class: 'delta' }, lastPt ? 'première mesure' : '')),
    tile(metric.lowerIsBetter ? 'Meilleure' : 'Record', best === null ? '—' : metric.format(best),
      h('div', { class: 'delta' }, metric.lowerIsBetter ? 'la plus rapide' : 'toutes séances confondues')),
    tile('Séances', String(entries.length),
      entries.length ? h('div', { class: 'delta' }, `depuis le ${formatDate(entries[0].date)}`) : null)
  );

  /* --- graphe -------------------------------------------------------- */
  const seg = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Valeur affichée' },
    usable.map(([key, m]) => h('button', {
      type: 'button', 'aria-pressed': key === chosenCardioMetric ? 'true' : 'false',
      onclick: () => { chosenCardioMetric = key; ctx.render(); }
    }, m.short))
  );
  const chartHost = h('div', {});
  const chartCard = h('section', { class: 'card chart-card' },
    h('div', { class: 'chart-head' },
      h('h2', { class: 'title' }, metric.label),
      h('span', { class: 'spacer' }),
      h('a', { class: 'btn small', href: '#/cardio/nouveau' }, icon(ICONS.plus, 14), 'Ajouter une séance')
    ),
    usable.length > 1 ? h('div', { class: 'chart-seg' }, seg) : null,
    points.length
      ? chartHost
      : h('p', { class: 'list-empty' }, 'Renseigne la distance ou la durée pour voir la courbe.'),
    points.length === 1
      ? h('p', { class: 'chart-note' }, 'Une seule séance pour l’instant : la courbe se tracera dès la prochaine.')
      : null
  );
  if (points.length) {
    ctx.onCleanup(mountSeriesChart(chartHost, [{ label: metric.short, points, cls: '' }],
      { unit: metric.unit, label: metric.label }));
  }

  /* --- tableau ------------------------------------------------------- */
  const hasIncline = entries.some((c) => c.incline);
  const paced = store.cardioType(activity.typeId).pace;
  const table = h('section', { class: 'card' },
    h('div', { class: 'list-head' }, h('h2', {}, 'Détail des séances')),
    h('div', { class: 'table-wrap' },
      h('table', {},
        h('thead', {},
          h('tr', {},
            h('th', {}, 'Date'),
            h('th', { class: 'num' }, 'Durée'),
            h('th', { class: 'num' }, 'Distance'),
            h('th', { class: 'num' }, paced ? 'Allure' : 'Vitesse'),
            hasIncline ? h('th', { class: 'num' }, 'Incl.') : null,
            h('th', {}, 'Note')
          )
        ),
        h('tbody', {},
          [...entries].reverse().map((c) =>
            h('tr', {},
              h('td', {}, formatDate(c.date)),
              h('td', { class: 'num' }, c.duration ? store.formatDuration(c.duration) : '—'),
              h('td', { class: 'num' }, c.distance ? `${fmtNum(c.distance, 2)} km` : '—'),
              h('td', { class: 'num' }, c.distance && c.duration
                ? (paced ? `${store.formatPace(store.cardioPace(c))} /km` : `${fmtNum(store.cardioSpeed(c), 1)} km/h`)
                : '—'),
              hasIncline ? h('td', { class: 'num' }, c.incline ? `${fmtNum(c.incline, 1)} %` : '—') : null,
              h('td', { class: 'note' }, c.note || '')
            )
          )
        )
      )
    )
  );

  return h('div', { class: 'page' }, head, h('div', { class: 'stack' }, tiles, chartCard, table, ...voirAussi()));
}

/* ----------------------------------------------------------------- page */

export function viewProgression(rawId, ctx) {
  const catalog = store.exerciseCatalog();
  const activities = cardioActivities();

  if (!catalog.length && !activities.length) {
    return h('div', { class: 'page' }, pageHead('Progrès'),
      emptyState('Aucun exercice', 'Ajoute des exercices à ton programme.',
        h('a', { class: 'btn primary', href: '#/programme' }, 'Créer mon programme')));
  }

  const known = (v) => Boolean(v) && (catalog.some((e) => e.id === v) ||
    (v.startsWith(CARDIO) && activities.some((a) => CARDIO + a.key === v)));
  const id = known(rawId) ? rawId : lastTrained(catalog, activities);

  const sel = picker(catalog, activities, id);

  if (id.startsWith(CARDIO)) {
    const activity = activities.find((a) => CARDIO + a.key === id);
    return cardioView(activity, ctx, pageHead('Progrès', { sub: 'Séance cardio', actions: sel }));
  }

  const exercise = catalog.find((e) => e.id === id);
  const sess = exercise.sessionId ? store.getSession(exercise.sessionId) : null;
  return exerciseView(exercise, ctx, pageHead('Progrès', {
    sub: sess ? sessionTitle(sess) : 'Retiré du programme',
    actions: sel
  }));
}
