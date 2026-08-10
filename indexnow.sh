#!/usr/bin/env bash
# Prévient Bing (et Yandex, Naver, Copilot, ChatGPT search) qu'une ou plusieurs
# URLs ont changé. Google n'utilise pas IndexNow, mais Bing indexe en heures
# là où il faut des jours autrement.
#
#   ./indexnow.sh                  -> soumet toutes les URLs du sitemap
#   ./indexnow.sh /ma-page         -> soumet une seule URL
set -euo pipefail
cd "$(dirname "$0")"
KEY="9530006e226540f899fd2445283c8b22"
HOST=$(grep -m1 '<loc>' sitemap.xml | sed -E 's|.*https://([^/]+)/.*|\1|')

if [ $# -ge 1 ]; then URLS="https://$HOST$1"
else URLS=$(grep -o '<loc>[^<]*</loc>' sitemap.xml | sed -E 's|</?loc>||g'); fi

LIST=$(echo "$URLS" | sed 's|.*|"&"|' | paste -sd, -)
BODY="{\"host\":\"$HOST\",\"key\":\"$KEY\",\"keyLocation\":\"https://$HOST/$KEY.txt\",\"urlList\":[$LIST]}"

CODE=$(curl -s -o /dev/null -w '%{http_code}' -X POST 'https://api.indexnow.org/indexnow' \
  -H 'Content-Type: application/json; charset=utf-8' -d "$BODY")
echo "IndexNow -> HTTP $CODE ($(echo "$URLS" | wc -l | tr -d ' ') URLs sur $HOST)"
[ "$CODE" = "200" ] || [ "$CODE" = "202" ] || { echo "Echec : verifier que https://$HOST/$KEY.txt est accessible"; exit 1; }
