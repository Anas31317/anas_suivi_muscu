/**
 * Programme type donné à chaque nouveau compte : 4 séances, historique vide.
 * Aucune perf personnelle ici : ce fichier est public.
 *
 * mode "kg" -> la charge est le poids sur la barre / la machine
 * mode "bw" -> poids du corps ; la colonne poids sert au lest (0 = à vide)
 *
 * Dernière colonne : l'exercice du catalogue correspondant (voir
 * exercise-library.js), pour que chaque ligne du programme ait sa fiche :
 * muscles, matériel, silhouette. Les comptes créés avant le catalogue sont
 * rattachés par store.js, qui garde leur id d'exercice et donc leur historique.
 */

const TEMPLATE = [
  {
    id: 's1',
    name: 'Pecs + Biceps',
    exercises: [
      ['e-bench', 'Développé couché', 'kg', 3, 'dc-barre'],
      ['e-bench-incl', 'Développé incliné machine', 'kg', 3, 'chest-press-incline'],
      ['e-pec-fly', 'Pec deck (butterfly)', 'kg', 3, 'pec-deck'],
      ['e-curl-pupitre', 'Curl pupitre barre EZ', 'kg', 3, 'curl-pupitre-ez'],
      ['e-bayesian', 'Bayesian curl (poulie, bras en arrière)', 'kg', 3, 'bayesian-curl']
    ]
  },
  {
    id: 's2',
    name: 'Dos + Triceps',
    exercises: [
      ['e-traction', 'Tractions pronation', 'bw', 3, 'tractions-pro'],
      ['e-rowing', 'Rowing machine', 'kg', 3, 'rowing-machine'],
      ['e-pull-over', 'Pull over machine', 'kg', 3, 'pull-over-machine'],
      ['e-dips', 'Dips', 'bw', 3, 'dips'],
      ['e-ext-corde', 'Extension poulie haute corde', 'kg', 3, 'ext-corde'],
      ['e-overhead-uni', 'Extension poulie unilatérale', 'kg', 3, 'ext-unilaterale']
    ]
  },
  {
    id: 's3',
    name: 'Épaules + Avant-bras',
    exercises: [
      ['e-militaire', 'Développé épaules Smith', 'kg', 3, 'militaire-smith'],
      ['e-elev-lat', 'Élévations latérales haltères', 'kg', 3, 'elev-lat-halteres'],
      ['e-oiseau', 'Oiseau poulie', 'kg', 3, 'oiseau-poulie'],
      ['e-curl-halt', 'Curl haltères', 'kg', 3, 'curl-halteres'],
      ['e-reverse-curl', 'Reverse curl poulie basse', 'kg', 3, 'reverse-curl-poulie']
    ]
  },
  {
    id: 's4',
    name: 'Legs',
    exercises: [
      ['e-pendulum', 'Pendulum squat', 'kg', 2, 'pendulum-squat'],
      ['e-leg-curl', 'Leg curl assis', 'kg', 3, 'leg-curl-assis'],
      ['e-leg-ext', 'Leg extension', 'kg', 3, 'leg-extension'],
      ['e-calves', 'Mollets assis machine', 'kg', 3, 'mollets-assis']
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
