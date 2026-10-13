/**
 * Petite silhouette avec le muscle travaillé en surbrillance.
 *
 * Volontairement schématique : l'idée est de repérer d'un coup d'œil la zone
 * travaillée, pas de faire une planche d'anatomie. La même silhouette sert de
 * face et de dos ; seule la zone allumée change, et `MUSCLES[].view` dit de
 * quel côté on regarde.
 *
 * Les couleurs viennent de classes CSS (.bm-*), donc elles suivent le thème.
 */

const NS = 'http://www.w3.org/2000/svg';

function node(name, attrs) {
  const el = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

const ell = (cx, cy, rx, ry, cls) => node('ellipse', { cx, cy, rx, ry, class: cls });
const box = (x, y, w, h, r, cls) => node('rect', { x, y, width: w, height: h, rx: r, class: cls });

/** Corps gris : tête, buste, bras, jambes. */
function silhouette() {
  return [
    ell(30, 11, 8, 8.5, 'bm-body'),
    box(26, 18, 8, 6, 2, 'bm-body'),
    node('path', { class: 'bm-body', d: 'M17 24 h26 l3 16 l-4 24 h-22 l-4 -24 Z' }),
    ell(12.5, 38, 4.5, 12, 'bm-body'), ell(47.5, 38, 4.5, 12, 'bm-body'),
    ell(9, 59, 4, 11, 'bm-body'), ell(51, 59, 4, 11, 'bm-body'),
    box(19, 62, 22, 10, 4, 'bm-body'),
    ell(23.5, 86, 7, 16, 'bm-body'), ell(36.5, 86, 7, 16, 'bm-body'),
    ell(23.5, 108, 5, 11, 'bm-body'), ell(36.5, 108, 5, 11, 'bm-body')
  ];
}

/** Zones allumées, par muscle. */
const ZONES = {
  pecs: () => [box(20, 28, 20, 12, 5, 'bm-on')],
  epaules: () => [ell(17, 27, 6, 5.5, 'bm-on'), ell(43, 27, 6, 5.5, 'bm-on')],
  biceps: () => [ell(12.5, 36, 4.5, 8, 'bm-on'), ell(47.5, 36, 4.5, 8, 'bm-on')],
  triceps: () => [ell(12.5, 38, 4.5, 9, 'bm-on'), ell(47.5, 38, 4.5, 9, 'bm-on')],
  'avant-bras': () => [ell(9, 59, 4, 10, 'bm-on'), ell(51, 59, 4, 10, 'bm-on')],
  dos: () => [box(19, 27, 22, 24, 6, 'bm-on')],
  abdos: () => [box(25, 42, 10, 20, 4, 'bm-on')],
  fessiers: () => [box(19, 62, 22, 10, 4, 'bm-on')],
  quadriceps: () => [ell(23.5, 84, 6.5, 14, 'bm-on'), ell(36.5, 84, 6.5, 14, 'bm-on')],
  ischios: () => [ell(23.5, 88, 6.5, 13, 'bm-on'), ell(36.5, 88, 6.5, 13, 'bm-on')],
  mollets: () => [ell(23.5, 108, 4.5, 10, 'bm-on'), ell(36.5, 108, 4.5, 10, 'bm-on')]
};

/** Silhouette de `height` pixels avec le muscle `muscleId` en surbrillance. */
export function bodyMap(muscleId, { height = 76 } = {}) {
  const svg = node('svg', {
    viewBox: '0 0 60 122',
    width: Math.round((height * 60) / 122),
    height,
    class: 'body-map',
    'aria-hidden': 'true',
    focusable: 'false'
  });
  for (const part of silhouette()) svg.append(part);
  const zone = ZONES[muscleId];
  if (zone) for (const part of zone()) svg.append(part);
  return svg;
}
