# Drive Sync

Frankly OS operating work is local-only by default. Website uploads are a separate test lane for standalone tools, HTML/code prototypes and gated/noindex blog drafts.

## Current Snapshot

- Pending after latest local build:
  - Date: 2026-07-06
  - Scope: Claude Run-to-Packet Launcher v0.1, Claude Task Packet Builder v0.1, Studio v0.1, Observatory v0.1, Flight Recorder v0.1, registry feed, Drive-Ready Bundle Dry Run v0.1, Mission Simulator v0.1, Launch Packet v0.1, Mission Theatre v0.1, Future Mode v0.1, navigation updates, site data feed refresh, browser QA evidence and a fresh site snapshot.
  - Status: pending explicit Drive connector-write approval.
  - Local page: `frankly-os-site/studio.html`
  - Pending queue count: 15 local items
  - Queue: `os-visualization/system-intelligence/drive-pending-queue-rep-001-2026-07-05.json`

- Website split:
  - Date: 2026-07-06
  - Scope: uploadable website bundle separated from local Frankly OS operating surfaces.
  - Status: local only; no deploy, no push, no Drive connector write.
  - Upload bundle source: `index.html`, `franklys-bmw.html`, `blog/index.html`, `blog/cykelforsikring.html`, `robots.txt`, `sitemap.xml`, shared logo assets.
  - Local-only surfaces: Frankly OS, Studio, Observatory, Control Cockpit, Mission Control, progress/run memory, onboarding, product clarity and data feeds.

- Date: 2026-07-05
- Drive folder: https://drive.google.com/drive/folders/1zCr1nHBdxWuQejp-qxiC_W6r2_dF23X7
- Local source: `frankly-os-site/`
- Scope: Control Cockpit v0.1, overview/progress navigation updates, site data feeds and a clean zip archive.
- Status: uploaded to Drive.
- Zip archive: https://drive.google.com/file/d/1zC8Fiz1phH3qKeOLEhNHsKcDCBLnIqYd/view?usp=drivesdk
- Control Cockpit HTML: https://drive.google.com/file/d/1XdaVRMFFZalVoNgwES14M9_zW_pLruWv/view?usp=drivesdk
- Overview HTML: https://drive.google.com/file/d/1JTP3VQHmW56LC8xro1KzYlXVIykVArko/view?usp=drivesdk
- Progress Map HTML: https://drive.google.com/file/d/1jcIDyXkR84DddSc3WS8Fvht61ajN-aPW/view?usp=drivesdk
- CSS snapshot: https://drive.google.com/file/d/1D6g_IioDHl3XSkMAk8QgxeutbiQ7Fe4V/view?usp=drivesdk
- Drive sync file: https://drive.google.com/file/d/1ymtHWZAix7wAXiAyRY6R6rO0W9tbl4pI/view?usp=drivesdk

Previous snapshot:

- 2026-07-05 Tool/Connector Guard Matrix snapshot: https://drive.google.com/drive/folders/11NCzyLWZzNF6vrO_27CgAa49kw91paht
- 2026-07-05 MCQ-011 Presentation Machine rep 001 plus Repository Instructions rep 001: https://drive.google.com/drive/folders/15-bbb62Sa_SruhH0t66pFaMCwrI4IUOC
- 2026-07-05 MCQ-011 Route QA rep 001: https://drive.google.com/drive/folders/16dcCPOf1yDU7ZwuWpzD9ers1NzyGdIyQ
- 2026-07-04 MCQ-011 run-registry overview: https://drive.google.com/drive/folders/1iKPKASH9V12CmlRTXdRdqwoJopaYn6wG
- 2026-07-04 machine-focus/claims-lock: https://drive.google.com/drive/folders/1bw9ctr5a9N4IVuFOns675cPVvsLCKaMx
- 2026-07-04 overview baseline: https://drive.google.com/drive/folders/1EWF0eQqxGBgqQzODH3oNyhpfIJ1F2jlx

## Future Rule

After any meaningful local Frankly OS machine-surface build:

1. Run the relevant local validation.
2. Upload a dated snapshot to `Frankly OS / outputs / prototypes` only after explicit connector-write approval.
3. Include key files individually when they are useful to inspect in Drive.
4. Include one complete zip archive for restoration.
5. Report the Drive URL in the final handoff.

For uploadable website test-lane work, rebuild the ignored `site/` bundle with `python3 scripts/sync_from_drive.py`, verify that only allowlisted files are copied, and do not deploy unless Jonas explicitly approves a publish step.

Do not upload secrets, `.env` files, `.git/`, dependency folders, local ledgers or obsolete bundle chunks unless the user explicitly asks for a raw forensic archive.
