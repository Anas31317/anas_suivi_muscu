/**
 * 1RM : les maxis réellement réalisés, saisis à part des séances, et comparés
 * au 1RM estimé (Epley) calculé sur l'historique.
 *
 *   #/1rm             liste par exercice + maxis enregistrés
 *   #/1rm/nouveau     enregistrer un 1RM (?ex=<exerciseId> pré-sélectionne)
 *   #/1rm/:id         modifier / supprimer
 *
 * Un 1RM n'est pas une séance : il n'apparaît ni dans l'historique ni dans les
 * compteurs de séances.
 */

import * as store from '../store.js';
import { fmtNum, formatDate } from '../store.js';
import { h, numInput, parseNum, toast, icon, ICONS } from '../ui.js';
import { pageHead, emptyState, longDate, plural } from './common.js';

/* ----------------------------------------------------------- la page */

export function viewOneRM() {
  const entries = store.oneRMList();
  // l'estimé le plus à jour (dernière séance), pas le meilleur de tous les temps
  const rows = store.exerciseCatalog()
    .map((ex) => ({ ex, real: store.bestOneRM(ex.id), est: store.latestEstimatedRM(ex.id) }))
    .filter((r) => r.real || r.est);

  const addBtn = h('a', { class: 'btn primary', href: '#/1rm/nouveau' }, icon(ICONS.plus, 14), 'Enregistrer un 1RM');

  if (!rows.length) {
    return h('div', { class: 'page' },
      pageHead('1RM', { back: { href: '#/progression', label: 'Progrès' }, actions: addBtn }),
      emptyState('Aucun 1RM',
        'Enregistre un maxi réalisé, ou fais quelques séances : le 1RM estimé se calcule tout seul.',
        h('a', { class: 'btn primary', href: '#/1rm/nouveau' }, icon(ICONS.plus, 14), 'Enregistrer un 1RM'))
    );
  }

  // deux chiffres par exercice, sous le nom : sur un téléphone, une colonne de
  // droite écraserait le nom de l'exercice
  const byExercise = h('section', { class: 'card list-card' },
    h('div', { class: 'list-head' }, h('h2', {}, 'Par exercice')),
    rows.map(({ ex, real, est }) =>
      h('a', { class: 'list-row', href: `#/1rm/nouveau?ex=${encodeURIComponent(ex.id)}` },
        h('div', { class: 'body' },
          h('div', { class: 'name' }, ex.name, ex.inProgramme ? null : h('span', { class: 'tag' }, 'retiré')),
          h('div', { class: 'meta stats' },
            `Estimé ${est ? `${fmtNum(est.weight, 1)} kg` : '—'}`,
            ' · ',
            `Réalisé ${real ? `${fmtNum(real.weight, 1)} kg` : '—'}`
          ),
          real ? h('div', { class: 'meta' }, `réalisé le ${formatDate(real.date)}`) : null
        ),
        h('span', { class: 'chev' }, icon(ICONS.chevron, 16))
      )
    )
  );

  const recorded = entries.length
    ? h('section', { class: 'card list-card' },
        h('div', { class: 'list-head' },
          h('h2', {}, 'Maxis enregistrés'),
          h('span', { class: 'muted' }, plural(entries.length, 'maxi', 'maxis'))
        ),
        entries.map((r) =>
          h('a', { class: 'list-row', href: `#/1rm/${encodeURIComponent(r.id)}` },
            h('span', { class: 'row-icon' }, icon(ICONS.trophy, 16)),
            h('div', { class: 'body' },
              h('div', { class: 'name' }, r.name),
              h('div', { class: 'meta cap' }, longDate(r.date))
            ),
            h('div', { class: 'row-value' }, h('span', { class: 'v' }, `${fmtNum(r.weight, 1)} kg`)),
            h('span', { class: 'chev' }, icon(ICONS.chevron, 16))
          )
        )
      )
    : null;

  return h('div', { class: 'page' },
    pageHead('1RM', {
      back: { href: '#/progression', label: 'Progrès' },
      sub: 'Ton maxi réalisé, et l’estimation tirée de ta dernière séance.',
      actions: addBtn
    }),
    h('div', { class: 'stack' }, byExercise, recorded)
  );
}

/* ---------------------------------------------------------- formulaire */

export function viewOneRMForm(id, query = {}) {
  const existing = id ? store.getOneRM(id) : null;
  if (id && !existing) return emptyState('1RM introuvable', null, h('a', { class: 'btn', href: '#/1rm' }, '1RM'));

  const catalog = store.exerciseCatalog();
  if (!catalog.length) {
    return emptyState('Aucun exercice', 'Crée d’abord un exercice dans ton programme.',
      h('a', { class: 'btn', href: '#/programme' }, 'Programme'));
  }

  const preset = existing ? existing.exerciseId : query.ex;
  const selected = catalog.some((e) => e.id === preset) ? preset : catalog[0].id;
  const draft = existing
    ? { ...existing }
    : { id: store.uid('rm'), exerciseId: selected, name: '', date: store.todayISO(), weight: null, note: '' };

  const msg = h('div', { class: 'auth-msg error', role: 'alert', hidden: true });

  const exSel = h('select', { 'aria-label': 'Exercice' },
    catalog.map((e) => h('option', { value: e.id, selected: e.id === selected }, e.name)));
  const dateIn = h('input', { type: 'date', value: draft.date, max: store.todayISO(), 'aria-label': 'Date' });
  const weightIn = numInput({ value: draft.weight !== null ? String(draft.weight).replace('.', ',') : '', placeholder: 'ex : 100', 'aria-label': 'Charge en kg' });
  const noteIn = h('input', { type: 'text', maxlength: 300, placeholder: 'Ceinture, spotter, ressenti…', 'aria-label': 'Note' });
  noteIn.value = draft.note || '';

  const estimate = h('p', { class: 'computed' });
  const refresh = () => {
    const est = store.latestEstimatedRM(exSel.value);
    const real = store.bestOneRM(exSel.value);
    estimate.textContent = [
      est ? `1RM estimé : ${fmtNum(est.weight, 1)} kg` : null,
      real && real.date !== draft.date ? `meilleur réalisé : ${fmtNum(real.weight, 1)} kg` : null
    ].filter(Boolean).join(' · ');
  };
  exSel.addEventListener('change', refresh);
  refresh();

  const save = () => {
    const weight = parseNum(weightIn.value);
    if (weight === null || weight <= 0) { msg.textContent = 'Renseigne la charge soulevée.'; msg.hidden = false; return; }
    if (weight > 700) { msg.textContent = 'Charge invalide.'; msg.hidden = false; return; }
    const ex = catalog.find((e) => e.id === exSel.value);
    store.saveOneRM({
      id: draft.id,
      exerciseId: ex.id,
      name: ex.name,
      date: dateIn.value || store.todayISO(),
      weight,
      note: noteIn.value.trim()
    });
    toast(existing ? '1RM modifié' : '1RM enregistré');
    location.hash = '#/1rm';
  };

  const remove = () => {
    if (!confirm(`Supprimer ce 1RM (${draft.name}, ${formatDate(draft.date)}) ?`)) return;
    store.deleteOneRM(draft.id);
    toast('1RM supprimé');
    location.hash = '#/1rm';
  };

  const field = (label, input, hint) =>
    h('div', { class: 'field' }, h('label', {}, label), input, hint ? h('span', { class: 'hint' }, hint) : null);

  return h('div', { class: 'page page-form' },
    pageHead(existing ? 'Modifier le 1RM' : 'Nouveau 1RM', { back: { href: '#/1rm', label: '1RM' } }),
    h('section', { class: 'card section' },
      h('div', { class: 'form-grid' },
        field('Exercice', exSel),
        field('Date', dateIn),
        field('Charge (kg)', weightIn, 'Le maxi réellement soulevé, sur 1 répétition.'),
        field('Note', noteIn)
      ),
      estimate,
      msg
    ),
    h('div', { class: 'form-actions' },
      existing ? h('button', { class: 'btn ghost danger', type: 'button', onclick: remove }, 'Supprimer') : null,
      h('a', { class: 'btn ghost', href: '#/1rm' }, 'Annuler'),
      h('button', { class: 'btn primary', type: 'button', onclick: save }, icon(ICONS.check, 15), 'Enregistrer')
    )
  );
}
