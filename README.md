# Frankly OS Site

This folder contains the local website surface for Frankly OS, Frankly Lab and related product clarity pages.

## Current Role

The site is not only a static mirror of Drive files anymore. It is becoming the visual operating layer for the OS:

- `frankly-os.html` is the operating console and system map.
- `lab-hub.html` is the tools and experiments hub.
- `agent-brief-builder.html` is the local prompt builder for larger autonomous chat missions.
- `mission-control-queue.html` is the local queue for larger mission batches before thread handoff.
- `progress-map.html` is the current machine-state visualization: what is built, active and gated.
- `onboarding.html` is the internal start surface for first-run orientation.
- `frankly-daekningsoverblik.html` is the first product clarity surface.
- `guide/index.html` is an internal Danish store training guide for explaining Frankly, warranty and home contents insurance.

The current build is local and draft-state. Public deployment, paid API automation and Slack automation remain paused until Jonas explicitly approves them.

## Source Of Truth

Google Drive remains the canonical source for Frankly OS system files. Local files in this repo are implementation and preview artifacts used to test the website experience before publishing.

When Drive sync is available again, the site can be connected to a metadata endpoint or GitHub Action. Until then, local manifest updates should be treated as draft evidence, not production data.

## Key Local Files

- `frankly-os.html` - main OS visualization page.
- `lab-hub.html` - Frankly Lab hub page.
- `agent-brief-builder.html` - local Agent Brief Builder tool for bigger chat mission batches.
- `mission-control-queue.html` - local Mission Control Queue for manual launch, review and integration of larger mission batches.
- `progress-map.html` - local Frankly OS Progress Map for machine status, active batch and next path.
- `onboarding.html` - internal start surface and first-run entry gate.
- `frankly-daekningsoverblik.html` - coverage/product clarity page.
- `guide/index.html` - internal store training guide for salespeople.
- `blog/index.html` - local draft blog index, currently noindex.
- `blog/cykelforsikring.html` - source-updated local draft article for the Blog SEO route pilot, currently noindex.
- `robots.txt` - blocks draft blog pages.
- `sitemap.xml` - local sitemap shell; draft blog pages are excluded until approval.
- `data/activation-queue-data.json` - local same-origin activation queue feed for HTTP previews.
- `data/surface-gate-registry.json` - local same-origin surface gate feed for HTTP previews.
- `data/mission-control-queue.json` - local same-origin Mission Control feed for HTTP previews.
- `data/README.md` - local data-feed source and regeneration notes.
- `CNAME` - configured custom domain target.
- `scripts/sync_from_drive.py` - optional Drive sync helper.

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

The current priority is the Frankly OS machine, not more site surfaces. Existing pages should be maintained and QA'd, but new pages should only be built when they expose or validate machine state.

1. Keep Frankly OS, Lab and Mission Control healthy as operating surfaces.
2. Use Mission Control and the loop runner to make work resumable.
3. Build new surfaces only when they make machine state clearer.
4. Keep all durable system files in English.
5. Run browser and screenshot QA before any publish step.
6. Run `python3 os-visualization/scripts/run-local-site-qa.py` before browser QA when local data, links, CSS or inline scripts change.
7. Use `agent-brief-builder.html` or `python3 os-visualization/scripts/generate-mission-brief.py` to turn broad goals into fewer, larger local chat missions.
8. Use `mission-control-queue.html` to track those batches manually before any supervised thread handoff is approved.
9. Use `progress-map.html` to see current machine progress before starting new work.
10. Start future machine workstreams from `../os-visualization/mission-control/handoff-packets/current-machine-handoff.md`.
11. Run `python3 os-visualization/scripts/validate-machine-state.py` after future active Mission Control batch updates.
12. Use MCQ-009 to fill `SRC-001` through `SRC-009` with approved source documents and owner confirmations before changing customer-facing copy.

## Guardrails

- Do not publish publicly without approval.
- Do not enable paid API runtime without approval.
- Do not connect Slack automation without approval.
- Do not expose sensitive source material.
- Prefer local evidence and reversible changes before deployment.
