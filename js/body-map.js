/**
 * Deux silhouettes, de face et de dos, avec les muscles travaillés en couleur.
 *
 * Volontairement schématique : l'idée est de repérer d'un coup d'œil ce que
 * l'exercice fait travailler, y compris quand il fait travailler plusieurs
 * choses à la fois. Muscles principaux en accent, secondaires en teinte claire.
 *
 * Les couleurs viennent de classes CSS (.bm-*), donc elles suivent le thème.
 */

const NS = 'http://www.w3.org/2000/svg';
const FRONT = 0;   // décalage horizontal de la silhouette de face
const BACK = 68;   // et de celle de dos

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

/** Zone allumée d'un muscle, sur la silhouette qui convient. */
const ZONES = {
  pecs: (c) => [box(FRONT + 20, 28, 20, 12, 5, c)],
  epaules: (c) => [ell(FRONT + 17, 27, 6, 5.5, c), ell(FRONT + 43, 27, 6, 5.5, c)],
  biceps: (c) => [ell(FRONT + 12.5, 36, 4.5, 8, c), ell(FRONT + 47.5, 36, 4.5, 8, c)],
  'avant-bras': (c) => [ell(FRONT + 9, 59, 4, 10, c), ell(FRONT + 51, 59, 4, 10, c)],
  abdos: (c) => [box(FRONT + 25, 42, 10, 20, 4, c)],
  quadriceps: (c) => [ell(FRONT + 23.5, 84, 6.5, 14, c), ell(FRONT + 36.5, 84, 6.5, 14, c)],
  trapezes: (c) => [node('path', { class: c, d: `M${BACK + 19} 25 h22 l-5 11 h-12 Z` })],
  dos: (c) => [box(BACK + 19, 33, 22, 18, 5, c)],
  triceps: (c) => [ell(BACK + 12.5, 38, 4.5, 9, c), ell(BACK + 47.5, 38, 4.5, 9, c)],
  lombaires: (c) => [box(BACK + 23, 50, 14, 11, 4, c)],
  fessiers: (c) => [box(BACK + 19, 62, 22, 10, 4, c)],
  ischios: (c) => [ell(BACK + 23.5, 88, 6.5, 13, c), ell(BACK + 36.5, 88, 6.5, 13, c)],
  mollets: (c) => [ell(BACK + 23.5, 108, 4.5, 10, c), ell(BACK + 36.5, 108, 4.5, 10, c)]
};

/**
 * Silhouettes de face et de dos.
 * @param {string[]} primary    muscles principaux, en accent
 * @param {string[]} secondary  muscles secondaires, en teinte claire
 */
export function bodyMap(primary = [], secondary = [], { height = 64, label = '' } = {}) {
  const svg = node('svg', {
    viewBox: '0 0 128 122',
    width: Math.round((height * 128) / 122),
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
  return svg;
}
