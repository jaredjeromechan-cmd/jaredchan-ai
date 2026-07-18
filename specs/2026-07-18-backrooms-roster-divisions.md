# Spec: Backrooms roster grouped by division

Date: 2026-07-18 | Gate: 31HKS | Project: jaredchan.ai
Design agreed in session 18/07/2026 (A+C direction; roster becomes the building's
staff directory). Builds on spec 2026-07-18-backrooms-plaque-and-replay-label.

## Goal

The roster shows the org's structure, not just its staff: agents grouped under their
division, and divisions-in-discovery visible as a quiet signal that the org is growing.

## Acceptance criteria

- [ ] THE ROSTER groups agents under a division header line:
      `BUILD :: est. 17/07/2026 :: 6 agents`
      Header styled like agent names (bright, caps); the six agent rows under it are
      unchanged in content and order.
- [ ] After the last group, one dim row per division in discovery:
      `governance & compliance :: in discovery`
      Lowercase and dim by design: divisions earn their caps and est. date when they
      go operational. No agents listed, no count shown.
- [ ] The plaque's division count is untouched (counts operational divisions only).
- [ ] Data: exporter emits `divisions` array (id, name, est, status) and each agent
      gains a `division` id; the page render script groups from data, so future
      divisions appear with no page-code change.
- [ ] New roster lines participate in the page's matter beats and reveal like the
      existing rows (same `.section` selector family), and reduced motion renders
      them statically like everything else.
- [ ] Copy: Singapore English, no em dashes, lowercase except the operational
      division names and agent names (existing caps grammar).

## Out of scope

Floors/building visualization, per-division pages, collapse/expand interaction (that
arrives with the building at division 2), any change to plaque or replay.

## Verification plan

1. Local serve: desktop + 412px width; roster groups render, discovery row dim.
2. ?rm=1 pass: static render intact.
3. Fresh export reviewed line by line (new divisions array included).
4. PepperPotts sweep; Sarah.T gates the deploy.
