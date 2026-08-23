# Branching

The repository uses a single long-lived branch and short-lived work branches.
There is no `develop` branch and no release branches — releases are cut from
`main` automatically.

## `main`

`main` is always releasable and always deployed.

- Protected: no direct pushes, changes land through pull requests
- Every push runs CI (lint → typecheck → tests → build → PWA and SEO gates)
- Every push also runs semantic-release, which decides from the commit history
  whether a release is due, and publishes it if so

## Work branches

Branch off `main`, and name the branch after the change:

```
<type>/<short-kebab-description>
```

`<type>` matches the Conventional Commit type the work will use:

| Prefix | For |
| --- | --- |
| `feat/` | new capability |
| `fix/` | a bug |
| `perf/` | performance work |
| `refactor/` | restructuring with no behaviour change |
| `content/` | slokas, ashtotaras, stotras, blog posts, translations |
| `chore/` | tooling, dependencies, housekeeping |
| `ci/` | workflows and automation |
| `docs/` | documentation only |

Examples:

```
feat/sloka-audio-player
fix/telugu-font-fallback
content/hanuman-ashtotara
chore/bump-nuxt-4-5
```

Keep branches short-lived. A branch that outlives a few days is usually two
changes that should have been two branches.

## Pull requests

- Rebase or merge `main` in before asking for review; do not let a branch fall
  far behind
- CI must be green — the gates are not advisory
- Squash-merge, and make the squashed subject a valid conventional commit: it
  is the message semantic-release reads
- Delete the branch after merging

## Releases

Merging to `main` is the release trigger. semantic-release computes the next
version from the commits since the last tag, writes `CHANGELOG.md`, bumps
`package.json`, tags the commit and publishes a GitHub release. The release
commit carries `[skip ci]` so it does not trigger another run.

## Hotfixes

There is no separate hotfix flow. Branch `fix/...` off `main`, open a PR, and
merge it — the patch release follows automatically.
