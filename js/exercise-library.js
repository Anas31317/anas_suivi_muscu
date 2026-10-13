/**
 * Catalogue d'exercices.
 *
 * Une ligne par variante : le même mouvement à la barre, aux haltères, à la
 * machine ou à la poulie sont des exercices différents, parce qu'on ne les
 * charge pas pareil et qu'on ne les suit pas sur la même courbe.
 *
 * L'inclinaison et l'angle des poignées ne sont pas des colonnes : ils ne
 * concernent qu'une partie des exercices. Quand ils distinguent vraiment un
 * mouvement, ils sont dans son nom (« Tirage vertical prise neutre »,
 * « Développé incliné »).
 *
 * Chaque exercice dit quels muscles il travaille : `primary` (en accent sur la
 * silhouette) et `secondary` (en teinte claire). Beaucoup sont polyarticulaires,
 * d'où les deux listes.
 *
 * Pas de nombre de séries ici : c'est à chacun de le régler dans sa séance.
 *
 * Colonnes : id, nom, matériel, mode, muscles primaires, muscles secondaires.
 *   matériel : barre | halteres | machine | poulie | corps
 *   mode     : kg (charge saisie) | bw (poids du corps, lest éventuel)
 */

export const MUSCLES = [
  { id: 'pecs', label: 'Pectoraux', view: 'front' },
  { id: 'dos', label: 'Dos', view: 'back' },
  { id: 'trapezes', label: 'Trapèzes', view: 'back' },
  { id: 'epaules', label: 'Épaules', view: 'front' },
  { id: 'biceps', label: 'Biceps', view: 'front' },
  { id: 'triceps', label: 'Triceps', view: 'back' },
  { id: 'avant-bras', label: 'Avant-bras', view: 'front' },
  { id: 'abdos', label: 'Abdominaux', view: 'front' },
  { id: 'lombaires', label: 'Lombaires', view: 'back' },
  { id: 'fessiers', label: 'Fessiers', view: 'back' },
  { id: 'quadriceps', label: 'Quadriceps', view: 'front' },
  { id: 'ischios', label: 'Ischios-jambiers', view: 'back' },
  { id: 'mollets', label: 'Mollets', view: 'back' }
];

export const GEAR = {
  barre: 'Barre',
  halteres: 'Haltères',
  machine: 'Machine',
  poulie: 'Poulie',
  corps: 'Poids du corps'
};

const RAW = [
  /* ---------------------------------------------------------- pectoraux */
  ['dc-barre', 'Développé couché', 'barre', 'kg', ['pecs'], ['triceps', 'epaules']],
  ['dc-incline-barre', 'Développé incliné', 'barre', 'kg', ['pecs'], ['epaules', 'triceps']],
  ['dc-decline-barre', 'Développé décliné', 'barre', 'kg', ['pecs'], ['triceps']],
  ['dc-smith', 'Développé couché Smith', 'machine', 'kg', ['pecs'], ['triceps', 'epaules']],
  ['dc-incline-smith', 'Développé incliné Smith', 'machine', 'kg', ['pecs'], ['epaules', 'triceps']],
  ['dc-halteres', 'Développé couché haltères', 'halteres', 'kg', ['pecs'], ['triceps', 'epaules']],
  ['dc-halteres-neutre', 'Développé couché haltères prise neutre', 'halteres', 'kg', ['pecs'], ['triceps']],
  ['dc-incline-halteres', 'Développé incliné haltères', 'halteres', 'kg', ['pecs'], ['epaules', 'triceps']],
  ['dc-decline-halteres', 'Développé décliné haltères', 'halteres', 'kg', ['pecs'], ['triceps']],
  ['chest-press', 'Développé machine (chest press)', 'machine', 'kg', ['pecs'], ['triceps', 'epaules']],
  ['chest-press-incline', 'Développé incliné machine', 'machine', 'kg', ['pecs'], ['epaules', 'triceps']],
  ['ecarte-couche', 'Écarté haltères couché', 'halteres', 'kg', ['pecs'], []],
  ['ecarte-incline', 'Écarté haltères incliné', 'halteres', 'kg', ['pecs'], ['epaules']],
  ['pec-deck', 'Pec deck (butterfly)', 'machine', 'kg', ['pecs'], []],
  ['ecarte-poulie-haute', 'Écarté poulie haute', 'poulie', 'kg', ['pecs'], []],
  ['ecarte-poulie-basse', 'Écarté poulie basse', 'poulie', 'kg', ['pecs'], ['epaules']],
  ['ecarte-poulie-milieu', 'Écarté poulie hauteur poitrine', 'poulie', 'kg', ['pecs'], []],
  ['pompes', 'Pompes', 'corps', 'bw', ['pecs'], ['triceps', 'epaules', 'abdos']],
  ['pompes-pieds-hauts', 'Pompes pieds surélevés', 'corps', 'bw', ['pecs'], ['epaules', 'triceps']],
  ['pompes-larges', 'Pompes prise large', 'corps', 'bw', ['pecs'], ['epaules']],
  ['dips-pecs', 'Dips buste penché', 'corps', 'bw', ['pecs'], ['triceps', 'epaules']],

  /* ---------------------------------------------------------------- dos */
  ['tractions-pro', 'Tractions pronation', 'corps', 'bw', ['dos'], ['biceps', 'avant-bras']],
  ['tractions-supi', 'Tractions supination', 'corps', 'bw', ['dos'], ['biceps']],
  ['tractions-neutre', 'Tractions prise neutre', 'corps', 'bw', ['dos'], ['biceps', 'avant-bras']],
  ['tractions-larges', 'Tractions prise large', 'corps', 'bw', ['dos'], ['epaules']],
  ['tirage-vertical-pro', 'Tirage vertical pronation', 'poulie', 'kg', ['dos'], ['biceps']],
  ['tirage-vertical-supi', 'Tirage vertical supination', 'poulie', 'kg', ['dos'], ['biceps']],
  ['tirage-vertical-neutre', 'Tirage vertical prise neutre', 'poulie', 'kg', ['dos'], ['biceps']],
  ['tirage-vertical-large', 'Tirage vertical prise large', 'poulie', 'kg', ['dos'], ['epaules', 'biceps']],
  ['rowing-barre-pro', 'Rowing barre pronation', 'barre', 'kg', ['dos'], ['trapezes', 'biceps', 'lombaires']],
  ['rowing-barre-supi', 'Rowing barre supination (Yates)', 'barre', 'kg', ['dos'], ['biceps', 'lombaires']],
  ['rowing-t-bar', 'Rowing T-bar', 'barre', 'kg', ['dos'], ['trapezes', 'biceps']],
  ['rowing-haltere', 'Rowing haltère un bras', 'halteres', 'kg', ['dos'], ['biceps', 'trapezes']],
  ['rowing-halteres-2', 'Rowing haltères deux bras', 'halteres', 'kg', ['dos'], ['biceps', 'lombaires']],
  ['seal-row', 'Seal row (banc)', 'halteres', 'kg', ['dos'], ['biceps', 'trapezes']],
  ['rowing-machine', 'Rowing machine', 'machine', 'kg', ['dos'], ['biceps', 'trapezes']],
  ['tirage-horizontal', 'Tirage horizontal poulie', 'poulie', 'kg', ['dos'], ['biceps', 'trapezes']],
  ['tirage-horizontal-large', 'Tirage horizontal prise large', 'poulie', 'kg', ['dos'], ['trapezes', 'epaules']],
  ['rowing-inverse', 'Rowing inversé (barre basse)', 'corps', 'bw', ['dos'], ['biceps', 'abdos']],
  ['pull-over-poulie', 'Pull over poulie haute', 'poulie', 'kg', ['dos'], ['triceps']],
  ['pull-over-haltere', 'Pull over haltère', 'halteres', 'kg', ['dos'], ['pecs', 'triceps']],
  ['sdt', 'Soulevé de terre', 'barre', 'kg', ['dos', 'lombaires'], ['fessiers', 'ischios', 'trapezes']],

  /* ----------------------------------------------------------- trapèzes */
  ['shrugs-barre', 'Shrugs barre', 'barre', 'kg', ['trapezes'], ['avant-bras']],
  ['shrugs-halteres', 'Shrugs haltères', 'halteres', 'kg', ['trapezes'], ['avant-bras']],
  ['shrugs-machine', 'Shrugs machine', 'machine', 'kg', ['trapezes'], []],
  ['face-pull', 'Face pull', 'poulie', 'kg', ['trapezes', 'epaules'], ['dos']],
  ['rowing-menton', 'Rowing menton', 'barre', 'kg', ['trapezes', 'epaules'], ['biceps']],

  /* ------------------------------------------------------------ épaules */
  ['militaire-debout', 'Développé militaire debout', 'barre', 'kg', ['epaules'], ['triceps', 'abdos']],
  ['militaire-assis', 'Développé militaire assis', 'barre', 'kg', ['epaules'], ['triceps']],
  ['militaire-smith', 'Développé épaules Smith', 'machine', 'kg', ['epaules'], ['triceps']],
  ['dev-epaules-halteres', 'Développé épaules haltères', 'halteres', 'kg', ['epaules'], ['triceps']],
  ['dev-epaules-neutre', 'Développé épaules prise neutre', 'halteres', 'kg', ['epaules'], ['triceps']],
  ['arnold-press', 'Arnold press', 'halteres', 'kg', ['epaules'], ['triceps']],
  ['dev-epaules-machine', 'Développé épaules machine', 'machine', 'kg', ['epaules'], ['triceps']],
  ['elev-lat-halteres', 'Élévations latérales haltères', 'halteres', 'kg', ['epaules'], []],
  ['elev-lat-poulie', 'Élévation latérale poulie', 'poulie', 'kg', ['epaules'], []],
  ['elev-lat-machine', 'Élévations latérales machine', 'machine', 'kg', ['epaules'], []],
  ['elev-lat-penche', 'Élévations latérales buste penché', 'halteres', 'kg', ['epaules'], ['trapezes']],
  ['elev-front-halteres', 'Élévations frontales haltères', 'halteres', 'kg', ['epaules'], ['pecs']],
  ['elev-front-barre', 'Élévations frontales barre', 'barre', 'kg', ['epaules'], []],
  ['elev-front-poulie', 'Élévations frontales poulie', 'poulie', 'kg', ['epaules'], []],
  ['oiseau-halteres', 'Oiseau haltères', 'halteres', 'kg', ['epaules'], ['trapezes', 'dos']],
  ['oiseau-machine', 'Oiseau machine (reverse pec deck)', 'machine', 'kg', ['epaules'], ['trapezes']],
  ['oiseau-poulie', 'Oiseau poulie', 'poulie', 'kg', ['epaules'], ['trapezes']],

  /* ------------------------------------------------------------- biceps */
  ['curl-barre', 'Curl barre droite', 'barre', 'kg', ['biceps'], ['avant-bras']],
  ['curl-ez', 'Curl barre EZ', 'barre', 'kg', ['biceps'], ['avant-bras']],
  ['curl-halteres', 'Curl haltères', 'halteres', 'kg', ['biceps'], ['avant-bras']],
  ['curl-alterne', 'Curl haltères alterné', 'halteres', 'kg', ['biceps'], ['avant-bras']],
  ['curl-marteau', 'Curl marteau', 'halteres', 'kg', ['biceps', 'avant-bras'], []],
  ['curl-marteau-corde', 'Curl marteau à la corde', 'poulie', 'kg', ['biceps', 'avant-bras'], []],
  ['curl-pupitre-ez', 'Curl pupitre barre EZ', 'barre', 'kg', ['biceps'], []],
  ['curl-pupitre-haltere', 'Curl pupitre haltère', 'halteres', 'kg', ['biceps'], []],
  ['curl-pupitre-machine', 'Curl pupitre machine', 'machine', 'kg', ['biceps'], []],
  ['curl-incline', 'Curl incliné haltères', 'halteres', 'kg', ['biceps'], []],
  ['curl-araignee', 'Curl araignée (spider)', 'halteres', 'kg', ['biceps'], []],
  ['curl-concentre', 'Curl concentré', 'halteres', 'kg', ['biceps'], []],
  ['curl-poulie-barre', 'Curl poulie basse barre', 'poulie', 'kg', ['biceps'], []],
  ['curl-poulie-corde', 'Curl poulie basse corde', 'poulie', 'kg', ['biceps'], ['avant-bras']],
  ['bayesian-curl', 'Bayesian curl (poulie, bras en arrière)', 'poulie', 'kg', ['biceps'], []],
  ['drag-curl', 'Drag curl', 'barre', 'kg', ['biceps'], []],

  /* ------------------------------------------------------------ triceps */
  ['dips', 'Dips barres parallèles', 'corps', 'bw', ['triceps'], ['pecs', 'epaules']],
  ['dips-machine', 'Dips machine', 'machine', 'kg', ['triceps'], ['pecs']],
  ['dips-banc', 'Dips sur banc', 'corps', 'bw', ['triceps'], ['epaules']],
  ['dev-serre', 'Développé couché prise serrée', 'barre', 'kg', ['triceps'], ['pecs', 'epaules']],
  ['barre-au-front', 'Barre au front (EZ)', 'barre', 'kg', ['triceps'], []],
  ['barre-au-front-halteres', 'Extension haltères couché', 'halteres', 'kg', ['triceps'], []],
  ['ext-corde', 'Extension poulie haute corde', 'poulie', 'kg', ['triceps'], []],
  ['ext-barre', 'Extension poulie haute barre', 'poulie', 'kg', ['triceps'], []],
  ['ext-inverse', 'Extension poulie prise inversée', 'poulie', 'kg', ['triceps'], []],
  ['overhead-haltere', 'Extension au-dessus de la tête haltère', 'halteres', 'kg', ['triceps'], []],
  ['overhead-corde', 'Extension au-dessus de la tête corde', 'poulie', 'kg', ['triceps'], []],
  ['ext-unilaterale', 'Extension poulie unilatérale', 'poulie', 'kg', ['triceps'], []],
  ['kickback-haltere', 'Kickback haltère', 'halteres', 'kg', ['triceps'], []],
  ['kickback-poulie', 'Kickback poulie', 'poulie', 'kg', ['triceps'], []],
  ['pompes-diamant', 'Pompes diamant', 'corps', 'bw', ['triceps'], ['pecs']],
  ['ext-machine', 'Extension triceps machine', 'machine', 'kg', ['triceps'], []],

  /* --------------------------------------------------------- avant-bras */
  ['reverse-curl', 'Reverse curl barre EZ', 'barre', 'kg', ['avant-bras'], ['biceps']],
  ['curl-poignets', 'Curl poignets', 'barre', 'kg', ['avant-bras'], []],
  ['curl-poignets-inverse', 'Curl poignets inversé', 'barre', 'kg', ['avant-bras'], []],
  ['farmer-walk', 'Marche du fermier', 'halteres', 'kg', ['avant-bras'], ['trapezes', 'abdos']],
  ['suspension', 'Suspension à la barre', 'corps', 'bw', ['avant-bras'], ['dos']],

  /* --------------------------------------------------------- abdominaux */
  ['crunch', 'Crunch au sol', 'corps', 'bw', ['abdos'], []],
  ['crunch-poulie', 'Crunch à la poulie', 'poulie', 'kg', ['abdos'], []],
  ['crunch-machine', 'Crunch machine', 'machine', 'kg', ['abdos'], []],
  ['releve-jambes-suspendu', 'Relevé de jambes suspendu', 'corps', 'bw', ['abdos'], ['avant-bras']],
  ['releve-jambes-chaise', 'Relevé de jambes chaise romaine', 'corps', 'bw', ['abdos'], []],
  ['releve-bassin', 'Relevé de bassin au sol', 'corps', 'bw', ['abdos'], []],
  ['gainage', 'Gainage (planche)', 'corps', 'bw', ['abdos'], ['lombaires']],
  ['gainage-lateral', 'Gainage latéral', 'corps', 'bw', ['abdos'], []],
  ['roue-abdos', 'Roue abdominale', 'corps', 'bw', ['abdos'], ['dos']],
  ['russian-twist', 'Russian twist', 'halteres', 'kg', ['abdos'], []],
  ['sit-up-leste', 'Sit-up lesté', 'halteres', 'kg', ['abdos'], []],

  /* ---------------------------------------------------------- lombaires */
  ['ext-lombaire', 'Extension lombaire (banc 45°)', 'corps', 'bw', ['lombaires'], ['fessiers', 'ischios']],
  ['ext-lombaire-machine', 'Extension lombaire machine', 'machine', 'kg', ['lombaires'], ['fessiers']],
  ['good-morning', 'Good morning', 'barre', 'kg', ['lombaires', 'ischios'], ['fessiers']],
  ['superman', 'Superman au sol', 'corps', 'bw', ['lombaires'], ['fessiers']],

  /* ----------------------------------------------------------- fessiers */
  ['hip-thrust', 'Hip thrust barre', 'barre', 'kg', ['fessiers'], ['ischios', 'quadriceps']],
  ['hip-thrust-machine', 'Hip thrust machine', 'machine', 'kg', ['fessiers'], ['ischios']],
  ['pont-fessier', 'Pont fessier au sol', 'corps', 'bw', ['fessiers'], ['ischios']],
  ['abduction-machine', 'Abduction machine', 'machine', 'kg', ['fessiers'], []],
  ['abduction-poulie', 'Abduction poulie', 'poulie', 'kg', ['fessiers'], []],
  ['kickback-fessier', 'Kickback fessier poulie', 'poulie', 'kg', ['fessiers'], ['ischios']],
  ['step-up', 'Montée sur banc (step-up)', 'halteres', 'kg', ['fessiers', 'quadriceps'], ['ischios']],
  ['sdt-sumo', 'Soulevé de terre sumo', 'barre', 'kg', ['fessiers'], ['quadriceps', 'dos', 'lombaires']],

  /* --------------------------------------------------------- quadriceps */
  ['squat', 'Squat barre (nuque)', 'barre', 'kg', ['quadriceps'], ['fessiers', 'lombaires', 'abdos']],
  ['squat-avant', 'Squat avant (front squat)', 'barre', 'kg', ['quadriceps'], ['fessiers', 'abdos']],
  ['squat-gobelet', 'Squat gobelet', 'halteres', 'kg', ['quadriceps'], ['fessiers']],
  ['squat-smith', 'Squat Smith', 'machine', 'kg', ['quadriceps'], ['fessiers']],
  ['hack-squat', 'Hack squat machine', 'machine', 'kg', ['quadriceps'], ['fessiers']],
  ['pendulum-squat', 'Pendulum squat', 'machine', 'kg', ['quadriceps'], ['fessiers']],
  ['presse', 'Presse à cuisses', 'machine', 'kg', ['quadriceps'], ['fessiers', 'ischios']],
  ['presse-une-jambe', 'Presse à cuisses une jambe', 'machine', 'kg', ['quadriceps'], ['fessiers']],
  ['leg-extension', 'Leg extension', 'machine', 'kg', ['quadriceps'], []],
  ['leg-extension-uni', 'Leg extension unilatéral', 'machine', 'kg', ['quadriceps'], []],
  ['fente-avant', 'Fente avant', 'halteres', 'kg', ['quadriceps'], ['fessiers']],
  ['fente-marchee', 'Fente marchée', 'halteres', 'kg', ['quadriceps'], ['fessiers']],
  ['fente-bulgare', 'Fente bulgare', 'halteres', 'kg', ['quadriceps'], ['fessiers']],
  ['sissy-squat', 'Sissy squat', 'corps', 'bw', ['quadriceps'], []],

  /* ------------------------------------------------------------ ischios */
  ['leg-curl-allonge', 'Leg curl allongé', 'machine', 'kg', ['ischios'], ['mollets']],
  ['leg-curl-assis', 'Leg curl assis', 'machine', 'kg', ['ischios'], []],
  ['leg-curl-debout', 'Leg curl debout unilatéral', 'machine', 'kg', ['ischios'], []],
  ['sdt-roumain', 'Soulevé de terre roumain', 'barre', 'kg', ['ischios'], ['fessiers', 'lombaires']],
  ['sdt-roumain-halteres', 'Soulevé de terre roumain haltères', 'halteres', 'kg', ['ischios'], ['fessiers', 'lombaires']],
  ['sdt-jambes-tendues', 'Soulevé de terre jambes tendues', 'barre', 'kg', ['ischios'], ['lombaires']],
  ['nordic-curl', 'Nordic curl', 'corps', 'bw', ['ischios'], ['fessiers']],

  /* ------------------------------------------------------------ mollets */
  ['mollets-debout', 'Mollets debout machine', 'machine', 'kg', ['mollets'], []],
  ['mollets-barre', 'Mollets debout barre', 'barre', 'kg', ['mollets'], []],
  ['mollets-smith', 'Mollets Smith', 'machine', 'kg', ['mollets'], []],
  ['mollets-assis', 'Mollets assis machine', 'machine', 'kg', ['mollets'], []],
  ['mollets-presse', 'Mollets à la presse', 'machine', 'kg', ['mollets'], []],
  ['mollets-une-jambe', 'Mollets une jambe', 'corps', 'bw', ['mollets'], []]
];

export const LIBRARY = RAW.map(([id, name, gear, mode, primary, secondary]) =>
  ({ id, name, gear, mode, primary, secondary }));

/** Les exercices dont le muscle principal est `muscleId`. */
export function libraryFor(muscleId) {
  return LIBRARY.filter((e) => e.primary[0] === muscleId);
}

export function libraryEntry(libId) {
  return LIBRARY.find((e) => e.id === libId) || null;
}

/** Recherche sur le nom et le matériel, accents et casse ignorés. */
const plain = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function searchLibrary(query) {
  const words = plain(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return LIBRARY.filter((e) => {
    const hay = plain(`${e.name} ${GEAR[e.gear]}`);
    return words.every((w) => hay.includes(w));
  });
}

/**
 * Exercice du catalogue portant le même nom (à l'accent et à la casse près),
 * ou dont le nom contient celui cherché. Sert à proposer l'exercice du
 * catalogue plutôt que d'en créer un doublon à la main.
 */
export function findByName(name) {
  const q = plain(name).trim().replace(/\s+/g, ' ');
  if (q.length < 3) return null;
  const exact = LIBRARY.find((e) => plain(e.name).replace(/\s+/g, ' ') === q);
  if (exact) return exact;
  return LIBRARY.find((e) => {
    const n = plain(e.name).replace(/\s+/g, ' ');
    return n === q || n.includes(q) || q.includes(n);
  }) || null;
}

export function muscleLabel(id) {
  const m = MUSCLES.find((x) => x.id === id);
  return m ? m.label : id;
}
