# -*- coding: utf-8 -*-
"""
Télécharge les illustrations d'exercices depuis wger.de et régénère
js/exercise-images.js.

    python tools/images-wger.py

Les images viennent de la base ouverte wger.de, sous licence Creative Commons
BY-SA : leur réutilisation impose de citer les auteurs, ce que font le bas du
catalogue et la section « Illustrations » du README.

La correspondance MAP (exercice du catalogue -> exercice wger) est écrite à la
main : une illustration approximative serait pire que pas d'illustration. Pour
en ajouter une, cherche l'exercice sur wger.de, relève son identifiant dans
l'URL et ajoute la ligne ici.

Dépendances : curl (fourni avec Windows) et Pillow (pip install Pillow).
"""
import io
import json
import os
import subprocess

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(REPO, 'images', 'exercices')
TMP = os.path.join(REPO, '.cache-images')
SIZE = 320

MAP = {
    # pectoraux
    'dc-barre': 73, 'dc-incline-barre': 538, 'dc-decline-barre': 185,
    'dc-incline-smith': 925, 'dc-halteres': 75, 'dc-halteres-neutre': 1353,
    'dc-incline-halteres': 537, 'chest-press': 129, 'chest-press-incline': 539,
    'ecarte-couche': 238, 'pec-deck': 135, 'ecarte-poulie-haute': 323,
    'ecarte-poulie-basse': 1296, 'ecarte-poulie-milieu': 1922,
    'pompes': 1551, 'pompes-pieds-hauts': 1112,
    # dos
    'tractions-pro': 475, 'tractions-supi': 152, 'tractions-neutre': 1738,
    'tirage-vertical-supi': 1127, 'tirage-vertical-neutre': 1136,
    'rowing-barre-pro': 83, 'rowing-barre-supi': 84, 'rowing-t-bar': 513,
    'rowing-haltere': 81, 'rowing-machine': 1725, 'tirage-horizontal': 1117,
    'rowing-inverse': 1198, 'pull-over-poulie': 1137, 'pull-over-haltere': 161,
    'sdt': 184,
    # trapèzes
    'shrugs-barre': 571, 'shrugs-halteres': 572, 'shrugs-machine': 570,
    'rowing-menton': 693,
    # épaules
    'militaire-debout': 1893, 'militaire-assis': 566, 'dev-epaules-halteres': 567,
    'dev-epaules-machine': 543, 'elev-lat-halteres': 348, 'elev-lat-poulie': 1378,
    'elev-lat-machine': 1744, 'elev-front-halteres': 256, 'elev-front-poulie': 1745,
    'oiseau-halteres': 487, 'oiseau-poulie': 822,
    # biceps
    'curl-barre': 91, 'curl-ez': 94, 'curl-halteres': 92, 'curl-alterne': 1192,
    'curl-marteau': 272, 'curl-marteau-corde': 275, 'curl-pupitre-ez': 465,
    'curl-incline': 1448, 'curl-poulie-barre': 912,
    # triceps
    'dips': 194, 'dips-banc': 197, 'dev-serre': 76, 'barre-au-front': 246,
    'ext-corde': 1900, 'ext-barre': 805, 'overhead-haltere': 1336,
    'overhead-corde': 1519, 'pompes-diamant': 1086,
    # avant-bras
    'reverse-curl': 1290, 'curl-poignets': 51,
    # abdominaux
    'crunch': 167, 'releve-jambes-suspendu': 979, 'releve-jambes-chaise': 978,
    'gainage': 1307, 'roue-abdos': 1573, 'russian-twist': 1193, 'sit-up-leste': 1648,
    # lombaires
    'ext-lombaire': 301, 'ext-lombaire-machine': 1348, 'good-morning': 1392,
    # fessiers
    'hip-thrust': 1642, 'pont-fessier': 265, 'abduction-machine': 1748,
    'kickback-fessier': 1131, 'step-up': 981, 'sdt-sumo': 630,
    # quadriceps
    'squat': 1801, 'squat-avant': 257, 'squat-gobelet': 203, 'squat-smith': 1747,
    'hack-squat': 375, 'pendulum-squat': 1521, 'presse': 371, 'leg-extension': 369,
    'fente-avant': 984, 'fente-marchee': 206, 'fente-bulgare': 1706,
    # ischios
    'leg-curl-allonge': 365, 'leg-curl-assis': 366, 'leg-curl-debout': 367,
    'sdt-roumain': 507, 'sdt-roumain-halteres': 1652,
    # mollets
    'mollets-debout': 622, 'mollets-assis': 1620, 'mollets-presse': 146,
}

LICENSES = {1: 'CC BY-SA 3.0', 2: 'CC BY-SA 4.0', 3: 'CC0 1.0', 4: 'CC BY 4.0', 5: 'ODbL'}
LICENSE_URL = {
    'CC BY-SA 3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
    'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
    'CC0 1.0': 'https://creativecommons.org/publicdomain/zero/1.0/',
    'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/',
    'ODbL': 'https://opendatacommons.org/licenses/odbl/'
}


def get(url):
    """curl plutôt qu'urllib : le magasin de certificats de Python est souvent périmé."""
    out = subprocess.run(['curl', '-s', '-m', '60', '-H', 'User-Agent: suivi-muscu/1.0', url],
                         capture_output=True, text=True, encoding='utf-8')
    return json.loads(out.stdout)


def fetch_catalog():
    """Les exercices wger qui ont une image, avec leur auteur et leur licence."""
    rows = {}
    url = 'https://wger.de/api/v2/exerciseinfo/?format=json&limit=100'
    while url:
        page = get(url)
        for e in page['results']:
            imgs = e.get('images') or []
            if not imgs:
                continue
            main = next((i for i in imgs if i.get('is_main')), imgs[0])
            rows[e['id']] = {
                'url': main['image'],
                'license': main.get('license'),
                'author': (main.get('license_author') or e.get('license_author') or 'wger.de').strip()
            }
        url = page['next']
    return rows


def convert(raw_path, dest_path):
    """Redimensionne sur fond blanc : les PNG transparents viraient au gris en thème sombre."""
    im = Image.open(raw_path).convert('RGBA')
    bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
    bg.alpha_composite(im)
    bg = bg.convert('RGB')
    bg.thumbnail((SIZE, SIZE), Image.LANCZOS)
    bg.save(dest_path, 'WEBP', quality=82, method=6)


def write_module(entries):
    authors = sorted({e['author'] for e in entries.values()}, key=str.lower)
    lics = sorted({e['license'] for e in entries.values()})
    out = io.StringIO()
    out.write('/**\n * Illustrations des exercices.\n *\n')
    out.write(' * Images de la base ouverte wger.de, sous licence Creative Commons :\n')
    for name in lics:
        out.write(' *   ' + name + ' - ' + LICENSE_URL.get(name, '') + '\n')
    out.write(' *\n * Auteurs : ' + ', '.join(authors) + '.\n *\n')
    out.write(" * L'attribution est obligatoire : elle est affichée en bas du catalogue\n")
    out.write(' * et dans le README. Fichier produit par tools/images-wger.py.\n */\n\n')
    out.write('export const IMAGE_SOURCE = {\n')
    out.write("  site: 'wger.de',\n")
    out.write("  url: 'https://wger.de/en/exercise/overview/',\n")
    out.write('  authors: ' + json.dumps(authors, ensure_ascii=False) + ',\n')
    out.write('  licenses: ' + json.dumps(
        [{'name': n, 'url': LICENSE_URL.get(n, '')} for n in lics], ensure_ascii=False) + '\n};\n\n')
    out.write('export const IMAGES = {\n')
    for key in sorted(entries):
        out.write("  '" + key + "': " + json.dumps(entries[key], ensure_ascii=False) + ',\n')
    out.write('};\n\n')
    out.write("/** Chemin de l'illustration d'un exercice du catalogue, ou null. */\n")
    out.write('export function exerciseImage(libId) {\n')
    out.write('  const e = IMAGES[libId];\n')
    out.write("  return e ? { src: 'images/exercices/' + e.file, author: e.author, license: e.license } : null;\n")
    out.write('}\n')
    path = os.path.join(REPO, 'js', 'exercise-images.js')
    io.open(path, 'w', encoding='utf-8').write(out.getvalue())
    return authors, lics


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(TMP, exist_ok=True)
    rows = fetch_catalog()
    print(len(rows), 'exercices avec image sur wger')

    entries = {}
    total = 0
    for lib_id, wid in MAP.items():
        row = rows.get(wid)
        if not row:
            print('introuvable :', lib_id, wid)
            continue
        ext = os.path.splitext(row['url'].split('?')[0])[1].lower() or '.png'
        raw = os.path.join(TMP, str(wid) + ext)
        if not os.path.exists(raw):
            subprocess.run(['curl', '-s', '-m', '60', '-o', raw, row['url']], check=False)
        if not os.path.exists(raw) or os.path.getsize(raw) < 500:
            print('échec :', lib_id, row['url'])
            continue
        dest = os.path.join(OUT_DIR, lib_id + '.webp')
        try:
            convert(raw, dest)
        except Exception as err:          # image illisible : on garde la silhouette
            print('illisible :', lib_id, err)
            continue
        total += os.path.getsize(dest)
        entries[lib_id] = {
            'file': lib_id + '.webp',
            'author': row['author'],
            'license': LICENSES.get(row['license'], 'CC BY-SA')
        }

    authors, lics = write_module(entries)
    print(len(entries), 'images,', round(total / 1024), 'Ko au total')
    print('licences :', ', '.join(lics))
    print('auteurs :', ', '.join(authors))


if __name__ == '__main__':
    main()
