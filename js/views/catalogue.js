/**
 * Catalogue d'exercices : une base commune à tout le monde.
 *
 * On cherche par le nom, ou on parcourt muscle par muscle. Chaque ligne montre
 * le mouvement, le matériel et les muscles travaillés (principaux en évidence,
 * secondaires en gris).
 *
 * « Ajouter » met l'exercice tel quel dans la séance ; « Renommer » l'ajoute
 * sous un autre nom, ce qui en fait un exercice à part, avec sa propre courbe.
 *
 * Le panneau vit dans la page « Modifier la séance » : il n'y a pas de
 * navigation, donc le brouillon en cours n'est jamais perdu.
 */

import { MUSCLES, GEAR, LIBRARY, libraryFor, searchLibrary, muscleLabel } from '../exercise-library.js';
import { exerciseImage, IMAGE_SOURCE } from '../exercise-images.js';
import { bodyMap } from '../body-map.js';
import { h, icon, ICONS } from '../ui.js';

const GEAR_ICON = {
  barre: ICONS.barre,
  halteres: ICONS.dumbbell,
  machine: ICONS.machine,
  poulie: ICONS.poulie,
  corps: ICONS.corps
};

/**
 * @param {(entry) => void} onAdd  exercice du catalogue choisi
 * @param {(entry) => boolean} has  vrai si l'exercice est déjà dans la séance
 */
export function cataloguePanel({ onAdd, has }) {
  let current = MUSCLES[0].id;
  let query = '';

  const search = h('input', {
    type: 'search', placeholder: 'Chercher un exercice…', 'aria-label': 'Chercher un exercice',
    autocomplete: 'off', spellcheck: 'false'
  });
  const chipsWrap = h('div', { class: 'muscle-chips', role: 'group', 'aria-label': 'Muscle' });
  const head = h('div', { class: 'cat-head' });
  const listWrap = h('div', { class: 'card list-card' });

  const row = (e) => {
    const already = has(e);
    const tags = GEAR[e.gear];
    const muscles = [...e.primary.map(muscleLabel), ...e.secondary.map(muscleLabel)].join(', ');
    /*
     * Les illustrations wger sont au trait, sans muscles en couleur : les
     * muscles se lisent donc ici, les principaux en évidence, les secondaires
     * en gris. La silhouette colorée reste en en-tête de muscle.
     */
    const muscleLine = h('div', { class: 'meta muscles' },
      e.primary.map((m, i) => h('span', { class: 'm1' }, (i ? ', ' : '') + muscleLabel(m))),
      e.secondary.map((m, i) => h('span', {}, (i || e.primary.length ? ', ' : '') + muscleLabel(m)))
    );

    /*
     * Quand on a une illustration, elle montre le mouvement ET les muscles en
     * rouge : elle remplace la silhouette, qui reste le repli pour les
     * exercices sans image.
     */
    const img = exerciseImage(e.id);
    const fallback = () => bodyMap(e.primary, e.secondary, { height: 56, label: muscles });
    let visual = fallback();
    if (img) {
      const el = h('img', {
        class: 'cat-img', src: img.src, width: 72, height: 72, loading: 'lazy', decoding: 'async',
        alt: `${e.name} — muscles travaillés : ${muscles}`,
        title: `© ${img.author}, ${img.license}`
      });
      // image absente du cache hors ligne : on retombe sur la silhouette
      el.addEventListener('error', () => el.replaceWith(fallback()));
      visual = el;
    }

    return h('div', { class: 'list-row cat-row' },
      visual,
      h('div', { class: 'body' },
        h('div', { class: 'name' }, e.name),
        h('div', { class: 'meta' }, icon(GEAR_ICON[e.gear] || ICONS.dumbbell, 13), tags),
        muscleLine
      ),
      already
        ? h('span', { class: 'cat-added' }, icon(ICONS.check, 14), 'Ajouté')
        : h('button', {
            class: 'btn small cat-add', type: 'button',
            'aria-label': `Ajouter ${e.name} à la séance`,
            onclick: () => { onAdd(e); draw(); }
          }, icon(ICONS.plus, 14), 'Ajouter')
    );
  };

  const draw = () => {
    /* --- muscles ----------------------------------------------------- */
    chipsWrap.textContent = '';
    for (const m of MUSCLES) {
      chipsWrap.append(h('button', {
        type: 'button',
        class: 'chip' + (!query && m.id === current ? ' on' : ''),
        'aria-pressed': !query && m.id === current ? 'true' : 'false',
        onclick: () => { query = ''; search.value = ''; current = m.id; draw(); }
      }, m.label));
    }

    /* --- en-tête ----------------------------------------------------- */
    head.textContent = '';
    const found = query ? searchLibrary(query) : libraryFor(current);
    if (query) {
      head.append(h('div', {},
        h('h3', {}, `Recherche « ${query} »`),
        h('p', { class: 'meta' }, found.length
          ? `${found.length} exercice${found.length > 1 ? 's' : ''} sur ${LIBRARY.length}`
          : 'aucun exercice ne correspond')));
    } else {
      const muscle = MUSCLES.find((m) => m.id === current);
      head.append(
        bodyMap([muscle.id], [], { height: 72, label: muscle.label }),
        h('div', {},
          h('h3', {}, muscle.label),
          h('p', { class: 'meta' }, `${found.length} exercices`),
          h('p', { class: 'meta' }, 'De face et de dos'))
      );
    }

    /* --- liste ------------------------------------------------------- */
    listWrap.textContent = '';
    if (!found.length) {
      listWrap.append(h('p', { class: 'list-empty' }, 'Essaie un autre mot : « incliné », « poulie », « supination »…'));
    } else {
      for (const e of found) listWrap.append(row(e));
    }
  };

  let timer = 0;
  search.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => { query = search.value.trim(); draw(); }, 120);
  });

  /* --- crédit des illustrations (obligatoire en CC BY-SA) ------------ */
  const credit = h('p', { class: 'cat-credit' },
    'Illustrations : ',
    h('a', { href: IMAGE_SOURCE.url, target: '_blank', rel: 'noopener noreferrer' }, IMAGE_SOURCE.site),
    `, ${IMAGE_SOURCE.authors.length} contributeurs — `,
    IMAGE_SOURCE.licenses.map((l, i) =>
      h('span', {}, i ? ' / ' : '', h('a', { href: l.url, target: '_blank', rel: 'noopener noreferrer' }, l.name))),
    '. Chaque image indique son auteur au survol ; la liste complète est dans le README.'
  );

  draw();
  return h('div', { class: 'catalogue' },
    h('div', { class: 'cat-search' }, search),
    chipsWrap, head, listWrap, credit);
}
