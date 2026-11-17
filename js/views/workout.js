/**
 * Séance en cours : tous les exercices, séries et reps sur une seule page.
 *
 * - Les exercices et le nombre de séries viennent du programme de la séance ;
 *   ils ne se modifient que depuis « Modifier la séance » (session-editor.js).
 *   Ici on ne saisit que les charges, les reps et les notes.
 * - Chaque série affiche ce qui a été fait la séance précédente sur le même
 *   exercice ; un tap sur cette valeur la recopie.
 * - Enregistrement automatique à chaque saisie, et bouton « Enregistrer ».
 * - Rouvrir la même séance le même jour reprend la saisie en cours.
 *
 * Routes : #/seance/:id (séance du jour) et #/log/:logId (séance passée).
 */

import * as store from '../store.js';
import { fmtNum, formatDate, formatDateShort } from '../store.js';
import * as sync from '../sync.js';
import { h, numInput, parseNum, toast, icon, ICONS } from '../ui.js';
import { sessionNumber, pageHead, emptyState, longDate } from './common.js';

const SAVE_DELAY = 500;

// Chrono, gardé sur l'appareil : il survit à un changement de page, un rechargement ou
// l'appli fermée. start : Date.now() quand il tourne ; acc : ms déjà comptées.
const CHRONO_KEY = 'suivi-muscu:chrono';
const chrono = (() => {
  try {
    const c = JSON.parse(localStorage.getItem(CHRONO_KEY));
    if (c && typeof c.acc === 'number' && (c.start === null || typeof c.start === 'number')) return c;
  } catch { /* stockage indisponible : on repart de zéro */ }
  return { start: null, acc: 0 };
})();
const saveChrono = () => { try { localStorage.setItem(CHRONO_KEY, JSON.stringify(chrono)); } catch { /* ignore */ } };
const chronoMs = () => chrono.acc + (chrono.start === null ? 0 : Date.now() - chrono.start);

const NOTES_SHOWN = 3;

/** Les notes des dernières fois (la plus récente d'abord), en rappel gris. */
function pastNotes(items) {
  const notes = items.filter((x) => x.note && x.note.trim()).slice(0, NOTES_SHOWN);
  return notes.length
    ? h('div', { class: 'prev-notes' }, notes.map((x) => h('p', { class: 'prev-note' }, `${formatDateShort(x.date)} · ${x.note}`)))
    : null;
}

const clone = (o) => JSON.parse(JSON.stringify(o));
const numText = (n) => (n === null || n === undefined ? '' : String(n).replace('.', ','));

/** Perf précédente d'un exercice : avant (ou le jour de) la séance, hors séance elle-même. */
function previousEntry(exerciseId, log) {
  const before = store.historyForExercise(exerciseId, log.id).filter((e) => e.date <= log.date);
  return before.length ? before[before.length - 1] : null;
}

/** « 75 × 8 », « 8 » au poids du corps sans lest. */
function setLabel(set, mode) {
  if (!set) return '—';
  const reps = set.reps === null ? '?' : set.reps;
  if (set.weight === null || mode === 'pdc' || (mode === 'bw' && set.weight === 0)) return String(reps);
  return `${fmtNum(set.weight)} × ${reps}`;
}

function isDone(entry) {
  return entry.sets.length > 0 && entry.sets.every((s) => s.reps !== null);
}

/** Séries vides du programme, charge reprise de la dernière fois. */
function plannedSets(count, prev, from = 0, fallbackWeight = null) {
  const sets = [];
  for (let i = from; i < count; i++) {
    sets.push({ weight: prev && prev.sets[i] ? prev.sets[i].weight : fallbackWeight, reps: null });
  }
  return sets;
}

/**
 * Brouillon de la séance : exercices et nombre de séries du programme.
 * Une séance déjà enregistrée garde ses séries (jamais tronquées) ; les séries
 * prévues pas encore faites sont ajoutées vides.
 */
function buildDraft(sess, source) {
  const draft = source
    ? clone(source)
    : { id: store.uid('log'), sessionId: sess.id, date: store.todayISO(), note: '', entries: [] };
  if (!sess) return draft;

  const byId = new Map(draft.entries.map((e) => [e.exerciseId, e]));
  const ordered = [];
  for (const ex of sess.exercises) {
    const prev = previousEntry(ex.id, draft);
    const entry = byId.get(ex.id);
    if (entry) {
      byId.delete(ex.id); // nom et type gardés tels qu'enregistrés ce jour-là
      const last = entry.sets[entry.sets.length - 1];
      entry.sets.push(...plannedSets(ex.defaultSets, prev, entry.sets.length, last ? last.weight : null));
      ordered.push(entry);
    } else {
      ordered.push({ exerciseId: ex.id, name: ex.name, mode: ex.mode, note: '', sets: plannedSets(ex.defaultSets, prev) });
    }
  }
  // exercices retirés du programme depuis, mais déjà saisis : on les garde
  draft.entries = [...ordered, ...byId.values()];
  return draft;
}

/**
 * Ce qui est réellement enregistré : les séries faites (reps renseignées) ;
 * une charge préremplie sur une série pas encore faite ne compte pas.
 */
function cleanLog(draft) {
  return {
    id: draft.id,
    sessionId: draft.sessionId,
    date: draft.date,
    note: draft.note || '',
    done: Boolean(draft.done),
    entries: draft.entries
      .map((en) => ({
        exerciseId: en.exerciseId, name: en.name, mode: en.mode, note: en.note || '',
        sets: en.sets.filter((s) => s.reps !== null)
      }))
      .filter((en) => en.sets.length || en.note)
  };
}

export function viewWorkout({ sessionId, logId }, ctx) {
  const existing = logId ? store.getLog(logId) : null;
  if (logId && !existing) {
    return emptyState('Séance introuvable', null, h('a', { class: 'btn', href: '#/muscu' }, 'Muscu'));
  }
  const sid = existing ? existing.sessionId : sessionId;
  const sess = store.getSession(sid);
  if (!sess && !existing) {
    return emptyState('Séance introuvable', null, h('a', { class: 'btn', href: '#/muscu' }, 'Muscu'));
  }

  // Séance du jour déjà commencée ? On la reprend.
  const today = !existing ? store.logForSessionOn(sid, store.todayISO()) : null;
  const source = existing || today;
  const draft = buildDraft(sess, source);
  const pastMode = Boolean(existing) && existing.date !== store.todayISO();

  /* --- enregistrement automatique ----------------------------------- */
  const status = h('span', { class: 'save-status', role: 'status' });
  let timer = 0;
  let pending = false;
  const setStatus = (text, cls = '') => { status.textContent = text; status.className = 'save-status ' + cls; };

  const saveNow = () => {
    clearTimeout(timer);
    if (!pending) return;
    pending = false;
    const clean = cleanLog(draft);
    if (clean.entries.length) {
      store.saveLog(clean);
      setStatus('Enregistré', 'ok');
    } else if (store.getLog(draft.id)) {
      store.deleteLog(draft.id);
      setStatus('Rien de saisi', '');
    }
  };
  const changed = () => {
    pending = true;
    setStatus('Enregistrement…', 'busy');
    clearTimeout(timer);
    timer = setTimeout(saveNow, SAVE_DELAY);
  };

  // En quittant la page ou en verrouillant le téléphone : on enregistre tout de suite.
  const onHide = () => {
    if (document.visibilityState === 'hidden') { saveNow(); sync.flush(); }
  };
  document.addEventListener('visibilitychange', onHide);
  ctx.onCleanup(() => { saveNow(); document.removeEventListener('visibilitychange', onHide); });

  setStatus(source ? 'Enregistré' : 'Enregistrement automatique', source ? 'ok' : '');

  /* --- chrono -------------------------------------------------------- */
  // Toujours dans la barre du bas ; on le lance, le met en pause et le remet à zéro à la main.
  const chronoTime = h('span', { class: 'chrono-time', role: 'timer', 'aria-label': 'Chrono' });
  const playBtn = h('button', { class: 'btn ghost small icon-only', type: 'button', onclick: () => {
    if (chrono.start === null) chrono.start = Date.now();
    else { chrono.acc = chronoMs(); chrono.start = null; }
    saveChrono();
    tick();
  } });
  const resetBtn = h('button', {
    class: 'btn ghost small icon-only', type: 'button', title: 'Remettre à zéro', 'aria-label': 'Remettre le chrono à zéro',
    onclick: () => { chrono.acc = 0; chrono.start = chrono.start === null ? null : Date.now(); saveChrono(); tick(); }
  }, icon(ICONS.reset, 15));
  const chronoBox = h('div', { class: 'chrono' }, icon(ICONS.timer, 16), chronoTime, playBtn, resetBtn);
  let shownRunning = null;
  const tick = () => {
    const s = Math.floor(chronoMs() / 1000);
    chronoTime.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    const running = chrono.start !== null;
    if (running !== shownRunning) { // l'icône ne change qu'au démarrage / à la pause
      shownRunning = running;
      const label = running ? 'Mettre le chrono en pause' : 'Démarrer le chrono';
      playBtn.title = label;
      playBtn.setAttribute('aria-label', label);
      playBtn.replaceChildren(icon(running ? ICONS.pause : ICONS.play, 15));
    }
  };
  // 4 fois par seconde : calé sur l'appui, la première seconde ne traîne pas
  const ticker = setInterval(tick, 250);
  ctx.onCleanup(() => clearInterval(ticker));
  tick();

  /* --- exercices ----------------------------------------------------- */
  const doneCount = h('span', {});
  const updateProgress = () => {
    doneCount.textContent = `${draft.entries.filter(isDone).length}/${draft.entries.length} exercices faits`;
  };

  const exerciseCard = (entry, entryIndex) => {
    const isBW = entry.mode === 'bw';
    // poids du corps sans lest : pas de colonne de charge du tout
    const sansCharge = entry.mode === 'pdc';
    const prev = previousEntry(entry.exerciseId, draft);
    const card = h('section', { class: 'card ex-card' });
    const refreshDone = () => { card.classList.toggle('is-done', isDone(entry)); updateProgress(); };

    const rows = h('div', { class: 'sets' },
      h('div', { class: 'set-row set-head-row' },
        h('span', { class: 'set-head' }, '#'),
        // la date de la dernière séance tient dans l'en-tête, sur sa propre ligne :
        // à la suite du libellé, elle débordait sur « Charge kg »
        h('span', { class: 'set-head prev-head' },
          'Dernière fois',
          prev ? h('span', { class: 'prev-date' }, formatDateShort(prev.date)) : null),
        sansCharge ? null : h('span', { class: 'set-head' }, isBW ? 'Lest kg' : 'Charge kg'),
        h('span', { class: 'set-head' }, 'Reps')
      )
    );
    if (sansCharge) rows.firstChild.classList.add('no-weight');

    entry.sets.forEach((set, i) => {
      const before = prev && prev.sets[i];
      let rowEl = null;
      const markRow = () => rowEl && rowEl.classList.toggle('is-set-done', set.reps !== null);
      const w = numInput({
        value: numText(set.weight),
        placeholder: isBW ? '0' : '',
        'aria-label': `${entry.name}, série ${i + 1}, charge en kg`,
        enterkeyhint: 'next',
        oninput: () => { set.weight = parseNum(w.value); changed(); }
      });
      const r = numInput({
        value: numText(set.reps),
        // pas de rappel ici : « Dernière fois », juste à côté, le donne déjà (un tap le recopie)
        inputmode: 'numeric',
        enterkeyhint: 'next',
        'aria-label': `${entry.name}, série ${i + 1}, répétitions`,
        oninput: () => { set.reps = parseNum(r.value); markRow(); refreshDone(); changed(); }
      });
      const prevCell = before
        ? h('button', {
            class: 'prev-cell', type: 'button',
            title: 'Recopier les valeurs de la dernière fois',
            'aria-label': `Recopier la dernière fois : ${setLabel(before, entry.mode)}`,
            onclick: () => {
              set.weight = before.weight;
              set.reps = before.reps;
              w.value = numText(set.weight);
              r.value = numText(set.reps);
              markRow();
              refreshDone();
              changed();
            }
          }, setLabel(before, entry.mode))
        : h('span', { class: 'prev-cell empty' }, '—');

      rowEl = h('div', { class: 'set-row' + (sansCharge ? ' no-weight' : '') },
        h('span', { class: 'idx' }, String(i + 1)), prevCell, sansCharge ? null : w, r);
      markRow();
      rows.append(rowEl);
    });

    const note = h('input', {
      type: 'text', value: entry.note || '', class: 'entry-note', maxlength: 200,
      placeholder: isBW ? 'Note (ex : + élastique rose, chaîne 10 kg)' : 'Note',
      'aria-label': `${entry.name}, note`,
      oninput: () => { entry.note = note.value; changed(); }
    });

    card.append(
      h('div', { class: 'ex-head' },
        h('span', { class: 'ex-num' }, String(entryIndex + 1)),
        h('div', { class: 'ex-title' },
          h('h2', {}, entry.name, isBW || sansCharge ? h('span', { class: 'tag' }, 'PdC') : null)
        ),
        h('span', { class: 'done-mark', title: 'Exercice fait' }, icon('M5 12.5l4.5 4.5L19 7.5', 14)),
        h('a', {
          class: 'btn ghost small icon-only', href: `#/progression/${encodeURIComponent(entry.exerciseId)}`,
          title: 'Voir la progression', 'aria-label': `Progression de ${entry.name}`
        }, icon(ICONS.chart, 16))
      ),
      // séries à gauche, notes à droite sur grand écran ; l'une sous l'autre sur téléphone
      h('div', { class: 'ex-body' },
        rows,
        h('div', { class: 'ex-foot' },
          h('span', { class: 'set-head' }, 'Notes'),
          // les notes des dernières fois, là où on écrit la nouvelle
          pastNotes(store.historyForExercise(entry.exerciseId, draft.id).filter((e) => e.date <= draft.date).reverse()),
          note))
    );
    refreshDone();
    return card;
  };

  // Entrée (« Suivant » sur le clavier du téléphone) : charge → reps → série suivante → exercice suivant
  const nextField = (e) => {
    if (e.key !== 'Enter' || !e.target.matches('.set-row input')) return;
    e.preventDefault();
    const fields = [...list.querySelectorAll('.set-row input')];
    const next = fields[fields.indexOf(e.target) + 1];
    if (next) next.focus(); else e.target.blur();
  };

  const list = h('div', { class: 'stack', onkeydown: nextField },
    draft.entries.length
      ? draft.entries.map(exerciseCard)
      : emptyState('Aucun exercice dans cette séance', 'Ajoute des exercices depuis « Modifier la séance ».',
          sess ? h('a', { class: 'btn primary', href: `#/seance/${sid}/modifier` }, icon(ICONS.edit, 14), 'Modifier la séance') : null)
  );
  updateProgress();

  /* --- date, note ---------------------------------------------------- */
  const dateInput = h('input', {
    type: 'date', value: draft.date, max: store.todayISO(), 'aria-label': 'Date de la séance',
    onchange: () => { draft.date = dateInput.value || store.todayISO(); changed(); }
  });
  // notes laissées les dernières fois sur cette même séance du programme
  const prevNotes = pastNotes(store.logsForSession(sid).filter((l) => l.id !== draft.id && l.date <= draft.date));
  const sessionNote = h('textarea', {
    placeholder: 'Forme du jour, ressenti…', maxlength: 1000, 'aria-label': 'Note de séance',
    oninput: () => { draft.note = sessionNote.value; changed(); }
  });
  sessionNote.value = draft.note || '';

  /* --- actions ------------------------------------------------------- */
  // N'écrit que s'il y a eu une modification : une séance ouverte puis
  // enregistrée sans changement reste strictement identique.
  const save = () => {
    // la séance est terminée : l'accueil proposera la suivante, pas « Reprendre »
    draft.done = true;
    pending = true;
    saveNow();
    sync.flush();
    if (!store.getLog(draft.id)) {
      toast('Rien à enregistrer : saisis au moins une série.');
      return;
    }
    toast('Séance enregistrée');
    location.hash = existing ? '#/muscu' : '#/';
  };

  const remove = () => {
    if (!confirm(`Supprimer la séance du ${formatDate(draft.date)} ? Elle disparaîtra de ton historique.`)) return;
    clearTimeout(timer);
    pending = false;
    if (store.getLog(draft.id)) store.deleteLog(draft.id);
    toast('Séance supprimée');
    location.hash = '#/muscu';
  };

  const n = sess ? sessionNumber(sess.id) : null;

  return h('div', { class: 'page page-form' },
    pageHead(sess ? sess.name : 'Séance', {
      back: { href: '#/muscu', label: 'Muscu' },
      sub: h('span', { class: 'workout-sub' },
        n ? `Séance ${n} · ` : '',
        pastMode ? longDate(draft.date) : 'Aujourd’hui',
        ' · ', doneCount),
      actions: h('div', { class: 'workout-actions' },
        status,
        h('div', { class: 'date-field' }, dateInput),
        sess ? h('a', { class: 'btn', href: `#/seance/${sid}/modifier` }, icon(ICONS.edit, 14), 'Modifier la séance') : null
      )
    }),
    h('div', { class: 'stack' },
      list,
      h('div', { class: 'card section' },
        h('h2', {}, 'Note de séance'),
        prevNotes,
        sessionNote)
    ),
    h('div', { class: 'form-actions' },
      chronoBox,
      source ? h('button', { class: 'btn ghost danger', type: 'button', onclick: remove }, 'Supprimer') : null,
      h('button', { class: 'btn primary', type: 'button', onclick: save }, icon('M5 12.5l4.5 4.5L19 7.5', 15), 'Enregistrer la séance')
    )
  );
}
