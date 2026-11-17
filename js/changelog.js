/**
 * Patch notes à l'ouverture de l'appli après une mise à jour, en deux tailles :
 *
 * - grosse mise à jour (1.28.0, 1.29.0… : dernier nombre à 0) : une fenêtre
 *   « Quoi de neuf », fermée d'un bouton, d'Échap ou d'un clic à côté ;
 * - petite mise à jour ou correctif (1.28.1, 1.28.2…) : un petit bandeau en
 *   bas de l'écran, fermé d'un ✕.
 *
 * On montre les notes des versions sorties depuis la dernière visite sur cet
 * appareil, la plus récente en premier ; s'il y a une grosse dans le lot, c'est
 * la fenêtre, qui les montre toutes. La version vue est retenue sur l'appareil :
 * chaque note ne s'affiche qu'une fois. Une version sans note n'affiche rien.
 *
 * Pour une mise à jour visible : ajouter une entrée EN HAUT de NOTES, avec le
 * numéro de js/version.js et des phrases courtes écrites pour les utilisateurs :
 * 3 à 5 pour une grosse, 1 ou 2 pour une petite.
 */

import { APP_VERSION } from './version.js';
import { h, icon, ICONS } from './ui.js';

const NOTES = [
  {
    version: '1.28.3',
    items: ['Changer d’email depuis Profil est plus simple : ton mot de passe, puis un seul lien à cliquer sur ta nouvelle adresse.']
  },
  {
    version: '1.28.0',
    items: [
      'Quatre styles au choix dans Profil (Sobre, Énergie, Néon, Violet), en clair comme en sombre.',
      'Modifie ton prénom, ton nom, ton nom d’utilisateur et ton email depuis Profil.',
      'Accueil : les muscles travaillés de la semaine sur le bonhomme, et ton volume comparé à la semaine passée.',
      'Séance : un chrono dans la barre du bas, les séries faites en vert, la touche « Suivant » pour enchaîner, et tes notes des dernières fois.',
      'Catalogue : muscles corrigés (épaule en trois faisceaux, dos par muscle) et un bonhomme redessiné.'
    ]
  }
];

const KEY = 'suivi-muscu:version-vue';

/** « 1.10.0 » est plus récent que « 1.9.2 » : on compare nombre par nombre. */
function newer(a, b) {
  const x = a.split('.').map(Number);
  const y = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0);
  return false;
}

/** Affiche les nouveautés pas encore vues sur cet appareil, s'il y en a. */
export function maybeShowChangelog() {
  let seen = null;
  try { seen = localStorage.getItem(KEY); } catch { return; } // sans stockage, on ne harcèle pas
  if (seen === APP_VERSION) return;
  try { localStorage.setItem(KEY, APP_VERSION); } catch { /* ignore */ }

  // jamais venu sur cet appareil avec cette fonction : seulement la dernière note
  const notes = (seen ? NOTES.filter((n) => newer(n.version, seen)) : NOTES.slice(0, 1))
    .filter((n) => !newer(n.version, APP_VERSION))
    .slice(0, 3);
  if (!notes.length) return;
  const major = notes.some((n) => Number(n.version.split('.')[2] || 0) === 0);
  if (major && typeof HTMLDialogElement !== 'undefined') showDialog(notes);
  else showBanner(notes);
}

/** Petite mise à jour : un bandeau en bas, qui ne bloque rien. */
function showBanner(notes) {
  const items = notes.flatMap((n) => n.items).slice(0, 3);
  const banner = h('div', { class: 'patch-note', role: 'status' },
    h('div', { class: 'body' },
      h('p', { class: 'eyebrow' }, `Mise à jour ${notes[0].version}`),
      h('ul', {}, items.map((t) => h('li', {}, t)))
    ),
    h('button', {
      class: 'btn ghost small icon-only', type: 'button', title: 'Fermer', 'aria-label': 'Fermer les nouveautés',
      onclick: () => banner.remove()
    }, icon(ICONS.close, 14))
  );
  document.body.append(banner);
}

/** Grosse mise à jour : la fenêtre « Quoi de neuf ». */
function showDialog(notes) {
  const close = () => dialog.close();
  const dialog = h('dialog', { class: 'changelog', 'aria-labelledby': 'changelog-title' },
    h('h2', { id: 'changelog-title' }, 'Quoi de neuf'),
    notes.map((n) => h('section', {},
      h('p', { class: 'eyebrow' }, `Version ${n.version}`),
      h('ul', {}, n.items.map((t) => h('li', {}, t)))
    )),
    h('div', { class: 'btn-row' }, h('button', { class: 'btn primary', type: 'button', onclick: close }, 'C’est parti'))
  );
  // un clic sur le fond, hors de la fenêtre, la ferme aussi
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
  dialog.addEventListener('close', () => dialog.remove());
  document.body.append(dialog);
  dialog.showModal();
}
