/**
 * Programme type donné à chaque nouveau compte : 4 séances, historique vide.
 * Aucune perf personnelle ici : ce fichier est public.
 *
 * mode "kg" -> la charge est le poids sur la barre / la machine
 * mode "bw" -> poids du corps ; la colonne poids sert au lest (0 = à vide)
 *
 * Dernière colonne : l'exercice du catalogue correspondant (voir
 * exercise-library.js). Vide quand le mouvement est écrit de façon trop large
 * pour désigner une fiche précise. Les comptes créés avant le catalogue sont
 * rattachés par store.js, qui garde leur id d'exercice et donc leur historique.
 */

const TEMPLATE = [
  {
    id: 's1',
    name: 'Pecs + Biceps',
    exercises: [
      ['e-bench', 'Bench', 'kg', 3, ''],
      ['e-bench-incl', 'Bench incliné', 'kg', 3, ''],
      ['e-pec-fly', 'Pec fly', 'kg', 3, ''],
      ['e-curl-pupitre', 'Curl pupitre barre EZ', 'kg', 3, 'curl-pupitre-ez'],
      ['e-bayesian', 'Bayesian curl (poulie, bras en arrière)', 'kg', 3, 'bayesian-curl']
    ]
  },
  {
    id: 's2',
    name: 'Dos + Triceps',
    exercises: [
      ['e-traction', 'Tractions', 'bw', 3, ''],
      ['e-rowing', 'Rowing', 'kg', 3, ''],
      ['e-pull-over', 'Pull over', 'kg', 3, ''],
      ['e-dips', 'Dips', 'bw', 3, 'dips'],
      ['e-ext-corde', 'Extension poulie haute corde', 'kg', 3, 'ext-corde'],
      ['e-overhead-uni', 'Overhead unilatéral', 'kg', 3, '']
    ]
  },
  {
    id: 's3',
    name: 'Épaules + Avant-bras',
    exercises: [
      ['e-militaire', 'Développé épaules Smith', 'kg', 3, 'militaire-smith'],
      ['e-elev-lat', 'Élévations latérales', 'kg', 3, ''],
      ['e-oiseau', 'Oiseau poulie', 'kg', 3, 'oiseau-poulie'],
      ['e-curl-halt', 'Curl haltères', 'kg', 3, 'curl-halteres'],
      ['e-reverse-curl', 'Reverse curl barre EZ', 'kg', 3, 'reverse-curl']
    ]
  },
  {
    id: 's4',
    name: 'Legs',
    exercises: [
      ['e-pendulum', 'Pendulum squat', 'kg', 2, 'pendulum-squat'],
      ['e-leg-curl', 'Leg curl', 'kg', 3, ''],
      ['e-leg-ext', 'Leg extension', 'kg', 3, 'leg-extension'],
      ['e-calves', 'Mollets (calf raise)', 'kg', 3, '']
    ]
  }
];

/** État de départ d'un nouveau compte : le programme, sans historique. */
export function buildTemplateState() {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    sessions: TEMPLATE.map((s) => ({
      id: s.id,
      name: s.name,
      exercises: s.exercises.map(([id, name, mode, defaultSets, libId]) =>
        ({ id, name, mode, defaultSets, libId: libId || '' }))
    })),
    logs: [],
    cardio: []
  };
}

/**
 * Les rattachements au catalogue, par id d'exercice.
 *
 * Les comptes ouverts avant le catalogue ont ces mêmes ids, avec les anciens
 * noms. store.js s'en sert pour leur donner la bonne fiche sans changer l'id :
 * les séances déjà enregistrées, elles, ne sont jamais réécrites.
 */
export function templateLinks() {
  const out = {};
  for (const s of TEMPLATE) {
    for (const [id, , , , libId] of s.exercises) if (libId) out[id] = libId;
  }
  return out;
}
