# Spec: Backrooms record plaque + replay relabel (addendum to 2026-07-17-agency-page.md)

Date: 2026-07-18 | Gate: 31HKS | Project: jaredchan.ai
Copy approved verbatim by Jared 18/07/2026. Future building/phase-reel design is logged
in the agency ledger (2026-07-18-backrooms-scale-direction.md) and is NOT this build.

## Goal

The record section must read as a growing dated record (day zero vs today), and the
replay button must be named for what it will become: the reel since day zero.

## Acceptance criteria

- [ ] Replay button text is exactly: `replay :: since day zero :: 17/07/2026`
- [ ] THE RECORD section shows the plaque, aligned mono, exactly this shape:
      `day zero :: 17/07/2026 :: 1 division, 6 agents, 7 decisions`
      `today    :: <export date DD/MM/YYYY> :: <n> division(s), <n> agents, <n> decisions`
      `the book only moves forward`
      Day-zero line frozen (baseline constants); today line computed at export time.
- [ ] Provenance sentence retained below the plaque, smaller/dimmer: "Exported from the
      agency ledger; work engagements appear as counts only."
- [ ] Exporter (agency repo scripts/export-agency-data.mjs) emits `dayZero` (frozen
      baseline: date 17/07/2026, divisions 1, agents 6, decisions 7) and `today`
      (export date + computed divisions/agents/decisions counts); existing fields keep
      working; privacy allowlist unchanged in spirit (counts and titles only).
- [ ] Fresh export run, JSON reviewed line by line against privacy rules, pasted into
      the inline #agency-data block.
- [ ] Replay end: onDone caption shows the plaque's today line for ~5s, then returns to
      `the floor is live :: six agents on shift`.
- [ ] Reduced motion unaffected (plaque is static text; replay button already hidden).
- [ ] Copy is lowercase mono, Singapore English, no em dashes anywhere.

## Out of scope (this round)

Building/floors visualization, phase reel, camera zoom, per-floor replays (killed),
plaque phase-2/3 evolutions, homepage nav link, any homepage change at all.

## Verification plan

1. Local serve (node rewrite server), Chrome: plaque renders aligned at desktop and
   ~412px width; button label correct; replay end caption sequence observed.
2. ?rm=1 reduced-motion pass: plaque present, button hidden, no reel.
3. Exported JSON diffed and read line by line before paste.
4. PepperPotts sweep on the diff; Sarah.T gates the deploy item by item.
