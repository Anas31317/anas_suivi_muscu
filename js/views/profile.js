/** Profil : compte, apparence, programme, données, déconnexion. */

import * as store from '../store.js';
import * as insights from '../insights.js';
import { accountSection } from '../auth-views.js';
import * as shareApi from '../share.js';
import { getTheme, setTheme } from '../theme.js';
import { h, toast, icon, ICONS } from '../ui.js';
import { plural, pageHead } from './common.js';

export function viewProfile(ctx) {
  const state = store.getState();
  const email = ctx.user.email;
  const name = insights.firstName(email);

  /* --- identité ------------------------------------------------------ */
  const identity = h('section', { class: 'card profile-card' },
    h('span', { class: 'avatar', 'aria-hidden': 'true' }, (name || email).charAt(0).toUpperCase()),
    h('div', { class: 'body' },
      h('div', { class: 'name' }, name || 'Mon compte'),
      h('div', { class: 'meta' }, email)
    )
  );

  /* --- apparence ----------------------------------------------------- */
  const current = getTheme();
  const themeSeg = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Thème' },
    [['auto', 'Auto'], ['light', 'Clair'], ['dark', 'Sombre']].map(([value, label]) =>
      h('button', {
        type: 'button', 'aria-pressed': value === current ? 'true' : 'false',
        onclick: () => { setTheme(value); ctx.render(); }
      }, label)
    )
  );
  const appearance = h('section', { class: 'card section' },
    h('div', { class: 'section-row' },
      h('div', {},
        h('h2', {}, 'Apparence'),
        h('p', { class: 'desc' }, 'Auto suit le réglage de ton appareil.')
      ),
      themeSeg
    )
  );

  /* --- programme ----------------------------------------------------- */
  const programme = h('a', { class: 'card nav-card', href: '#/programme' },
    h('span', { class: 'row-icon' }, icon(ICONS.list, 18)),
    h('div', { class: 'body' },
      h('div', { class: 'name' }, 'Mon programme'),
      h('div', { class: 'meta' },
        `${plural(state.sessions.length, 'séance', 'séances')} · ${plural(store.allExercises().length, 'exercice', 'exercices')}`)
    ),
    h('span', { class: 'chev' }, icon(ICONS.chevron, 16))
  );

  /* --- partage ------------------------------------------------------- */
  const cfg = store.getShare();
  const enabledIn = h('input', { type: 'checkbox', id: 'share-on', checked: cfg.enabled });
  const nameIn = h('input', {
    type: 'text', maxlength: 40, id: 'share-name', value: cfg.name || name,
    placeholder: 'Le nom que verront tes amis'
  });
  const codeEl = h('span', { class: 'share-code' }, cfg.code ? store.formatShareCode(cfg.code) : '—');

  const apply = async (patch) => {
    const next = { ...store.getShare(), ...patch };
    if (next.enabled && !next.code) next.code = store.newShareCode();
    next.name = nameIn.value.trim() || name;
    store.setShare(next);
    try {
      if (next.enabled) await shareApi.push(ctx.user.id);
      else await shareApi.stopSharing(ctx.user.id);
      toast(next.enabled ? 'Partage activé' : 'Partage désactivé');
    } catch (err) {
      toast(shareApi.explain(err));
    }
  };

  enabledIn.addEventListener('change', () => apply({ enabled: enabledIn.checked }));
  nameIn.addEventListener('change', () => { if (store.getShare().enabled) apply({}); });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(store.formatShareCode(store.getShare().code));
      toast('Code copié');
    } catch {
      toast('Copie impossible : note le code à la main.');
    }
  };

  const regenerate = () => {
    if (!confirm('Générer un nouveau code ?\n\nCeux qui ont l’ancien ne verront plus ton suivi.')) return;
    apply({ code: store.newShareCode() });
  };

  const sharing = h('section', { class: 'card section' },
    h('h2', {}, 'Partage'),
    h('p', { class: 'desc' },
      'Donne ton code à qui tu veux : il verra ton programme, tes séances, ton cardio et tes 1RM, ' +
      'en lecture seule. Personne ne peut te trouver sans ce code.'),
    h('label', { class: 'check' }, enabledIn, 'Partager mon suivi'),
    cfg.enabled
      ? h('div', { class: 'stack share-block' },
          h('div', { class: 'code-row' },
            codeEl,
            h('button', { class: 'btn small', type: 'button', onclick: copy }, 'Copier'),
            h('button', { class: 'btn small ghost', type: 'button', onclick: regenerate }, 'Nouveau code')
          ),
          h('div', { class: 'field' }, h('label', { for: 'share-name' }, 'Nom affiché'), nameIn)
        )
      : null
  );

  /* --- données ------------------------------------------------------- */
  const fileInput = h('input', {
    type: 'file', accept: 'application/json,.json', class: 'sr-only',
    onchange: async (e) => {
      const file = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!file) return;
      try {
        if (file.size > 2 * 1024 * 1024) throw new Error('fichier trop gros (2 Mo maximum).');
        if (!confirm('Remplacer toutes tes données actuelles par celles du fichier ?')) return;
        store.importJSON(await file.text());
        toast('Données importées');
      } catch (err) {
        alert('Import impossible : ' + err.message);
      }
    }
  });

  const data = h('section', { class: 'card section' },
    h('h2', {}, 'Mes données'),
    h('p', { class: 'desc' },
      `${plural(state.logs.length, 'séance enregistrée', 'séances enregistrées')}, synchronisées sur tous tes appareils. ` +
      'L’export te donne une copie de sauvegarde.'),
    h('div', { class: 'btn-row' },
      h('button', {
        class: 'btn', type: 'button',
        onclick: () => {
          const blob = new Blob([store.exportJSON()], { type: 'application/json' });
          const a = h('a', { href: URL.createObjectURL(blob), download: `suivi-muscu-${store.todayISO()}.json` });
          a.click();
          setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        }
      }, icon(ICONS.download, 14), 'Exporter'),
      h('button', { class: 'btn', type: 'button', onclick: () => fileInput.click() }, icon(ICONS.upload, 14), 'Importer'),
      fileInput,
      h('button', {
        class: 'btn danger', type: 'button',
        onclick: () => {
          if (!confirm('Effacer tout ton historique et repartir du programme type ? C’est irréversible (exporte d’abord si besoin).')) return;
          store.resetToTemplate();
          toast('Données réinitialisées');
        }
      }, 'Réinitialiser')
    )
  );

  return h('div', { class: 'page' },
    pageHead('Profil'),
    h('div', { class: 'stack' },
      identity,
      programme,
      sharing,
      appearance,
      data,
      accountSection({ email, onSignOut: ctx.signOut })
    )
  );
}
