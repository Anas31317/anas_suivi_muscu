/** Accueil : prochaine séance, chiffres clés, activité, records. */

import * as store from '../store.js';
import { fmtNum, formatDate } from '../store.js';
import * as insights from '../insights.js';
import { mountWeekBars } from '../charts.js';
import { bodyMap } from '../body-map.js';
import { muscleLabel } from '../exercise-library.js';
import { h, icon, ICONS } from '../ui.js';
import { sessionTitle, plural, emptyState } from './common.js';
import { startLabel } from './muscu.js';

export function viewDashboard(ctx) {
  const state = store.getState();
  const name = insights.firstName(ctx.user.email);
  const next = insights.nextSession();
  const last = insights.lastLog();
  const c = insights.counts();

  /* --- prochaine séance ---------------------------------------------- */
  // Séance commencée aujourd'hui mais pas encore enregistrée : on propose de la
  // reprendre. Une fois enregistrée, c'est la séance suivante qui est proposée.
  const todayLog = last && last.date === store.todayISO() && !last.done ? last : null;
  const current = todayLog ? store.getSession(todayLog.sessionId) : null;

  let hero;
  if (current) {
    hero = h('section', { class: 'card hero' },
      h('p', { class: 'eyebrow' }, 'Séance du jour'),
      h('h2', { class: 'hero-title' }, sessionTitle(current)),
      h('p', { class: 'hero-meta' },
        // une entrée peut ne porter qu'une note : seules celles avec des séries comptent
        `${todayLog.entries.filter((e) => e.sets.length).length} sur ${plural(current.exercises.length, 'exercice', 'exercices')} enregistrés`),
      h('div', { class: 'btn-row' },
        h('a', { class: 'btn primary', href: `#/seance/${current.id}` }, icon(ICONS.play, 14), 'Reprendre'),
        next && next.id !== current.id
          ? h('a', { class: 'btn', href: `#/seance/${next.id}` }, `Enchaîner : ${next.name}`)
          : null
      )
    );
  } else if (next) {
    const lastOfNext = store.lastLogForSession(next.id);
    hero = h('section', { class: 'card hero' },
      h('p', { class: 'eyebrow' }, last ? 'Prochaine séance' : 'Pour commencer'),
      h('h2', { class: 'hero-title' }, sessionTitle(next)),
      h('p', { class: 'hero-meta' },
        plural(next.exercises.length, 'exercice', 'exercices'),
        lastOfNext ? ` · dernière fois ${insights.relativeDay(lastOfNext.date)}` : ' · jamais faite'
      ),
      h('div', { class: 'btn-row' },
        h('a', { class: 'btn primary', href: `#/seance/${next.id}` }, icon(ICONS.play, 14), startLabel(next.id)),
        h('a', { class: 'btn', href: '#/muscu' }, 'Choisir une autre séance')
      )
    );
  } else {
    hero = emptyState('Aucune séance dans ton programme',
      'Crée tes séances et tes exercices pour commencer.',
      h('a', { class: 'btn primary', href: '#/programme' }, 'Créer mon programme'));
  }

  /* --- chiffres clés ------------------------------------------------- */
  const tile = (label, value, sub) =>
    h('div', { class: 'card tile' },
      h('div', { class: 'label' }, label),
      h('div', { class: 'value' }, value),
      sub ? h('div', { class: 'delta' }, sub) : null
    );
  const vol = insights.weekVolume();
  const volPct = vol.previous ? Math.round(((vol.current - vol.previous) / vol.previous) * 100) : null;
  const tonnage = (kg) => (kg >= 1000 ? `${fmtNum(kg / 1000, 1)} t` : `${fmtNum(kg, 0)} kg`);
  const tiles = h('div', { class: 'tiles tiles-4' },
    tile('Cette semaine', String(c.week), plural(c.week, 'séance', 'séances')),
    tile('Ce mois-ci', String(c.month), plural(c.month, 'séance', 'séances')),
    h('div', { class: 'card tile' },
      h('div', { class: 'label' }, 'Volume · semaine'),
      h('div', { class: 'value' }, vol.current ? tonnage(vol.current) : '—'),
      volPct === null
        ? h('div', { class: 'delta' }, vol.current ? 'rien la semaine passée' : 'charge × reps')
        : h('div', { class: 'delta ' + (volPct > 0 ? 'up' : volPct < 0 ? 'down' : '') },
            `${volPct > 0 ? '+' : ''}${volPct} % vs sem. passée`)),
    (() => {
      const cw = insights.cardioStats(7);
      return h('a', { class: 'card tile tile-link', href: '#/cardio' },
        h('div', { class: 'label' }, 'Cardio · 7 jours'),
        h('div', { class: 'value' }, cw.count ? store.formatDuration(cw.minutes) : '—'),
        h('div', { class: 'delta' }, cw.count ? `${plural(cw.count, 'séance', 'séances')} · ${fmtNum(cw.km, 1)} km` : 'aucune séance'));
    })()
  );

  /* --- activité ------------------------------------------------------ */
  const weeks = insights.weeklyActivity(8);
  const barsHost = h('div', {});
  const activity = h('section', { class: 'card chart-card' },
    h('div', { class: 'chart-head' },
      h('h2', { class: 'title' }, 'Séances de muscu par semaine'),
      h('span', { class: 'chart-sub' }, '8 dernières semaines')
    ),
    barsHost
  );
  ctx.onCleanup(mountWeekBars(barsHost, weeks));

  /* --- muscles de la semaine ------------------------------------------ */
  // les silhouettes du catalogue : on voit d'un coup d'œil ce qui a été négligé
  const mus = insights.recentMuscles(7);
  const musclesCard = h('section', { class: 'card chart-card' },
    h('div', { class: 'chart-head' },
      h('h2', { class: 'title' }, 'Muscles travaillés'),
      h('span', { class: 'chart-sub' }, '7 derniers jours')
    ),
    mus.primary.length
      ? h('div', { class: 'muscles-week' },
          bodyMap(mus.primary, mus.secondary, { height: 150, label: mus.primary.map(muscleLabel).join(', ') }),
          h('div', {},
            h('p', { class: 'm1' }, mus.primary.map(muscleLabel).join(', ')),
            mus.secondary.length ? h('p', { class: 'meta' }, 'En secondaire : ' + mus.secondary.map(muscleLabel).join(', ')) : null))
      : h('p', { class: 'list-empty' }, 'Aucune séance de muscu ces 7 derniers jours.')
  );

  /* --- records ------------------------------------------------------- */
  const records = insights.recentRecords(5);
  const recordsCard = h('section', { class: 'card list-card' },
    h('div', { class: 'list-head' },
      h('h2', {}, 'Derniers records'),
      h('a', { class: 'link', href: '#/progression' }, 'Tout voir')
    ),
    records.length
      ? records.map((r) =>
          h('a', { class: 'list-row', href: `#/progression/${encodeURIComponent(r.exerciseId)}` },
            h('span', { class: 'row-icon' }, icon(ICONS.trophy, 16)),
            h('div', { class: 'body' },
              h('div', { class: 'name' }, r.name),
              h('div', { class: 'meta' }, formatDate(r.date))
            ),
            h('div', { class: 'row-value' },
              h('span', { class: 'v' }, `${fmtNum(r.value, 1)} ${r.unit}`),
              h('span', { class: 'delta up' }, `+${fmtNum(r.gain, 1)}`)
            )
          )
        )
      : h('p', { class: 'list-empty' },
          state.logs.length
            ? 'Pas encore de record : ils apparaîtront quand tu battras une perf.'
            : 'Tes records apparaîtront ici après quelques séances.')
  );

  return h('div', { class: 'page' },
    h('div', { class: 'page-top' },
      h('div', { class: 'page-head' },
        h('div', { class: 'page-title' },
          h('h1', {}, name ? `Salut ${name}` : 'Accueil'),
          h('p', { class: 'sub' }, last ? `Dernière séance ${insights.relativeDay(last.date)}.` : 'Bienvenue sur ton suivi.')
        )
      )
    ),
    h('div', { class: 'stack' },
      hero,
      tiles,
      h('div', { class: 'grid-2' }, activity, musclesCard),
      recordsCard
    )
  );
}
