# Frankly Test Site And Local OS Surfaces

This folder now has two separate roles:

- The uploadable website lane is a small test site for standalone HTML tools, code prototypes, the approved online coverage overview, the approved Start here preview and the public Frankly Journal (`journal/`).
- Frankly OS operating surfaces stay local: OS map, Studio, Observatory, Mission Control, run memory, local state feeds and progress.

## Current Role

The uploadable website bundle is generated into ignored `site/` by `scripts/sync_from_drive.py`. Despite the historical script name, it no longer syncs Drive and no longer copies every HTML file. It copies only the allowlist below.

<!-- BEGIN generated-allowlist (mirror of sync_from_drive.py — regenerate if that file changes) -->

**Gated Lab pages** — `index.html` (entry) plus 19 pages from `UPLOADABLE_HTML`. Each is served behind the Lab preview curtain (a JS gate injected at build time). The curtain is **not security and not `noindex`**: it only stops casual browsing of fully-rendered HTML. Crawl protection for these pages comes from `robots.txt` `Disallow`, not from a `noindex` meta tag.

- `index.html`
- `frankly-signature-generator.html`
- `frankly-brand-reference.html`
- `frankly-brand-assistant.html`
- `frankly-ribbon-lab.html`
- `frankly-business-card.html`
- `frankly-dictionary.html`
- `frankly-qr-link.html`
- `frankly-image-resizer.html`
- `frankly-drop-protection.html`
- `franklys-bmw.html`
- `the-decision-chicken.html`
- `frankly-quiz.html`
- `onboarding.html`
- `frankly-daekningsoverblik.html`
- `frankly-instore-onepager.html`
- `frankly-instore-salgsguide.html`
- `glass-lab.html`
- `glass-surface.html`
- `liquid-glass-hover.html`

**Public Journal** — the whole `journal/` tree is copied verbatim (HTML pages, images, fonts). Unlike the Lab pages, the Journal is **NOT gated and IS indexable** — it is the one public surface of the Lab (see `robots.txt` allow + `sitemap.xml`). There is no `blog/` directory; the blog suite lives entirely under `journal/`.

**Static assets** (`STATIC_FILES`, copied only if present):

- `robots.txt`, `sitemap.xml`
- `frankly-lab-brand.css`, `frankly-surfaces.css`
- `frankly-ribbon-lab.css`, `frankly-ribbon-lab.js`
- `assets/frankly-logo-small.png`, `assets/frankly-wordmark.png`, `assets/three.module.min.js`
- `assets/tools/*.png` — 3D tool-object renders used as card thumbnails

<!-- END generated-allowlist -->

Internal operating pages remain useful locally, but they are not website content and are not copied into `site/`:

- `frankly-os.html`, `overview.html`, `progress-map.html`
- `studio.html`, `observatory.html`, `control-cockpit.html`
- `lab-hub.html`, `agent-brief-builder.html`, `mission-control-queue.html`
- `guide/index.html`
- `data/*.json` machine feeds

GitHub Pages deployment is manual-only. There is no scheduled or push-triggered deploy, and no Drive sync in the website build.

## Source Of Truth

Google Drive remains a durable artifact home for approved snapshots. It is not the public website source for Frankly OS operating state.

After meaningful local OS work, keep the local handoff and pending Drive queue current. Upload only after explicit connector-write approval. After meaningful website test-lane work, build `site/` locally and keep it out of OS state unless Jonas approves a publish or Drive pass.

Do not reconnect the website deploy to Drive metadata or machine feeds unless Jonas explicitly reopens that deployment scope.

## Key Local Files

- `index.html` - uploadable test-site entry page; its public-only shelf fallback is generated from the canonical shelf source.
- `lab-registry.html` - retired local archive, kept on disk for continuity and excluded from active navigation and the upload bundle.
- `franklys-bmw.html` - standalone HTML game/tool test.
- `frankly-lab-tools.css`, `frankly-lab-tools.js` - retired legacy runtime files kept on disk; no active page or upload bundle depends on them.
- `onboarding.html` - approved Start here preview, copied into the upload bundle behind the Lab gate (JS curtain) and robots-disallowed (not a `noindex` meta).
- `frankly-daekningsoverblik.html` - approved online coverage overview, copied into the upload bundle behind the Lab gate and included in the sitemap.
- `journal/` - the public Frankly Journal blog suite (index + posts + images + fonts), copied verbatim; NOT gated and indexable. This is the only public Lab surface. (There is no `blog/` directory — that path is retired.)
- `robots.txt` - `Disallow`s the Lab tools/previews and historical/internal operating URLs from crawling, and allows the public `journal/` tree. Note: `Disallow` blocks crawling; it is not the same as a `noindex` meta tag.
- `sitemap.xml` - includes the uploadable test-site entry, standalone game, coverage overview and the public Journal posts.
- `frankly-os.html`, `overview.html`, `progress-map.html`, `studio.html`, `observatory.html`, `control-cockpit.html`, `lab-hub.html`, `agent-brief-builder.html`, `mission-control-queue.html` - local-only operating surfaces.
- `data/*.json` - local-only same-origin feeds for OS previews.
- `data/tools-shelf.json` - generated local copy of the canonical shelf; not copied into the public bundle because it also describes local-only OS entries.
- `data/README.md` - local data-feed source and regeneration notes.
- `CNAME` - configured custom domain target.
- `scripts/sync_from_drive.py` - allowlisted upload-bundle builder.

## Canonical Lab Shelf

`../os-visualization/system-intelligence/tools-shelf.json` is the only hand-maintained shelf inventory. `sync-site-data-feeds.py` validates every target, writes `data/tools-shelf.json`, injects the public-only static fallback into `index.html` and includes the full local fallback in the cockpit SNAP. `scripts/sync_from_drive.py` fails closed if a public target is missing or a local/retired target enters the upload manifest.

`lab-registry.html`, `lab-hub.html`, `glass-folders.html` and the old `frankly-lab-tools.css/js` runtime remain on disk as history. They are not active navigation or upload-bundle inputs.

## Current Run

The latest site-level review is documented in:

`../os-visualization/reports/whole-site-lab-updated-skill-run-2026-06-30.md`

The latest blog source verification is documented in:

`../os-visualization/reports/cykelforsikring-danish-source-verification-2026-07-01.md`

The latest loop engineering and choice-interface update is documented in:

`../os-visualization/reports/loop-engineering-choice-interface-2026-07-01.md`

The latest Loop Control panel update is documented in:

`../os-visualization/reports/loop-control-panel-2026-07-01.md`

The latest shared surface navigation update is documented in:

`../os-visualization/reports/shared-surface-navigation-2026-07-01.md`

The latest V14 activation queue implementation is documented in:

`../os-visualization/reports/v14-activation-pilot-implementation-2026-07-01.md`

The latest Lab operating queue update is documented in:

`../os-visualization/reports/lab-operating-queue-2026-07-01.md`

The latest product clarity review-gate update is documented in:

`../os-visualization/reports/product-clarity-review-gate-2026-07-01.md`

The latest onboarding entry-gate update is documented in:

`../os-visualization/reports/onboarding-entry-gate-2026-07-01.md`

The latest blog publishing-gate update is documented in:

`../os-visualization/reports/blog-publishing-gate-2026-07-01.md`

The latest cykelforsikring article review-gate update is documented in:

`../os-visualization/reports/article-review-gate-cykelforsikring-2026-07-01.md`

The latest surface gate registry update is documented in:

`../os-visualization/reports/surface-gate-registry-2026-07-01.md`

The latest site data-feed update is documented in:

`../os-visualization/reports/site-data-feeds-2026-07-01.md`

The latest site data-feed sync generator update is documented in:

`../os-visualization/reports/site-data-feed-sync-generator-2026-07-01.md`

The latest local static QA runner update is documented in:

`../os-visualization/reports/local-site-qa-runner-2026-07-01.md`

The latest Agent Brief Builder update is documented in:

`../os-visualization/reports/agent-briefing-pipeline-2026-07-01.md`

The latest Mission Control Queue update is documented in:

`../os-visualization/reports/mission-control-queue-2026-07-01.md`

The latest Mission Control batch run is documented in:

`../os-visualization/reports/mission-control-batch-009-product-legal-source-intake-pack-run-2026-07-01.md`

The latest Mission Control agent review is documented in:

`../os-visualization/reports/mission-control-batch-001-agent-review-2026-07-01.md`

The latest Frankly OS Progress Map update is documented in:

`../os-visualization/reports/frankly-os-progress-map-2026-07-01.md`

The latest Control Cockpit activation test is documented in:

`../os-visualization/reports/control-cockpit-v0-1-activation-test-2026-07-05.md`

The latest website machine-surface integration is documented in:

`../os-visualization/reports/website-machine-surface-integration-2026-07-02.md`

Latest product clarity evidence screenshots are stored in:

`../os-visualization/evidence/20260701-product-clarity-review-gate-browser-qa/`

Latest onboarding evidence screenshots are stored in:

`../os-visualization/evidence/20260701-onboarding-entry-gate-browser-qa/`

Latest blog publishing-gate evidence screenshots are stored in:

`../os-visualization/evidence/20260701-blog-publishing-gate-browser-qa/`

Latest article review-gate evidence screenshots are stored in:

`../os-visualization/evidence/20260701-article-review-gate-browser-qa/`

Latest surface gate registry evidence screenshots are stored in:

`../os-visualization/evidence/20260701-surface-gate-registry-browser-qa/`

Latest site data-feed evidence screenshots are stored in:

`../os-visualization/evidence/20260701-site-data-feeds-browser-qa/`

Latest Agent Brief Builder evidence screenshots are stored in:

`../os-visualization/evidence/20260701-agent-brief-builder-browser-qa/`

Latest Mission Control Queue evidence screenshots are stored in:

`../os-visualization/evidence/20260701-mission-control-queue-browser-qa/`

Latest Mission Control batch outputs are stored in:

`../os-visualization/mission-control/batches/MCQ-009/`

Earlier whole-site evidence screenshots are stored in:

`../os-visualization/evidence/20260630-213345-site-lab-rerun/`

## Build Direction

The current website direction is separation:

1. Keep Frankly OS, Mission Control, Studio, Observatory and run memory local.
2. Keep the uploadable website bundle limited to Lab tools, standalone HTML/code prototypes, the approved online coverage overview, the approved Start here preview and the public Frankly Journal (`journal/`).
3. Add a file to `scripts/sync_from_drive.py`'s allowlist only when it is safe website content.
4. Keep product/legal/claims surfaces out of the upload bundle unless Jonas explicitly reopens and approves that scope.
5. Keep all durable system files in English.
6. Run `python3 scripts/sync_from_drive.py` from this folder to rebuild `site/` before checking the upload bundle.
7. Run `python3 ../os-visualization/scripts/run-local-site-qa.py` from this folder's parent workspace after local OS/site changes.

## Guardrails

- Do not publish publicly without approval.
- Do not enable paid API runtime without approval.
- Do not connect Slack automation without approval.
- Do not expose sensitive source material.
- Do not copy local operating surfaces or machine feeds into the uploadable website bundle.
- Prefer local evidence and reversible changes before deployment.
