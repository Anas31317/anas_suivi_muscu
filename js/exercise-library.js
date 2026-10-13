/**
 * Catalogue d'exercices.
 *
 * Une ligne par variante : le même mouvement à la barre, aux haltères, à la
 * machine ou à la poulie sont des exercices différents, parce qu'on ne les
 * charge pas pareil et qu'on ne les suit pas sur la même courbe. L'inclinaison
 * et l'angle des poignées sont dans le nom quand ils changent le mouvement.
 *
 * Chaque exercice dit quels muscles il travaille : `primary` (en accent sur la
 * silhouette) et `secondary` (en teinte claire). Beaucoup sont polyarticulaires,
 * d'où les deux listes.
 *
 * Pas de nombre de séries ici : c'est à chacun de le régler dans sa séance.
 *
 * Colonnes : id, nom, matériel, mode, position, prise, primaires, secondaires.
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
  ['dc-barre', 'Développé couché', 'barre', 'kg', 'Couché', 'Pronation', ['pecs'], ['triceps', 'epaules']],
  ['dc-incline-barre', 'Développé incliné', 'barre', 'kg', 'Incliné 30°', 'Pronation', ['pecs'], ['epaules', 'triceps']],
  ['dc-decline-barre', 'Développé décliné', 'barre', 'kg', 'Décliné', 'Pronation', ['pecs'], ['triceps']],
  ['dc-smith', 'Développé couché Smith', 'machine', 'kg', 'Couché', 'Pronation', ['pecs'], ['triceps', 'epaules']],
  ['dc-incline-smith', 'Développé incliné Smith', 'machine', 'kg', 'Incliné 30°', 'Pronation', ['pecs'], ['epaules', 'triceps']],
  ['dc-halteres', 'Développé couché haltères', 'halteres', 'kg', 'Couché', 'Pronation', ['pecs'], ['triceps', 'epaules']],
  ['dc-halteres-neutre', 'Développé couché haltères prise neutre', 'halteres', 'kg', 'Couché', 'Neutre', ['pecs'], ['triceps']],
  ['dc-incline-halteres', 'Développé incliné haltères', 'halteres', 'kg', 'Incliné 30°', 'Pronation', ['pecs'], ['epaules', 'triceps']],
  ['dc-decline-halteres', 'Développé décliné haltères', 'halteres', 'kg', 'Décliné', 'Pronation', ['pecs'], ['triceps']],
  ['chest-press', 'Développé machine (chest press)', 'machine', 'kg', 'Assis', 'Pronation', ['pecs'], ['triceps', 'epaules']],
  ['chest-press-incline', 'Développé incliné machine', 'machine', 'kg', 'Incliné', 'Pronation', ['pecs'], ['epaules', 'triceps']],
  ['ecarte-couche', 'Écarté haltères couché', 'halteres', 'kg', 'Couché', 'Neutre', ['pecs'], []],
  ['ecarte-incline', 'Écarté haltères incliné', 'halteres', 'kg', 'Incliné 30°', 'Neutre', ['pecs'], ['epaules']],
  ['pec-deck', 'Pec deck (butterfly)', 'machine', 'kg', 'Assis', 'Neutre', ['pecs'], []],
  ['ecarte-poulie-haute', 'Écarté poulie haute', 'poulie', 'kg', 'Debout', 'Neutre', ['pecs'], []],
  ['ecarte-poulie-basse', 'Écarté poulie basse', 'poulie', 'kg', 'Debout', 'Neutre', ['pecs'], ['epaules']],
  ['ecarte-poulie-milieu', 'Écarté poulie hauteur poitrine', 'poulie', 'kg', 'Debout', 'Neutre', ['pecs'], []],
  ['pompes', 'Pompes', 'corps', 'bw', 'Au sol', 'Pronation', ['pecs'], ['triceps', 'epaules', 'abdos']],
  ['pompes-pieds-hauts', 'Pompes pieds surélevés', 'corps', 'bw', 'Incliné', 'Pronation', ['pecs'], ['epaules', 'triceps']],
  ['pompes-larges', 'Pompes prise large', 'corps', 'bw', 'Au sol', 'Pronation', ['pecs'], ['epaules']],
  ['dips-pecs', 'Dips buste penché', 'corps', 'bw', 'Suspendu', 'Neutre', ['pecs'], ['triceps', 'epaules']],

  /* ---------------------------------------------------------------- dos */
  ['tractions-pro', 'Tractions pronation', 'corps', 'bw', 'Suspendu', 'Pronation', ['dos'], ['biceps', 'avant-bras']],
  ['tractions-supi', 'Tractions supination', 'corps', 'bw', 'Suspendu', 'Supination', ['dos'], ['biceps']],
  ['tractions-neutre', 'Tractions prise neutre', 'corps', 'bw', 'Suspendu', 'Neutre', ['dos'], ['biceps', 'avant-bras']],
  ['tractions-larges', 'Tractions prise large', 'corps', 'bw', 'Suspendu', 'Pronation', ['dos'], ['epaules']],
  ['tirage-vertical-pro', 'Tirage vertical pronation', 'poulie', 'kg', 'Assis', 'Pronation', ['dos'], ['biceps']],
  ['tirage-vertical-supi', 'Tirage vertical supination', 'poulie', 'kg', 'Assis', 'Supination', ['dos'], ['biceps']],
  ['tirage-vertical-neutre', 'Tirage vertical prise neutre', 'poulie', 'kg', 'Assis', 'Neutre', ['dos'], ['biceps']],
  ['tirage-vertical-large', 'Tirage vertical prise large', 'poulie', 'kg', 'Assis', 'Pronation', ['dos'], ['epaules', 'biceps']],
  ['rowing-barre-pro', 'Rowing barre pronation', 'barre', 'kg', 'Penché', 'Pronation', ['dos'], ['trapezes', 'biceps', 'lombaires']],
  ['rowing-barre-supi', 'Rowing barre supination (Yates)', 'barre', 'kg', 'Penché', 'Supination', ['dos'], ['biceps', 'lombaires']],
  ['rowing-t-bar', 'Rowing T-bar', 'barre', 'kg', 'Penché', 'Neutre', ['dos'], ['trapezes', 'biceps']],
  ['rowing-haltere', 'Rowing haltère un bras', 'halteres', 'kg', 'Penché', 'Neutre', ['dos'], ['biceps', 'trapezes']],
  ['rowing-halteres-2', 'Rowing haltères deux bras', 'halteres', 'kg', 'Penché', 'Neutre', ['dos'], ['biceps', 'lombaires']],
  ['seal-row', 'Seal row (banc)', 'halteres', 'kg', 'Couché', 'Neutre', ['dos'], ['biceps', 'trapezes']],
  ['rowing-machine', 'Rowing machine', 'machine', 'kg', 'Assis', 'Neutre', ['dos'], ['biceps', 'trapezes']],
  ['tirage-horizontal', 'Tirage horizontal poulie', 'poulie', 'kg', 'Assis', 'Neutre', ['dos'], ['biceps', 'trapezes']],
  ['tirage-horizontal-large', 'Tirage horizontal prise large', 'poulie', 'kg', 'Assis', 'Pronation', ['dos'], ['trapezes', 'epaules']],
  ['rowing-inverse', 'Rowing inversé (barre basse)', 'corps', 'bw', 'Suspendu', 'Pronation', ['dos'], ['biceps', 'abdos']],
  ['pull-over-poulie', 'Pull over poulie haute', 'poulie', 'kg', 'Debout', 'Pronation', ['dos'], ['triceps']],
  ['pull-over-haltere', 'Pull over haltère', 'halteres', 'kg', 'Couché', 'Neutre', ['dos'], ['pecs', 'triceps']],
  ['sdt', 'Soulevé de terre', 'barre', 'kg', 'Debout', 'Pronation', ['dos', 'lombaires'], ['fessiers', 'ischios', 'trapezes']],

  /* ----------------------------------------------------------- trapèzes */
  ['shrugs-barre', 'Shrugs barre', 'barre', 'kg', 'Debout', 'Pronation', ['trapezes'], ['avant-bras']],
  ['shrugs-halteres', 'Shrugs haltères', 'halteres', 'kg', 'Debout', 'Neutre', ['trapezes'], ['avant-bras']],
  ['shrugs-machine', 'Shrugs machine', 'machine', 'kg', 'Debout', 'Neutre', ['trapezes'], []],
  ['face-pull', 'Face pull', 'poulie', 'kg', 'Debout', 'Neutre', ['trapezes', 'epaules'], ['dos']],
  ['rowing-menton', 'Rowing menton', 'barre', 'kg', 'Debout', 'Pronation', ['trapezes', 'epaules'], ['biceps']],

  /* ------------------------------------------------------------ épaules */
  ['militaire-debout', 'Développé militaire debout', 'barre', 'kg', 'Debout', 'Pronation', ['epaules'], ['triceps', 'abdos']],
  ['militaire-assis', 'Développé militaire assis', 'barre', 'kg', 'Assis', 'Pronation', ['epaules'], ['triceps']],
  ['militaire-smith', 'Développé épaules Smith', 'machine', 'kg', 'Assis', 'Pronation', ['epaules'], ['triceps']],
  ['dev-epaules-halteres', 'Développé épaules haltères', 'halteres', 'kg', 'Assis', 'Pronation', ['epaules'], ['triceps']],
  ['dev-epaules-neutre', 'Développé épaules prise neutre', 'halteres', 'kg', 'Assis', 'Neutre', ['epaules'], ['triceps']],
  ['arnold-press', 'Arnold press', 'halteres', 'kg', 'Assis', 'Rotation', ['epaules'], ['triceps']],
  ['dev-epaules-machine', 'Développé épaules machine', 'machine', 'kg', 'Assis', 'Pronation', ['epaules'], ['triceps']],
  ['elev-lat-halteres', 'Élévations latérales haltères', 'halteres', 'kg', 'Debout', 'Neutre', ['epaules'], []],
  ['elev-lat-poulie', 'Élévation latérale poulie', 'poulie', 'kg', 'Debout', 'Neutre', ['epaules'], []],
  ['elev-lat-machine', 'Élévations latérales machine', 'machine', 'kg', 'Assis', 'Neutre', ['epaules'], []],
  ['elev-lat-penche', 'Élévations latérales buste penché', 'halteres', 'kg', 'Penché', 'Neutre', ['epaules'], ['trapezes']],
  ['elev-front-halteres', 'Élévations frontales haltères', 'halteres', 'kg', 'Debout', 'Pronation', ['epaules'], ['pecs']],
  ['elev-front-barre', 'Élévations frontales barre', 'barre', 'kg', 'Debout', 'Pronation', ['epaules'], []],
  ['elev-front-poulie', 'Élévations frontales poulie', 'poulie', 'kg', 'Debout', 'Pronation', ['epaules'], []],
  ['oiseau-halteres', 'Oiseau haltères', 'halteres', 'kg', 'Penché', 'Neutre', ['epaules'], ['trapezes', 'dos']],
  ['oiseau-machine', 'Oiseau machine (reverse pec deck)', 'machine', 'kg', 'Assis', 'Neutre', ['epaules'], ['trapezes']],
  ['oiseau-poulie', 'Oiseau poulie', 'poulie', 'kg', 'Debout', 'Neutre', ['epaules'], ['trapezes']],

  /* ------------------------------------------------------------- biceps */
  ['curl-barre', 'Curl barre droite', 'barre', 'kg', 'Debout', 'Supination', ['biceps'], ['avant-bras']],
  ['curl-ez', 'Curl barre EZ', 'barre', 'kg', 'Debout', 'Supination', ['biceps'], ['avant-bras']],
  ['curl-halteres', 'Curl haltères', 'halteres', 'kg', 'Debout', 'Supination', ['biceps'], ['avant-bras']],
  ['curl-alterne', 'Curl haltères alterné', 'halteres', 'kg', 'Debout', 'Supination', ['biceps'], ['avant-bras']],
  ['curl-marteau', 'Curl marteau', 'halteres', 'kg', 'Debout', 'Neutre', ['biceps', 'avant-bras'], []],
  ['curl-marteau-corde', 'Curl marteau à la corde', 'poulie', 'kg', 'Debout', 'Neutre', ['biceps', 'avant-bras'], []],
  ['curl-pupitre-ez', 'Curl pupitre barre EZ', 'barre', 'kg', 'Assis', 'Supination', ['biceps'], []],
  ['curl-pupitre-haltere', 'Curl pupitre haltère', 'halteres', 'kg', 'Assis', 'Supination', ['biceps'], []],
  ['curl-pupitre-machine', 'Curl pupitre machine', 'machine', 'kg', 'Assis', 'Supination', ['biceps'], []],
  ['curl-incline', 'Curl incliné haltères', 'halteres', 'kg', 'Incliné 45°', 'Supination', ['biceps'], []],
  ['curl-araignee', 'Curl araignée (spider)', 'halteres', 'kg', 'Penché', 'Supination', ['biceps'], []],
  ['curl-concentre', 'Curl concentré', 'halteres', 'kg', 'Assis', 'Supination', ['biceps'], []],
  ['curl-poulie-barre', 'Curl poulie basse barre', 'poulie', 'kg', 'Debout', 'Supination', ['biceps'], []],
  ['curl-poulie-corde', 'Curl poulie basse corde', 'poulie', 'kg', 'Debout', 'Neutre', ['biceps'], ['avant-bras']],
  ['bayesian-curl', 'Bayesian curl (poulie, bras en arrière)', 'poulie', 'kg', 'Debout', 'Supination', ['biceps'], []],
  ['drag-curl', 'Drag curl', 'barre', 'kg', 'Debout', 'Supination', ['biceps'], []],

  /* ------------------------------------------------------------ triceps */
  ['dips', 'Dips barres parallèles', 'corps', 'bw', 'Suspendu', 'Neutre', ['triceps'], ['pecs', 'epaules']],
  ['dips-machine', 'Dips machine', 'machine', 'kg', 'Assis', 'Neutre', ['triceps'], ['pecs']],
  ['dips-banc', 'Dips sur banc', 'corps', 'bw', 'Au sol', 'Pronation', ['triceps'], ['epaules']],
  ['dev-serre', 'Développé couché prise serrée', 'barre', 'kg', 'Couché', 'Pronation', ['triceps'], ['pecs', 'epaules']],
  ['barre-au-front', 'Barre au front (EZ)', 'barre', 'kg', 'Couché', 'Pronation', ['triceps'], []],
  ['barre-au-front-halteres', 'Extension haltères couché', 'halteres', 'kg', 'Couché', 'Neutre', ['triceps'], []],
  ['ext-corde', 'Extension poulie haute corde', 'poulie', 'kg', 'Debout', 'Neutre', ['triceps'], []],
  ['ext-barre', 'Extension poulie haute barre', 'poulie', 'kg', 'Debout', 'Pronation', ['triceps'], []],
  ['ext-inverse', 'Extension poulie prise inversée', 'poulie', 'kg', 'Debout', 'Supination', ['triceps'], []],
  ['overhead-haltere', 'Extension au-dessus de la tête haltère', 'halteres', 'kg', 'Assis', 'Neutre', ['triceps'], []],
  ['overhead-corde', 'Extension au-dessus de la tête corde', 'poulie', 'kg', 'Debout', 'Neutre', ['triceps'], []],
  ['ext-unilaterale', 'Extension poulie unilatérale', 'poulie', 'kg', 'Debout', 'Neutre', ['triceps'], []],
  ['kickback-haltere', 'Kickback haltère', 'halteres', 'kg', 'Penché', 'Neutre', ['triceps'], []],
  ['kickback-poulie', 'Kickback poulie', 'poulie', 'kg', 'Penché', 'Neutre', ['triceps'], []],
  ['pompes-diamant', 'Pompes diamant', 'corps', 'bw', 'Au sol', 'Pronation', ['triceps'], ['pecs']],
  ['ext-machine', 'Extension triceps machine', 'machine', 'kg', 'Assis', 'Neutre', ['triceps'], []],

  /* --------------------------------------------------------- avant-bras */
  ['reverse-curl', 'Reverse curl barre EZ', 'barre', 'kg', 'Debout', 'Pronation', ['avant-bras'], ['biceps']],
  ['curl-poignets', 'Curl poignets', 'barre', 'kg', 'Assis', 'Supination', ['avant-bras'], []],
  ['curl-poignets-inverse', 'Curl poignets inversé', 'barre', 'kg', 'Assis', 'Pronation', ['avant-bras'], []],
  ['farmer-walk', 'Marche du fermier', 'halteres', 'kg', 'Debout', 'Neutre', ['avant-bras'], ['trapezes', 'abdos']],
  ['suspension', 'Suspension à la barre', 'corps', 'bw', 'Suspendu', 'Pronation', ['avant-bras'], ['dos']],

  /* --------------------------------------------------------- abdominaux */
  ['crunch', 'Crunch au sol', 'corps', 'bw', 'Au sol', '', ['abdos'], []],
  ['crunch-poulie', 'Crunch à la poulie', 'poulie', 'kg', 'À genoux', 'Neutre', ['abdos'], []],
  ['crunch-machine', 'Crunch machine', 'machine', 'kg', 'Assis', 'Neutre', ['abdos'], []],
  ['releve-jambes-suspendu', 'Relevé de jambes suspendu', 'corps', 'bw', 'Suspendu', 'Pronation', ['abdos'], ['avant-bras']],
  ['releve-jambes-chaise', 'Relevé de jambes chaise romaine', 'corps', 'bw', 'Suspendu', 'Neutre', ['abdos'], []],
  ['releve-bassin', 'Relevé de bassin au sol', 'corps', 'bw', 'Au sol', '', ['abdos'], []],
  ['gainage', 'Gainage (planche)', 'corps', 'bw', 'Au sol', '', ['abdos'], ['lombaires']],
  ['gainage-lateral', 'Gainage latéral', 'corps', 'bw', 'Au sol', '', ['abdos'], []],
  ['roue-abdos', 'Roue abdominale', 'corps', 'bw', 'À genoux', 'Neutre', ['abdos'], ['dos']],
  ['russian-twist', 'Russian twist', 'halteres', 'kg', 'Assis', 'Neutre', ['abdos'], []],
  ['sit-up-leste', 'Sit-up lesté', 'halteres', 'kg', 'Au sol', 'Neutre', ['abdos'], []],

  /* ---------------------------------------------------------- lombaires */
  ['ext-lombaire', 'Extension lombaire (banc 45°)', 'corps', 'bw', 'Penché', '', ['lombaires'], ['fessiers', 'ischios']],
  ['ext-lombaire-machine', 'Extension lombaire machine', 'machine', 'kg', 'Assis', 'Neutre', ['lombaires'], ['fessiers']],
  ['good-morning', 'Good morning', 'barre', 'kg', 'Debout', 'Pronation', ['lombaires', 'ischios'], ['fessiers']],
  ['superman', 'Superman au sol', 'corps', 'bw', 'Au sol', '', ['lombaires'], ['fessiers']],

  /* ----------------------------------------------------------- fessiers */
  ['hip-thrust', 'Hip thrust barre', 'barre', 'kg', 'Allongé', '', ['fessiers'], ['ischios', 'quadriceps']],
  ['hip-thrust-machine', 'Hip thrust machine', 'machine', 'kg', 'Assis', '', ['fessiers'], ['ischios']],
  ['pont-fessier', 'Pont fessier au sol', 'corps', 'bw', 'Au sol', '', ['fessiers'], ['ischios']],
  ['abduction-machine', 'Abduction machine', 'machine', 'kg', 'Assis', '', ['fessiers'], []],
  ['abduction-poulie', 'Abduction poulie', 'poulie', 'kg', 'Debout', '', ['fessiers'], []],
  ['kickback-fessier', 'Kickback fessier poulie', 'poulie', 'kg', 'Debout', '', ['fessiers'], ['ischios']],
  ['step-up', 'Montée sur banc (step-up)', 'halteres', 'kg', 'Debout', 'Neutre', ['fessiers', 'quadriceps'], ['ischios']],
  ['sdt-sumo', 'Soulevé de terre sumo', 'barre', 'kg', 'Debout', 'Pronation', ['fessiers'], ['quadriceps', 'dos', 'lombaires']],

  /* --------------------------------------------------------- quadriceps */
  ['squat', 'Squat barre (nuque)', 'barre', 'kg', 'Debout', 'Pronation', ['quadriceps'], ['fessiers', 'lombaires', 'abdos']],
  ['squat-avant', 'Squat avant (front squat)', 'barre', 'kg', 'Debout', 'Neutre', ['quadriceps'], ['fessiers', 'abdos']],
  ['squat-gobelet', 'Squat gobelet', 'halteres', 'kg', 'Debout', 'Neutre', ['quadriceps'], ['fessiers']],
  ['squat-smith', 'Squat Smith', 'machine', 'kg', 'Debout', 'Pronation', ['quadriceps'], ['fessiers']],
  ['hack-squat', 'Hack squat machine', 'machine', 'kg', 'Debout', 'Neutre', ['quadriceps'], ['fessiers']],
  ['pendulum-squat', 'Pendulum squat', 'machine', 'kg', 'Debout', 'Neutre', ['quadriceps'], ['fessiers']],
  ['presse', 'Presse à cuisses', 'machine', 'kg', 'Assis', '', ['quadriceps'], ['fessiers', 'ischios']],
  ['presse-une-jambe', 'Presse à cuisses une jambe', 'machine', 'kg', 'Assis', '', ['quadriceps'], ['fessiers']],
  ['leg-extension', 'Leg extension', 'machine', 'kg', 'Assis', '', ['quadriceps'], []],
  ['leg-extension-uni', 'Leg extension unilatéral', 'machine', 'kg', 'Assis', '', ['quadriceps'], []],
  ['fente-avant', 'Fente avant', 'halteres', 'kg', 'Debout', 'Neutre', ['quadriceps'], ['fessiers']],
  ['fente-marchee', 'Fente marchée', 'halteres', 'kg', 'Debout', 'Neutre', ['quadriceps'], ['fessiers']],
  ['fente-bulgare', 'Fente bulgare', 'halteres', 'kg', 'Debout', 'Neutre', ['quadriceps'], ['fessiers']],
  ['sissy-squat', 'Sissy squat', 'corps', 'bw', 'Debout', '', ['quadriceps'], []],

  /* ------------------------------------------------------------ ischios */
  ['leg-curl-allonge', 'Leg curl allongé', 'machine', 'kg', 'Couché', '', ['ischios'], ['mollets']],
  ['leg-curl-assis', 'Leg curl assis', 'machine', 'kg', 'Assis', '', ['ischios'], []],
  ['leg-curl-debout', 'Leg curl debout unilatéral', 'machine', 'kg', 'Debout', '', ['ischios'], []],
  ['sdt-roumain', 'Soulevé de terre roumain', 'barre', 'kg', 'Debout', 'Pronation', ['ischios'], ['fessiers', 'lombaires']],
  ['sdt-roumain-halteres', 'Soulevé de terre roumain haltères', 'halteres', 'kg', 'Debout', 'Neutre', ['ischios'], ['fessiers', 'lombaires']],
  ['sdt-jambes-tendues', 'Soulevé de terre jambes tendues', 'barre', 'kg', 'Debout', 'Pronation', ['ischios'], ['lombaires']],
  ['nordic-curl', 'Nordic curl', 'corps', 'bw', 'À genoux', '', ['ischios'], ['fessiers']],

  /* ------------------------------------------------------------ mollets */
  ['mollets-debout', 'Mollets debout machine', 'machine', 'kg', 'Debout', '', ['mollets'], []],
  ['mollets-barre', 'Mollets debout barre', 'barre', 'kg', 'Debout', 'Pronation', ['mollets'], []],
  ['mollets-smith', 'Mollets Smith', 'machine', 'kg', 'Debout', 'Pronation', ['mollets'], []],
  ['mollets-assis', 'Mollets assis machine', 'machine', 'kg', 'Assis', '', ['mollets'], []],
  ['mollets-presse', 'Mollets à la presse', 'machine', 'kg', 'Assis', '', ['mollets'], []],
  ['mollets-une-jambe', 'Mollets une jambe', 'corps', 'bw', 'Debout', '', ['mollets'], []]
];

export const LIBRARY = RAW.map(([id, name, gear, mode, position, grip, primary, secondary]) =>
  ({ id, name, gear, mode, position, grip, primary, secondary }));

/** Les exercices dont le muscle principal est `muscleId`. */
export function libraryFor(muscleId) {
  return LIBRARY.filter((e) => e.primary[0] === muscleId);
}

export function libraryEntry(libId) {
  return LIBRARY.find((e) => e.id === libId) || null;
}

/** Recherche sur le nom, le matériel et la prise, accents et casse ignorés. */
const plain = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function searchLibrary(query) {
  const words = plain(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return LIBRARY.filter((e) => {
    const hay = plain(`${e.name} ${GEAR[e.gear]} ${e.position} ${e.grip}`);
    return words.every((w) => hay.includes(w));
  });
}

export function muscleLabel(id) {
  const m = MUSCLES.find((x) => x.id === id);
  return m ? m.label : id;
}
