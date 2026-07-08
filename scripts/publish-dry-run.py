#!/usr/bin/env python3
"""C4 publish dry-run packer — "prepare the decision, stop at the gate".

Rebuilds the uploadable bundle exactly as the Pages workflow does, checks the built
site/ against the deploy allowlist (reusing sync_from_drive.build_manifest — the same
intended-output source of truth C1 added), writes a dated checksum manifest plus a
"what would go live" diff vs the previous run, and then STOPS. It never calls git,
gh or any deploy step — publishing stays Jonas's gated action.

Run from anywhere; it chdirs to the repo root so the build uses repo-relative paths.
Exit 0 when clean, nonzero on a boundary leak.
"""
from __future__ import annotations

import hashlib
import json
import os
import sys
from datetime import date
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
SITE = REPO_ROOT / "site"
OUT_DIR = REPO_ROOT / "publish-dry-run"

# Internal OS surfaces that must never appear in the public bundle (backstop over the allowlist).
FORBIDDEN_SURFACES = {
    "frankly-os.html", "control-cockpit.html", "studio.html", "observatory.html",
    "mission-control-queue.html", "progress-map.html", "lab-hub.html", "agent-brief-builder.html",
}

sys.path.insert(0, str(SCRIPT_DIR))
import sync_from_drive as sfd  # noqa: E402  (sibling module; path injected above)


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    os.chdir(REPO_ROOT)

    # (1) Rebuild exactly like deploy.yml's `python3 scripts/sync_from_drive.py`.
    sfd.main()

    # (2) Boundary check: every emitted file must be on the deploy allowlist.
    allowlist = set(sfd.build_manifest(REPO_ROOT).keys())
    actual: dict[str, dict] = {}
    leaks: list[str] = []
    forbidden_hits: list[str] = []
    for path in sorted(SITE.rglob("*")):
        if not path.is_file():
            continue
        rel = path.relative_to(SITE).as_posix()
        actual[rel] = {"sha256": _sha256(path), "bytes": path.stat().st_size}
        if rel not in allowlist:
            leaks.append(rel)
        if path.name in FORBIDDEN_SURFACES:
            forbidden_hits.append(rel)

    # (3) Manifest + would-go-live diff vs the previous dry run.
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    latest = OUT_DIR / "latest.json"
    prev_files = (json.loads(latest.read_text(encoding="utf-8")).get("files", {})
                  if latest.exists() else {})
    added = sorted(set(actual) - set(prev_files))
    removed = sorted(set(prev_files) - set(actual))
    changed = sorted(r for r in actual if r in prev_files and actual[r]["sha256"] != prev_files[r]["sha256"])

    boundary_passed = not leaks and not forbidden_hits
    stop_line = ("DRY RUN ONLY — nothing was dispatched. To publish, Jonas runs "
                 "`gh workflow run deploy.yml` (deploy is Jonas-gated).")
    manifest = {
        "id": "publish-dry-run",
        "date": date.today().isoformat(),
        "repo": "frankly-os-site",
        "fileCount": len(actual),
        "boundaryPassed": boundary_passed,
        "leaks": leaks,
        "forbiddenSurfaces": forbidden_hits,
        "wouldGoLive": {"added": added, "removed": removed, "changed": changed},
        "files": actual,
        "stop": stop_line,
    }
    payload = json.dumps(manifest, indent=2, ensure_ascii=False) + "\n"
    (OUT_DIR / f"publish-dry-run-{date.today().isoformat()}.json").write_text(payload, encoding="utf-8")
    latest.write_text(payload, encoding="utf-8")

    print(f"publish dry-run: {len(actual)} files on allowlist; "
          f"would-go-live added={len(added)} removed={len(removed)} changed={len(changed)}")
    if not boundary_passed:
        print("BOUNDARY FAIL — bundle contains files not on the deploy allowlist:", file=sys.stderr)
        for item in leaks:
            print(f"  leak: {item}", file=sys.stderr)
        for item in forbidden_hits:
            print(f"  forbidden internal surface: {item}", file=sys.stderr)
        print(stop_line)
        return 1
    print("boundary OK: every emitted file is on the deploy allowlist; no internal surfaces.")
    print(stop_line)
    return 0


if __name__ == "__main__":
    sys.exit(main())
