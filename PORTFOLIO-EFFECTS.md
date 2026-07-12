# Portfolio visual effects, the handoff

This is the standing brief for the visual effects of Jared's portfolio at **www.jaredchan.ai**. It exists so that any model (Opus, Sonnet, whoever picks this up next) can understand the design language, extend it in the same voice, and avoid the traps that have already been hit. Read this fully before touching `portfolio/index.html`.

The whole site is **one self-contained file**: `portfolio/index.html`. No build step, no framework. Three.js r128 comes from CDNs as globals. Deploy with `firebase deploy --only hosting:portfolio` from the repo root. Jared wants changes deployed immediately after (or even before) verification.

---

## 1. The design fiction

Everything on this site is made of the matter of one living thing: **the field**, a breathing particle sphere with a glowing nucleus (the orb) at the centre of the homepage.

The governing idea is **conservation of matter**:

- Pages are not "shown", they are **formed out of the sphere's particles**. The sphere exhales dots that fly out and land on every character and card border, then the real text fades up underneath the last settling dots.
- Pages are not "hidden", they **dissolve back into the sphere**. Every visible character and card border sheds dots that stream into the core along curled paths.
- The orb's light follows its matter. When particles leave to form a page, the orb ebbs away in step with them. When a page dissolves back in, the orb re-brightens as it re-absorbs.

Secondary language:

- **Decrypt**: headlines and labels scramble in from glyphs (`#$%&*+<>=?@/\|`), settling left to right.
- **Tethers**: on the desktop projects index, each project card holds onto a passing particle with a hairline thread that rides along as the sphere tumbles. The projects are "nodes online", literally plugged into the field.
- **The dive (warp)**: pressing Enter expands the field past the viewer like a jump to lightspeed, then the index condenses out of the swollen web.

Taste rules: one continuous movement, never a dead beat between two animations. Subtle over showy. A single green family on near-black, serif display type (Cormorant Garamond) against mono body (JetBrains Mono). When in doubt, make the new thing behave like matter from the sphere.

---

## 2. Jared's standing rules (non-negotiable)

1. **Every animation must also play on refresh and direct URL landing.** Refreshing a page must never play less than navigating to it. Jared has flagged this repeatedly. Verify by refreshing before calling anything done.
2. **Browser back and forward must play the same ceremonies as in-page links.** The popstate handler routes every history traversal through the full transitions.
3. **Any tap, key or scroll mid-ceremony skips straight to the settled page** (`fxSkip`). Exception: wheel events are ignored for the first 600ms of a ceremony, because a Mac trackpad back-swipe keeps emitting momentum wheel events after the navigation lands and was killing the ceremony on frame one.
4. **Reduced motion** (`prefers-reduced-motion`) gets plain fades and swaps, no dots, no dive.
5. **Mobile (below 1100px) keeps the simple single column.** The constellation layout, its tethers and the sphere-shift are desktop only. The about node and its field tether are the exception: they float at every width.
6. Locale: Singapore English, no em dashes anywhere (chat, comments, UI strings). Comments explain the why.

---

## 3. Map of the file

All in `portfolio/index.html`, in this order:

- **Head boot script**: stamps `data-scene` on `<html>` before first paint so refreshes never flash the homepage, and `data-arrive` (unless reduced motion) to hold a directly-landed page invisible until its ceremony starts. A 3.5s timeout deletes `data-arrive` so the page can never be stuck hidden if scripts fail. Its known-paths chain is hand-maintained (it runs pre-paint and must never be able to fail), twin of the CSS reveal list.
- **Project data and the render script** (added 12/07/2026): the three dossiers and their index cards live as JSON in `<script type="application/json" id="project-data">` and are rendered at boot by an inline script that sits after the scene shells and before the CDN loads. Every `</` inside a JSON string is written `<\/`. The router entries and dossier tethers derive from `PROJECTS`; the CSS reveal list and the boot path chain are the only per-project hand edits left. `node scripts/check-project-data.mjs` guards the block and must pass before any deploy that touches it.
- **CSS**: scene overlays (`.scene`, z 20), the dossier sheet, the desktop constellation media query for `#projects-scene`, `#tether` canvas (z 25), `#fx` canvas (z 30), chrome bands (z 40).
- **Router**: `SCENES` map (`/projects`, `/projects/exsa`, `/projects/table-23`, `/projects/homebase`, `/about-builder01`), `showScene`/`routeTo` (DOM overlay swap plus history), `openProjects`/`assembleProjects`, `exitToField`, `matterHop`, the popstate ceremony dispatch, `fxSkip`/`fxAbort`, and the direct-landing block with the warm gate. The `data-scene-link` click handler ignores clicks while `warp.active` (the about node stays hittable while `#stage` fades during the dive; without the guard a mid-dive tap forks the ceremony and double-pushes history).
- **Matter machinery**: `collectSceneDots` (samples every visible character and card border of a scene into dot positions, live from the DOM), `sampleTitleTargets` (pixel-samples a headline into letter-shaped points via an offscreen canvas), `playDissolve` (beat one: page streams into the sphere), `playExhale` (beat two: sphere pays a headline out), `playAssemble` (page-wide exhale, the reverse of dissolve), `revealScene` (body blocks settle top-down with decrypts), `arriveScene` (exhale plus reveal).
- **Sphere**: 4500 particles on a fibonacci sphere with jitter, neural connection lines, core and halo sprites, the hidden resident sprite (zoom in to see him), warp state, the tether system (`drawTethers`), and the animate loop.

Key state: `fx` (transition state: `active`, `startT`, `pendingPath`, `internalNav`), `scenePath` (null means the field), `warpDim` (dive progress), `sceneDim` (eases to 1 while a scene is up, rate 1.4/s), `dimNow = min(1, warpDim * 0.22 + sceneDim * 0.9)` (orb dimming).

---

## 4. The three beats

- **Dissolve** (`playDissolve`): collect scene dots, each flies to a point near the sphere centre along a quadratic bezier with a random perpendicular bulge, staggered delays. The next scene's ceremony starts at the 70th percentile of arrivals so the movements overlap. Trails come from partially erasing the canvas each frame (`destination-out` at low alpha) instead of clearing.
- **Exhale** (`playExhale`): a dossier headline pixel-sampled into targets; dots launch from the sphere's face (position sampled live per dot, so drift is respected), decelerate onto the letterforms, nearest letters first; the real `h1` fades up under the last dots.
- **Assemble** (`playAssemble`): the page-wide reverse of dissolve. Launch spread is wide (`0.2 to 1.0 of min(430, 34vw)`) so on Enter the dots read as the warp-swollen field condensing into the page. Surfaces nearest the sphere form first. The real page fades up at the 55th percentile.

Orb logic during Enter: the dive itself only dims the nucleus by 22% at peak (`warpDim * 0.22`). The real fade is `sceneDim` ramping at 1.4/s, timed to span the assemble, so the orb visibly spends its matter on the page. Do not let any transition kill the orb's light before its dispersal begins; that exact bug has been reported and fixed once.

---

## 5. Engineering invariants (do not break these)

1. **Stall forgiveness.** All dot flights run on wall-clock time. Every frame loop must carry this pattern: if the gap between frames exceeds 250ms, shift the whole timeline (`t0`, reveal and settle deadlines) forward by the gap. Without it, cold-load jank silently consumes the flight and the user sees "text disappears then loads" with no particles. This bug shipped once; do not reintroduce it in new effects.
2. **The warm gate.** Direct landings wait for `document.fonts.ready` plus 4 rendered rAF frames before starting the ceremony, while `data-arrive` holds the page invisible. Delete `data-arrive` the moment the ceremony has taken over (hidden-instant or inline styles now own visibility).
3. **`fxAbort` must restore everything.** Any new transition state (classes, inline styles, timers, rAF handles) must be cleaned up in `fxAbort`, because a skip can land at any instant. It currently removes `hidden-instant` everywhere, clears inline styles on scene descendants and on the scene elements themselves, cancels both rAF handles and all `fxTimer` timeouts.
4. **`fx.internalNav`** wraps `showScene` calls made by ceremonies so the router does not fire its own decrypt or abort logic on top.
5. **Measure the DOM live.** `collectSceneDots` and `sampleTitleTargets` read live rects, which is why layout redesigns (the constellation happened after the transitions) never break the matter beats. Never hardcode positions into an effect.
6. **Never stagger or offset elements with CSS transforms.** `revealScene` and the card hover own `transform`; offsets must use `position: relative; top` or margins (see the constellation's right-column stagger) or the reveal will snap.
7. **hidden-instant** (`opacity 0 !important, no transition`) is how a scene stays laid out but invisible while its dots fly. Measuring still works under it.
8. **URLs change at interaction time, not transition end**, so back pressed mid-flight behaves. `fx.pendingPath` is where a skip lands.
9. Top-level `function` declarations in the big script are reachable from the console (`assembleProjects()` etc). Useful for live testing; keep new machinery as function declarations for the same reason.

---

## 6. The tethers

Drawn every frame in `drawTethers` on the `#tether` canvas (z 25, above scene scrim, below the matter layer). Each card anchors at its inner edge midpoint, grabs the nearest particle (stride-9 projection scan) within `min(32vw, 460px)`, holds it (eased endpoint, so handoffs glide), and releases when it swings out of reach. A slow sine sag keeps the line reading as a thread. The Classified card's tether is dimmer (0.55). Gated off when: below 1100px, `fx.active`, or `data-arrive` still held. If cards are added or reordered, update the `tethers` array construction (first two entries are left of the sphere, rest are right).

Every tether carries a `home`: the project cards belong to `/projects`, and the about node's tether (`home: null`) belongs to the field itself, drawn only while the field is calm (no scene up, not warping). The about node (`#about-node`, the `about builder01` link) wanders via `driftAboutNode` in the animate loop, two incommensurate sine pairs per axis so the figure never quite repeats. Desktop roams the top-right quadrant; below 1100px it keeps a tighter float in the negative space between the subtitle and the sphere's crown, anchored to the right edge so narrow screens never overflow. Its tether follows at every width (with a longer arm, half the viewport, on narrow screens where the crown breathes in and out of the standard reach); the constellation's tethers stay desktop-only. Reduced motion pins the node to its CSS fallback spot.

## 6b. The about page

`/about-builder01` (`#about-scene`) mirrors a case file: the sheet keeps the right-hand grid column and `sphereShift` flips sign (`shiftDir`) so the field drifts LEFT instead of right. Arrival is the standard `arriveScene`: the sphere exhales the `h1` ("Builder01") while `.pabove` ("About", deliberately plain serif) and the body settle with the top-down reveal. `.pabove` is wired into both `collectSceneDots` and `revealScene`, so it sheds and receives dots like everything else. The proof link inside ("the projects index") is a plain `data-scene-link`, so the hop to `/projects` rides `matterHop`: dissolve into the left-shifted sphere, which glides back to centre while paying the index out.

## 6c. The exhibits

Each case file mounts one live capture: `.exhibits > figure.exhibit`, images `exhibit-*.png` at the web root (paths always root-absolute; a relative path breaks on nested URLs, see the resident). The captures are processed by a pure-Python PNG pipeline (no PIL on this Mac): resized with sips, edge streaks cropped, and the browser mockup's rounded corners cut out with an alpha mask (radius ~9px at 880 wide) so the plate's glass shows through instead of white corner spots. Hosting serves images immutable for a year, so any regenerated capture must take a NEW filename (hence the `-v2` suffixes). The plate wears the cards' glass and an amplified `exhibitpulse` glow, deliberately louder than the cards' hover. On desktop (>= 1100px) the exhibits column is the `has-exhibits` grid's right half: the plate rests in the sphere's lower flank (sticky container, margins position it), drifts a small figure via `driftExhibits` (left/top offsets, never transform), and holds a particle tether (`home` is its dossier path; `drawTethers` gates dossier tethers with `fileOn`). Every file also floats a `.link-node`, its live URL as a fixed-position link over the sphere's crown (EXSA and Table 23 point at their web.app apps, Homebase at chan-teo.com): same drift loop, its own tether anchored at the text's mid-height, decrypts in with the section headings. Below 1100px the node hides, and an inline copy of the link inside `.exhibits` shows instead; the whole exhibits block then sits statically in the flow after the closing section.

Matter beats: `collectSceneDots` samples exhibit borders plus a sparse interior fill and the link's characters, so exhibits shed into the sphere on every dissolve. On arrival, `arriveScene` collects `collectSceneDots(sceneEl, '.exhibits, .exhibit-link')` as extras for `playExhale`, which flies them from the sphere a beat behind the headline. The sampling happens BEFORE `revealScene` runs, because the reveal blanks the link's text for its decrypt and nudges every block 12px off its settled spot. To add an exhibit to a new file: drop the same markup in, register a tether entry in the `tethers` construction, and the beats come free.

---

## 7. Verification workflow (required)

Simulate end to end before handing anything over. The convention:

1. Serve locally with a tiny node server that mimics the Firebase rewrites (any non-file path serves `portfolio/index.html`). Do not use `firebase serve`; a 12-line `http` script is fine.
2. Drive Chrome (Claude in Chrome tools) at 1440x900 and once near 1100px. **Keep the tab focused**: rAF freezes in unfocused tabs and has caused false "animation is stuck" alarms multiple times.
3. Screenshot latency is about 1s and flights last about 2s, so screenshots often miss the middle. For proof, either probe the `#fx` canvas pixel alpha from page JS mid-flight, or add temporary `console.log('[fx] ...')` instrumentation and read the console across a reload. **Strip all instrumentation before deploying.**
4. Test matrix for any transition change: Enter from the field, refresh on `/projects` and one dossier, browser back and forward, a skip mid-flight (scroll during the ceremony), a dossier hop both directions, and below-1100px layout.
5. A deliberate main-thread stall mid-flight (`while (performance.now() - t < 900) {}` from the console) is the regression test for stall forgiveness: dots must still be painted after it.
6. Deploy, then spot-check the live site, ideally with the same canvas probe.

---

## 8. How to add a new page or effect, in this voice

For a new PROJECT none of the steps below are needed by hand: add an entry to `#project-data`, drop in the exhibit image under a new filename, and add the two hand lines (CSS reveal list, boot path chain). The `project-registrar` agent's checklist covers all of it, including the four-card constellation limit. The steps below are for a genuinely new kind of page.

1. Add the scene markup as a `.scene` overlay, register it in `SCENES`, `SCENE_TITLES`, the boot script's path list, and `firebase.json` rewrites.
2. Give it the standard arrival: `arriveScene` (exhale headline plus top-down reveal) for a dossier-like page, or an assemble if it is an index-like page.
3. Wire all four routes in: in-page link (`data-scene-link`), popstate ceremony dispatch, direct-landing warm gate, and the skip path. Rule 1 and 2 of section 2 are the checklist.
4. New animated elements must shed and receive dots: extend the selector list in `collectSceneDots` if the new content uses new class names.
5. Respect the matter fiction: things come from the sphere, return to the sphere, and carry its light budget with them.
