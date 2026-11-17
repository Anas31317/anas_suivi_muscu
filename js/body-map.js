/**
 * Deux silhouettes, de face et de dos, avec les muscles travaillés en couleur.
 *
 * Chaque muscle a sa vraie forme, découpée en segments (trois faisceaux du
 * deltoïde, carreaux des abdominaux, chefs du quadriceps…). Au repos, ils se
 * devinent en gris sur le corps ; les muscles principaux de l'exercice passent en
 * accent, les secondaires en teinte claire.
 *
 * Les formes sont dessinées pour la moitié gauche d'une silhouette de 60 de large,
 * puis reprises en miroir : les deux côtés sont symétriques par construction.
 * Les deux vues se distinguent sans lire : le visage d'un côté, la colonne de
 * l'autre ; à partir d'une certaine taille, elles portent aussi leur étiquette.
 *
 * Les couleurs viennent de classes CSS (.bm-*), donc elles suivent le thème.
 */

const NS = 'http://www.w3.org/2000/svg';
const W = 60;            // largeur d'une silhouette ; l'axe de symétrie est à W / 2
const FRONT = 0;         // décalage horizontal de la silhouette de face
const BACK = 68;         // et de celle de dos
const LABEL_FROM = 68;   // hauteur à partir de laquelle on écrit « Face » et « Dos »
const MIRROR = `matrix(-1 0 0 1 ${W} 0)`;

function node(name, attrs) {
  const el = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

/** Rectangle arrondi, en chemin (pour les carreaux des abdominaux). */
const rr = (x, y, w, h, r) =>
  `M${x + r} ${y}h${w - 2 * r}q${r} 0 ${r} ${r}v${h - 2 * r}q0 ${r} -${r} ${r}h-${w - 2 * r}q-${r} 0 -${r} -${r}v-${h - 2 * r}q0 -${r} ${r} -${r}Z`;

/* ------------------------------------------------------------- le corps */

/** Moitié gauche du corps : buste, bras, avant-bras, cuisse, jambe, pied. */
const BODY_HALF = [
  // buste, du cou à la hanche
  'M30 19.5L25.5 20C21.5 21 17.5 22.2 15.2 24.2C13.2 26 13.2 29.4 14.6 32.4L17.2 38C18.6 44 20 50 20.4 55C20.6 58.4 19.4 61.4 18.8 64.4L19.2 69L30 70Z',
  // bras
  'M15.2 24C11.2 25.2 9.8 30 9.8 36C9.8 41.6 10.3 45.8 10.9 49.4L16.2 49.4C16.8 45 17.8 40.4 17.8 35.8L16.8 27.6Z',
  // avant-bras
  'M10.9 48.6C9 53.4 7.6 60 8 67.6L12.2 67.8C13.2 61 15.4 54.6 16.2 48.6Z',
  // cuisse : l'intérieur s'arrête juste avant l'axe, pour séparer les jambes
  'M18.9 63.6C17.4 71.6 17.9 82 20 92.6L28.6 92.6C29.4 84.4 29.6 75 29.5 66Z',
  // jambe
  'M20.1 92C18.8 98.2 19.3 106.4 21.3 114.2L26.8 114.2C28.3 106.4 29 99 28.6 92Z'
];

function figure() {
  const parts = [
    node('ellipse', { cx: W / 2, cy: 9.6, rx: 6, ry: 7.2, class: 'bm-body' }),
    node('path', { d: 'M26.6 15h6.8v6h-6.8Z', class: 'bm-body' })
  ];
  for (const d of BODY_HALF) {
    parts.push(node('path', { d, class: 'bm-body' }));
    parts.push(node('path', { d, class: 'bm-body', transform: MIRROR }));
  }
  for (const t of [null, MIRROR]) {
    const hand = node('ellipse', { cx: 10, cy: 71, rx: 2.5, ry: 3.8, class: 'bm-body' });
    const foot = node('ellipse', { cx: 24, cy: 117, rx: 4.4, ry: 2.6, class: 'bm-body' });
    if (t) { hand.setAttribute('transform', t); foot.setAttribute('transform', t); }
    parts.push(hand, foot);
  }
  return parts;
}

/* ------------------------------------------------------------ les muscles */

/*
 * Formes de la moitié gauche, par vue. Un muscle peut avoir plusieurs segments
 * (les chefs du quadriceps, les carreaux des abdominaux) et apparaître sur les
 * deux vues quand on le voit des deux côtés (avant-bras, trapèzes, deltoïde
 * latéral). Les segments ne se chevauchent pas : plusieurs muscles allumés à la
 * fois restent lisibles.
 */
const SHAPES = {
  front: {
    // le trapèze supérieur, qu'on voit entre le cou et l'épaule
    'trap-sup': ['M26.2 20.6C22.6 21.6 19.2 22.6 16.6 23.9C19.4 24.2 22.6 23.6 26.4 22.6Z'],
    'delt-lateral': ['M14.6 23.6C11.4 24.4 9.9 27.8 10.4 32.2C11.4 32.8 12.6 32.4 13.4 31.4C12.8 28.4 13.2 25.6 14.6 23.6Z'],
    'delt-avant': ['M15.4 23.4C13.9 25.4 13.7 28.8 14.2 31.6C16.4 31.4 18.2 29 19 25.8C17.8 24.2 16.7 23.4 15.4 23.4Z'],
    pecs: ['M29.3 23.8C25.2 23.3 21.2 24.2 19.6 26.6C18.9 30.6 19.7 34.8 22 36.6C25 38.2 27.9 37.5 29.3 36Z'],
    biceps: ['M11.3 32.6C10.6 36.2 10.8 41 11.9 45.4C13.5 46 15.1 45.6 15.8 44.6C16.4 40 16.3 35.6 15.3 32.3C13.9 31.6 12.5 31.8 11.3 32.6Z'],
    'avant-bras': ['M11.1 49.8C9.5 54.2 8.6 59.2 8.7 65.2L11.5 65.6C12.3 60 13.9 55 15.4 49.8C14 49.1 12.5 49.1 11.1 49.8Z'],
    abdos: [
      rr(25.4, 39, 3.9, 4.8, 1.3), rr(25.4, 44.6, 3.9, 4.8, 1.3), rr(25.4, 50.2, 3.9, 4.8, 1.3),
      'M25.4 55.8h3.9v7.4C27.8 63 26.2 61.4 25.4 59.6Z',
      // obliques, sur le flanc
      'M21.3 38.6C22.3 44.6 22.8 51 22.6 57.6L24.5 60.2V39.6Z'
    ],
    quadriceps: [
      // vaste externe
      'M19.6 67.4C18.7 74.6 19.1 83.2 21.3 90.2C22.5 90.6 23.3 89.8 23.4 88.2C22.6 81.2 22.6 73.6 23.5 67.8Z',
      // droit fémoral
      'M24.2 67.2C23.3 74 23.5 80.6 24.4 85.4C25.4 86.4 26.4 86.2 26.9 85.2C27.3 79.4 27.2 73.2 26.4 67Z',
      // vaste interne, la goutte au-dessus du genou
      'M27.6 79.6C28.4 83.6 28.6 87.6 28 90.6C26.4 91 25.2 90.2 24.8 88.8C25.8 86.4 26.8 83.2 27.6 79.6Z'
    ],
    // l'intérieur de la cuisse, contre l'axe
    adducteurs: ['M27.1 66.8C28 70.6 28.6 74.6 28.9 78.6L29.4 78.6V66.6Z'],
    // le jumeau interne, qu'on voit aussi de face
    mollets: ['M28.2 95.4C28.6 100.2 28 105.6 26.8 109.8L25.8 109.6C26.5 104.8 26.7 100 26.5 95.4Z']
  },
  back: {
    // le trapèze en trois faisceaux : supérieur (du cou à l'épaule), moyen (la
    // bande horizontale vers l'omoplate), inférieur (le V qui descend le long de la colonne)
    'trap-sup': ['M30 15.5L26.8 16.5C25.8 19.5 21 21.8 16 23.8C20 23.6 24.6 22.6 30 21.6Z'],
    'trap-moy': ['M16 23.8C20 23.6 24.6 22.6 30 21.6V32.4L26 31.6C25.6 29.6 25.2 28.4 24.6 27.6C22.6 26.4 19.6 25.2 16 23.8Z'],
    'trap-inf': ['M26 31.6L30 32.4V44.5H29.3C27.8 37 26.6 33.4 26 31.6Z'],
    'delt-lateral': ['M13.6 24.2C11.2 25.4 10 28.6 10.4 32.2L11.6 32.4C11.3 28.8 12 26 13.9 24.6Z'],
    'delt-arriere': ['M15.4 23.8C13 24.8 11.9 28.2 12.1 32.3C14 32.8 16.4 31.3 18.3 29C17.9 26.6 16.9 24.6 15.4 23.8Z'],
    // grand rond et sous-épineux : le bord externe de l'omoplate
    'grand-rond': ['M17.5 29.6C19.3 31 21.4 32.1 23 32.7C22.8 35 21.6 36.7 19.6 37.1C18.2 35 17.5 32.5 17.5 29.6Z'],
    rhomboides: ['M24.3 29.4C25.5 32.5 26.4 35.7 27.3 39.2C25.9 39.8 24.6 39.4 23.7 38.5C23.1 35.6 23.2 32.4 24.3 29.4Z'],
    'grand-dorsal': ['M17.8 38.4C19.8 38.7 22.1 39.8 24 40.7C25.6 43.4 26.6 46.8 27.2 50.6C25.2 53.2 22.6 55 20.6 55.6C20 49.8 19.1 44 17.8 38.4Z'],
    triceps: ['M11.4 31.9C10.4 35.6 10.4 41 11.2 46.4C12.8 47.3 14.6 46.9 15.8 45.5C16.6 41 16.4 36 15.4 32.1C14 31.3 12.6 31.3 11.4 31.9Z'],
    'avant-bras': ['M11.1 49.8C9.5 54.2 8.6 59.2 8.7 65.2L11.5 65.6C12.3 60 13.9 55 15.4 49.8C14 49.1 12.5 49.1 11.1 49.8Z'],
    lombaires: ['M27.6 52.2C28.3 55.2 28.9 58.6 29.3 62.2L26.7 62.6C26.3 59 26.6 55.4 27.6 52.2Z'],
    fessiers: ['M19.3 63.4C18.7 66.6 19.1 70 20.5 72.4C23.4 73.6 26.9 73.3 29.4 72.2V64.4C26.4 63 22.6 62.7 19.3 63.4Z'],
    ischios: [
      // biceps fémoral, à l'extérieur
      'M20.3 74.4C19.7 80.2 20.3 86.2 21.8 91L24.3 91C23.8 85.2 23.6 79.4 24.2 74.4Z',
      // semi-tendineux, à l'intérieur
      'M24.9 74.4C24.5 80.2 24.8 86 25.6 91L28.4 91C28.9 85 29 79.4 28.8 74.4Z'
    ],
    // les deux chefs des jumeaux
    mollets: [
      'M20.9 95.2C19.9 99.6 20.3 104.6 22.2 108.2L24.2 107.6C24 103.2 23.8 99.2 24.2 95.2Z',
      'M24.8 95.2C24.6 99.2 25 103.6 25.4 108.2L27.2 108.6C28.5 104.6 28.8 99.6 28 95.2Z'
    ]
  }
};

/** Les catégories qui regroupent plusieurs muscles dessinés (en-tête du catalogue, etc.). */
const EXPAND = {
  dos: ['trap-sup', 'trap-moy', 'trap-inf', 'grand-dorsal', 'grand-rond', 'rhomboides'],
  trapezes: ['trap-sup', 'trap-moy', 'trap-inf'],
  epaules: ['delt-avant', 'delt-lateral', 'delt-arriere']
};
const expand = (ids) => new Set(ids.flatMap((id) => EXPAND[id] || [id]));

function muscles(view, primary, secondary) {
  const parts = [];
  for (const [id, paths] of Object.entries(SHAPES[view])) {
    const cls = primary.has(id) ? 'bm-on' : secondary.has(id) ? 'bm-second' : 'bm-muscle';
    for (const d of paths) {
      parts.push(node('path', { d, class: cls }));
      parts.push(node('path', { d, class: cls, transform: MIRROR }));
    }
  }
  return parts;
}

/** Le visage : deux yeux suffisent à dire « on le voit de face ». */
const faceMarks = () => [
  node('ellipse', { cx: 27.6, cy: 9.4, rx: 1.1, ry: 1.3, class: 'bm-trait' }),
  node('ellipse', { cx: 32.4, cy: 9.4, rx: 1.1, ry: 1.3, class: 'bm-trait' })
];

/** De dos : la colonne. */
const backMarks = () => [node('path', { d: 'M30 17V63', class: 'bm-spine' })];

function caption(dx, text) {
  const el = node('text', { x: dx + W / 2, y: 131, class: 'bm-label', 'text-anchor': 'middle' });
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

  // un muscle à la fois principal et secondaire reste principal
  const on = expand(primary);
  const second = expand(secondary);

  for (const [view, dx, marks] of [['front', FRONT, faceMarks], ['back', BACK, backMarks]]) {
    const g = node('g', { transform: `translate(${dx} 0)` });
    g.append(...figure(), ...muscles(view, on, second), ...marks());
    svg.append(g);
  }

  if (withLabels) {
    svg.append(caption(FRONT, 'Face'));
    svg.append(caption(BACK, 'Dos'));
  }
  return svg;
}
