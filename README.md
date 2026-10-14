# Suivi Muscu

Appli de suivi de musculation et de cardio pour un petit groupe : chacun a son compte et
son suivi privé, un historique complet et des courbes de progression. Elle s'installe sur
le téléphone et reste utilisable sans réseau, à la salle.

En ligne : <https://anas31317.github.io/suivi_muscu_india/>

## Les onglets

Chaque onglet suit la même logique : **ce qu'on fait maintenant en haut, ce qu'on a déjà
fait en dessous**, et toutes les courbes de musculation sont réunies dans Progrès.

- **Accueil** : la prochaine séance — celle du jour tant qu'elle n'est pas enregistrée,
  la suivante dès qu'elle l'est — les chiffres de la
  semaine et du mois, le cardio des 7 derniers jours, l'activité sur 8 semaines et les
  derniers records.
- **Muscu** : les séances du programme à lancer, puis l'historique complet par mois,
  filtrable par séance (c'est là qu'on modifie ou supprime une séance passée).
  Une séance s'ouvre sur une page unique avec tous les exercices, séries et reps ; chaque
  série affiche à gauche ce qui a été fait la fois précédente (un tap la recopie). Tout
  s'enregistre au fur et à mesure ; rouvrir la séance le même jour reprend où on en était.
  Les notes laissées la fois précédente, sur la séance comme sur chaque exercice, sont
  rappelées en gris à l'endroit où on écrit les nouvelles.
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

## Catalogue d'exercices

« Modifier la séance » contient un **catalogue** de plus de 140 exercices : une ligne par
variante, parce que le même mouvement à la barre, aux haltères, à la machine ou à la poulie
ne se charge pas pareil et ne se suit pas sur la même courbe. L'inclinaison et l'angle des
poignées ne sont pas des colonnes — ils ne concernent qu'une partie des exercices — mais
sont dans le nom quand ils distinguent vraiment un mouvement : « Tirage vertical prise
neutre », « Développé incliné ».

Chaque exercice affiche **les muscles qu'il travaille** sur deux silhouettes, de face et de
dos, reconnaissables au premier coup d'œil : muscles principaux en couleur pleine,
secondaires en teinte claire, beaucoup d'exercices étant polyarticulaires. Le dos est
détaillé en quatre muscles — trapèzes, grand dorsal, grand rond, rhomboïdes — parce qu'un
tirage vertical et des shrugs n'ont rien à voir ; les douze catégories qui servent à ranger
les exercices restent larges, elles. La barre de
recherche comprend le français comme l'anglais : « bench press » trouve le développé
couché.

Pas de nombre de séries dans le catalogue : il se règle dans la séance, après l'ajout.

L'éditeur de séance garde ses outils repliés, sous deux titres qu'on déplie au besoin :

- **Catalogue d'exercices**, la base commune ;
- **Créer un exercice** : désactivé. Le bloc renvoie à l'adresse de `SUPPORT_EMAIL`
  ([`js/config.js`](js/config.js)) pour demander l'ajout d'un exercice manquant. Tout le
  monde part ainsi de la même base, et un exercice ajouté au catalogue profite à tous au
  lieu de rester dans un seul compte ;
Le catalogue est la seule porte d'entrée : un exercice ajouté depuis le catalogue et déjà
fait un jour **reprend son identifiant** au
lieu d'en recevoir un neuf : sa courbe repart là où elle s'était arrêtée, sans rien avoir à
demander. C'est ce qui permet de retirer un exercice d'une séance, de le remettre des
semaines plus tard, et de retrouver la même courbe — au lieu de deux courbes à moitié
remplies pour le même mouvement. Un exercice que le catalogue ne connaît pas (créé à la main
avant la fermeture de la création) reste utilisable tant qu'il est dans une séance, et son
historique reste lisible dans Progrès ; mais une fois retiré d'une séance, il faut demander
son ajout au catalogue pour le remettre.

Un exercice vraiment polyarticulaire apparaît dans **chacune** de ses catégories : les dips
sont dans Pectoraux et dans Triceps, le soulevé de terre dans Lombaires, Fessiers et
Ischios. On le trouve là où on le cherche.

Les comptes ouverts avant le catalogue avaient des exercices écrits à la main (« Bench »,
« Extension poulie corde ») qui ne pointaient sur aucune fiche. Ils sont rattachés
automatiquement à l'exercice du catalogue correspondant, par leur identifiant pour le
programme type, par leur nom quand il désigne un exercice sans ambiguïté. L'identifiant ne
change pas — courbes, 1RM et séances passées suivent — et l'historique garde les noms figés
au moment de la saisie. Le rattachement vaut aussi pour les exercices qui n'existent plus
que par leur historique, après avoir été retirés du programme. Les vingt exercices du programme type ont tous leur fiche ; un
exercice ajouté à la main dont le nom ne correspond à aucune fiche reste tel quel, et c'est
très bien : c'est là que sert la création d'exercice.

Les noms d'exercices ne se modifient pas : ils viennent du catalogue, et c'est ce qui fait
que le même mouvement porte le même nom sur tous les comptes. Dans une séance, chacun règle
l'ordre, le type et le nombre de séries.

Pour compléter le catalogue : [`js/exercise-library.js`](js/exercise-library.js), une ligne
par exercice (id, nom, matériel, mode, muscles principaux, muscles secondaires). Les zones
des silhouettes sont dans [`js/body-map.js`](js/body-map.js).

### Pourquoi des schémas et pas des photos

Les bases d'exercices libres mélangent les styles : dessins au trait, images générées,
photos, rendus 3D — et aucune ne couvre tous les exercices. Une liste moitié photos moitié
dessins se lit mal. Les silhouettes, elles, sont dessinées par le site : même style partout,
rien à télécharger, aucun droit à demander, et elles disent ce qu'une photo ne dit pas, à
savoir quels muscles travaillent et dans quelle mesure.

## Mode maintenance

Pour essayer une nouveauté sans que les autres tombent sur une appli à moitié faite :
dans [`js/config.js`](js/config.js), `MAINTENANCE = true`. Seule l'adresse
`MAINTAINER_EMAIL` entre alors dans l'appli ; les autres comptes voient un écran
« Maintenance en cours » et peuvent seulement se déconnecter. Un bandeau orange rappelle au
mainteneur que le mode est actif — **il faut repasser `MAINTENANCE` à `false` et pousser**
pour rouvrir l'appli. Aujourd'hui l'appli est ouverte : `MAINTENANCE = false`.

C'est un garde-fou d'affichage, pas une sécurité : il tient les autres à l'écart le temps
d'un essai, il n'arrêterait pas quelqu'un de décidé. Ce qui protège vraiment les données
reste les règles RLS de la base.

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
| `js/exercise-library.js`, `js/body-map.js` | catalogue d'exercices et silhouettes |
| `js/views/` | une page par fichier : `dashboard`, `muscu` (programme + historique), `workout` (séance en cours), `session-editor`, `catalogue`, `cardio`, `progression`, `one-rm`, `friends`, `programme`, `profile` |
| `js/vendor/` | supabase-js (copie locale vérifiée) |
| `supabase/` | scripts SQL : tables, règles de sécurité, partage |
| `sw.js`, `manifest.webmanifest` | installation sur mobile et mode hors ligne |

En ajoutant un fichier JS ou CSS : l'ajouter à la liste `SHELL` de `sw.js` et incrémenter
`CACHE`, pour qu'il soit disponible hors ligne. La version affichée en pied de page est
dans [`js/version.js`](js/version.js).
