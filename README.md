# Suivi Muscu

Appli de suivi de musculation et de cardio pour un petit groupe : chacun a son compte et
son suivi privé, un historique complet et des courbes de progression. Elle s'installe sur
le téléphone et reste utilisable sans réseau, à la salle.

En ligne : <https://anas31317.github.io/anas_suivi_muscu/>

## Les onglets

Chaque onglet suit la même logique : **ce qu'on fait maintenant en haut, ce qu'on a déjà
fait en dessous**, et toutes les courbes de musculation sont réunies dans Progrès.

- **Accueil** : la prochaine séance — celle du jour tant qu'elle n'est pas enregistrée,
  la suivante dès qu'elle l'est — juste en dessous les **muscles travaillés** ces 7
  derniers jours sur les silhouettes du catalogue (pour voir d'un coup d'œil ce qu'on a
  négligé avant de choisir sa séance), puis les chiffres de la semaine et du mois, le
  **volume** de la semaine (charge × reps) comparé à la même période de la semaine passée,
  le cardio des 7 derniers jours et l'activité sur 8 semaines. Les records se lisent dans
  Progrès.
- **Muscu** : les séances du programme à lancer, puis l'historique complet par mois,
  filtrable par séance (c'est là qu'on modifie ou supprime une séance passée).
  Une séance s'ouvre sur une page unique avec tous les exercices, séries et reps ; chaque
  série affiche à gauche ce qui a été fait la fois précédente (un tap la recopie) et se
  teinte en vert dès que ses reps sont saisies : on voit d'un coup d'œil où on en est. Tout
  s'enregistre au fur et à mesure ; rouvrir la séance le même jour reprend où on en était.
  La touche « Suivant » du clavier enchaîne charge, reps, série suivante puis exercice
  suivant : une séance se saisit sans viser les champs au doigt.
  Un **chrono** est toujours là, dans la barre du bas, avec démarrer / pause et remise à
  zéro. C'est un chrono, pas un compte à rebours : on prend le repos qu'on veut, et rien ne
  se déclenche tout seul. Il est gardé sur l'appareil : il continue de tourner si on va voir
  Progrès, si la page se recharge ou si on ferme l'appli, et affiche toujours le bon temps.
  Les notes des trois dernières fois, sur la séance comme sur chaque exercice, sont
  rappelées en gris avec leur date, à l'endroit où on écrit les nouvelles (à droite des
  séries sur ordinateur, en dessous sur téléphone). On voit d'un coup
  d'œil ce qui revient d'une semaine à l'autre (une gêne, un réglage de machine…).
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
- **Profil** : **modifier le profil** (prénom, nom, nom d'utilisateur, email), programme,
  apparence (auto / clair / sombre) et style (Sobre, Énergie, Néon, Violet), export / import
  des données, mot de passe, déconnexion. Prénom, nom et nom d'utilisateur sont rangés dans
  le compte Supabase (pas de table en plus) ; le prénom sert au « Salut » de l'accueil. Un
  nouvel email ne compte qu'une fois confirmé par **deux liens**, l'un reçu sur la nouvelle
  adresse, l'autre sur l'actuelle : l'appli le rappelle tant que ce n'est pas fait. Personne
  n'a rien à faire dans Supabase. Le nom d'utilisateur s'affiche dans le profil ; il n'est pas vérifié unique.

Inscription réservée aux emails autorisés, connexion et mot de passe oublié par email.

## Catalogue d'exercices

« Modifier la séance » contient un **catalogue** de plus de 170 exercices : une ligne par
variante, parce que le même mouvement à la barre, aux haltères, à la machine ou à la poulie
ne se charge pas pareil et ne se suit pas sur la même courbe. L'inclinaison et l'angle des
poignées ne sont pas des colonnes — ils ne concernent qu'une partie des exercices — mais
sont dans le nom quand ils distinguent vraiment un mouvement : « Tirage vertical prise
neutre », « Développé incliné ».

Chaque exercice affiche **les muscles qu'il travaille** sur deux silhouettes, de face et de
dos, reconnaissables au premier coup d'œil : muscles principaux en couleur pleine,
secondaires en teinte claire, beaucoup d'exercices étant polyarticulaires. Chaque muscle a sa
forme, découpée en segments (carreaux des abdominaux, chefs du quadriceps, des ischios et des
mollets), et les muscles au repos se devinent en gris. Le dos est
détaillé en quatre muscles — trapèzes, grand dorsal, grand rond, rhomboïdes — parce qu'un
tirage vertical et des shrugs n'ont rien à voir ; l'épaule en trois faisceaux — antérieur,
latéral, postérieur — parce qu'un développé, une élévation latérale et un oiseau non plus (le
postérieur se colore de dos). Les adducteurs sont colorés à leur place
tout en étant rangés avec les quadriceps.

Pour ranger les exercices, le dos est coupé par muscle, en restant fidèle à l'anatomie :
**Grand dorsal** (tractions, tirages, rowings, pull-over ; le grand rond, qui le seconde,
est rangé avec lui), **Trapèzes** et **Rhomboïdes**. Un rowing figure dans les trois : il
travaille le grand dorsal, les rhomboïdes et le trapèze moyen. Le trapèze est dessiné en ses
trois faisceaux : **supérieur** (shrugs, rowing menton), **moyen** (rowings, face pull ; oiseau
en secondaire) et **inférieur**. Les autres catégories
restent larges : les trois faisceaux de l'épaule sont tous rangés dans Épaules. La barre de
recherche comprend le français comme l'anglais : « bench press » trouve le développé
couché.

Pas de nombre de séries dans le catalogue : il se règle dans la séance, après l'ajout.

Trois façons de charger un exercice, parce qu'une seule ne suffisait pas : **charge** (barre,
machine, haltères), **poids du corps** (aucune charge à saisir, la courbe est en répétitions)
et **poids du corps + lest** (la colonne de charge est le lest). Tractions et dips existent
donc en deux fiches, au poids du corps et lestées : charge et répétitions ne se lisent pas
sur la même courbe. Les comptes ouverts avant cette séparation sont répartis d'après ce
qu'ils ont réellement fait — jamais de lest saisi, c'est la fiche poids du corps ; du lest
déjà mis, c'est la fiche lestée — sans changer d'identifiant, donc sans couper la courbe.

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

Une dernière catégorie, **Préparation physique**, reçoit ce qui ne vise pas un muscle en
particulier : renforcement des pieds, parcours médecine ball, corde à sauter. Mieux vaut une
case honnête qu'un exercice forcé dans un groupe musculaire qui ne lui va pas.

Les noms qu'une recherche ne peut pas deviner — abréviations, fautes de frappe, formulations
de salle — sont traduits par une table de correspondances en bas de
[`js/exercise-library.js`](js/exercise-library.js) : une ligne « ce nom → cette fiche », qui
vaut pour tous les comptes qui l'ont écrit pareil.

Pour savoir ce qui manque aux autres comptes, les règles RLS interdisant de lire leurs
données depuis l'appli : [`supabase/exos-hors-catalogue.sql`](supabase/exos-hors-catalogue.sql),
à exécuter dans le SQL Editor du projet. Il ne sort que des noms d'exercices et un nombre de
comptes — aucune charge, aucune date, aucun email.

Pour compléter le catalogue : [`js/exercise-library.js`](js/exercise-library.js), une ligne
par exercice (id, nom, matériel, mode, muscles principaux, muscles secondaires). Les zones
des silhouettes sont dans [`js/body-map.js`](js/body-map.js).

### Pourquoi des schémas et pas des photos

Les bases d'exercices libres mélangent les styles : dessins au trait, images générées,
photos, rendus 3D — et aucune ne couvre tous les exercices. Une liste moitié photos moitié
dessins se lit mal. Les silhouettes, elles, sont dessinées par le site : même style partout,
rien à télécharger, aucun droit à demander, et elles disent ce qu'une photo ne dit pas, à
savoir quels muscles travaillent et dans quelle mesure.

## Apparence

Quatre styles au choix dans Profil, chacun en clair comme en sombre (réglage « auto » par
défaut) :

- **Sobre** (par défaut) : gris chauds et un seul accent bleu ;
- **Énergie** : orange brûlé, titres très resserrés ;
- **Néon** : vert citron sur noir profond, coins arrondis, titres larges (en clair, le citron
  devient un vert olive, sinon il serait illisible sur fond blanc) ;
- **Violet** : plus doux, coins arrondis.

Le style et le thème sont retenus sur l'appareil : chacun règle le sien. Deux polices, hébergées dans [`fonts/`](fonts/) (licence
OFL) parce que la Content-Security-Policy n'autorise que les fichiers du site : **Archivo**
légèrement resserrée pour les titres, **Inter** pour le texte et les chiffres, alignés en
colonnes (`tabular-nums`). Elles sont dans le cache hors ligne comme le reste.

Lisible à la salle, en un coup d'œil :

- texte, texte secondaire et texte blanc des boutons bleus à **4,5:1 de contraste au
  moins** (norme WCAG AA) ;
- sur écran tactile, boutons d'au moins **44 px** de haut ; à la souris, ils restent
  compacts.

Les couleurs sont des variables en tête de [`css/style.css`](css/style.css) (`--accent`,
`--ink-muted`…), une fois pour le clair et une fois pour le sombre ; chaque style les
redéfinit sous `[data-style="…"]`, et la liste des styles est dans
[`js/theme.js`](js/theme.js). Les styles ne changent pas de police : ils jouent sur la
largeur d'Archivo, qui est réglable.

## Quoi de neuf

Après une mise à jour, l'appli présente les nouveautés à la première ouverture, une seule
fois par appareil, en deux tailles selon le numéro de version :

- **grosse mise à jour** (1.28.0, 1.29.0… : dernier nombre à 0) : une fenêtre « Quoi de
  neuf », fermée d'un bouton, d'Échap ou d'un clic à côté ;
- **petite mise à jour ou correctif** (1.28.1, 1.28.2…) : un petit bandeau en bas de
  l'écran, fermé d'un ✕, qui ne bloque rien.

Si une grosse et des petites se cumulent depuis la dernière visite, la fenêtre les montre
toutes. Une version sans note n'affiche rien.

Pour une mise à jour visible : dans [`js/changelog.js`](js/changelog.js), ajouter une
entrée **en haut** de `NOTES`, avec le numéro de [`js/version.js`](js/version.js) et des
phrases courtes écrites pour les utilisateurs, pas pour les développeurs : 3 à 5 pour une
grosse mise à jour, 1 ou 2 pour une petite.

## Mode maintenance

Pour que les autres ne tombent jamais sur une appli à moitié faite : dans
[`js/config.js`](js/config.js), `MAINTENANCE = true`. Seul le compte `MAINTAINER_ID` entre
alors dans l'appli ; les autres comptes voient un écran « Maintenance en cours » et peuvent
seulement se déconnecter. Un bandeau orange rappelle au mainteneur que le mode est actif.

Le mainteneur est reconnu à l'**identifiant de son compte** (Supabase > Authentication >
Users, colonne UID), pas à son email : l'identifiant ne change pas quand on change d'email
dans Profil, et il ne dit rien de personnel dans un dépôt public.

**La règle : le mode maintenance s'active sur le site en ligne dès qu'on commence des
modifications, pas seulement pour le test final.**

1. Passer `MAINTENANCE` à `true`, commiter et pousser ce seul changement.
2. Faire les modifications et les pousser (elles sont en ligne, mais visibles du seul
   mainteneur).
3. Tester sur le site en ligne.
4. Une fois validé, repasser `MAINTENANCE` à `false` et pousser : l'appli rouvre pour tous.

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
- Content-Security-Policy stricte (scripts, styles et polices du site uniquement) ; librairie Supabase hébergée dans le dépôt
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
| `fonts/` | polices Archivo et Inter (woff2) et leurs licences |
| `js/app.js` | routeur, onglets, garde d'accès, cycle de connexion |
| `js/store.js` | état, cache local par compte, métriques, import / export |
| `js/sync.js` | synchronisation du compte avec Supabase |
| `js/auth.js`, `js/auth-views.js` | comptes : connexion, inscription, mots de passe |
| `js/share.js` | partage : publication de ma copie, lecture du suivi d'un ami |
| `js/insights.js` | calculs de l'accueil : prochaine séance, activité, volume, muscles travaillés |
| `js/charts.js` | graphes SVG (courbes, barres, mini-courbes) |
| `js/seed.js` | programme type des nouveaux comptes |
| `js/logo.js`, `js/theme.js`, `js/version.js` | logo, thème et styles, nom / version / auteur |
| `js/changelog.js` | « Quoi de neuf » affiché après une mise à jour |
| `js/config.js` | URL et clé publique Supabase |
| `js/exercise-library.js`, `js/body-map.js` | catalogue d'exercices et silhouettes |
| `js/views/` | une page par fichier : `dashboard`, `muscu` (programme + historique), `workout` (séance en cours), `session-editor`, `catalogue`, `cardio`, `progression`, `one-rm`, `friends`, `programme`, `profile` |
| `js/vendor/` | supabase-js (copie locale vérifiée) |
| `supabase/` | scripts SQL : tables, règles de sécurité, partage |
| `sw.js`, `manifest.webmanifest` | installation sur mobile et mode hors ligne |

En ajoutant un fichier JS, CSS ou une police : l'ajouter à la liste `SHELL` de `sw.js` et incrémenter
`CACHE`, pour qu'il soit disponible hors ligne. La version affichée en pied de page est
dans [`js/version.js`](js/version.js).
