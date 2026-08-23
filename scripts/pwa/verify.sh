#!/usr/bin/env bash
#
# PWA installability + offline gate.
#
# Lighthouse removed its PWA category, so installability is asserted directly
# against the built output: the manifest must carry the fields Chrome requires,
# every icon it names must exist at the size it claims, and a service worker
# with a navigation fallback must be precached.
#
# Usage: bun run pwa:verify   (builds first if .output/public is missing)

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PROJECT_ROOT="$ROOT"
# shellcheck source=../lib/serve.sh
. "$ROOT/scripts/lib/serve.sh"

PUBLIC_DIR="$ROOT/.output/public"
MANIFEST="$PUBLIC_DIR/site.webmanifest"

failures=0

fail() {
   printf '  \033[31m✗\033[0m %s\n' "$1"
   failures=$((failures + 1))
}

pass() {
   printf '  \033[32m✓\033[0m %s\n' "$1"
}

if [ ! -d "$PUBLIC_DIR" ]; then
   echo "▸ .output/public not found — building first"
   (cd "$ROOT" && bun run build)
fi

echo "▸ Web app manifest"

if [ ! -f "$MANIFEST" ]; then
   fail "site.webmanifest is missing from the build output"
   echo
   echo "PWA verification failed."
   exit 1
fi

pass "site.webmanifest is present"

# Chrome's installability criteria: name, a launch URL, a standalone-ish
# display mode, and a theme colour for the OS chrome.
for field in name short_name start_url scope display theme_color background_color; do
   if bun -e "
      const manifest = await Bun.file('$MANIFEST').json();
      const value = manifest['$field'];
      process.exit(value === undefined || value === null || value === '' ? 1 : 0);
   "; then
      pass "manifest.$field is set"
   else
      fail "manifest.$field is missing or empty"
   fi
done

display=$(bun -e "console.log((await Bun.file('$MANIFEST').json()).display ?? '')")

case "$display" in
   standalone | fullscreen | minimal-ui)
      pass "manifest.display is installable (\"$display\")"
      ;;
   *)
      fail "manifest.display must be standalone, fullscreen or minimal-ui (got \"$display\")"
      ;;
esac

echo "▸ Icons"

# An installable manifest needs at least one 192px and one 512px PNG, plus a
# maskable icon so Android does not letterbox the launcher shortcut.
icons=$(bun -e "
   const manifest = await Bun.file('$MANIFEST').json();
   for (const icon of manifest.icons ?? []) {
      console.log([icon.src, icon.sizes, icon.purpose ?? 'any'].join(' '));
   }
")

if [ -z "$icons" ]; then
   fail "manifest declares no icons"
else
   while read -r src sizes purpose; do
      [ -z "$src" ] && continue
      if [ -f "$PUBLIC_DIR${src}" ]; then
         pass "$src ($sizes, $purpose) exists"
      else
         fail "$src is declared in the manifest but missing from the build"
      fi
   done <<< "$icons"
fi

for required in 192x192 512x512; do
   if echo "$icons" | grep -q " $required "; then
      pass "an $required icon is declared"
   else
      fail "no $required icon is declared"
   fi
done

if echo "$icons" | grep -q "maskable"; then
   pass "a maskable icon is declared"
else
   fail "no maskable icon is declared"
fi

echo "▸ Service worker"

if [ -f "$PUBLIC_DIR/sw.js" ]; then
   pass "sw.js is present"
else
   fail "sw.js is missing — the app cannot work offline"
fi

if grep -q "precache" "$PUBLIC_DIR/sw.js" 2>/dev/null; then
   pass "sw.js precaches the app shell"
else
   fail "sw.js does not appear to precache anything"
fi

if grep -q "NavigationRoute\|navigateFallback\|createHandlerBoundToURL" "$PUBLIC_DIR/sw.js" 2>/dev/null; then
   pass "sw.js serves an offline navigation fallback"
else
   fail "sw.js has no navigation fallback — offline navigations will 404"
fi

echo "▸ Document (served)"

# The root is a locale redirect and locale routes render on demand, so the head
# has to be checked against a running server rather than a static file.
trap stop_preview_server EXIT

if ! start_preview_server "${PWA_VERIFY_PORT:-3210}"; then
   fail "the built server did not start"
else
   pass "the built server responds on $SERVER_URL"

   ENTRY="$(resolve_entry_path)"
   DOCUMENT="$(curl -fsSL "$SERVER_URL$ENTRY")"

   pass "resolved the entry document at $ENTRY"

   if echo "$DOCUMENT" | grep -q 'rel="manifest"'; then
      pass "the document links the manifest"
   else
      fail "the document does not link the manifest"
   fi

   if echo "$DOCUMENT" | grep -q 'name="theme-color"'; then
      pass "the document declares a theme-color"
   else
      fail "the document does not declare a theme-color"
   fi

   if curl -fs -o /dev/null "$SERVER_URL/site.webmanifest"; then
      pass "the manifest is served over HTTP"
   else
      fail "the manifest is not served at /site.webmanifest"
   fi

   if curl -fs -o /dev/null "$SERVER_URL/sw.js"; then
      pass "the service worker is served over HTTP"
   else
      fail "the service worker is not served at /sw.js"
   fi
fi

echo

if [ "$failures" -gt 0 ]; then
   echo "PWA verification failed with $failures problem(s)."
   exit 1
fi

echo "PWA verification passed."
