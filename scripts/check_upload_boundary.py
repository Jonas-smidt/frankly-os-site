#!/usr/bin/env python3
"""Fail-closed upload-boundary check — runs IN the deploy repo, in CI.

Defense-in-depth backstop for the deploy pipeline: after `sync_from_drive.py`
builds ./site, scan the built bundle for anything that must never ship publicly —
Frankly OS operating surfaces, machine data feeds, or a whole-site build bundle.
Exit 1 on any leak (or if ./site is missing) so the deploy job stops before upload.

Self-contained by design: it derives the repo root from its own location and must
NOT import the parent-workspace QA (that would be a cross-repo false-negative in CI,
where only this repo is checked out). The OS-only deny-list is intentionally duplicated
from os-visualization/scripts/run-local-site-qa.py — keep the two in lockstep.
"""
from __future__ import annotations

import pathlib
import sys

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = REPO_ROOT / "site"

# Frankly OS operating surfaces: allowed in the source tree for local use, but never
# in the public upload set. (Lab tools, prototypes and gated drafts are allowed and
# are deliberately NOT listed here.)
OS_ONLY_PAGES = [
    "control-cockpit.html",
    "observatory.html",
    "studio.html",
    "mission-control-queue.html",
    "progress-map.html",
    "overview.html",
    "frankly-os.html",
    "frankly-os-cockpit.html",
    "lab-hub.html",
]


def main() -> int:
    if not SITE.exists():
        print(f"BOUNDARY FAIL: built site/ is missing ({SITE}); run sync_from_drive.py first.", file=sys.stderr)
        return 1

    denied = set(OS_ONLY_PAGES)
    leaked_pages = []
    leaked_data = []
    for path in SITE.rglob("*"):
        if not path.is_file():
            continue
        if path.name in denied:
            leaked_pages.append(path.relative_to(REPO_ROOT).as_posix())
        elif path.suffix == ".json" and path.parent.name == "data":
            leaked_data.append(path.relative_to(REPO_ROOT).as_posix())

    # A whole-site build bundle beside the site would package OS surfaces too.
    stray_bundles = [p.relative_to(REPO_ROOT).as_posix() for p in REPO_ROOT.glob("frankly-os-site-bundle.*")]

    leaks = leaked_pages + leaked_data + stray_bundles
    if leaks:
        print("BOUNDARY FAIL: the built site/ contains files that must not ship publicly:", file=sys.stderr)
        for item in leaked_pages:
            print(f"  OS-only page leaked: {item}", file=sys.stderr)
        for item in leaked_data:
            print(f"  machine data feed leaked: {item}", file=sys.stderr)
        for item in stray_bundles:
            print(f"  stray site bundle: {item}", file=sys.stderr)
        return 1

    print("Upload boundary OK: no OS-only pages, data feeds or stray bundles in site/.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
