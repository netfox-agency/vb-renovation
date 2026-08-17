# VB Rénovation — site vitrine

Site vitrine statique (HTML/CSS/JS pur, aucun build) pour **VB Rénovation**,
peintre en bâtiment / ravalement de façade à **Lannion (22300)**.

- Adresse : 80 Route de Tréguier, 22300 Lannion
- Téléphone : 06 04 10 71 12
- Fiche Google : « VB Rénovation », Peintre en bâtiment à Lannion, 5,0/5 (3 avis au 04/08/2026)

## Lancer en local

```bash
python3 -m http.server 4196
```

(ou via la preview `vb-renovation` de `.claude/launch.json`)

## Design

Système hérité de Bretonnet/Debord (bento, hero plein cadre, kickers à filet,
Bricolage Grotesque + Inter). Palette tirée du logo : **marine `#1c4270` +
or `#b9882c`**, fond blanc minéral. Séparateurs de section en **diagonale**
(la passe de rouleau). Aucun hex en dur hors de `:root`.

## TODO avant mise en ligne (à compléter avec le client)

Le plan complet (audit SEO + actions client priorisées) est dans `SEO-PLAN.md`,
le plan publicitaire et l'analyse de marché dans `ADS-PLAN.md`.
Les points bloquants :

1. ~~Clé Web3Forms~~ **FAIT le 13/08/2026** : formulaire actif et testé en
   production par un envoi réel (HTTP 200, `success: true`, tous les champs
   transmis, écran de confirmation affiché, `generate_lead` poussé dans le
   dataLayer). À vérifier côté client : l'adresse de réception configurée dans
   le compte Web3Forms doit être celle où VB Rénovation veut ses demandes.
   Rappel : l'API refuse les appels serveur (plan Pro), le test ne peut se
   faire que depuis un navigateur.
2. ~~Domaine définitif~~ **FAIT le 17/08/2026** : bascule sur `vbrenovation22.fr`
   via `./bascule-domaine.sh`. Reste hors dépôt : redirection 301 de l'ancienne
   adresse workers.dev, et choix www ou apex avec 301 de l'autre.
3. **Logo HD** : le fichier fourni fait 160×160 (issu de la fiche Google).
4. **À confirmer avec le client** : SIRET, forme juridique, gérant, e-mail,
   assurance décennale (compagnie + n° de police), horaires.
5. **Fiche Google à revendiquer** (non revendiquée à ce jour) → récupérer le
   Place ID pour le lien « laisser un avis », et intégrer les 3 avis mot pour
   mot. Aucun avis inventé.
6. **Vraies photos de chantiers** (avant/après) : les images actuelles sont des
   illustrations Pexels, créditées dans les mentions légales.
7. **GTM** : remplacer `GTM-XXXXXXX` dans `assets/script.js` pour activer le
   suivi des conversions (dataLayer `generate_lead` + `phone_call` déjà câblés).
8. **Fourchettes de prix** (`prix-ravalement-facade`, pages services) : repères
   de marché, à faire valider par le client.

## Architecture

25 pages indexables en hub-and-spoke : accueil + 7 pages prestations (dont
copropriétés) + 5 pages guides/infos + 10 pages communes. Chaque page a son propre
title/meta/H1, un contenu unique, une FAQ, un schema Service + BreadcrumbList
(+ FAQPage) et un maillage vers les pages voisines. Les CTA des pages internes
pointent vers `/?devis=<cle>#devis`, qui pré-remplit le formulaire.

## Fichiers d'infrastructure

- `_headers` : cache long sur `/assets/*` (versionnés), en-têtes de sécurité.
- `wrangler.jsonc` : URLs propres + page 404 réellement servie.
- `.assetsignore` : empêche `.git` et les docs internes d'être servis.
- `robots.txt` / `sitemap.xml` / `llms.txt` : à re-générer au changement de domaine.
- `bascule-domaine.sh` / `indexnow.sh` : bascule du domaine, soumission Bing.

## Sources des photos (Pexels, licence libre)

- hero : photo 32115287 (peintre au rouleau sur nacelle)
- ravalement (feat) : 10282815 (façade classique ravalée)
- peinture façade : 1669754 (rouleau sur mur)
- enduit/reprises : 29274535 (façadier en nacelle)
- peinture intérieure : 7218579
- nettoyage : 5652626 (nettoyeur basse pression)
- fissures : 38561969 (truelle d'enduit)
- intro : 5493658 (enduiseur de dos)
- savoir-faire : 5767932 (taloche en lumière rasante)
