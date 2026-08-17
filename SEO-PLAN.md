# VB Rénovation — Plan SEO & conversion

Audit complet réalisé le 10/08/2026 sur le site en ligne, puis chantier
d'optimisation. Ce document liste **ce qui a été fait** et **ce qui reste à
faire, côté client**, par ordre de rentabilité.

---

## 1. Ce qui a été fait (côté site)

### Architecture : de 1 page à 25 pages
Le site ne comptait qu'une seule page indexable, qui devait porter à elle seule
une dizaine d'intentions de recherche différentes. Il compte désormais
**25 pages et environ 9 300 mots de contenu unique**. Google associe une page à un
ou deux sujets, rarement dix : l'essentiel de la demande locale était donc hors
de portée. Le site suit désormais une architecture **hub-and-spoke** :

**6 pages prestations**
- `/ravalement-facade-lannion` — la page argent principale
- `/peinture-facade-lannion`
- `/enduit-facade-lannion`
- `/peinture-interieure-lannion`
- `/nettoyage-demoussage-facade-lannion`
- `/fissures-impermeabilisation-lannion`

**2 pages informationnelles** (captent la recherche en amont du devis)
- `/prix-ravalement-facade` — « prix ravalement façade m2 » est une des requêtes
  les plus tapées du secteur, et la première objection de tout prospect
- `/aides-ravalement-facade`

**1 page copropriétés** (`/ravalement-copropriete-syndic`) — segment entièrement
absent du site : devis détaillé par poste pour l'assemblée générale, planning,
gestion des occupants. C'est le seul type de chantier où le client n'est pas un
particulier, et le panier moyen y est bien plus élevé.

**3 guides** qui captent la recherche bien en amont du devis, et que les moteurs
IA (AI Overviews, ChatGPT, Perplexity) citent volontiers
- `/quand-ravaler-sa-facade` — les signes qui alertent
- `/enduit-ou-peinture-facade` — la comparaison des trois solutions
- `/couleur-facade-reglementation` — déclaration préalable, PLU, ABF

**10 pages communes** (contenu réellement différent, pas un copier-coller de
ville : la similarité mesurée entre deux pages est de 15 % maximum)
- `/peintre-perros-guirec` — embruns, résidences secondaires
- `/peintre-tregastel` — enduit clair sur granit rose
- `/peintre-trebeurden` — pignons plein ouest
- `/peintre-treguier` — bâti ancien, chaux, secteur protégé
- `/peintre-pleumeur-bodou` — granit, Île-Grande très exposée
- `/peintre-louannec` — baie abritée, pavillons des années 80-2000
- `/peintre-plestin-les-greves` — Lieue de Grève, mer et campagne
- `/peintre-penvenan` — Port-Blanc, Buguélès, côte rocheuse
- `/peintre-paimpol` — maisons d'armateurs, chaux, air de port
- `/peintre-guingamp` — intérieur des terres, gel plutôt que sel

Chaque page a son propre titre, sa méta-description, son H1, son contenu unique,
sa FAQ, son schema.org, et un maillage vers les pages voisines.

### Conversion
- Chaque page se termine par une bande CTA (devis + appel) et affiche la
  réassurance en tête : note Google, gratuité du diagnostic, ancrage local.
- La barre d'appel mobile fixe fonctionne désormais sur **toutes** les pages
  (elle ne s'affichait que sur l'accueil).
- Un clic sur une prestation pré-remplit le formulaire de devis avec la bonne
  prestation (`/?devis=nettoyage#devis`), pour réduire la friction.
- Des **fourchettes de prix au m²** sont publiées : c'est l'objection numéro un,
  et l'absence de tout repère chiffré faisait partir les visiteurs comparer
  ailleurs. Les fourchettes sont annoncées comme des repères de marché, jamais
  comme un engagement.

### Technique
- Toutes les images converties en **WebP** : la page passe d'environ 1,4 Mo à
  environ 0,5 Mo (hero de 180 à 60 Ko).
- **Polices auto-hébergées** : plus aucune requête vers Google Fonts, un
  aller-retour réseau en moins avant l'affichage.
- **`_headers`** : cache d'un an sur les fichiers versionnés (ils étaient
  revalidés à chaque visite) + en-têtes de sécurité (HSTS, nosniff,
  Referrer-Policy).
- **`canonical`, `og:url`, `og:image`** ajoutés (aperçus corrects lors des
  partages, plus de risque de doublon d'URL).
- **`robots.txt`, `sitemap.xml`, `llms.txt`** créés. Les robots des moteurs
  génératifs (ChatGPT, Perplexity, Claude, AI Overviews) sont explicitement
  autorisés : ils envoient de plus en plus de demandes de devis.
- **Schema.org** complété : graphe WebSite + WebPage + HousePainter avec URL
  absolues, logo, image, plan, catalogue de prestations lié aux nouvelles pages.
- **`.assetsignore`** : le dossier `.git` était servi publiquement, il ne l'est
  plus. **`wrangler.jsonc`** : la page 404 personnalisée renvoyait un corps vide.
- **Maillage interne** : les pages prestations renvoient vers les guides, les
  communes sont reliées entre voisines géographiques. Aucune page orpheline,
  6 liens entrants en médiane.
- **IndexNow** (`./indexnow.sh`) : prévient Bing en quelques minutes au lieu de
  quelques jours. Google ne l'utilise pas, mais Bing alimente Copilot et la
  recherche de ChatGPT. À relancer après chaque publication et après la bascule
  de domaine.
- **`./bascule-domaine.sh <domaine>`** : bascule les 25 pages, le sitemap, le
  robots, le llms et tout le JSON-LD en une commande, le jour du vrai domaine.

---

## 2. Ce qui reste à faire — par ordre de rentabilité

### Priorité 1 — Sans ça, le reste ne sert pas à grand-chose

**a) ~~Brancher le formulaire de devis~~ — fait le 13 août 2026.**
Le formulaire est actif et vérifié par un envoi réel depuis le site en ligne :
la demande est bien reçue, l'écran de confirmation s'affiche, et la conversion
est enregistrée pour le futur suivi publicitaire. Seul point à confirmer de
votre côté : que l'adresse e-mail de réception paramétrée dans le compte
Web3Forms est bien celle où vous voulez recevoir les demandes.

**b) Acheter un vrai nom de domaine** (par exemple `vb-renovation.fr`).
L'adresse actuelle en `.workers.dev` est une adresse technique : elle inspire
peu confiance, se référence mal, et surtout elle bloque toute la suite (fiche
Google, annuaires, référencement). Une fois le domaine acheté, la bascule prend
quelques minutes de notre côté.

**c) Revendiquer la fiche Google.**
La fiche « VB Rénovation » existe et affiche 5,0/5, mais elle **n'est pas
revendiquée** : n'importe qui peut suggérer des modifications, et vous ne pouvez
ni répondre aux avis, ni publier, ni voir les statistiques. La vérification par
courrier prend une à deux semaines : à lancer tout de suite, c'est le premier
levier de visibilité locale, devant le site lui-même.

### Priorité 2 — Le gisement de confiance

**d) De vraies photos de chantiers.**
Toutes les images du site sont des illustrations sous licence libre. Pour un
artisan, c'est le plus gros manque : un concurrent qui montre son propre travail
sera choisi avant vous. Le format le plus efficace est l'**avant/après**.
Objectif : 6 à 10 chantiers photographiés, même au téléphone, en cadrant le même
angle avant et après. Ces photos servent deux fois : sur le site et sur la fiche
Google (dont la photo de couverture actuelle, une bâtisse en pierre, ne montre
aucun chantier).

**e) Une page « À propos » avec un visage et un prénom.**
Le site parle de « VB Rénovation », une entité abstraite. Un prénom, une photo,
le nombre d'années de métier : c'est ce qui décide un propriétaire de 60 ans
entre deux devis équivalents.

**f) Les avis clients.**
3 avis, c'est trop peu pour rassurer, même à 5,0/5. Viser 12 à 15 avis sur trois
mois, à un rythme régulier (3 à 4 par mois, jamais plusieurs le même jour).
Message type à envoyer par SMS deux à trois jours après la fin d'un chantier :

> Bonjour [Prénom], merci pour votre confiance pour vos travaux de [ravalement /
> peinture] à [Commune]. Un avis Google nous aiderait beaucoup à faire connaître
> notre travail : [lien]. Merci encore ! VB Rénovation

Le lien direct vers le formulaire d'avis sera généré dès la fiche revendiquée.
Ne jamais offrir de contrepartie contre un avis : c'est interdit par Google.

**g) Compléter les mentions légales.**
Elles contiennent encore des champs entre crochets (SIRET, gérant, assurance,
hébergeur). C'est une obligation légale, un signal de confiance, et plusieurs
annuaires professionnels exigent le SIRET pour valider une inscription.
Nous manquent : SIRET, forme juridique, nom du gérant, e-mail de contact,
compagnie d'assurance et numéro de police décennale, horaires d'ouverture.

### Priorité 3 — Une fois le domaine en place

**h) Search Console** : déclarer le site et soumettre le sitemap.

**i) Annuaires et citations**, avec des coordonnées rigoureusement identiques
partout (le nom, l'adresse et le téléphone doivent être au caractère près) :
PagesJaunes, Houzz, la Chambre de Métiers, une page Facebook professionnelle,
puis Mappy, 118712, Travaux.com.

**j) Publier régulièrement sur la fiche Google** (une publication par semaine
avec une photo de chantier suffit) et répondre à tous les avis sous 48 h.

---

## 3. Ce qu'on peut raisonnablement attendre

Le référencement local d'un artisan se joue sur trois piliers : la fiche Google
(le plus fort), les avis, et le site. Le site est désormais du bon côté ; les
deux autres piliers dépendent d'actions que vous seul pouvez mener.

Sur un domaine neuf, il faut compter deux à trois mois avant de voir les
premières positions se stabiliser, et l'essentiel des premiers contacts viendra
de la fiche Google, pas de la recherche classique. Les requêtes les plus
accessibles rapidement sont les plus précises : « ravalement façade Perros-Guirec »,
« nettoyage façade Trégastel », « prix ravalement façade Lannion ». Les requêtes
génériques (« peintre Lannion ») demandent plus de temps et plus d'avis.

---

## 4. Notes techniques (interne)

- Basculer le domaine = remplacer `vbrenovation22.fr` dans
  `index.html`, les 12 pages, `sitemap.xml`, `robots.txt`, `llms.txt`
  (`grep -rl` puis `sed`), puis mettre en place la redirection 301.
- Le suivi de conversion est câblé dans `assets/script.js` (dataLayer
  `generate_lead` et `phone_call`) mais dormant : remplacer `GTM-XXXXXXX` par
  l'identifiant réel pour l'activer.
- Les fourchettes de prix sont des repères de marché. À faire valider par le
  client, et à ajuster s'il pratique d'autres tarifs.
- Aucun avis n'est inventé : la note 5,0/3 reflète la fiche au 10/08/2026. À
  maintenir à jour dans le schema et sur la page quand le nombre d'avis change.
