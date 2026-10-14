/**
 * Modifier la séance : nom, exercices, type, nombre de séries, ordre.
 *
 * Les changements sont faits sur un brouillon et appliqués uniquement avec
 * « Enregistrer ». Ils ne touchent jamais aux séances déjà enregistrées :
 * l'historique garde les noms et séries d'origine.
 *
 * Route : #/seance/:id/modifier
 */

import * as store from '../store.js';
import { h, toast, icon, ICONS } from '../ui.js';
import { sessionNumber, miniBtn, pageHead, emptyState } from './common.js';
import { cataloguePanel } from './catalogue.js';
import { SUPPORT_EMAIL } from '../config.js';

const SET_CHOICES = [1, 2, 3, 4, 5, 6, 7, 8, 10];

export function viewSessionEditor(sessionId, ctx) {
  const sess = store.getSession(sessionId);
  if (!sess) return emptyState('Séance introuvable', null, h('a', { class: 'btn', href: '#/muscu' }, 'Muscu'));

  const original = JSON.stringify({ name: sess.name, exercises: sess.exercises });
  const draft = JSON.parse(original);
  let saved = false;
  const isDirty = () => !saved && JSON.stringify(draft) !== original;

  const backHref = `#/seance/${sessionId}`;

  /* --- enregistrer / annuler ----------------------------------------- */
  const doSave = () => {
    const name = draft.name.trim();
    if (!name) { toast('Donne un nom à la séance.'); return false; }
    const empty = draft.exercises.find((e) => !e.name.trim());
    if (empty) { toast('Chaque exercice doit avoir un nom.'); return false; }
    store.saveSessionProgram(sessionId, {
      name,
      exercises: draft.exercises.map((e) => ({ ...e, name: e.name.trim() }))
    });
    saved = true;
    return true;
  };

  const save = () => {
    if (!isDirty()) { location.hash = backHref; return; }
    if (doSave()) {
      toast('Séance modifiée');
      location.hash = backHref;
    }
  };

  const cancel = () => {
    if (isDirty() && !confirm('Abandonner les modifications ?')) return;
    saved = true; // rien à proposer en quittant
    location.hash = backHref;
  };

  // Quitter la page (onglet, retour) avec des changements : on propose d'enregistrer.
  ctx.onCleanup(() => {
    if (isDirty() && confirm('Enregistrer les modifications de la séance avant de quitter ?')) {
      doSave();
      toast('Séance modifiée');
    }
  });

  /* --- liste des exercices ------------------------------------------- */
  const list = h('div', { class: 'edit-list' });

  const draw = () => {
    list.textContent = '';
    if (!draft.exercises.length) {
      list.append(h('p', { class: 'muted edit-empty' }, 'Aucun exercice. Ajoute le premier ci-dessous.'));
    }
    draft.exercises.forEach((ex, i) => {
      // le nom se corrige sur place : l'exercice garde son identifiant, donc
      // ses séances passées et sa courbe
      const name = h('input', {
        type: 'text', value: ex.name, maxlength: 80, 'aria-label': `Nom de l’exercice ${i + 1}`,
        oninput: () => { ex.name = name.value; }
      });
      const mode = h('select', { 'aria-label': 'Type', onchange: () => { ex.mode = mode.value; } },
        h('option', { value: 'kg', selected: ex.mode === 'kg' }, 'Charge'),
        h('option', { value: 'bw', selected: ex.mode === 'bw' }, 'Poids du corps'));
      const sets = h('select', { 'aria-label': 'Nombre de séries', onchange: () => { ex.defaultSets = Number(sets.value); } },
        ...[...new Set([...SET_CHOICES, ex.defaultSets])].sort((a, b) => a - b)
          .map((n) => h('option', { value: n, selected: n === ex.defaultSets }, `${n} série${n > 1 ? 's' : ''}`)));

      list.append(h('div', { class: 'edit-row' },
        h('span', { class: 'ex-num' }, String(i + 1)),
        h('div', { class: 'edit-fields' },
          name,
          h('div', { class: 'edit-opts' }, mode, sets)
        ),
        h('div', { class: 'mini' },
          miniBtn(ICONS.up, 'Monter', () => {
            if (i === 0) return;
            [draft.exercises[i - 1], draft.exercises[i]] = [draft.exercises[i], draft.exercises[i - 1]];
            draw();
          }),
          miniBtn(ICONS.down, 'Descendre', () => {
            if (i === draft.exercises.length - 1) return;
            [draft.exercises[i + 1], draft.exercises[i]] = [draft.exercises[i], draft.exercises[i + 1]];
            draw();
          }),
          miniBtn(ICONS.close, 'Retirer de la séance', () => {
            if (!confirm(`Retirer « ${ex.name || 'cet exercice'} » de la séance ? Son historique est conservé.`)) return;
            draft.exercises.splice(i, 1);
            draw();
            drawReuse();
          })
        )
      ));
    });
  };
  draw();

  /* --- ajout --------------------------------------------------------- */
  /*
   * Remettre un exercice déjà connu (retiré de cette séance, ou d'une autre) :
   * on reprend son id, donc sa courbe et son historique continuent.
   */
  const reuseWrap = h('div', { class: 'reuse' });
  const drawReuse = () => {
    reuseWrap.textContent = '';
    // on ne filtre plus les exercices masqués : sans option de retrait, les
    // laisser de côté reviendrait à rendre leur historique inatteignable
    const known = store.exerciseCatalog()
      .filter((e) => !draft.exercises.some((x) => x.id === e.id));
    if (!known.length) return;

    const select = h('select', { 'aria-label': 'Exercice déjà fait à remettre' },
      h('option', { value: '' }, 'Choisir un exercice déjà fait…'));
    const groups = new Map();
    for (const e of known) {
      const key = e.inProgramme ? e.sessionName : 'Retirés du programme';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(e);
    }
    for (const [label, items] of groups) {
      const group = h('optgroup', { label });
      for (const e of items) group.append(h('option', { value: e.id }, e.name));
      select.append(group);
    }
    select.addEventListener('change', () => {
      const found = known.find((e) => e.id === select.value);
      if (!found) return;
      draft.exercises.push({
        id: found.id, name: found.name, mode: found.mode,
        defaultSets: found.defaultSets, libId: found.libId || ''
      });
      draw();
      drawReuse();
    });

    reuseWrap.append(
      select,
      h('span', { class: 'hint' }, 'Son historique et sa courbe continuent.')
    );
  };
  drawReuse();

  /*
   * Catalogue : une base d'exercices par muscle, pour ne pas avoir à tout
   * saisir à la main. Un exercice ajouté d'ici est un exercice normal de la
   * séance, avec son propre identifiant, donc son propre historique.
   */
  const catalogue = cataloguePanel({
    has: (e) => draft.exercises.some((x) => x.libId === e.id || x.name.toLowerCase() === e.name.toLowerCase()),
    onAdd: (e) => {
      draft.exercises.push({
        id: store.uid('e'), name: e.name, mode: e.mode, defaultSets: 3, libId: e.id
      });
      draw();
      drawReuse();
      toast(`${e.name} ajouté`);
    }
  });

  /** Bloc dépliable : le titre seul tant qu'on ne clique pas dessus. */
  const fold = (title, desc, body, { extraClass = '' } = {}) =>
    h('details', { class: 'card section fold' + extraClass },
      h('summary', {},
        h('h2', {}, title),
        h('span', { class: 'chev' }, icon(ICONS.chevron, 16))
      ),
      desc ? h('p', { class: 'desc' }, desc) : null,
      body
    );

  const nameInput = h('input', {
    type: 'text', value: draft.name, maxlength: 60, 'aria-label': 'Nom de la séance',
    oninput: () => { draft.name = nameInput.value; }
  });

  return h('div', { class: 'page page-form' },
    pageHead('Modifier la séance', {
      back: { href: backHref, label: 'Retour à la séance' },
      sub: `Séance ${sessionNumber(sessionId)} · les séances déjà enregistrées ne changent pas.`
    }),
    h('div', { class: 'stack' },
      h('section', { class: 'card section' },
        h('label', { class: 'field-label' }, 'Nom de la séance'),
        nameInput
      ),
      h('section', { class: 'card section' },
        h('h2', {}, 'Exercices'),
        h('p', { class: 'desc' }, 'Ordre, type et nombre de séries tels qu’ils apparaîtront pendant la séance.'),
        list
      ),
      fold('Catalogue d’exercices', 'Cherche un exercice, ou parcours muscle par muscle.',
        [catalogue], { extraClass: ' cat-box' }),
      fold('Créer un exercice', 'La création est désactivée : tout le monde part de la même base.', [
        h('div', { class: 'notice' },
          h('p', {}, 'Un exercice manque au catalogue ? Merci de contacter l’administrateur, ' +
            'il sera ajouté pour tout le monde.'),
          h('a', { class: 'btn small', href: `mailto:${SUPPORT_EMAIL}` }, SUPPORT_EMAIL))
      ]),
      fold('Remettre un exercice déjà fait',
        'Un exercice retiré d’une séance reprend sa courbe là où elle s’était arrêtée.',
        [reuseWrap])
    ),
    h('div', { class: 'form-actions' },
      h('button', { class: 'btn ghost', type: 'button', onclick: cancel }, 'Annuler'),
      h('button', { class: 'btn primary', type: 'button', onclick: save }, icon('M5 12.5l4.5 4.5L19 7.5', 15), 'Enregistrer')
    )
  );
}
