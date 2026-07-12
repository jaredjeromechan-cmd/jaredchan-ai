#!/usr/bin/env node
// Guards the #project-data block in portfolio/index.html. That block is now
// the page's content (dossiers and index cards render from it at boot), so
// a malformed block is not a cosmetic bug, it is a broken site. Run this
// before shipping any change that touches the data block.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = join(repoRoot, 'portfolio', 'index.html');
const html = readFileSync(indexPath, 'utf8');

function fail(message) {
  console.error(`[check-project-data] FAIL: ${message}`);
  process.exit(1);
}

const match = html.match(
  /<script type="application\/json" id="project-data">([\s\S]*?)<\/script>/
);
if (!match) fail('could not find the #project-data block in portfolio/index.html');

const raw = match[1];

// The escaping rule that keeps this block from ending itself early: every
// literal "</" inside a JSON string must be written "<\/", because a raw
// "</script" would stop the browser parsing the block right there and every
// dossier past that point would go missing. Enforcing the full rule (no raw
// "</" at all) also gives a clear message; a raw "</script>" additionally
// truncates the extraction above and surfaces as a JSON parse failure, which
// still fails this run.
if (raw.includes('</')) {
  fail('raw "</" found inside the data block; every "</" must be written "<\\/"');
}

let projects;
try {
  projects = JSON.parse(raw);
} catch (err) {
  fail(`JSON.parse failed: ${err.message}`);
}

const required = [
  'id', 'path', 'sceneId', 'projectNumber', 'title',
  'sections', 'exhibits', 'link', 'indexCard',
];

for (const p of projects) {
  const label = p && p.id ? p.id : '(unknown project)';
  for (const field of required) {
    if (p[field] === undefined) fail(`project "${label}" is missing required field "${field}"`);
  }
  if (!p.status || p.status.dossierText === undefined) {
    fail(`project "${label}" is missing required field "status.dossierText"`);
  }
  if (!p.status || p.status.indexText === undefined) {
    fail(`project "${label}" is missing required field "status.indexText"`);
  }
  // The renderer consumes these two unguarded: a missing indexClass renders
  // class="undefined" on the status pill and silently skews the About page's
  // evidence tally, with no error anywhere. Catch it here instead.
  if (!p.status || typeof p.status.live !== 'boolean') {
    fail(`project "${label}" is missing required boolean field "status.live"`);
  }
  if (!p.status || p.status.indexClass === undefined) {
    fail(`project "${label}" is missing required field "status.indexClass"`);
  }
  console.log(`[check-project-data] ok: ${label}`);
}

// The sitemap is the third hand-maintained per-project list (after the CSS
// reveal list and the boot path chain). Nothing else would notice a project
// missing from it, so the drift is caught here.
const sitemapPath = join(repoRoot, 'portfolio', 'sitemap.xml');
let sitemap;
try {
  sitemap = readFileSync(sitemapPath, 'utf8');
} catch {
  fail('portfolio/sitemap.xml is missing');
}
for (const p of projects) {
  if (!sitemap.includes(`https://www.jaredchan.ai${p.path}</loc>`)) {
    fail(`sitemap.xml has no entry for "${p.path}"; add it alongside the other hand-maintained lists`);
  }
}
console.log('[check-project-data] ok: sitemap lists every project');

process.exit(0);
