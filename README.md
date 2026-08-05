# VB Rénovation — site vitrine

Site one-page statique (HTML/CSS/JS pur, aucun build) pour **VB Rénovation**,
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

1. **Clé Web3Forms** : remplacer `REMPLACER_PAR_VOTRE_CLE_WEB3FORMS` dans
   `index.html` (tant que le placeholder est là, le formulaire bascule sur le
   repli téléphone). Tester par un envoi réel depuis un vrai navigateur
   (l'anti-bot Web3Forms bloque les tests headless).
2. **Domaine** : ajouter `<link rel="canonical">`, `og:url`, `og:image`
   (assets/img/og.jpg est prêt, 1200×630), `sitemap.xml`, `robots.txt`,
   `llms.txt` et l'`@id`/`url` du schema.org une fois le domaine choisi.
3. **Logo HD** : le fichier fourni fait 160×160 (issu de la fiche Google).
   Demander l'original en haute résolution pour l'og:image et le favicon.
4. **À confirmer avec le client** (rien n'a été inventé, mais à valider) :
   - assurance décennale (compagnie + n° de police, cité dans « Artisan assuré »)
   - SIRET, forme juridique, nom du gérant (mentions légales)
   - e-mail de contact
   - horaires d'ouverture (la fiche Google indique « Ferme à 18:00 »)
   - liste exacte des communes desservies
   - Place ID de la fiche Google pour les boutons « Laisser un avis »
     (aujourd'hui : lien Maps par requête nom+adresse)
5. **Avis Google** : intégrer les 3 avis mot pour mot depuis la fiche
   (section prévue, aucun avis inventé), et tenir `aggregateRating` à jour.
6. **Vraies photos de chantiers** : les images actuelles sont des
   illustrations Pexels (licence libre, créditées dans les mentions légales).
   Remplacer progressivement par les chantiers VB Rénovation (section
   « Réalisations » à ajouter à ce moment-là).
7. **GTM** : remplacer `GTM-XXXXXXX` dans `assets/script.js` pour activer le
   suivi des conversions (dataLayer `generate_lead` + `phone_call` déjà câblés).

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
