#!/usr/bin/env bash
#
# Lighthouse CI for Devanilayam — SSR-aware.
#
# The lighthouserc*.json files hold assertions only (no URL, no server), so
# `lhci autorun` on its own cannot locate a static dir for this SSR app. This
# script boots the production build and points Lighthouse at the running
# server, passing the routes as --collect.url flags.
#
# Deliberately a local script rather than a workflow step: it needs Chrome and
# several runs per URL, which is slower and noisier than the gates that guard
# every push. Run it before a release, or when touching layout, fonts or images.
#
# Usage:
#   scripts/seo/lighthouse.sh                          # desktop config, /en
#   scripts/seo/lighthouse.sh lighthouserc.mobile.json # throttled mobile
#   URLS="/en /te /en/slokas" scripts/seo/lighthouse.sh
#   BUILD=1 scripts/seo/lighthouse.sh                  # force a fresh build
#
# Accessibility is an error gate at 0.9; performance, SEO and best-practices
# are warnings so a noisy local run never blocks work.

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

PORT="${PORT:-3230}"
BASE="http://127.0.0.1:${PORT}"
CONFIG="${1:-lighthouserc.json}"
# Locale-prefixed: "/" is only a redirect stub under the i18n prefix strategy,
# and auditing a meta-refresh page measures nothing.
URLS="${URLS:-/en}"
SERVER_PID=""

if [[ -t 1 ]]; then G=$'\e[32m'; R=$'\e[31m'; D=$'\e[2m'; B=$'\e[1m'; X=$'\e[0m'; else G=""; R=""; D=""; B=""; X=""; fi

cleanup() { [[ -n "$SERVER_PID" ]] && kill "$SERVER_PID" 2>/dev/null; }
trap cleanup EXIT INT TERM

[[ -f "$CONFIG" ]] || { printf "${R}Config not found: %s${X}\n" "$CONFIG"; exit 1; }

if ! command -v google-chrome > /dev/null 2>&1 \
   && ! command -v chromium > /dev/null 2>&1 \
   && [[ -z "${CHROME_PATH:-}" ]]; then
   printf "${R}No Chrome found.${X} Install Chrome/Chromium, or set CHROME_PATH.\n"
   exit 2
fi

if [[ "${BUILD:-0}" == "1" || ! -f .output/server/index.mjs ]]; then
   printf "${D}Building production output…${X}\n"
   bun run build > /tmp/seo-build.log 2>&1 \
      || { printf "${R}Build failed.${X} See /tmp/seo-build.log\n"; tail -20 /tmp/seo-build.log; exit 1; }
fi

printf "${D}Starting server on :%s …${X}\n" "$PORT"
PORT="$PORT" HOST=127.0.0.1 node .output/server/index.mjs > /tmp/seo-server.log 2>&1 &
SERVER_PID=$!
ready=0
for _ in $(seq 1 60); do curl -sf -o /dev/null "$BASE/" && { ready=1; break; }; sleep 1; done
[[ "$ready" == "1" ]] || { printf "${R}Server never became ready.${X}\n"; tail -20 /tmp/seo-server.log; exit 1; }

URL_FLAGS=()
for path in $URLS; do URL_FLAGS+=("--collect.url=${BASE}${path}"); done

printf "\n${B}Lighthouse${X}  config=${CONFIG}  urls=[%s]\n\n" "$URLS"
bunx --bun @lhci/cli@0.15.x autorun --config="$CONFIG" "${URL_FLAGS[@]}"
STATUS=$?

if [[ "$STATUS" == "0" ]]; then
   printf "\n${G}Lighthouse assertions passed.${X}\n"
else
   printf "\n${R}Lighthouse assertions failed (see report links above).${X}\n"
fi
exit "$STATUS"
