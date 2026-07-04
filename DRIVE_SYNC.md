# Drive Sync

Frankly OS work should not remain local-only unless the user explicitly asks for that.

## Current Snapshot

- Date: 2026-07-05
- Drive folder: https://drive.google.com/drive/folders/16dcCPOf1yDU7ZwuWpzD9ers1NzyGdIyQ
- Local source: `frankly-os-site/`
- Scope: MCQ-011 Route QA rep 001 overview/progress surfaces and a clean zip archive.
- Zip archive: https://drive.google.com/file/d/14bbfN1hRBjjIFbcGleMcA2lcyURlB7PS/view?usp=drivesdk

Previous snapshot:

- 2026-07-04 MCQ-011 run-registry overview: https://drive.google.com/drive/folders/1iKPKASH9V12CmlRTXdRdqwoJopaYn6wG
- 2026-07-04 machine-focus/claims-lock: https://drive.google.com/drive/folders/1bw9ctr5a9N4IVuFOns675cPVvsLCKaMx
- 2026-07-04 overview baseline: https://drive.google.com/drive/folders/1EWF0eQqxGBgqQzODH3oNyhpfIJ1F2jlx

## Future Rule

After any meaningful Frankly OS site or machine-surface build:

1. Run the relevant local validation.
2. Upload a dated snapshot to `Frankly OS / outputs / prototypes`.
3. Include key files individually when they are useful to inspect in Drive.
4. Include one complete zip archive for restoration.
5. Report the Drive URL in the final handoff.

Do not upload secrets, `.env` files, `.git/`, dependency folders, local ledgers or obsolete bundle chunks unless the user explicitly asks for a raw forensic archive.
