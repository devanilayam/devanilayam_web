# Security policy

## Supported versions

Devanilayam is a continuously deployed website. Only the version currently live
at [devanilayam.com](https://devanilayam.com) is supported; fixes ship forward
rather than being backported to earlier tags.

## Reporting a vulnerability

Please report security issues privately, not as a public GitHub issue.

- Preferred: open a [private security advisory](https://github.com/devanilayam/devanilayam_web/security/advisories/new)
- Alternatively, email **moulibheemaneti99@gmail.com** with `SECURITY` in the
  subject line

Please include:

- What the issue is and roughly how severe you believe it to be
- The steps needed to reproduce it, including the URL and browser
- Anything you already know about the impact — what an attacker could read,
  change or break

## What to expect

- An acknowledgement within **3 working days**
- An initial assessment, with a severity and a rough timeline, within
  **7 working days**
- A fix deployed as soon as it is ready; high-severity issues take priority
  over everything else in flight
- Credit in the release notes if you would like it — tell us the name or handle
  to use

Please give us a reasonable opportunity to fix an issue before disclosing it
publicly.

## Scope

In scope:

- The website and its server routes
- The service worker, web app manifest and installed PWA behaviour
- The build, release and deployment configuration in this repository

Out of scope:

- Findings that require a compromised device, browser or account
- Missing hardening headers with no demonstrated impact
- Automated scanner output submitted without a working proof of concept
- Denial of service through volumetric traffic
- Social engineering, physical attacks, and anything targeting the maintainers
  personally

## Safe harbour

We will not pursue or support action against anyone who reports an issue in
good faith, stays within the scope above, avoids privacy violations and service
degradation, and gives us a chance to respond before going public.
