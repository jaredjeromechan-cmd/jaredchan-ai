# CLAUDE.md — jaredchan.ai

This repo is Jared Chan's personal portfolio site: the single self-contained file `portfolio/index.html`, served by Firebase Hosting at **www.jaredchan.ai** (the bare `jaredchan.ai` points here too).

It used to live inside the chan-teo-homebase repo and was split out into its own repo and its own Firebase project on 12/07/2026. It shares nothing with Homebase any more: separate git repo, separate Firebase project, no Firestore, no auth.

## Who you're working with

Jared is the owner and **not a developer**. Instructions to him must be plain language, exact copy-paste commands, one step at a time, one terminal tab, and **never chained with `&&`**. Simulate anything end-to-end before handing it over.

**Style:** Singapore English spelling. Dates DD/MM/YYYY, 24-hour time. **No em dashes** anywhere (chat, comments, UI copy). Direct and concise.

## The one big rule

**Before touching anything in `portfolio/`, read `PORTFOLIO-EFFECTS.md` in full.** It is the handoff brief for the site's visual effects: the design fiction (everything is matter from the particle sphere), Jared's standing rules (every animation must also play on refresh; browser back/forward play the full ceremonies; any input skips), the engineering invariants (stall forgiveness, the warm gate, fxAbort hygiene), and the required verification workflow. Extend the site in that voice; do not bolt on effects that ignore it.

Drafted copy is shown to Jared for approval before deploying; his verbatim text ships as-is.

## Firebase

- Project ID: `jaredchan-ai`, owned by Jared's **personal** account (jaredjeromechan@gmail.com).
- The Firebase CLI's global default is Jared's work account. This directory is pinned to the personal account with `firebase login:use jaredjeromechan@gmail.com` (run inside this directory). **Never run `firebase login` or `firebase logout`**, they would disturb the work setup. If the pin is ever lost, re-run the `login:use` command above inside this directory.
- Deploy: `firebase deploy` (hosting only, there is nothing else).
- No secrets live in this repo and none should ever be added: the repo is public and the site is a static page.
