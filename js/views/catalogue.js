/**
 * Catalogue d'exercices : on choisit un muscle, on voit les exercices
 * correspondants avec le matériel et un repère visuel, et on les ajoute à la
 * séance en cours de modification.
 *
 * Le panneau vit dans la page « Modifier la séance » : il n'y a pas de
 * navigation, donc le brouillon en cours n'est jamais perdu.
 */

import { MUSCLES, GEAR, libraryFor } from '../exercise-library.js';
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
 * @param {(entry) => void} onAdd  appelé avec l'exercice du catalogue choisi
 * @param {(entry) => boolean} has  vrai si l'exercice est déjà dans la séance
 */
export function cataloguePanel({ onAdd, has }) {
  let current = MUSCLES[0].id;
  const wrap = h('div', { class: 'catalogue' });

  const draw = () => {
    wrap.textContent = '';
    const muscle = MUSCLES.find((m) => m.id === current);

    const chips = h('div', { class: 'muscle-chips', role: 'group', 'aria-label': 'Muscle' },
      MUSCLES.map((m) => h('button', {
        type: 'button',
        class: 'chip' + (m.id === current ? ' on' : ''),
        'aria-pressed': m.id === current ? 'true' : 'false',
        onclick: () => { current = m.id; draw(); }
      }, m.label))
    );

    const rows = libraryFor(current).map((e) => {
      const already = has(e);
      return h('div', { class: 'list-row cat-row' },
        h('span', { class: 'row-icon', title: GEAR[e.gear] }, icon(GEAR_ICON[e.gear] || ICONS.dumbbell, 18)),
        h('div', { class: 'body' },
          h('div', { class: 'name' }, e.name),
          h('div', { class: 'meta' },
            `${GEAR[e.gear]} · ${e.sets} séries`,
            e.mode === 'bw' ? ' · poids du corps' : ''),
          e.tip ? h('div', { class: 'meta stats' }, e.tip) : null
        ),
        already
          ? h('span', { class: 'cat-added' }, icon(ICONS.check, 14), 'Ajouté')
          : h('button', {
              class: 'btn small', type: 'button',
              'aria-label': `Ajouter ${e.name} à la séance`,
              onclick: () => { onAdd(e); draw(); }
            }, icon(ICONS.plus, 14), 'Ajouter')
      );
    });

    wrap.append(
      chips,
      h('div', { class: 'cat-head' },
        bodyMap(muscle.id, { height: 84 }),
        h('div', {},
          h('h3', {}, muscle.label),
          h('p', { class: 'meta' }, muscle.view === 'back' ? 'Vue de dos' : 'Vue de face'),
          h('p', { class: 'meta' }, `${rows.length} exercices`)
        )
      ),
      h('div', { class: 'card list-card' }, rows)
    );
  };

  draw();
  return wrap;
}
