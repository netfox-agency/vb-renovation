# VB Rénovation — Mots-clés, ciblage et audit des pages d'atterrissage

Complément opérationnel à `ADS-PLAN.md`, rédigé le 19/08/2026.
Le plan initial donnait la stratégie et l'architecture, mais **aucune liste de
mots-clés** et aucun contrôle des pages sur les critères propres au trafic payé.
C'est l'objet de ce document.

---

## 1. Deux problèmes bloquants sur les pages d'atterrissage

Les 25 pages du site sont d'excellentes pages de référencement naturel. Ce ne
sont pas encore de bonnes pages d'atterrissage publicitaires. Deux écarts, tous
les deux mesurés dans le code, pas supposés.

### 1.1 Le formulaire n'existe que sur la page d'accueil

Vérification faite sur les 25 pages : **une seule contient un formulaire**,
`index.html`. Sur les 24 autres, chaque bouton « Demander un devis » pointe vers
`/?devis=…#devis`, c'est-à-dire vers l'accueil.

Conséquence sur le trafic payé : on paie un clic sur la page ravalement, et pour
laisser ses coordonnées le visiteur doit **cliquer une deuxième fois, charger
une deuxième page** (l'accueil, plus lourde : 42 Ko de HTML et 11 images) puis
faire défiler jusqu'au formulaire. Chaque étape supplémentaire coûte une part
importante des visiteurs, et davantage encore sur mobile en zone rurale.

C'est le premier poste de perte, avant les enchères et avant les annonces. Tant
qu'il n'est pas corrigé, une partie du budget publicitaire finance des visites
qui n'aboutiront jamais.

**Correctif** : intégrer le formulaire court directement en bas de chaque page
de prestation et de commune, avec le champ « prestation » pré-rempli. Le bloc de
traçabilité déjà déployé continue de fonctionner à l'identique.

### 1.2 Aucune image de chantier sur les pages de prestation

Les pages de prestation contiennent **deux balises image chacune : le logo dans
l'en-tête et le logo dans le pied de page**. Aucune photo de mur, de chantier,
d'avant/après.

Les visuels existent pourtant dans le dépôt (`s-ravalement-facade.webp`,
`s-nettoyage-facade.webp`, `s-peinture-facade.webp`, `s-enduit-reprises.webp`)
mais ne servent que sur l'accueil.

Sur un métier où l'achat se décide sur le rendu visuel, une page sans image
demande au visiteur de faire confiance à du texte seul. C'est le deuxième poste
de perte.

**Correctif** : au minimum réutiliser les visuels existants sur les pages
correspondantes. Idéalement, des photos réelles de chantiers de l'entreprise :
c'est ce qui départage sur ce marché, et cela sert aussi les avis et la fiche
Google.

### 1.3 Le formulaire est un peu long pour du trafic payé

Six champs visibles : nom, téléphone, e-mail, commune, prestation, message. Pour
du référencement naturel c'est acceptable. Pour du trafic payé, la règle est de
ne rendre obligatoires que **nom, téléphone et besoin** : l'artisan rappelle et
obtient le reste en trente secondes de conversation. L'e-mail et la commune
peuvent rester présents mais facultatifs.

---

## 2. Correction d'architecture : trop de campagnes pour le budget

`ADS-PLAN.md` prévoit sept campagnes de recherche. Sur un budget de 120 €/mois
côté recherche, cela revient à **17 € par campagne et par mois**. Aucune
campagne n'atteint alors le volume nécessaire pour que Google apprenne quoi que
ce soit, et le pilotage devient illisible.

La segmentation doit se faire **par groupe d'annonces, pas par campagne**. Les
groupes partagent le budget et la donnée, tout en gardant une annonce et une
page d'atterrissage propres à chaque intention.

### Architecture retenue au lancement

```
Annonces Local Services            (paiement au prospect)

Campagne 1 — Marque                                    ~20 €/mois
└── VB Rénovation                        → /

Campagne 2 — Façade                                    ~100 €/mois
├── Ravalement                           → /ravalement-facade-lannion
├── Prix & devis                         → /prix-ravalement-facade
├── Nettoyage & démoussage               → /nettoyage-demoussage-facade-lannion
├── Peinture de façade                   → /peinture-facade-lannion
└── Fissures & infiltrations             → /fissures-impermeabilisation-lannion
```

Ouverture différée, quand la première campagne aura des données :

```
Campagne 3 — Communes                    → pages /peintre-<commune>
Campagne 4 — Peinture intérieure (hiver) → /peinture-interieure-lannion
Campagne 5 — Copropriétés                → /ravalement-copropriete-syndic
```

---

## 3. Les mots-clés

Correspondance **exacte `[…]` et expression `"…"` uniquement** au démarrage.
Aucune requête large tant que le compte n'a pas d'historique de conversions.

### Campagne 1 — Marque

```
[vb renovation]                    [vb renovation lannion]
[vb rénovation lannion]            [vb renovation van been]
"vb renovation"                    [van been peinture lannion]
```

Volume faible, clics à quelques centimes. Sert à ne pas laisser un concurrent ou
un annuaire se placer sur le nom de l'entreprise.

### Campagne 2 · Groupe « Ravalement » → `/ravalement-facade-lannion`

```
[ravalement façade lannion]              [ravalement de façade lannion]
[entreprise ravalement façade lannion]   [ravalement façade trégor]
[ravalement façade côtes d'armor]        [façadier lannion]
[ravaleur lannion]                       [entreprise ravalement 22]
[refaire façade maison lannion]          [rénovation façade lannion]
"ravalement de façade"                   "entreprise de ravalement"
"façadier"                               "rénovation de façade"
```

### Campagne 2 · Groupe « Prix & devis » → `/prix-ravalement-facade`

```
[prix ravalement façade]                 [prix ravalement façade m2]
[tarif ravalement façade]                [prix ravalement maison]
[combien coûte un ravalement de façade]  [devis ravalement façade]
[coût ravalement façade]                 [prix ravalement façade 100m2]
"prix ravalement façade"                 "devis ravalement"
```

Intention d'information mais fortement commerciale : la page affiche des
fourchettes réelles, ce que presque aucun concurrent ne fait. C'est un
différenciateur exploitable dans le titre de l'annonce.

### Campagne 2 · Groupe « Nettoyage & démoussage » → `/nettoyage-demoussage-facade-lannion`

```
[nettoyage façade lannion]               [démoussage façade lannion]
[nettoyage façade trégor]                [hydrofuge façade lannion]
[nettoyer façade verte]                  [façade noircie nettoyage]
[traitement anti mousse façade]          [lavage façade maison]
"nettoyage de façade"                    "démoussage façade"
"hydrofuge façade"
```

Petit panier, décision rapide, faible concurrence. C'est le groupe qui remplit
le planning entre deux gros chantiers, et le meilleur candidat pour accumuler
les premières conversions dont l'algorithme a besoin.

**Négatif propre à ce groupe** : `toiture`, `toit`, `couvreur` — sauf si Luigi
fait aussi le démoussage de toiture, à confirmer.

### Campagne 2 · Groupe « Peinture de façade » → `/peinture-facade-lannion`

```
[peinture façade lannion]                [peintre façade lannion]
[repeindre façade maison]                [peinture extérieure maison lannion]
[peinture mur extérieur lannion]         [prix peinture façade]
"peinture de façade"                     "repeindre sa façade"
```

### Campagne 2 · Groupe « Fissures & infiltrations » → `/fissures-impermeabilisation-lannion`

```
[fissure façade lannion]                 [réparation fissure façade]
[traitement fissure mur extérieur]       [imperméabilisation façade]
[infiltration mur extérieur]             [mur qui prend l'humidité extérieur]
[fissure mur maison que faire]           [étanchéité façade]
"fissure façade"                         "imperméabilisation de façade"
```

Recherche inquiète, donc décision rapide et taux de transformation élevé. À
surveiller de près : c'est souvent le groupe au meilleur coût par demande.

### Campagne 3 — Communes (ouverture différée)

Un groupe par commune, pointant vers sa page dédiée. Le gain est mécanique : la
page reprend le nom de la commune, donc le score de qualité monte et le clic
coûte moins cher.

```
Perros-Guirec   [ravalement façade perros guirec]  [peintre perros guirec]
Trégastel       [ravalement façade trégastel]      [peintre trégastel]
Trébeurden      [ravalement façade trébeurden]     [peintre trébeurden]
Tréguier        [ravalement façade tréguier]       [peintre tréguier]
Pleumeur-Bodou  [ravalement façade pleumeur bodou] [peintre pleumeur bodou]
Louannec        [ravalement façade louannec]       [peintre louannec]
Plestin         [ravalement façade plestin]        [peintre plestin les grèves]
Penvénan        [ravalement façade penvénan]       [peintre penvénan]
Paimpol         [ravalement façade paimpol]        [peintre paimpol]
Guingamp        [ravalement façade guingamp]       [peintre guingamp]
```

### Campagne 4 — Peinture intérieure, campagne d'hiver → `/peinture-interieure-lannion`

```
[peintre en bâtiment lannion]            [peintre lannion]
[peinture intérieure lannion]            [peintre appartement lannion]
[devis peinture intérieure]              [peintre professionnel lannion]
[refaire peinture maison lannion]        [peinture plafond lannion]
"peintre en bâtiment"                    "peinture intérieure"
```

Attention : `peintre` seul attire l'art, la carrosserie et l'emploi. Ce groupe
exige les listes de négatifs ci-dessous, sans exception.

### Campagne 5 — Copropriétés → `/ravalement-copropriete-syndic`

```
[ravalement immeuble]                    [ravalement copropriété]
[entreprise ravalement syndic]           [ravalement façade immeuble côtes d'armor]
[devis ravalement copropriété]
"ravalement d'immeuble"
```

Volume très faible, panier très élevé, cycle long. À laisser tourner à petit
budget en permanence plutôt qu'à pousser.

---

## 4. Les listes de négatifs, au niveau du compte

Trois listes partagées, appliquées à toutes les campagnes. Une exclusion ajoutée
une fois protège immédiatement l'ensemble.

**Liste 1 — Emploi et formation**
```
emploi · recrutement · offre d'emploi · salaire · cap peinture · formation
apprentissage · stage · alternance · devenir peintre · fiche métier
auto-entrepreneur · statut · convention collective · intérim · pole emploi
```

**Liste 2 — Gratuit, bricolage et grande distribution**
```
gratuit · pas cher · tuto · tutoriel · comment faire · soi-même · diy
leroy merlin · castorama · brico dépôt · bricomarché · point p · weldom
location échafaudage · louer échafaudage · matériel · nuancier · pistolet
```

**Liste 3 — Hors métier**
```
artiste peintre · peinture artistique · tableau · toile · aquarelle
peinture voiture · carrosserie · peinture automobile · peinture sol garage
peinture poudre · thermolaquage · ravalement dentaire · peintre décorateur
plaquiste · maçon · couvreur · toiture · charpente · isolation combles
```

**Liste 4 — À activer si l'ITE n'est pas proposée** (question ouverte)
```
isolation extérieure · ITE · isolation thermique extérieure · maprimerénov
prime rénovation · bardage · polystyrène façade · isolation par l'extérieur
```

---

## 5. Ciblage

| Réglage | Valeur | Pourquoi |
|---|---|---|
| Zone | Rayon 25 km autour de Lannion | Couvre Perros-Guirec, Trébeurden, Tréguier, Plestin |
| Extension | Paimpol et Guingamp en second temps | À ouvrir seulement si le coût par demande le permet |
| Type de présence | **Présence uniquement** | Le défaut « présence ou intérêt » diffuse hors zone |
| Appareils | Mobile prioritaire | 8 recherches locales sur 10 se font au téléphone |
| Horaires | Plages où le téléphone est décroché | Question ouverte, bloquante pour ce réglage |
| Langue | Français | |
| Réseau Display | **Décoché** | Coché par défaut, engloutit le budget sans intention |
| Partenaires de recherche | Décoché au démarrage | À tester plus tard, pas avec un budget d'apprentissage |

---

## 6. Ce que le marché a confirmé le 19/08/2026

La concurrence locale directe est constituée d'artisans installés : SRC
Ravalement, Artisan Le Gall, RS Peinture, SASU Pascal L'Hostis, Esprit Déco,
A.B Raval. Tous ont plus d'avis que VB Rénovation.

Mais la concurrence **publicitaire** sur ces requêtes est majoritairement le fait
d'**annuaires et de revendeurs de prospects** : Socorebat, Travaux.com,
RDV Artisans, Smouky, ContactArtisan. Ils achètent les requêtes génériques pour
revendre le contact.

Conséquence stratégique : inutile de se battre au budget sur « ravalement façade »
seul, ils paieront toujours plus. L'avantage se prend sur ce qu'ils ne peuvent
pas faire — **le local précis et le spécifique** : la commune, le type de
désordre, la fourchette de prix affichée, le nom de l'artisan et son adresse.
C'est exactement ce que le site sait faire et eux non.

---

## 7. Reste à trancher avant de lancer

1. **L'isolation thermique par l'extérieur est-elle proposée ?** Détermine soit
   une campagne dédiée à fort panier, soit la liste de négatifs n° 4.
2. **Le démoussage de toiture est-il fait ?** Détermine les négatifs du groupe
   nettoyage.
3. **Quel budget mensuel ?** À annoncer TTC au client, il ne récupère pas la TVA.
4. **À quelles heures le téléphone est-il décroché ?** Bloquant pour le
   calendrier de diffusion.
5. **Le suivi des conversions** : conteneur GTM, propriété GA4, actions de
   conversion, Consent Mode v2. Aucun n'existe à ce jour.
