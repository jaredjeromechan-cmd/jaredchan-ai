# Spec: /agency — the living office (v1)

Date: 2026-07-17 | Gate: 31HKS | Project: jaredchan.ai

## Goal

A public page at jaredchan.ai/agency that makes the JaredChan Agency visible and alive:
a pixel-art office where the six agents visibly exist and work, backed by real
(sanitised) vault data, so Jared can show the agency in any room instead of pointing at
a GitHub repo.

## Amendment (17 Jul, greenlit): entry via The Backrooms

The living office is housed in "The Backrooms". Entry: in the homepage's expanded view
(avatar revealed at sphere centre), clicking the avatar face navigates to The Backrooms.
Transition mirrors the existing about.builder01 path with one difference: the expanded
view collapses back to original size, moves along the same leftward path as builder01,
then white pixels form "The Backrooms" header. This touches the homepage minimally
(one click target + transition reuse); all PORTFOLIO-EFFECTS.md invariants apply.

## Acceptance criteria

- [ ] The Backrooms page served at `/backrooms` (new file under `portfolio/`, own HTML)
      and reachable by direct URL
- [ ] Homepage: avatar face in expanded view becomes clickable; exit transition follows
      the builder01 path (collapse to original size, move left, white pixels form "The
      Backrooms" header); no other homepage behaviour changes; effects invariants hold
- [ ] Dark pixel-art office scene (canvas, vanilla JS, no frameworks, matching the
      site's black aesthetic) with 6 animated sprites: 31HKS (doorway), EE (drafting
      table), PepperPotts (patrolling), Sarah.T (checkpoint desk), TCD (writing desk),
      SingSangSung (whiteboard). Each has a name tag and an idle + working animation
- [ ] Each agent shows a status line and stat sourced ONLY from `agency-data.json`
      (e.g. "TCD: 14 decisions logged this month")
- [ ] Below the scene: agency intro, pipeline diagram, and one card per agent with
      role + softened origin story (no real names, surnames, or identifying detail)
- [ ] Replay: a "replay a real session" button plays a curated event log from
      `agency-data.json` at high speed - sprites act out events with short captions
- [ ] Data pipeline: `export-agency-data` script in the continuity vault produces
      `agency-data.json` on an allowlist schema; publish flow is manual: run script,
      review the JSON, copy into `portfolio/`, deploy
- [ ] Privacy rules enforced by the exporter, not by trust: personal-project entries
      may show titles; work-capacity entries appear as aggregate counts only, UNLESS an
      entry carries an explicit `public_title:` field (written at logging time, shown
      for review at export); no employer names, file paths, or sub-weekly timestamps
      in the export
- [ ] Page is responsive at phone width; `prefers-reduced-motion` gets a static scene
      with the same information; copy is Singapore English with no em dashes
- [ ] Homepage nav link to /agency: OUT OF SCOPE this round (homepage is fragile);
      page reachable by direct URL

## Out of scope (this round)

Tier 3 interactivity, live telemetry, auto-sync, homepage integration, multiple
replays, sound.

## Verification plan

1. Local serve; check scene, animations, stats, and replay in the browser
2. Phone-width and reduced-motion checks
3. Read the exported agency-data.json line by line against the privacy rules
4. PepperPotts sweep on the new code; Sarah.T gates the actual deploy (public publish)
