#!/usr/bin/env bash
#
# Lighthouse CI against the production build.
#
# Deliberately a local script rather than a workflow step: it needs Chrome and
# three runs per URL, which is slower and noisier than the gates that guard
# every push. Run it before a release, or when touching layout or fonts.
#
#   bun run seo:lighthouse            # desktop preset
#   bun run seo:lighthouse -- mobile  # mobile preset (slow 4G, moto-g-class CPU)
#
# Accessibility is an error gate at 0.9; performance, SEO and best-practices
# are warnings so a noisy local run never blocks work.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

PROFILE="${1:-desktop}"

case "$PROFILE" in
   desktop)
      CONFIG="lighthouserc.json"
      ;;
   mobile)
      CONFIG="lighthouserc.mobile.json"
      ;;
   *)
      echo "Unknown profile \"$PROFILE\" — expected \"desktop\" or \"mobile\"." >&2
      exit 2
      ;;
esac

if ! command -v google-chrome > /dev/null 2>&1 \
   && ! command -v chromium > /dev/null 2>&1 \
   && [ -z "${CHROME_PATH:-}" ]; then
   echo "No Chrome found. Install Chrome/Chromium, or set CHROME_PATH to a binary." >&2
   exit 2
fi

if [ ! -f "$ROOT/.output/server/index.mjs" ]; then
   echo "▸ No build found — running \`bun run build\` first"
   bun run build
fi

echo "▸ Lighthouse CI ($PROFILE, config: $CONFIG)"

# The port has to match the URLs in the config; LHCI starts the server itself.
PORT=3230 HOST=127.0.0.1 bunx --bun @lhci/cli@0.15.x autorun --config="$CONFIG"

echo
echo "Reports written to .lighthouseci/$PROFILE"
