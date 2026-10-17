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
  { id: 'epaules', label: 'Épaules', view: 'front' },
  { id: 'biceps', label: 'Biceps', view: 'front' },
  { id: 'triceps', label: 'Triceps', view: 'back' },
  { id: 'avant-bras', label: 'Avant-bras', view: 'front' },
  { id: 'abdos', label: 'Abdominaux', view: 'front' },
  { id: 'lombaires', label: 'Lombaires', view: 'back' },
  { id: 'fessiers', label: 'Fessiers', view: 'back' },
  { id: 'quadriceps', label: 'Quadriceps', view: 'front' },
  { id: 'ischios', label: 'Ischios-jambiers', view: 'back' },
  { id: 'mollets', label: 'Mollets', view: 'back' },
  // ce qui ne vise pas un muscle en particulier : renforcement, prévention,
  // travail pour un autre sport. Rangé à part plutôt que forcé dans une case.
  { id: 'prepa', label: 'Préparation physique', view: 'front' }
];

/*
 * Muscles précis, plus fins que les catégories ci-dessus. Le dos en compte
 * quatre : un tirage vertical et un rowing ne travaillent pas la même chose,
 * et ça se voit sur la silhouette. Chacun dit à quelle catégorie il appartient,
 * c'est elle qui sert à ranger les exercices.
 */
export const DETAIL = {
  trapezes: { label: 'Trapèzes', group: 'dos' },
  'grand-dorsal': { label: 'Grand dorsal', group: 'dos' },
  'grand-rond': { label: 'Grand rond', group: 'dos' },
  rhomboides: { label: 'Rhomboïdes', group: 'dos' },
  // l'intérieur de la cuisse : rangé avec les quadriceps, c'est là qu'on le
  // cherche, mais coloré à sa place sur la silhouette
  adducteurs: { label: 'Adducteurs', group: 'quadriceps' }
};

/** Catégorie d'un muscle : un muscle précis renvoie la sienne, les autres eux-mêmes. */
export function muscleGroup(id) {
  return DETAIL[id] ? DETAIL[id].group : id;
}

export const GEAR = {
  barre: 'Barre',
  halteres: 'Haltères',
  machine: 'Machine',
  poulie: 'Poulie',
  corps: 'Poids du corps',
  divers: 'Autre matériel'
};

const RAW = [
  /* ---------------------------------------------------------- pectoraux */
  ['dc-barre', 'Développé couché', 'barre', 'kg', ['pecs'], ['triceps', 'epaules']],
  ['dc-incline-barre', 'Développé incliné', 'barre', 'kg', ['pecs'], ['epaules', 'triceps']],
  ['dc-decline-barre', 'Développé décliné', 'barre', 'kg', ['pecs'], ['triceps']],
  ['dc-smith', 'Développé couché Smith', 'machine', 'kg', ['pecs'], ['triceps', 'epaules']],
  ['dc-incline-smith', 'Développé incliné Smith', 'machine', 'kg', ['pecs'], ['epaules', 'triceps']],
  ['dc-halteres', 'Développé couché haltères', 'halteres', 'kg', ['pecs'], ['triceps', 'epaules']],
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
  ['pompes-serrees', 'Pompes prise serrée', 'corps', 'bw', ['pecs', 'triceps'], ['epaules']],
  ['pompes-mains-hautes', 'Pompes mains surélevées', 'corps', 'bw', ['pecs'], ['triceps', 'epaules']],
  ['pompes-genoux', 'Pompes sur les genoux', 'corps', 'bw', ['pecs'], ['triceps', 'epaules']],
  ['pompes-archer', 'Pompes archer', 'corps', 'bw', ['pecs'], ['triceps', 'epaules', 'abdos']],
  ['pompes-sautees', 'Pompes sautées (pliométrie)', 'corps', 'bw', ['pecs'], ['triceps', 'epaules']],
  ['pompes-uni', 'Pompes unilatérales', 'corps', 'bw', ['pecs'], ['triceps', 'epaules', 'abdos']],

  /* ---------------------------------------------------------------- dos */
  ['tractions-pro', 'Tractions pronation', 'corps', 'bw', ['grand-dorsal'], ['grand-rond', 'biceps', 'avant-bras']],
  ['tractions-supi', 'Tractions supination', 'corps', 'bw', ['grand-dorsal'], ['biceps', 'grand-rond']],
  ['tractions-neutre', 'Tractions prise neutre', 'corps', 'bw', ['grand-dorsal'], ['grand-rond', 'biceps', 'avant-bras']],
  ['tractions-larges', 'Tractions prise large', 'corps', 'bw', ['grand-dorsal'], ['grand-rond', 'rhomboides', 'epaules']],
  ['tirage-vertical-pro', 'Tirage vertical pronation', 'poulie', 'kg', ['grand-dorsal'], ['grand-rond', 'biceps']],
  ['tirage-vertical-supi', 'Tirage vertical supination', 'poulie', 'kg', ['grand-dorsal'], ['biceps', 'grand-rond']],
  ['tirage-vertical-neutre', 'Tirage vertical prise neutre', 'poulie', 'kg', ['grand-dorsal'], ['grand-rond', 'biceps']],
  ['tirage-vertical-large', 'Tirage vertical prise large', 'poulie', 'kg', ['grand-dorsal'], ['grand-rond', 'rhomboides', 'epaules']],
  ['rowing-barre-pro', 'Rowing barre pronation', 'barre', 'kg', ['grand-dorsal', 'rhomboides'], ['trapezes', 'biceps', 'lombaires']],
  ['rowing-barre-supi', 'Rowing barre supination (Yates)', 'barre', 'kg', ['grand-dorsal'], ['biceps', 'rhomboides', 'lombaires']],
  ['rowing-t-bar', 'Rowing T-bar', 'barre', 'kg', ['grand-dorsal', 'rhomboides'], ['trapezes', 'biceps']],
  ['rowing-haltere', 'Rowing haltère unilatéral', 'halteres', 'kg', ['grand-dorsal'], ['rhomboides', 'grand-rond', 'biceps']],
  ['rowing-halteres-2', 'Rowing haltères deux bras', 'halteres', 'kg', ['grand-dorsal', 'rhomboides'], ['biceps', 'lombaires']],
  ['seal-row', 'Seal row (banc)', 'halteres', 'kg', ['grand-dorsal', 'rhomboides'], ['trapezes', 'biceps']],
  ['rowing-machine', 'Rowing machine', 'machine', 'kg', ['grand-dorsal', 'rhomboides'], ['trapezes', 'biceps']],
  ['tirage-horizontal', 'Tirage horizontal poulie', 'poulie', 'kg', ['grand-dorsal', 'rhomboides'], ['trapezes', 'biceps']],
  ['tirage-horizontal-large', 'Tirage horizontal prise large', 'poulie', 'kg', ['rhomboides', 'trapezes'], ['grand-dorsal', 'epaules']],
  ['rowing-inverse', 'Rowing inversé (barre basse)', 'corps', 'bw', ['grand-dorsal', 'rhomboides'], ['biceps', 'abdos']],
  ['pull-over-poulie', 'Pull over poulie haute', 'poulie', 'kg', ['grand-dorsal'], ['grand-rond', 'triceps']],
  ['pull-over-haltere', 'Pull over haltère', 'halteres', 'kg', ['grand-dorsal'], ['grand-rond', 'pecs', 'triceps']],
  ['pull-over-machine', 'Pull over machine', 'machine', 'kg', ['grand-dorsal'], ['grand-rond', 'triceps']],
  ['sdt', 'Soulevé de terre', 'barre', 'kg', ['lombaires', 'fessiers', 'ischios'], ['grand-dorsal', 'trapezes', 'quadriceps']],

  /* --------------------------------------------- dos : trapèzes et cou */
  ['shrugs-barre', 'Shrugs barre', 'barre', 'kg', ['trapezes'], ['avant-bras']],
  ['shrugs-halteres', 'Shrugs haltères', 'halteres', 'kg', ['trapezes'], ['avant-bras']],
  ['shrugs-machine', 'Shrugs machine', 'machine', 'kg', ['trapezes'], []],
  ['face-pull', 'Face pull', 'poulie', 'kg', ['trapezes', 'epaules'], ['rhomboides']],
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
  ['elev-lat-penche', 'Élévations latérales buste penché', 'halteres', 'kg', ['epaules'], ['trapezes', 'rhomboides']],
  ['elev-front-halteres', 'Élévations frontales haltères', 'halteres', 'kg', ['epaules'], ['pecs']],
  ['elev-front-barre', 'Élévations frontales barre', 'barre', 'kg', ['epaules'], []],
  ['elev-front-poulie', 'Élévations frontales poulie', 'poulie', 'kg', ['epaules'], []],
  ['oiseau-halteres', 'Oiseau haltères', 'halteres', 'kg', ['epaules'], ['rhomboides', 'trapezes']],
  ['oiseau-machine', 'Oiseau machine (reverse pec deck)', 'machine', 'kg', ['epaules'], ['rhomboides', 'trapezes']],
  ['oiseau-poulie', 'Oiseau poulie', 'poulie', 'kg', ['epaules'], ['rhomboides', 'trapezes']],

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
  ['dips', 'Dips', 'corps', 'bw', ['pecs', 'triceps'], ['epaules']],
  ['dips-machine', 'Dips machine', 'machine', 'kg', ['triceps'], ['pecs']],
  ['dips-banc', 'Dips sur banc', 'corps', 'bw', ['triceps'], ['epaules']],
  ['dev-serre', 'Développé couché prise serrée', 'barre', 'kg', ['triceps'], ['pecs', 'epaules']],
  ['barre-au-front', 'Barre au front (EZ)', 'barre', 'kg', ['triceps'], []],
  ['barre-au-front-halteres', 'Extension haltères couché', 'halteres', 'kg', ['triceps'], []],
  ['ext-corde', 'Extension poulie haute corde', 'poulie', 'kg', ['triceps'], []],
  ['ext-pushdown-barre', 'Extension poulie haute barre', 'poulie', 'kg', ['triceps'], []],
  ['ext-inverse', 'Extension poulie prise inversée', 'poulie', 'kg', ['triceps'], []],
  ['overhead-haltere', 'Extension au-dessus de la tête haltère', 'halteres', 'kg', ['triceps'], []],
  ['overhead-corde', 'Extension au-dessus de la tête corde', 'poulie', 'kg', ['triceps'], []],
  // `ext-barre` portait le nom « Extension poulie haute barre ». Ceux qui s'en
  // servaient faisaient en fait l'extension au-dessus de la tête à la barre :
  // la fiche garde son identifiant, donc leur courbe, et prend le bon nom. Le
  // pushdown à la barre repart de zéro sous `ext-pushdown-barre`.
  ['ext-barre', 'Extension au-dessus de la tête barre', 'poulie', 'kg', ['triceps'], []],
  ['ext-unilaterale', 'Extension poulie unilatérale', 'poulie', 'kg', ['triceps'], []],
  ['kickback-haltere', 'Kickback haltère', 'halteres', 'kg', ['triceps'], []],
  ['kickback-poulie', 'Kickback poulie', 'poulie', 'kg', ['triceps'], []],
  ['pompes-diamant', 'Pompes diamant', 'corps', 'bw', ['triceps'], ['pecs']],
  ['pompes-pike', 'Pompes piquées (pike)', 'corps', 'bw', ['epaules'], ['triceps']],
  ['ext-machine', 'Extension triceps machine', 'machine', 'kg', ['triceps'], []],

  /* --------------------------------------------------------- avant-bras */
  ['reverse-curl', 'Reverse curl barre EZ', 'barre', 'kg', ['avant-bras'], ['biceps']],
  ['reverse-curl-poulie', 'Reverse curl poulie basse', 'poulie', 'kg', ['avant-bras'], ['biceps']],
  ['curl-poignets', 'Curl poignets', 'barre', 'kg', ['avant-bras'], []],
  ['curl-poignets-inverse', 'Curl poignets inversé', 'barre', 'kg', ['avant-bras'], []],
  ['farmer-walk', 'Marche du fermier', 'halteres', 'kg', ['avant-bras'], ['trapezes', 'abdos']],
  ['suspension', 'Suspension à la barre', 'corps', 'bw', ['avant-bras'], ['grand-dorsal']],

  /* --------------------------------------------------------- abdominaux */
  ['crunch', 'Crunch au sol', 'corps', 'bw', ['abdos'], []],
  ['crunch-poulie', 'Crunch à la poulie', 'poulie', 'kg', ['abdos'], []],
  ['crunch-machine', 'Crunch machine', 'machine', 'kg', ['abdos'], []],
  ['releve-jambes-suspendu', 'Relevé de jambes suspendu', 'corps', 'bw', ['abdos'], ['avant-bras']],
  ['releve-jambes-chaise', 'Relevé de jambes chaise romaine', 'corps', 'bw', ['abdos'], []],
  ['releve-bassin', 'Relevé de bassin au sol', 'corps', 'bw', ['abdos'], []],
  ['gainage', 'Gainage (planche)', 'corps', 'bw', ['abdos'], ['lombaires']],
  ['gainage-lateral', 'Gainage latéral', 'corps', 'bw', ['abdos'], []],
  ['roue-abdos', 'Roue abdominale', 'corps', 'bw', ['abdos'], ['grand-dorsal']],
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
  ['sdt-sumo', 'Soulevé de terre sumo', 'barre', 'kg', ['fessiers', 'quadriceps'], ['lombaires', 'trapezes']],

  /* ------------------------------------------- quadriceps et adducteurs */
  ['adduction-machine', 'Adduction machine', 'machine', 'kg', ['adducteurs'], []],
  ['adduction-poulie', 'Adduction poulie', 'poulie', 'kg', ['adducteurs'], []],
  ['squat', 'Squat barre (nuque)', 'barre', 'kg', ['quadriceps', 'fessiers'], ['lombaires', 'abdos']],
  ['squat-avant', 'Squat avant (front squat)', 'barre', 'kg', ['quadriceps'], ['fessiers', 'abdos']],
  ['squat-gobelet', 'Squat gobelet', 'halteres', 'kg', ['quadriceps'], ['fessiers']],
  ['squat-smith', 'Squat Smith', 'machine', 'kg', ['quadriceps', 'fessiers'], []],
  ['hack-squat', 'Hack squat machine', 'machine', 'kg', ['quadriceps', 'fessiers'], []],
  ['pendulum-squat', 'Pendulum squat', 'machine', 'kg', ['quadriceps'], ['fessiers']],
  ['presse', 'Presse à cuisses', 'machine', 'kg', ['quadriceps', 'fessiers'], ['ischios']],
  ['presse-une-jambe', 'Presse à cuisses unilatérale', 'machine', 'kg', ['quadriceps'], ['fessiers']],
  ['leg-extension', 'Leg extension', 'machine', 'kg', ['quadriceps'], []],
  ['leg-extension-uni', 'Leg extension unilatéral', 'machine', 'kg', ['quadriceps'], []],
  ['fente-avant', 'Fente avant', 'halteres', 'kg', ['quadriceps', 'fessiers'], []],
  ['fente-marchee', 'Fente marchée', 'halteres', 'kg', ['quadriceps', 'fessiers'], []],
  ['fente-bulgare', 'Fente bulgare', 'halteres', 'kg', ['quadriceps', 'fessiers'], []],
  ['sissy-squat', 'Sissy squat', 'corps', 'bw', ['quadriceps'], []],

  /* ------------------------------------------------------------ ischios */
  ['leg-curl-allonge', 'Leg curl allongé', 'machine', 'kg', ['ischios'], ['mollets']],
  ['leg-curl-assis', 'Leg curl assis', 'machine', 'kg', ['ischios'], []],
  ['leg-curl-debout', 'Leg curl unilatéral', 'machine', 'kg', ['ischios'], []],
  ['sdt-roumain', 'Soulevé de terre roumain', 'barre', 'kg', ['ischios', 'fessiers'], ['lombaires']],
  ['sdt-roumain-halteres', 'Soulevé de terre roumain haltères', 'halteres', 'kg', ['ischios', 'fessiers'], ['lombaires']],
  ['sdt-roumain-uni', 'Soulevé de terre roumain unilatéral', 'halteres', 'kg', ['ischios', 'fessiers'], ['lombaires', 'abdos']],
  ['sdt-jambes-tendues', 'Soulevé de terre jambes tendues', 'barre', 'kg', ['ischios', 'fessiers'], ['lombaires']],
  ['nordic-curl', 'Nordic curl', 'corps', 'bw', ['ischios'], ['fessiers']],

  /* ------------------------------------------------------------ mollets */
  ['mollets-debout', 'Mollets debout machine', 'machine', 'kg', ['mollets'], []],
  ['mollets-barre', 'Mollets debout barre', 'barre', 'kg', ['mollets'], []],
  ['mollets-smith', 'Mollets Smith', 'machine', 'kg', ['mollets'], []],
  ['mollets-assis', 'Mollets assis machine', 'machine', 'kg', ['mollets'], []],
  ['mollets-presse', 'Mollets à la presse', 'machine', 'kg', ['mollets'], []],
  ['mollets-une-jambe', 'Mollets unilatéral', 'corps', 'bw', ['mollets'], []],

  /* ----------------------------------------------- préparation physique */
  ['renfo-pieds', 'Renforcement des pieds', 'corps', 'bw', ['prepa'], ['mollets']],
  ['medecine-ball', 'Parcours médecine ball', 'divers', 'bw', ['prepa'], ['abdos', 'quadriceps']],
  ['corde-a-sauter', 'Corde à sauter', 'divers', 'bw', ['prepa'], ['mollets']]
];

export const LIBRARY = RAW.map(([id, name, gear, mode, primary, secondary]) =>
  ({ id, name, gear, mode, primary, secondary }));

/**
 * Les exercices de cette catégorie. Un exercice vraiment polyarticulaire a
 * plusieurs muscles principaux : les dips sont dans Pectoraux et dans Triceps,
 * le soulevé de terre dans Lombaires, Fessiers et Ischios. On le trouve là où
 * on le cherche, au lieu de deviner dans quelle case il a été rangé.
 */
export function libraryFor(muscleId) {
  return LIBRARY.filter((e) => e.primary.some((m) => muscleGroup(m) === muscleId));
}

export function libraryEntry(libId) {
  return LIBRARY.find((e) => e.id === libId) || null;
}

const plain = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/*
 * Beaucoup de monde dit « bench press » ou « lat pulldown » : on traduit la
 * recherche avant de comparer, pour reconnaître l'exercice qu'il soit écrit en
 * français ou en anglais. Les expressions les plus longues passent d'abord,
 * sinon « press » mangerait « bench press ».
 */
const EN_FR = [
  ['romanian deadlift', 'souleve de terre roumain'],
  ['stiff leg deadlift', 'souleve de terre jambes tendues'],
  ['sumo deadlift', 'souleve de terre sumo'],
  ['incline bench press', 'developpe incline'], ['decline bench press', 'developpe decline'],
  ['incline press', 'developpe incline'], ['decline press', 'developpe decline'],
  ['incline dumbbell press', 'developpe incline halteres'],
  ['bench press', 'developpe couche'], ['chest press', 'developpe machine'],
  ['bench', 'developpe couche'],
  ['shoulder press', 'developpe epaules'], ['military press', 'developpe militaire'],
  ['overhead press', 'developpe militaire'], ['lat pulldown', 'tirage vertical'],
  ['pulldown', 'tirage vertical'], ['seated row', 'tirage horizontal'],
  ['cable row', 'tirage horizontal'], ['pull over', 'pull over'],
  ['pull up', 'tractions'], ['pullup', 'tractions'], ['chin up', 'tractions supination'],
  ['chinup', 'tractions supination'], ['push up', 'pompes'], ['pushup', 'pompes'],
  ['deadlift', 'souleve de terre'], ['leg press', 'presse a cuisses'],
  ['leg curl', 'leg curl'], ['leg extension', 'leg extension'],
  ['calf raise', 'mollets'], ['calf', 'mollets'],
  ['lateral raise', 'elevations laterales'], ['side raise', 'elevations laterales'],
  ['front raise', 'elevations frontales'], ['rear delt', 'oiseau'],
  ['reverse fly', 'oiseau'], ['upright row', 'rowing menton'],
  ['reverse wrist curl', 'curl poignets inverse'], ['wrist curl', 'curl poignets'],
  ['shrug', 'shrugs'], ['hammer curl', 'curl marteau'],
  ['preacher curl', 'curl pupitre'], ['concentration curl', 'curl concentre'],
  ['skullcrusher', 'barre au front'], ['triceps pushdown', 'extension poulie'],
  ['pushdown', 'extension poulie'], ['triceps extension', 'extension triceps'],
  ['overhead extension', 'extension au-dessus de la tete'],
  ['close grip', 'prise serree'], ['wide grip', 'prise large'],
  ['neutral grip', 'prise neutre'], ['reverse grip', 'prise inversee'],
  ['hip thrust', 'hip thrust'], ['glute bridge', 'pont fessier'],
  ['good morning', 'good morning'], ['back extension', 'extension lombaire'],
  ['hyperextension', 'extension lombaire'], ['ab wheel', 'roue abdominale'],
  ['leg raise', 'releve de jambes'], ['plank', 'gainage'],
  ['front squat', 'squat avant'], ['goblet squat', 'squat gobelet'],
  ['split squat', 'fente bulgare'], ['step up', 'montee sur banc'],
  ['walking lunge', 'fente marchee'], ['lunge', 'fente'],
  ['row', 'rowing'], ['fly', 'ecarte'], ['dips', 'dips'], ['dip', 'dips'],
  ['squat', 'squat'], ['curl', 'curl'], ['press', 'developpe'],
  ['barbell', 'barre'], ['dumbbell', 'halteres'], ['cable', 'poulie'],
  ['bodyweight', 'poids du corps'], ['smith machine', 'smith'],
  ['incline', 'incline'], ['decline', 'decline'], ['seated', 'assis'],
  ['standing', 'debout'], ['lying', 'couche'], ['bent over', 'penche'],
  ['single arm', 'unilateral'], ['one arm', 'unilateral'], ['single leg', 'unilateral'],
  ['chest', 'pectoraux'], ['back', 'dos'], ['shoulder', 'epaules'],
  ['biceps', 'biceps'], ['triceps', 'triceps'], ['legs', 'jambes'],
  ['glute', 'fessiers'], ['hamstring', 'ischios'], ['quad', 'quadriceps'],
  ['abs', 'abdominaux'], ['trap', 'trapezes'], ['forearm', 'avant-bras']
];

/*
 * Remplacement sur les mots entiers, jamais sur les morceaux : sinon le
 * français « presse à cuisses » contiendrait l'anglais « press ».
 */
const EN_RE = EN_FR.map(([en, fr]) => [new RegExp('\\b' + en.replace(/[-]/g, '\\-') + '\\b', 'g'), fr]);

/** Normalise et traduit : « Bench Press » et « développé couché » se rejoignent. */
function normalizeQuery(text) {
  let q = plain(text).replace(/[^a-z0-9 -]+/g, ' ').replace(/\s+/g, ' ').trim();
  for (const [re, fr] of EN_RE) q = q.replace(re, fr);
  // « pull-over » et « pull over » désignent le même mouvement : le trait
  // d'union tombe des deux côtés de la comparaison, jamais avant la traduction
  return q.replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Nom d'un exercice, normalisé de la même façon que la recherche. */
const libKey = (e) => normalizeQuery(e.name);

/*
 * Noms relevés dans de vrais comptes que la recherche ne peut pas deviner :
 * abréviations, fautes de frappe, formulations de salle. Chaque ligne dit à
 * quelle fiche le nom correspond ; elle vaut pour tous les comptes qui l'ont
 * écrit pareil, et l'exercice garde son identifiant, donc son historique.
 *
 * Pour savoir ce qu'il reste à traduire : supabase/exos-hors-catalogue.sql.
 *
 * Rien n'est deviné ici : un nom dont on n'est pas sûr reste tel quel chez la
 * personne, ce qui ne coûte qu'une fiche manquante. Le rattacher au mauvais
 * exercice, lui, renommerait le sien et lui collerait les mauvais muscles.
 */
const ALIASES = {
  'wirst curl': 'curl-poignets',
  'dips lestes': 'dips',
  'bulgarian squat': 'fente-bulgare',
  '1 leg press': 'presse-une-jambe',
  '1 leg calf raise': 'mollets-une-jambe',
  '1 leg rdl': 'sdt-roumain-uni',
  'one leg rdl': 'sdt-roumain-uni',
  'hip abduction': 'abduction-machine',
  'elevations laterales a la machine': 'elev-lat-machine',
  'seated calf raise': 'mollets-assis',
  'seating calf raise': 'mollets-assis',
  'mollets assis': 'mollets-assis',
  'mollet standing calf': 'mollets-debout',
  'mollets debout': 'mollets-debout',
  'tirage horizontal': 'tirage-horizontal',
  'decline bench': 'dc-decline-barre',
  'hip thrust': 'hip-thrust',
  squat: 'squat',
  abduction: 'abduction-machine',
  trapeze: 'shrugs-halteres',
  trapezes: 'shrugs-halteres',
  'elevantion frontale': 'elev-front-halteres',
  'elevation frontale': 'elev-front-halteres',
  'hip adduction': 'adduction-machine',
  adduction: 'adduction-machine',
  'tirage verticale': 'tirage-vertical-pro',
  'tirage vertical': 'tirage-vertical-pro',
  'pompe triceps': 'pompes-diamant',
  '1 leg leg curl': 'leg-curl-debout',
  'leg curl unilateral': 'leg-curl-debout',
  'fente sureleve': 'fente-bulgare',
  'fente surelevee': 'fente-bulgare',
  'fentes lestees support bench': 'fente-bulgare',
  'foot exercises': 'renfo-pieds',
  'parcours zchaud medecine ball': 'medecine-ball'
};

const ALIAS_MAP = new Map(
  Object.entries(ALIASES).map(([nom, id]) => [normalizeQuery(nom), id])
);

/** Recherche sur le nom et le matériel, en français comme en anglais. */
export function searchLibrary(query) {
  const words = normalizeQuery(query).split(' ').filter(Boolean);
  if (!words.length) return [];
  return LIBRARY.filter((e) => {
    const hay = libKey(e) + ' ' + normalizeQuery(GEAR[e.gear]);
    return words.every((w) => hay.includes(w));
  });
}

/**
 * Exercice du catalogue qui porte le même nom, à l'accent, à la casse et à la
 * langue près. Sert à proposer l'exercice du catalogue plutôt que d'en créer
 * un doublon à la main.
 */
export function findByName(name) {
  const key = normalizeQuery(name);
  const alias = ALIAS_MAP.get(key);
  if (alias) {
    const known = libraryEntry(alias);
    if (known) return known;
  }
  const q = new Set(key.split(' ').filter(Boolean));
  if (!q.size) return null;
  // comparaison par mots, pas par morceaux de phrase : l'anglais met le
  // qualificatif devant (« incline bench press »), le français derrière
  let best = null;
  let score = 0;
  for (const e of LIBRARY) {
    const n = new Set(libKey(e).split(' ').filter(Boolean));
    let shared = 0;
    for (const w of q) if (n.has(w)) shared += 1;
    const s = shared / Math.max(q.size, n.size);
    if (s > score) { score = s; best = e; }
  }
  return score >= 0.8 ? best : null;
}

export function muscleLabel(id) {
  if (DETAIL[id]) return DETAIL[id].label;
  const m = MUSCLES.find((x) => x.id === id);
  return m ? m.label : id;
}
