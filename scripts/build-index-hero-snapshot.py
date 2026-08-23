#!/usr/bin/env python3
"""Regenerate the inline INDEX-HERO-SNAPSHOT block inside `index.html`.

The Lab entry's hero shows two numbers and one provenance line. They are NEVER typed
into the markup and never `fetch()`ed: this script reads `data/tools-shelf.json` (the same
feed `render_index_shelf_snapshot()` and `assert_shelf_boundary()` read) and writes a
marker-framed `<script type="application/json">` block the page JS renders from.

    THE BLOCK BETWEEN THE MARKERS IS GENERATED. DO NOT HAND-EDIT IT.

Predicates (identical to the shelf boundary):
  shelf = count of tools with lane == "public-lab" and not retired
  play  = same predicate and shelf == "play"
  playShelf = tiles rendered inside <section id="play"> whose href is a public-lab feed entry
          (the number the Play chip lands on: 4 play + 2 experiments = 6; split kept; additive 2026-08-22)
  lanes = the three filter chips' counts (tools / play / pages) under the same predicate
Dates: `shelfUpdated` is the feed's own `updated` field (L0589 — never a file mtime);
`buildDate` is this script's run date.

The block sits directly ABOVE `<!-- TOOLS-SHELF-SNAPSHOT:BEGIN` and has its own markers,
so `sync-site-data-feeds.py`'s INDEX_SHELF_RE can never reach it. Run order: shelf sync
first, then this script.

Usage:  python3 scripts/build-index-hero-snapshot.py [--check]
        --check  exit 0 fresh / 1 stale (no write) / 2 markers or feed missing.
Deterministic except `generated` / `buildDate`, which --check ignores.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
PAGE = REPO_ROOT / "index.html"
FEED = REPO_ROOT / "data" / "tools-shelf.json"
BEGIN = "<!-- INDEX-HERO-SNAPSHOT:BEGIN -->"
END = "<!-- INDEX-HERO-SNAPSHOT:END -->"
SHELF_BEGIN = "<!-- TOOLS-SHELF-SNAPSHOT:BEGIN"
LANES = (("tools", "live", "tools"), ("play", "play", "play"), ("pages", "pages", "pages"))


PLAY_SECTION_RE = re.compile(r'<section[^>]*id="play"[^>]*>(.*?)</section>', re.S)
TILE_HREF_RE = re.compile(r'class="item[^"]*" href="([^"]*)"')


def play_shelf_counts(html: str, public: list) -> dict:
    """What the #play shelf actually renders, cross-checked against the feed (additive, 2026-08-22 fix pass).
    The Play shelf shows the 4 `shelf==play` tools plus 2 of the 4 `shelf==experiments` tools, so the hero
    number the Play chip lands on must be the rendered count (6), with the split kept. Every rendered href
    must be a public-lab, non-retired feed entry; anything else is a WARN, never counted."""
    m = PLAY_SECTION_RE.search(html)
    hrefs = TILE_HREF_RE.findall(m.group(1)) if m else []
    by_href = {t.get("href"): t for t in public}
    split: dict = {}
    for h in hrefs:
        t = by_href.get(h)
        if t is None:
            print(f"WARN: #play tile {h} is not a public-lab feed entry — not counted", file=sys.stderr)
            continue
        split[t.get("shelf")] = split.get(t.get("shelf"), 0) + 1
    off = sum(1 for t in public if t.get("shelf") == "experiments") - split.get("experiments", 0)
    return {"value": sum(split.values()),
            "rule": "tiles rendered inside <section id=play> whose href is a lane==public-lab && !retired feed entry",
            "play": split.get("play", 0), "experiments": split.get("experiments", 0),
            "experimentsOffShelf": off,
            "split": f"{split.get('play', 0)} to play · {split.get('experiments', 0)} experiments"}


def build_snapshot(feed: dict, now: datetime, html: str = "") -> dict:
    public = [t for t in feed.get("tools", []) if t.get("lane") == "public-lab" and not t.get("retired")]
    shelf = len(public)
    counted = feed.get("counts", {}).get("publicLab")
    if counted is not None and counted != shelf:
        print(f"WARN: counts.publicLab={counted} but predicate counts {shelf}", file=sys.stderr)
    return {
        "schemaVersion": "1.0",
        "generated": now.isoformat(timespec="seconds"),
        "buildDate": now.date().isoformat(),
        "shelfUpdated": feed.get("updated", ""),
        "shelf": {"value": shelf, "rule": "lane==public-lab && !retired"},
        "play": {"value": sum(1 for t in public if t.get("shelf") == "play"),
                 "rule": "lane==public-lab && !retired && shelf==play"},
        "playShelf": play_shelf_counts(html, public),
        "lanes": [
            {"id": lane_id, "target": target,
             "count": sum(1 for t in public if t.get("shelf") == shelf_key)}
            for lane_id, target, shelf_key in LANES
        ],
        "source": "data/tools-shelf.json",
        "generator": "scripts/build-index-hero-snapshot.py",
    }


def render_block(snap: dict) -> str:
    payload = json.dumps(snap, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    return (f"{BEGIN}\n"
            f'  <script id="index-hero-snapshot" type="application/json">{payload}</script>\n'
            f"  {END}")


def _stable(block: str) -> str:
    return re.sub(r'"(generated|buildDate)":"[^"]*"', r'"\1":""', block)


def main() -> int:
    ap = argparse.ArgumentParser(description="Rebuild the inline index hero snapshot.")
    ap.add_argument("--check", action="store_true", help="exit 1 if stale; write nothing")
    args = ap.parse_args()
    if not PAGE.exists() or not FEED.exists():
        print(f"FAIL: missing {PAGE if not PAGE.exists() else FEED}", file=sys.stderr)
        return 2
    html = PAGE.read_text(encoding="utf-8")
    if BEGIN not in html or END not in html:
        print(f"FAIL: markers {BEGIN} / {END} not found in index.html", file=sys.stderr)
        return 2
    if html.index(BEGIN) > html.index(SHELF_BEGIN):
        print("FAIL: INDEX-HERO-SNAPSHOT must sit above TOOLS-SHELF-SNAPSHOT", file=sys.stderr)
        return 2
    feed = json.loads(FEED.read_text(encoding="utf-8"))
    snap = build_snapshot(feed, datetime.now(timezone.utc), html)
    block = render_block(snap)
    start, stop = html.index(BEGIN), html.index(END) + len(END)
    if _stable(html[start:stop]) == _stable(block):
        print(f"index hero snapshot: already current (shelf {snap['shelf']['value']}, play {snap['play']['value']}).")
        return 0
    if args.check:
        print("STALE: index.html hero snapshot differs from data/tools-shelf.json.", file=sys.stderr)
        return 1
    PAGE.write_text(html[:start] + block + html[stop:], encoding="utf-8")
    print(f"index hero snapshot: rewritten (shelf {snap['shelf']['value']}, play {snap['play']['value']}, "
          f"play shelf {snap['playShelf']['value']} = {snap['playShelf']['split']}, "
          f"lanes {[l['count'] for l in snap['lanes']]}, shelf updated {snap['shelfUpdated']}).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
