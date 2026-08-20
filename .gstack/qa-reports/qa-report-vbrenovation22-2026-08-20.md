# QA conversion multi-formats — landings VB Rénovation
20/08/2026 · question : « l'expérience de conversion est-elle au mieux sur tous les formats, surtout mobile ? »

## Verdict : oui après 4 correctifs, dont 1 qui coûtait cher
Santé avant : 82/100 · après : 96/100

## Trouvailles et correctifs (tous vérifiés puis déployés, CSS v9)
| ID | Gravité | Constat mesuré | Correctif |
|---|---|---|---|
| 001 | HIGH | Champs de formulaire en 15px : iOS Safari zoome toute la page au focus, le visiteur perd le formulaire des yeux | 16px partout, 46px de haut sur tactile |
| 002 | MEDIUM | Tableau de prix débordant de sa boîte sous 640px | défilement interne (overflow-x auto) |
| 003 | LOW | CTA hero à 298px au lieu de pleine largeur entre 480 et 560px | colonne + width 100% dès 560px |
| 004 | POLISH | Fil d'Ariane : zone tactile de 16px | padding, 37px |

## Ce qui a été validé sans correctif
- Au-dessus du pli mobile (385x794) : H1, 2 CTA (devis + appel), 4 points ✓, tout visible sans scroller ; formulaire au 1er geste de scroll (1004px)
- Validation du formulaire testée en réel : téléphone trop court → seul f-tel signalé, focus dessus, message sous le champ, erreur effacée dès la correction ; champ e-mail replié inaccessible au clavier (tabindex -1)
- Champs anti-zoom vérifiés sur les pages avec et sans tableau (copro : boîte budget sans chiffre, voulue)
- Tablette 768 : hero 1 col, étapes/engagements/risques/réassurance 2 col, zéro débordement
- Desktop 1280x720 : bouton d'envoi au-dessus du pli (690px)
- Grand écran 1600 : conteneur 1200px centré (marges 200px), pas d'étirement
- Aucune erreur console sur aucun format
- Callbar mobile : masquée quand le formulaire est à l'écran, réapparaît ensuite (translateY)
- FAQ : ouverture exclusive native testée

## Limites du banc de test
- Viewport minimal réel du panneau : 385px (pas de test 320px)
- Pas de soumission réelle du formulaire (clé Web3Forms active → mail à Luigi) ; la soumission réelle a été validée en production le 17/08 (HTTP 200, success:true)

## Restent hors de portée du code (rappel)
Vraies photos avant/après, textes des 3 avis Google, attestation décennale.
