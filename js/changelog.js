/**
 * Patch notes à l'ouverture de l'appli après une mise à jour, en deux tailles :
 *
 * - grosse mise à jour (1.28.0, 1.29.0… : dernier nombre à 0) : une fenêtre
 *   « Quoi de neuf », fermée d'un bouton, d'Échap ou d'un clic à côté ;
 * - petite mise à jour ou correctif (1.28.1, 1.28.2…) : un petit bandeau en
 *   bas de l'écran, fermé d'un ✕.
 *
 * Une seule note à la fois, même pour qui a raté plusieurs versions : la
 * dernière grosse mise à jour pas encore vue s'il y en a une, sinon la dernière
 * petite. La version vue est retenue sur l'appareil : chaque note ne s'affiche
 * qu'une fois. Une version sans note n'affiche rien.
 *
 * Pour une mise à jour visible : ajouter une entrée EN HAUT de NOTES, avec le
 * numéro de js/version.js et des phrases courtes écrites pour les utilisateurs :
 * 3 à 5 pour une grosse, 1 ou 2 pour une petite.
 */

import { APP_VERSION } from './version.js';
import { h, icon, ICONS } from './ui.js';

const NOTES = [
  {
    version: '1.28.7',
    items: [
      'Modifier la séance : le bouton pour retirer un exercice est de retour sur téléphone.',
      'Séance : plus de bouton « Supprimer » en bas ; une séance se supprime depuis l’historique.'
    ]
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

  // pas encore vues (toutes, si l'appareil n'a jamais rien vu), sans aller au-delà de la version en ligne
  const unseen = NOTES.filter((n) => (!seen || newer(n.version, seen)) && !newer(n.version, APP_VERSION));
  const isMajor = (n) => Number(n.version.split('.')[2] || 0) === 0;
  // une seule note : la dernière grosse s'il y en a une, sinon la dernière petite (NOTES est du plus récent au plus ancien)
  const note = unseen.find(isMajor) || unseen[0];
  if (!note) return;
  if (isMajor(note) && typeof HTMLDialogElement !== 'undefined') showDialog(note);
  else showBanner(note);
}

/** Petite mise à jour : un bandeau en bas, qui ne bloque rien. */
function showBanner(note) {
  const items = note.items.slice(0, 2);
  const banner = h('div', { class: 'patch-note', role: 'status' },
    h('div', { class: 'body' },
      h('p', { class: 'eyebrow' }, `Mise à jour ${note.version}`),
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
function showDialog(note) {
  const close = () => dialog.close();
  const dialog = h('dialog', { class: 'changelog', 'aria-labelledby': 'changelog-title' },
    h('h2', { id: 'changelog-title' }, 'Quoi de neuf'),
    h('p', { class: 'eyebrow' }, `Version ${note.version}`),
    h('ul', {}, note.items.map((t) => h('li', {}, t))),
    h('div', { class: 'btn-row' }, h('button', { class: 'btn primary', type: 'button', onclick: close }, 'C’est parti'))
  );
  // un clic sur le fond, hors de la fenêtre, la ferme aussi
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
  dialog.addEventListener('close', () => dialog.remove());
  document.body.append(dialog);
  dialog.showModal();
}
