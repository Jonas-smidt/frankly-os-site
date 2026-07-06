# Frankly OS Site Agent Instructions

These instructions apply to the standalone `frankly-os-site/` repository.

## Purpose

This repo has two lanes:

- Local-only operating surfaces for Frankly OS: OS map, overview, Lab, Mission Control, progress map, Studio, Observatory, onboarding, draft product clarity and training surfaces.
- Uploadable website test surfaces: standalone HTML tools, code prototypes and gated/noindex blog drafts.

Frankly OS operating surfaces run locally. They must not be copied into the public/upload bundle.

The current priority is machine visibility and safe local review. Public deployment, paid API automation, Slack automation and claims/product/legal work remain gated.

## Key Files

- `index.html`: uploadable test-site entry page. It links only to allowlisted test outputs.
- `franklys-bmw.html`: standalone HTML game/tool test.
- `blog/*.html`: gated/noindex blog draft previews.
- `overview.html`: local-only internal "what have we built" overview.
- `progress-map.html`: local-only current machine progress, active gates and next path.
- `frankly-os.html`: local-only OS visualization surface.
- `lab-hub.html`: local-only tools and experiments hub.
- `mission-control-queue.html`: local Mission Control queue.
- `agent-brief-builder.html`: local prompt builder.
- `data/*.json`: generated same-origin preview feeds. Source lives under `../os-visualization/system-intelligence/`.
- `scripts/sync_from_drive.py`: despite the historical name, now builds the allowlisted upload bundle into ignored `site/` without Drive sync.
- `DRIVE_SYNC.md`: Drive snapshot rule and latest snapshot state.

## Commands

Run site QA from the root workspace:

```bash
python3 os-visualization/scripts/run-local-site-qa.py
```

Run the broader machine checks from the root workspace when site changes affect state copy, progress, gates or data feeds:

```bash
python3 os-visualization/scripts/run-frankly-os-evals.py
python3 os-visualization/scripts/validate-machine-state.py --strict-loop
python3 os-visualization/scripts/validate-source-intake.py
```

## Editing Rules

- Keep changes scoped to the page or data feed involved.
- Preserve local static openability unless a task explicitly requires a local HTTP preview.
- Match the existing design language in `frankly-surfaces.css`.
- Keep public/product/legal implications out of internal OS state copy.
- Keep draft blog/product pages noindex or gated unless Jonas explicitly approves publication.
- Do not add Frankly OS, Mission Control, Studio, Observatory, run memory or machine-state pages to `scripts/sync_from_drive.py`'s upload allowlist.

## Safety Gates

Stop before:

- publishing or deploying
- changing `CNAME`, GitHub Actions deploy behavior or sitemap/robots public posture
- adding tracking/analytics
- enabling paid APIs or Slack/company-visible automation
- changing customer-facing claims or product/legal wording
- uploading secrets, `.git/`, dependencies or obsolete bundle archives

## Drive Rule

After meaningful site work, archive a dated snapshot under `Frankly OS / outputs / prototypes` with key files and a clean zip. If upload is blocked, update `DRIVE_SYNC.md` as pending and leave a manifest in the root OS state.

## Nested Repo Rule

This folder is its own Git repository. Commit site changes from inside `frankly-os-site/`, separate from the root workspace commit.
