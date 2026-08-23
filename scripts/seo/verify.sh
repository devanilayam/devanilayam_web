#!/usr/bin/env bash
#
# SEO gate: boots the production build and asserts that the machine-readable
# surface search engines and AI crawlers rely on is actually in the SSR HTML —
# not added later by client-side JavaScript.
#
# Usage: bun run seo:verify

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PROJECT_ROOT="$ROOT"
# shellcheck source=../lib/serve.sh
. "$ROOT/scripts/lib/serve.sh"

failures=0

fail() {
   printf '  \033[31m✗\033[0m %s\n' "$1"
   failures=$((failures + 1))
}

pass() {
   printf '  \033[32m✓\033[0m %s\n' "$1"
}

# Asserts that $2 (a grep -E pattern) appears in the document held in $DOCUMENT.
expect_in_document() {
   local label="$1"
   local pattern="$2"

   if echo "$DOCUMENT" | grep -Eq "$pattern"; then
      pass "$label"
   else
      fail "$label"
   fi
}

trap stop_preview_server EXIT

if ! start_preview_server "${SEO_VERIFY_PORT:-3220}"; then
   echo "The built server did not start — cannot verify."
   exit 1
fi

ENTRY="$(resolve_entry_path)"
DOCUMENT="$(curl -fsSL "$SERVER_URL$ENTRY")"

echo "▸ Crawlability"

if curl -fs "$SERVER_URL/robots.txt" | grep -q "Sitemap:"; then
   pass "robots.txt is served and points at a sitemap"
else
   fail "robots.txt is missing or does not reference a sitemap"
fi

# /sitemap.xml redirects to the locale-aware index, so follow redirects.
if curl -fsL "$SERVER_URL/sitemap.xml" | grep -q "<urlset\|<sitemapindex"; then
   pass "sitemap.xml resolves to a sitemap"
else
   fail "sitemap.xml is missing or empty"
fi

echo "▸ Document head ($ENTRY)"

expect_in_document "the page has a <title>" "<title>[^<]+</title>"
expect_in_document "the page has a meta description" 'name="description" content="[^"]+"'
expect_in_document "the page declares a canonical URL" 'rel="canonical"'
expect_in_document "the page declares hreflang alternates" 'rel="alternate"[^>]*hreflang='
expect_in_document "the <html> element declares a language" '<html[^>]*lang="[a-z]'

echo "▸ Social cards"

expect_in_document "og:title is set" 'property="og:title"'
expect_in_document "og:description is set" 'property="og:description"'
expect_in_document "og:image is set" 'property="og:image"'
expect_in_document "twitter:card is set" 'name="twitter:card"'

echo "▸ Structured data"

# Delegated to a script so the regex survives shell quoting.
if jsonld_blocks=$(echo "$DOCUMENT" | bun "$ROOT/scripts/lib/check-jsonld.mjs"); then
   pass "all $jsonld_blocks JSON-LD block(s) parse as JSON"
else
   fail "the page ships no JSON-LD, or a block is not valid JSON"
fi

echo "▸ Content"

if echo "$DOCUMENT" | grep -q "<h1"; then
   pass "the page renders an <h1>"
else
   fail "the page renders no <h1>"
fi

# SSR is the whole point: an empty shell means crawlers see nothing.
body_text=$(echo "$DOCUMENT" | sed -e 's/<[^>]*>/ /g' | tr -s ' \n' ' ' | wc -c)

if [ "$body_text" -gt 500 ]; then
   pass "the server-rendered HTML carries $body_text characters of text"
else
   fail "the server-rendered HTML is nearly empty ($body_text characters) — is SSR on?"
fi

echo

if [ "$failures" -gt 0 ]; then
   echo "SEO verification failed with $failures problem(s)."
   exit 1
fi

echo "SEO verification passed."
