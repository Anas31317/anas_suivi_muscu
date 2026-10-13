/**
 * Catalogue d'exercices, par muscle.
 *
 * Sert à remplir un programme sans tout saisir à la main. Ajouter un exercice
 * depuis ce catalogue crée un exercice normal dans la séance : il garde son
 * propre identifiant, donc son historique et sa courbe lui appartiennent.
 * `libId` est conservé pour retrouver le muscle et le matériel à l'affichage.
 *
 * `mode` : 'kg' (charge saisie) ou 'bw' (poids du corps, lest éventuel).
 * `gear` : barre | halteres | machine | poulie | corps.
 */

export const MUSCLES = [
  { id: 'pecs', label: 'Pectoraux', view: 'front' },
  { id: 'dos', label: 'Dos', view: 'back' },
  { id: 'epaules', label: 'Épaules', view: 'front' },
  { id: 'biceps', label: 'Biceps', view: 'front' },
  { id: 'triceps', label: 'Triceps', view: 'back' },
  { id: 'avant-bras', label: 'Avant-bras', view: 'front' },
  { id: 'quadriceps', label: 'Quadriceps', view: 'front' },
  { id: 'ischios', label: 'Ischios-jambiers', view: 'back' },
  { id: 'fessiers', label: 'Fessiers', view: 'back' },
  { id: 'mollets', label: 'Mollets', view: 'back' },
  { id: 'abdos', label: 'Abdominaux', view: 'front' }
];

export const GEAR = {
  barre: 'Barre',
  halteres: 'Haltères',
  machine: 'Machine',
  poulie: 'Poulie',
  corps: 'Poids du corps'
};

export const LIBRARY = [
  /* ---------------------------------------------------------- pectoraux */
  { id: 'dev-couche', name: 'Développé couché', muscle: 'pecs', gear: 'barre', mode: 'kg', sets: 4,
    tip: 'Omoplates serrées, barre au niveau des tétons, pieds ancrés au sol.' },
  { id: 'dev-incline', name: 'Développé incliné', muscle: 'pecs', gear: 'barre', mode: 'kg', sets: 4,
    tip: 'Banc à 30° : plus haut, les épaules travaillent à la place des pecs.' },
  { id: 'dev-couche-halteres', name: 'Développé couché haltères', muscle: 'pecs', gear: 'halteres', mode: 'kg', sets: 4,
    tip: 'Amplitude plus grande qu’à la barre, descends jusqu’à sentir l’étirement.' },
  { id: 'dev-incline-halteres', name: 'Développé incliné haltères', muscle: 'pecs', gear: 'halteres', mode: 'kg', sets: 3 },
  { id: 'dev-decline', name: 'Développé décliné', muscle: 'pecs', gear: 'barre', mode: 'kg', sets: 3,
    tip: 'Cible le bas des pectoraux.' },
  { id: 'pec-fly', name: 'Pec fly (machine)', muscle: 'pecs', gear: 'machine', mode: 'kg', sets: 3,
    tip: 'Coudes légèrement fléchis, serre une seconde en fin de mouvement.' },
  { id: 'ecarte-halteres', name: 'Écarté haltères', muscle: 'pecs', gear: 'halteres', mode: 'kg', sets: 3,
    tip: 'Charge légère : c’est l’étirement qui compte, pas le poids.' },
  { id: 'ecarte-poulie', name: 'Écarté à la poulie', muscle: 'pecs', gear: 'poulie', mode: 'kg', sets: 3 },
  { id: 'dev-machine', name: 'Développé machine (chest press)', muscle: 'pecs', gear: 'machine', mode: 'kg', sets: 3 },
  { id: 'pompes', name: 'Pompes', muscle: 'pecs', gear: 'corps', mode: 'bw', sets: 3,
    tip: 'Corps gainé, coudes à 45° du buste.' },
  { id: 'dips-pecs', name: 'Dips buste penché', muscle: 'pecs', gear: 'corps', mode: 'bw', sets: 3,
    tip: 'Penche le buste en avant pour envoyer le travail sur les pectoraux.' },

  /* ---------------------------------------------------------------- dos */
  { id: 'tractions', name: 'Tractions (pronation)', muscle: 'dos', gear: 'corps', mode: 'bw', sets: 4,
    tip: 'Mains un peu plus larges que les épaules, monte le menton au-dessus de la barre.' },
  { id: 'tractions-supination', name: 'Tractions supination', muscle: 'dos', gear: 'corps', mode: 'bw', sets: 3,
    tip: 'Paumes vers toi : les biceps aident, tu montes plus de reps.' },
  { id: 'tirage-vertical', name: 'Tirage vertical (lat pulldown)', muscle: 'dos', gear: 'poulie', mode: 'kg', sets: 4,
    tip: 'Tire avec les coudes, pas avec les mains ; poitrine sortie.' },
  { id: 'rowing-barre', name: 'Rowing barre', muscle: 'dos', gear: 'barre', mode: 'kg', sets: 4,
    tip: 'Dos plat, buste à 45°, barre vers le nombril.' },
  { id: 'rowing-halteres', name: 'Rowing haltère un bras', muscle: 'dos', gear: 'halteres', mode: 'kg', sets: 3 },
  { id: 'rowing-machine', name: 'Rowing machine (tirage horizontal)', muscle: 'dos', gear: 'machine', mode: 'kg', sets: 3 },
  { id: 'tirage-horizontal', name: 'Tirage horizontal poulie basse', muscle: 'dos', gear: 'poulie', mode: 'kg', sets: 3 },
  { id: 'pull-over', name: 'Pull over', muscle: 'dos', gear: 'poulie', mode: 'kg', sets: 3,
    tip: 'Bras tendus, le mouvement part des épaules : grand dorsal isolé.' },
  { id: 'souleve-de-terre', name: 'Soulevé de terre', muscle: 'dos', gear: 'barre', mode: 'kg', sets: 4,
    tip: 'Dos neutre du début à la fin. Charge lourde, technique d’abord.' },
  { id: 'shrugs', name: 'Shrugs (trapèzes)', muscle: 'dos', gear: 'halteres', mode: 'kg', sets: 3,
    tip: 'Monte les épaules vers les oreilles, sans rouler.' },
  { id: 'face-pull', name: 'Face pull', muscle: 'dos', gear: 'poulie', mode: 'kg', sets: 3,
    tip: 'Excellent pour les épaules en bonne santé et la posture.' },

  /* ------------------------------------------------------------ épaules */
  { id: 'dev-militaire', name: 'Développé militaire', muscle: 'epaules', gear: 'barre', mode: 'kg', sets: 4,
    tip: 'Debout ou assis, gaine le ventre pour ne pas cambrer.' },
  { id: 'dev-epaules-halteres', name: 'Développé épaules haltères', muscle: 'epaules', gear: 'halteres', mode: 'kg', sets: 4 },
  { id: 'dev-smith', name: 'Développé épaules Smith', muscle: 'epaules', gear: 'machine', mode: 'kg', sets: 3 },
  { id: 'elevations-laterales', name: 'Élévations latérales', muscle: 'epaules', gear: 'halteres', mode: 'kg', sets: 4,
    tip: 'Léger, contrôlé, jusqu’à l’horizontale. Inutile de balancer.' },
  { id: 'elevations-poulie', name: 'Élévation latérale poulie', muscle: 'epaules', gear: 'poulie', mode: 'kg', sets: 3 },
  { id: 'oiseau', name: 'Oiseau (deltoïde postérieur)', muscle: 'epaules', gear: 'halteres', mode: 'kg', sets: 3,
    tip: 'Buste penché, serre les omoplates en fin de mouvement.' },
  { id: 'oiseau-poulie', name: 'Tirage oiseau poulie', muscle: 'epaules', gear: 'poulie', mode: 'kg', sets: 3 },
  { id: 'elevations-frontales', name: 'Élévations frontales', muscle: 'epaules', gear: 'halteres', mode: 'kg', sets: 3 },
  { id: 'rowing-menton', name: 'Rowing menton', muscle: 'epaules', gear: 'barre', mode: 'kg', sets: 3 },

  /* ------------------------------------------------------------- biceps */
  { id: 'curl-barre', name: 'Curl barre', muscle: 'biceps', gear: 'barre', mode: 'kg', sets: 4,
    tip: 'Coudes collés au corps, pas d’élan avec le dos.' },
  { id: 'curl-halteres', name: 'Curl haltères', muscle: 'biceps', gear: 'halteres', mode: 'kg', sets: 3 },
  { id: 'curl-pupitre', name: 'Curl pupitre (EZ)', muscle: 'biceps', gear: 'barre', mode: 'kg', sets: 3,
    tip: 'Le pupitre empêche de tricher : amplitude complète, descente contrôlée.' },
  { id: 'curl-incline', name: 'Curl incliné', muscle: 'biceps', gear: 'halteres', mode: 'kg', sets: 3,
    tip: 'Bras en arrière du corps : la longue portion travaille à fond.' },
  { id: 'curl-marteau', name: 'Curl marteau', muscle: 'biceps', gear: 'halteres', mode: 'kg', sets: 3,
    tip: 'Prise neutre : biceps et brachial, utile pour épaissir le bras.' },
  { id: 'curl-poulie', name: 'Curl à la poulie basse', muscle: 'biceps', gear: 'poulie', mode: 'kg', sets: 3 },
  { id: 'bayesian-curl', name: 'Bayesian curl', muscle: 'biceps', gear: 'poulie', mode: 'kg', sets: 3,
    tip: 'Dos à la poulie, bras en arrière : étirement maximal.' },
  { id: 'curl-concentre', name: 'Curl concentré', muscle: 'biceps', gear: 'halteres', mode: 'kg', sets: 3 },

  /* ------------------------------------------------------------ triceps */
  { id: 'dips', name: 'Dips', muscle: 'triceps', gear: 'corps', mode: 'bw', sets: 4,
    tip: 'Buste droit pour cibler les triceps. Ajoute une ceinture lestée quand c’est facile.' },
  { id: 'barre-au-front', name: 'Barre au front', muscle: 'triceps', gear: 'barre', mode: 'kg', sets: 3,
    tip: 'Coudes fixes, seul l’avant-bras bouge.' },
  { id: 'ext-poulie-corde', name: 'Extension poulie corde', muscle: 'triceps', gear: 'poulie', mode: 'kg', sets: 3,
    tip: 'Écarte la corde en fin de mouvement.' },
  { id: 'ext-poulie-barre', name: 'Extension poulie barre', muscle: 'triceps', gear: 'poulie', mode: 'kg', sets: 3 },
  { id: 'overhead-triceps', name: 'Extension au-dessus de la tête', muscle: 'triceps', gear: 'halteres', mode: 'kg', sets: 3,
    tip: 'Bras au-dessus de la tête : la longue portion est étirée, c’est là qu’elle grossit.' },
  { id: 'kickback', name: 'Kickback', muscle: 'triceps', gear: 'halteres', mode: 'kg', sets: 3 },
  { id: 'dev-serre', name: 'Développé couché prise serrée', muscle: 'triceps', gear: 'barre', mode: 'kg', sets: 3 },
  { id: 'dips-machine', name: 'Dips machine', muscle: 'triceps', gear: 'machine', mode: 'kg', sets: 3 },

  /* -------------------------------------------------------- avant-bras */
  { id: 'reverse-curl', name: 'Reverse curl', muscle: 'avant-bras', gear: 'barre', mode: 'kg', sets: 3,
    tip: 'Prise pronation : avant-bras et brachio-radial.' },
  { id: 'curl-poignets', name: 'Curl poignets', muscle: 'avant-bras', gear: 'barre', mode: 'kg', sets: 3 },
  { id: 'farmer-walk', name: 'Marche du fermier', muscle: 'avant-bras', gear: 'halteres', mode: 'kg', sets: 3,
    tip: 'Lourd, sur une distance ou un temps. Note la durée en note de série.' },
  { id: 'suspension-barre', name: 'Suspension à la barre', muscle: 'avant-bras', gear: 'corps', mode: 'bw', sets: 3 },

  /* -------------------------------------------------------- quadriceps */
  { id: 'squat', name: 'Squat', muscle: 'quadriceps', gear: 'barre', mode: 'kg', sets: 4,
    tip: 'Descends au moins jusqu’à la cuisse parallèle, genoux dans l’axe des pieds.' },
  { id: 'squat-avant', name: 'Squat avant (front squat)', muscle: 'quadriceps', gear: 'barre', mode: 'kg', sets: 3,
    tip: 'Barre devant : buste plus droit, quadriceps davantage sollicités.' },
  { id: 'presse', name: 'Presse à cuisses', muscle: 'quadriceps', gear: 'machine', mode: 'kg', sets: 4 },
  { id: 'hack-squat', name: 'Hack squat', muscle: 'quadriceps', gear: 'machine', mode: 'kg', sets: 3 },
  { id: 'pendulum-squat', name: 'Pendulum squat', muscle: 'quadriceps', gear: 'machine', mode: 'kg', sets: 3 },
  { id: 'leg-extension', name: 'Leg extension', muscle: 'quadriceps', gear: 'machine', mode: 'kg', sets: 3,
    tip: 'Marque un temps d’arrêt en haut.' },
  { id: 'fentes', name: 'Fentes', muscle: 'quadriceps', gear: 'halteres', mode: 'kg', sets: 3 },
  { id: 'bulgarian-split', name: 'Fente bulgare', muscle: 'quadriceps', gear: 'halteres', mode: 'kg', sets: 3,
    tip: 'Pied arrière surélevé : dur, mais redoutable.' },

  /* ------------------------------------------------------------ ischios */
  { id: 'leg-curl-allonge', name: 'Leg curl allongé', muscle: 'ischios', gear: 'machine', mode: 'kg', sets: 3 },
  { id: 'leg-curl-assis', name: 'Leg curl assis', muscle: 'ischios', gear: 'machine', mode: 'kg', sets: 3 },
  { id: 'souleve-roumain', name: 'Soulevé de terre roumain', muscle: 'ischios', gear: 'barre', mode: 'kg', sets: 4,
    tip: 'Jambes presque tendues, pousse les fesses en arrière, dos plat.' },
  { id: 'good-morning', name: 'Good morning', muscle: 'ischios', gear: 'barre', mode: 'kg', sets: 3 },
  { id: 'nordic-curl', name: 'Nordic curl', muscle: 'ischios', gear: 'corps', mode: 'bw', sets: 3,
    tip: 'Très dur : freine la descente le plus longtemps possible.' },

  /* ---------------------------------------------------------- fessiers */
  { id: 'hip-thrust', name: 'Hip thrust', muscle: 'fessiers', gear: 'barre', mode: 'kg', sets: 4,
    tip: 'Serre les fessiers en haut, menton rentré.' },
  { id: 'abduction', name: 'Abduction machine', muscle: 'fessiers', gear: 'machine', mode: 'kg', sets: 3 },
  { id: 'kickback-poulie', name: 'Kickback fessier poulie', muscle: 'fessiers', gear: 'poulie', mode: 'kg', sets: 3 },
  { id: 'souleve-sumo', name: 'Soulevé de terre sumo', muscle: 'fessiers', gear: 'barre', mode: 'kg', sets: 3 },
  { id: 'step-up', name: 'Montée sur banc (step up)', muscle: 'fessiers', gear: 'halteres', mode: 'kg', sets: 3 },

  /* ----------------------------------------------------------- mollets */
  { id: 'mollets-debout', name: 'Mollets debout', muscle: 'mollets', gear: 'machine', mode: 'kg', sets: 4,
    tip: 'Amplitude complète : talon bas, puis pointe au maximum.' },
  { id: 'mollets-assis', name: 'Mollets assis', muscle: 'mollets', gear: 'machine', mode: 'kg', sets: 3,
    tip: 'Genou plié : cible le soléaire, sous le mollet.' },
  { id: 'mollets-presse', name: 'Mollets à la presse', muscle: 'mollets', gear: 'machine', mode: 'kg', sets: 3 },
  { id: 'mollets-une-jambe', name: 'Mollets une jambe', muscle: 'mollets', gear: 'corps', mode: 'bw', sets: 3 },

  /* -------------------------------------------------------- abdominaux */
  { id: 'gainage', name: 'Gainage (planche)', muscle: 'abdos', gear: 'corps', mode: 'bw', sets: 3,
    tip: 'Note la durée en secondes à la place des reps.' },
  { id: 'crunch', name: 'Crunch', muscle: 'abdos', gear: 'corps', mode: 'bw', sets: 3 },
  { id: 'crunch-poulie', name: 'Crunch à la poulie', muscle: 'abdos', gear: 'poulie', mode: 'kg', sets: 3 },
  { id: 'releve-jambes', name: 'Relevé de jambes suspendu', muscle: 'abdos', gear: 'corps', mode: 'bw', sets: 3,
    tip: 'Sans balancer : contrôle la descente.' },
  { id: 'roue-abdos', name: 'Roue abdominale', muscle: 'abdos', gear: 'corps', mode: 'bw', sets: 3 },
  { id: 'russian-twist', name: 'Russian twist', muscle: 'abdos', gear: 'halteres', mode: 'kg', sets: 3 },
  { id: 'relevé-bassin', name: 'Relevé de bassin', muscle: 'abdos', gear: 'corps', mode: 'bw', sets: 3 }
];

/** Les exercices d'un muscle, dans l'ordre du catalogue. */
export function libraryFor(muscleId) {
  return LIBRARY.filter((e) => e.muscle === muscleId);
}

export function libraryEntry(libId) {
  return LIBRARY.find((e) => e.id === libId) || null;
}
