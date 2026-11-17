/**
 * Apparence, retenue sur l'appareil :
 * - le thème : 'auto' (suit le téléphone / l'ordinateur), 'light' ou 'dark' ;
 * - le style : 'sobre' (par défaut) ou l'un de STYLES, chacun avec son clair et son sombre.
 */

const KEY = 'suivi-muscu:theme';
const STYLE_KEY = 'suivi-muscu:style';

/** Styles proposés dans Profil ; les couleurs sont dans css/style.css ([data-style]). */
export const STYLES = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'energie', label: 'Énergie' },
  { id: 'neon', label: 'Néon' },
  { id: 'violet', label: 'Violet' }
];

const read = (key) => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const write = (key, value) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch { /* stockage indisponible : le choix vaut pour cette visite */ }
};

export function getTheme() {
  const t = read(KEY);
  return t === 'light' || t === 'dark' ? t : 'auto';
}

export function getStyle() {
  const s = read(STYLE_KEY);
  return STYLES.some((x) => x.id === s) ? s : 'sobre';
}

function apply(theme = getTheme(), style = getStyle()) {
  const root = document.documentElement;
  if (theme === 'light' || theme === 'dark') root.dataset.theme = theme;
  else delete root.dataset.theme;
  if (style === 'sobre') delete root.dataset.style;
  else root.dataset.style = style;
  // la barre du navigateur prend le fond de page du style et du thème en cours
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', getComputedStyle(root).getPropertyValue('--plane').trim() || '#f9f9f7');
}

export function setTheme(theme) {
  write(KEY, theme === 'auto' ? null : theme);
  apply(theme);
}

export function setStyle(style) {
  write(STYLE_KEY, style === 'sobre' ? null : style);
  apply(undefined, style);
}

export function initTheme() {
  apply();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => apply());
}
