/**
 * Deux silhouettes, de face et de dos, avec les muscles travaillés en couleur.
 *
 * Volontairement schématique : l'idée est de repérer d'un coup d'œil ce que
 * l'exercice fait travailler, y compris quand il en fait travailler plusieurs
 * à la fois. Muscles principaux en accent, secondaires en teinte claire.
 *
 * Les deux vues se distinguent sans lire : celle de face a un visage, celle de
 * dos a la colonne et les omoplates. À partir d'une certaine taille, elles
 * portent aussi leur étiquette.
 *
 * Les couleurs viennent de classes CSS (.bm-*), donc elles suivent le thème.
 */

const NS = 'http://www.w3.org/2000/svg';
const FRONT = 0;    // décalage horizontal de la silhouette de face
const BACK = 68;    // et de celle de dos
const LABEL_FROM = 68;  // hauteur à partir de laquelle on écrit « Face » et « Dos »

function node(name, attrs) {
  const el = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

const ell = (cx, cy, rx, ry, cls) => node('ellipse', { cx, cy, rx, ry, class: cls });
const box = (x, y, w, h, r, cls) => node('rect', { x, y, width: w, height: h, rx: r, class: cls });

/** Corps gris : tête, buste, bras, jambes. */
function figure(dx) {
  return [
    ell(dx + 30, 11, 8, 8.5, 'bm-body'),
    box(dx + 26, 18, 8, 6, 2, 'bm-body'),
    node('path', { class: 'bm-body', d: `M${dx + 17} 24 h26 l3 16 l-4 24 h-22 l-4 -24 Z` }),
    ell(dx + 12.5, 38, 4.5, 12, 'bm-body'), ell(dx + 47.5, 38, 4.5, 12, 'bm-body'),
    ell(dx + 9, 59, 4, 11, 'bm-body'), ell(dx + 51, 59, 4, 11, 'bm-body'),
    box(dx + 19, 62, 22, 10, 4, 'bm-body'),
    ell(dx + 23.5, 86, 7, 16, 'bm-body'), ell(dx + 36.5, 86, 7, 16, 'bm-body'),
    ell(dx + 23.5, 108, 5, 11, 'bm-body'), ell(dx + 36.5, 108, 5, 11, 'bm-body')
  ];
}

/** Le visage : deux yeux suffisent à dire « on le voit de face ». */
function faceMarks() {
  return [
    ell(FRONT + 27, 10, 1.2, 1.4, 'bm-trait'),
    ell(FRONT + 33, 10, 1.2, 1.4, 'bm-trait')
  ];
}

/** De dos : la colonne et les omoplates. */
function backMarks() {
  return [
    box(BACK + 29.2, 26, 1.6, 36, 0.8, 'bm-trait'),
    node('path', { class: 'bm-trait-line', d: `M${BACK + 22} 29 l5 7` }),
    node('path', { class: 'bm-trait-line', d: `M${BACK + 38} 29 l-5 7` })
  ];
}

/** Zone allumée d'un muscle, sur la silhouette qui convient. */
const ZONES = {
  pecs: (c) => [box(FRONT + 20, 28, 20, 12, 5, c)],
  epaules: (c) => [ell(FRONT + 17, 27, 6, 5.5, c), ell(FRONT + 43, 27, 6, 5.5, c)],
  biceps: (c) => [ell(FRONT + 12.5, 36, 4.5, 8, c), ell(FRONT + 47.5, 36, 4.5, 8, c)],
  'avant-bras': (c) => [ell(FRONT + 9, 59, 4, 10, c), ell(FRONT + 51, 59, 4, 10, c)],
  abdos: (c) => [box(FRONT + 25, 42, 10, 20, 4, c)],
  quadriceps: (c) => [ell(FRONT + 23.5, 84, 6.5, 14, c), ell(FRONT + 36.5, 84, 6.5, 14, c)],
  /*
   * Le dos en quatre zones : un tirage vertical n'allume pas les mêmes que des
   * shrugs. Elles ne se chevauchent pas, pour qu'on puisse en éclairer
   * plusieurs à la fois sans bouillie.
   */
  trapezes: (c) => [node('path', { class: c, d: `M${BACK + 19} 25 h22 l-3 11 h-16 Z` })],
  'grand-rond': (c) => [ell(BACK + 21, 39, 3, 3.2, c), ell(BACK + 39, 39, 3, 3.2, c)],
  rhomboides: (c) => [box(BACK + 26.5, 37, 7, 9, 2, c)],
  'grand-dorsal': (c) => [
    node('path', { class: c, d: `M${BACK + 18.5} 43 h5.5 l1.5 13 h-5.5 Z` }),
    node('path', { class: c, d: `M${BACK + 41.5} 43 h-5.5 l-1.5 13 h5.5 Z` })
  ],
  // le dos en bloc : seulement si un exercice reste rangé en « dos » sans détail
  dos: (c) => [node('path', { class: c, d: `M${BACK + 19} 25 h22 l1 10 l-2 16 h-20 l-2 -16 Z` })],
  triceps: (c) => [ell(BACK + 12.5, 38, 4.5, 9, c), ell(BACK + 47.5, 38, 4.5, 9, c)],
  lombaires: (c) => [box(BACK + 26, 52, 8, 9, 3, c)],
  fessiers: (c) => [box(BACK + 19, 62, 22, 10, 4, c)],
  ischios: (c) => [ell(BACK + 23.5, 88, 6.5, 13, c), ell(BACK + 36.5, 88, 6.5, 13, c)],
  mollets: (c) => [ell(BACK + 23.5, 108, 4.5, 10, c), ell(BACK + 36.5, 108, 4.5, 10, c)]
};

function caption(dx, text) {
  const el = node('text', { x: dx + 30, y: 131, class: 'bm-label', 'text-anchor': 'middle' });
  el.textContent = text;
  return el;
}

/**
 * Silhouettes de face et de dos.
 * @param {string[]} primary    muscles principaux, en accent
 * @param {string[]} secondary  muscles secondaires, en teinte claire
 */
export function bodyMap(primary = [], secondary = [], { height = 64, label = '' } = {}) {
  const withLabels = height >= LABEL_FROM;
  const vbHeight = withLabels ? 136 : 124;
  const svg = node('svg', {
    viewBox: `0 0 128 ${vbHeight}`,
    width: Math.round((height * 128) / vbHeight),
    height,
    class: 'body-map',
    role: 'img'
  });
  const title = node('title', {});
  title.textContent = label || 'Muscles travaillés';
  svg.append(title);

  for (const part of figure(FRONT)) svg.append(part);
  for (const part of figure(BACK)) svg.append(part);

  // secondaires d'abord : un muscle à la fois principal et secondaire reste en accent
  for (const id of secondary) {
    const zone = ZONES[id];
    if (zone) for (const part of zone('bm-second')) svg.append(part);
  }
  for (const id of primary) {
    const zone = ZONES[id];
    if (zone) for (const part of zone('bm-on')) svg.append(part);
  }

  // repères de vue par-dessus les zones, pour rester lisibles
  for (const part of faceMarks()) svg.append(part);
  for (const part of backMarks()) svg.append(part);

  if (withLabels) {
    svg.append(caption(FRONT, 'Face'));
    svg.append(caption(BACK, 'Dos'));
  }
  return svg;
}
