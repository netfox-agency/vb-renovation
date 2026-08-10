#!/usr/bin/env bash
# Bascule le site vers le domaine définitif, en une commande.
#
#   ./bascule-domaine.sh vb-renovation.fr
#
# Remplace le domaine dans les 13 pages, le sitemap, le robots.txt et le
# llms.txt : canonical, og:url, og:image, et tous les @id/url du JSON-LD.
# Affiche un récapitulatif à vérifier avant de committer.

set -euo pipefail

ANCIEN="vb-renovation.netfox-france.workers.dev"

if [ $# -ne 1 ]; then
  echo "Usage : $0 <nouveau-domaine>"
  echo "Exemple : $0 vb-renovation.fr   (sans https://, sans slash final)"
  exit 1
fi

NOUVEAU="${1#https://}"; NOUVEAU="${NOUVEAU#http://}"; NOUVEAU="${NOUVEAU%/}"

cd "$(dirname "$0")"

FICHIERS=$(grep -rl "$ANCIEN" --include='*.html' --include='*.xml' --include='*.txt' --include='*.md' . || true)

if [ -z "$FICHIERS" ]; then
  echo "Aucune occurrence de $ANCIEN : la bascule a déjà été faite ?"
  exit 0
fi

echo "Bascule : $ANCIEN  ->  $NOUVEAU"
echo
echo "$FICHIERS" | sed 's/^/  /'
echo

# macOS et GNU n'ont pas la même syntaxe pour sed -i.
if sed --version >/dev/null 2>&1; then SED=(sed -i); else SED=(sed -i ''); fi
echo "$FICHIERS" | xargs "${SED[@]}" "s|$ANCIEN|$NOUVEAU|g"

# La date de dernière modification du sitemap suit la bascule.
AUJOURDHUI=$(date +%F)
echo "$FICHIERS" | grep -q 'sitemap.xml' && \
  xargs "${SED[@]}" "s|<lastmod>[0-9-]*</lastmod>|<lastmod>$AUJOURDHUI</lastmod>|g" <<< "./sitemap.xml"

RESTE=$(grep -rc "$ANCIEN" --include='*.html' --include='*.xml' --include='*.txt' . 2>/dev/null | grep -v ':0$' || true)
if [ -n "$RESTE" ]; then
  echo "ATTENTION, occurrences restantes :"; echo "$RESTE"; exit 1
fi

echo "Terminé. Vérifications :"
echo "  canonical accueil : $(grep -o 'rel="canonical" href="[^"]*"' index.html)"
echo "  sitemap           : $(grep -c '<loc>' sitemap.xml) URLs sur $NOUVEAU"
echo "  robots            : $(grep -o 'Sitemap:.*' robots.txt)"
echo
echo "Il reste à faire, hors dépôt :"
echo "  1. brancher $NOUVEAU sur le Worker Cloudflare (Settings > Domains & Routes)"
echo "  2. rediriger $ANCIEN vers $NOUVEAU en 301 (Redirect Rule Cloudflare)"
echo "  3. choisir www ou apex et rediriger l'autre en 301"
echo "  4. déclarer le site dans Search Console et y soumettre le sitemap"
echo "  4 bis. lancer ./indexnow.sh pour prévenir Bing immédiatement"
echo "  5. mettre l'adresse du site à jour sur la fiche Google"
echo
echo "Puis : git add -A && git commit -m \"Bascule sur $NOUVEAU\" && git push"
