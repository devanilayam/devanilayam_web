#!/usr/bin/env bash
#
# Shared helpers for the verification gates: boot the production build on a
# local port, resolve the locale entry document, and tear the server down.
#
# Source this file, then call `start_preview_server` / `stop_preview_server`.

# Builds if there is no server output yet, then starts it on $1 (default 3210).
# Exports SERVER_URL on success; returns non-zero if the server never answers.
start_preview_server() {
   local port="${1:-3210}"
   local root="${PROJECT_ROOT:?PROJECT_ROOT must be set before sourcing serve.sh}"

   if [ ! -f "$root/.output/server/index.mjs" ]; then
      echo "▸ No build found — running \`bun run build\` first"
      (cd "$root" && bun run build) || return 1
   fi

   SERVER_LOG="$(mktemp)"

   PORT="$port" HOST=127.0.0.1 node "$root/.output/server/index.mjs" > "$SERVER_LOG" 2>&1 &
   SERVER_PID=$!

   SERVER_URL="http://127.0.0.1:$port"

   local attempt
   for attempt in $(seq 1 60); do
      if curl -fs -o /dev/null "$SERVER_URL/"; then
         return 0
      fi
      sleep 1
   done

   cat "$SERVER_LOG" >&2
   return 1
}

stop_preview_server() {
   [ -n "${SERVER_PID:-}" ] && kill "$SERVER_PID" 2>/dev/null
   [ -n "${SERVER_PID:-}" ] && wait "$SERVER_PID" 2>/dev/null
   [ -n "${SERVER_LOG:-}" ] && rm -f "$SERVER_LOG"
   return 0
}

# `/` is a meta-refresh into the default locale (the i18n strategy is
# `prefix`), and curl does not follow those. Echoes the resolved path.
resolve_entry_path() {
   local body
   body="$(curl -fsSL "$SERVER_URL/")"

   local refresh
   refresh="$(echo "$body" | grep -o 'url=/[A-Za-z0-9_/-]*' | head -n1 | cut -d= -f2)"

   echo "${refresh:-/}"
}
