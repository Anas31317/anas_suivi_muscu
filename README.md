# Suivi Muscu

Appli de suivi de musculation et de cardio pour un petit groupe : chacun a son compte et
son suivi privé, un historique complet et des courbes de progression. Elle s'installe sur
le téléphone et reste utilisable sans réseau, à la salle.

En ligne : <https://anas31317.github.io/suivi_muscu_india/>

## Les onglets

Chaque onglet suit la même logique : **ce qu'on fait maintenant en haut, ce qu'on a déjà
fait en dessous**, et toutes les courbes de musculation sont réunies dans Progrès.

- **Accueil** : la prochaine séance (ou celle du jour à reprendre), les chiffres de la
  semaine et du mois, le cardio des 7 derniers jours, l'activité sur 8 semaines et les
  derniers records.
- **Muscu** : les séances du programme à lancer, puis l'historique complet par mois,
  filtrable par séance (c'est là qu'on modifie ou supprime une séance passée).
  Une séance s'ouvre sur une page unique avec tous les exercices, séries et reps ; chaque
  série affiche à gauche ce qui a été fait la fois précédente (un tap la recopie). Tout
  s'enregistre au fur et à mesure ; rouvrir la séance le même jour reprend où on en était.
  Le programme (exercices, séries, ordre) ne se change que dans « Modifier la séance », avec
  un bouton Enregistrer — **l'historique n'est jamais réécrit**.
- **Cardio** : tapis, course, vélo, rameur… durée, vitesse **ou** distance (l'une calcule
  l'autre), inclinaison ; calories et fréquence cardiaque en option. Chiffres sur 7 et
  30 jours, puis l'historique par mois. Rien sur la progression ici : toutes les courbes
  sont dans Progrès.
- **Progrès** : une courbe à la fois, muscu ou cardio. L'exercice se choisit dans un
  sélecteur groupé par séance — volume, charge max ou reps totales — avec les tuiles et le
  détail des séances. Les activités cardio figurent à la fin du sélecteur sous « Séance
  cardio », avec distance, durée, vitesse ou allure.
- **1RM** (depuis « Voir aussi », en bas de Progrès) : pour chaque exercice suivi, le 1RM
  **estimé** tiré de la dernière séance et le 1RM **réellement réalisé**, saisi à part des
  séances. La liste des exercices suivis se choisit à la main ; en retirer un ne supprime
  ni ses séances ni ses maxis enregistrés.
- **Amis** : ton code de partage se règle ici. Donne-le à qui tu veux et il verra ton
  programme, ta progression, ton cardio et tes 1RM, en lecture seule. Personne ne peut te
  trouver sans ce code, et en générer un nouveau coupe l'accès aux anciens.
- **Profil** : programme, apparence (auto / clair / sombre), export / import des données,
  mot de passe, déconnexion.

Inscription réservée aux emails autorisés, connexion et mot de passe oublié par email.

## Mise en service

1. **Supabase** : suivre [docs/SUPABASE.md](docs/SUPABASE.md) — tables et règles de
   sécurité ([`supabase/`](supabase/)), liste blanche des emails, partage entre
   utilisateurs, réglages d'authentification, envoi des emails, puis la clé publique dans
   [`js/config.js`](js/config.js).
2. **GitHub Pages** : **Settings** > **Pages** > Source = *Deploy from a branch*,
   Branch = `main`, dossier `/ (root)`.

### Installer sur le téléphone

- **Android (Chrome)** : menu ⋮ > *Installer l'application*
- **iPhone (Safari)** : Partager > *Sur l'écran d'accueil*

Une fois connecté, l'appli fonctionne hors ligne : saisie, historique, graphes et cardio.
Tout repart vers le compte au retour du réseau.

## Sécurité

- Inscription limitée aux emails de la liste blanche, vérifiée par la base de données.
- Chaque utilisateur ne peut lire et modifier que ses propres données (Row Level Security).
- Un suivi partagé n'est lisible qu'en fournissant le code exact : impossible de lister les
  suivis des autres, même avec la clé publique.
- Confirmation d'email obligatoire ; liens email en flux PKCE, à usage unique.
- Content-Security-Policy stricte ; librairie Supabase hébergée dans le dépôt
  (`js/vendor`, version 2.116.0 vérifiée) plutôt que chargée depuis un CDN.
- À la déconnexion, les données locales de l'appareil sont effacées, y compris les suivis
  d'amis mis en cache.

Le détail est dans [docs/SUPABASE.md](docs/SUPABASE.md#ce-qui-protège-les-données).
La clé de [`js/config.js`](js/config.js) est la clé **publique** (anon) : elle est faite pour
être visible. Ne jamais y mettre la clé `service_role`.

## Tester en local

```sh
python -m http.server 8000
```

puis ouvrir <http://localhost:8000> (ajouter `http://localhost:8000/**` aux Redirect URLs
de Supabase pour que les liens email fonctionnent en local).

## Organisation du code

Site statique : HTML, CSS et JavaScript à modules, sans build ni dépendance à installer.

| Fichier | Rôle |
|---|---|
| `index.html` | squelette de la page, Content-Security-Policy |
| `css/style.css` | tout le style (thème clair / sombre) |
| `js/app.js` | routeur, onglets, garde d'accès, cycle de connexion |
| `js/store.js` | état, cache local par compte, métriques, import / export |
| `js/sync.js` | synchronisation du compte avec Supabase |
| `js/auth.js`, `js/auth-views.js` | comptes : connexion, inscription, mots de passe |
| `js/share.js` | partage : publication de ma copie, lecture du suivi d'un ami |
| `js/insights.js` | calculs de l'accueil : prochaine séance, activité, records |
| `js/charts.js` | graphes SVG (courbes, barres, mini-courbes) |
| `js/seed.js` | programme type des nouveaux comptes |
| `js/logo.js`, `js/theme.js`, `js/version.js` | logo, thème, nom / version / auteur |
| `js/config.js` | URL et clé publique Supabase |
| `js/views/` | une page par fichier : `dashboard`, `muscu` (programme + historique), `workout` (séance en cours), `session-editor`, `cardio`, `progression`, `one-rm`, `friends`, `programme`, `profile` |
| `js/vendor/` | supabase-js (copie locale vérifiée) |
| `supabase/` | scripts SQL : tables, règles de sécurité, partage |
| `sw.js`, `manifest.webmanifest` | installation sur mobile et mode hors ligne |

En ajoutant un fichier JS ou CSS : l'ajouter à la liste `SHELL` de `sw.js` et incrémenter
`CACHE`, pour qu'il soit disponible hors ligne. La version affichée en pied de page est
dans [`js/version.js`](js/version.js).
