#!/usr/bin/env python3
"""Regenerate the inline JSON snapshot inside `marketing/kalender.html`.

Sibling of `build-marketing-snapshot.py` (same BEGIN/END-block pattern, same reasons:
no `fetch()` on this site, no `marketing/data/` folder — `check_upload_boundary.py`
hard-fails on any `.json` under a `data` directory — and this file lives in `scripts/`
because `sync_from_drive.py` rglob-copies the whole `marketing/` tree).

    THE BLOCK BETWEEN THE MARKERS IS GENERATED. DO NOT HAND-EDIT IT.
    Change the source files, then re-run this script.

SOURCES (read-only)
  ../marketing-engine/calendar/marketing-calendar.json        -> lanes, items (verbatim)
  ../marketing-engine/social/content-examples-linkedin.md     -> 8 LinkedIn examples
  ../marketing-engine/social/content-examples-instagram.md    -> 8 Instagram examples

Content is copied VERBATIM (claims lock). The generator only adds derived keys:
`period` per item, per-lane populated `stops`, the lane x period `matrix`, counts,
the build-date default period, and the parsed field structure of each example.
Parsing is deliberately strict: each example file must yield exactly 8 blocks with
every mandatory field, else the generator raises. A source change is never a reason
to loosen the regex.

Usage:  python3 scripts/build-marketing-calendar-snapshot.py [--check]
        --check exits 1 if the page's block is out of date (no write).
Deterministic except `generated_at` (and, across days, the default period that is
derived from it — that is the page advertising its own staleness, not drift).
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
from datetime import date, datetime, timezone
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent                    # frankly-os-site/
WORKSPACE = REPO_ROOT.parent                     # Frankly os/
ENGINE = WORKSPACE / "marketing-engine"
PAGE = REPO_ROOT / "marketing" / "kalender.html"

CAL = ENGINE / "calendar" / "marketing-calendar.json"
LI = ENGINE / "social" / "content-examples-linkedin.md"
IG = ENGINE / "social" / "content-examples-instagram.md"

BEGIN = "<!-- MARKETING-CALENDAR-SNAPSHOT:BEGIN -->"
END = "<!-- MARKETING-CALENDAR-SNAPSHOT:END -->"

LANE_IDS = ["L1", "L2", "L3", "L4", "L5", "L6", "L7"]
MONTHS = ["2026-11", "2026-12", "2027-01", "2027-02", "2027-03"]
NO_DATE = "no-date"
EXPECTED_EXAMPLES = 8

# One line per gate value, shown in the chip's tap sheet. Describes the page's
# own rendering vocabulary — no product / coverage wording.
GATE_GLOSSARY = {
    "none": "Open — no gate. The item can proceed on its own source.",
    "jonas": "Awaiting Jonas — a decision or approval from Jonas moves this item.",
    "number-gate": "Number gate — a figure (reach, budget, price, rate, volume) is a [NUMBER-GATE] placeholder until Jonas sets it.",
    "legal-blocked": "Legal-blocked — needs legal, not just a claims scope.",
    "claims-gate": "Claims gate — needs a Jonas-named scope before any coverage or product wording is written.",
    "partner-consent": "Partner consent — nothing is produced or named before written consent exists.",
}
EST_NOTE = "~ = estimate with basis + owner. The .est convention is unratified (open decision card 11); shipping it here does not ratify it."

# ------------------------------------------------------------------ field maps
LI_FIELDS = {
    "Pillar": "pillar",
    "Channel job": "channel_job",
    "Format": "format",
    "Method": "method",
    "Hook": "hook",
    "Post copy": "copy",
    "Writing guide shipped with the template": "writing_guide",
    "Visual direction": "visual_direction",
    "Gates": "gates",
    "Feeds KPI": "kpi",
    "Reuse": "reuse",
    "Sit-next-to-the-bank check": "bank_check",
}
IG_FIELDS = {
    "Søjle": "pillar",
    "Kanalens job": "channel_job",
    "Format": "format",
    "Metode": "method",
    "Hook": "hook",
    "Caption": "copy",
    "Visuel retning": "visual_direction",
    "Gates": "gates",
    "Fodrer KPI": "kpi",
    "Genbrug": "reuse",
    "Sit-next-to-the-bank check": "bank_check",
}
MANDATORY = ["pillar", "channel_job", "format", "method", "hook", "copy",
             "visual_direction", "gates", "kpi", "reuse", "bank_check"]

BLOCK_RE = {
    "LI": re.compile(r"^## (LI-0[1-8]) — (.+?)\s*$", re.M),
    "IG": re.compile(r"^## (IG-0[1-8]) — (.+?)\s*$", re.M),
}
FIELD_RE = {
    "LI": re.compile(r"^- \*\*(.+?)(?: \((.+?)\))?:\*\*\s*(.*)$"),
    "IG": re.compile(r"^· \*\*(.+?)(?: \((.+?)\))?:\*\*\s*(.*)$"),
}
VERDICT_RE = re.compile(r"^\*\*R3\.1:\*\*\s*(.+?)\s*$", re.M)


def _read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


# ------------------------------------------------------------------ examples
def parse_examples(path: Path, kind: str, channel: str) -> list[dict]:
    text = _read_text(path)
    heads = list(BLOCK_RE[kind].finditer(text))
    if len(heads) != EXPECTED_EXAMPLES:
        raise ValueError(f"{path.name}: expected {EXPECTED_EXAMPLES} `## {kind}-0n — title` blocks, found {len(heads)}")
    fieldmap = LI_FIELDS if kind == "LI" else IG_FIELDS
    out = []
    for n, h in enumerate(heads):
        stop = heads[n + 1].start() if n + 1 < len(heads) else len(text)
        body = text[h.end():stop]
        # block ends at the first horizontal rule
        hr = re.search(r"^---\s*$", body, re.M)
        if hr:
            body = body[:hr.start()]
        fields: dict[str, str] = {}
        labels: dict[str, str] = {}
        cur = None
        for line in body.splitlines():
            m = FIELD_RE[kind].match(line)
            if m:
                label, qualifier, rest = m.group(1), m.group(2), m.group(3)
                key = fieldmap.get(label)
                if key is None:
                    raise ValueError(f"{path.name} {h.group(1)}: unknown field label '{label}'")
                if key in fields:
                    raise ValueError(f"{path.name} {h.group(1)}: duplicate field '{label}'")
                cur = key
                fields[key] = rest
                labels[key] = label + (f" ({qualifier})" if qualifier else "")
                continue
            if VERDICT_RE.match(line):
                cur = None
                continue
            if cur is None:
                continue
            s = line
            if s.startswith("  > "):
                s = s[4:]
            elif s.strip() == ">":
                s = ""
            elif s.startswith("  "):
                s = s[2:]
            fields[cur] = (fields[cur] + "\n" + s) if fields[cur] else s
        missing = [k for k in MANDATORY if k not in fields]
        if missing:
            raise ValueError(f"{path.name} {h.group(1)}: missing field(s) {missing}")
        verdict = VERDICT_RE.search(body)
        if not verdict:
            raise ValueError(f"{path.name} {h.group(1)}: no `**R3.1:**` verdict line")
        fields = {k: v.strip() for k, v in fields.items()}
        markers = {
            "claims_gate": "[CLAIMS-GATE]" in fields["gates"] or "[CLAIMS-GATE" in fields["copy"],
            "number_gate": "[NUMBER-GATE]" in fields["gates"] or "[NUMBER-GATE]" in fields["copy"],
            "partner_consent": bool(re.search(r"Partner consent|Partnersamtykke", fields["gates"])),
            "ai_label_open": "L0964" in fields["gates"],
            "canon_line": "(canon line)" in (fields["hook"] + fields["copy"]) or "(canon-linje)" in (fields["hook"] + fields["copy"]),
            "new_line_awaiting_jonas": "[NEW LINE — not canon, Jonas item 9]" in (fields["hook"] + fields["copy"]),
            "camera": bool(re.match(r"\**Camera|\**Kamera", fields["method"].lstrip("*"))),
        }
        out.append({
            "id": h.group(1),
            "title": h.group(2),
            "channel": channel,
            "language": "en" if kind == "LI" else "da",
            "fields": fields,
            "field_labels": labels,
            "field_order": list(fields.keys()),
            "verdict": verdict.group(1),
            "markers": markers,
        })
    return out


# ------------------------------------------------------------------ calendar
def period_of(item: dict) -> str:
    return item.get("week") or item.get("month") or NO_DATE


def build_calendar(build_day: date) -> dict:
    cal = json.loads(_read_text(CAL))
    meta, lanes, items = cal["meta"], cal["lanes"], cal["items"]
    if [l["id"] for l in lanes] != LANE_IDS:
        raise ValueError(f"marketing-calendar.json: lanes are {[l['id'] for l in lanes]}, expected {LANE_IDS}")
    week_starts: dict[str, str] = meta["week_starts"]
    weeks = list(week_starts.keys())
    periods = weeks + MONTHS + [NO_DATE]

    def plabel(p: str) -> dict:
        if p in week_starts:
            return {"id": p, "kind": "week", "label": p.replace("2026-", ""), "start": week_starts[p]}
        if p in MONTHS:
            y, m = p.split("-")
            name = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][int(m) - 1]
            return {"id": p, "kind": "month", "label": f"{name} {y}", "start": f"{p}-01"}
        return {"id": p, "kind": "no-date", "label": "no date", "start": None}

    rows = []
    for it in items:
        p = period_of(it)
        if p not in periods:
            raise ValueError(f"marketing-calendar.json: item {it.get('id')} has unknown period {p}")
        row = dict(it)
        row["period"] = p
        rows.append(row)

    matrix = {l: {p: 0 for p in periods} for l in LANE_IDS}
    for r in rows:
        matrix[r["lane"]][r["period"]] += 1
    matrix["all"] = {p: sum(matrix[l][p] for l in LANE_IDS) for p in periods}

    lane_rows = [{"id": "all", "label": "All lanes", "purpose": None, "stops": periods, "total": len(rows)}]
    for l in lanes:
        stops = [p for p in periods if matrix[l["id"]][p]]
        lane_rows.append({**l, "stops": stops, "total": sum(matrix[l["id"]].values())})

    reachable = sum(len(l["stops"]) for l in lane_rows)
    dead = 0  # by construction: every stop has >= 1 item

    # default period: the week containing the build date, else the month, else the
    # first period (build date precedes kickoff), else the last dated period.
    default, reason = None, None
    iso = build_day.isoformat()
    for i, w in enumerate(weeks):
        nxt = week_starts[weeks[i + 1]] if i + 1 < len(weeks) else None
        if week_starts[w] <= iso and (nxt is None or iso < nxt):
            if nxt is not None or iso < "2026-11-01":
                default, reason = w, "week containing the build date"
    if default is None and iso[:7] in MONTHS:
        default, reason = iso[:7], "month containing the build date"
    if default is None and iso < week_starts[weeks[0]]:
        default, reason = weeks[0], f"build date precedes the first period — opens on {weeks[0]}"
    if default is None:
        default, reason = MONTHS[-1], "build date is after the last period — opens on the last month"

    return {
        "meta": {**meta, "build_date": iso, "default_period": default, "default_period_reason": reason},
        "periods": [plabel(p) for p in periods],
        "lanes": lane_rows,
        "items": rows,
        "matrix": matrix,
        "counts": {
            "items": len(rows),
            "lanes": len(lanes),
            "awaiting_jonas": sum(1 for r in rows if r.get("gate") == "jonas"),
            "estimates": sum(1 for r in rows if "est" in r),
            "by_gate": dict(Counter(r.get("gate") for r in rows)),
            "reachable_states": reachable,
            "dead_states": dead,
            "populated_cells": reachable - len(periods),
        },
    }


# ------------------------------------------------------------------ assemble
def build_snapshot() -> dict:
    now = datetime.now(timezone.utc).astimezone()
    cal = build_calendar(now.date())
    li = parse_examples(LI, "LI", "linkedin")
    ig = parse_examples(IG, "IG", "instagram")
    return {
        "schema_version": "1.0",
        "generated_at": now.isoformat(timespec="seconds"),
        "generated_by": "frankly-os-site/scripts/build-marketing-calendar-snapshot.py",
        "hand_edit_warning": "GENERATED BLOCK — do not hand-edit. Re-run the generator instead.",
        "surface": {
            "path": "/marketing/kalender.html",
            "host": "os.franklydesign.dk",
            "posture": "internal test surface · gated · noindex · Disallow: /marketing/",
            "status": "Proposal",
        },
        "gate_glossary": GATE_GLOSSARY,
        "est_note": EST_NOTE,
        **cal,
        "examples": {
            "linkedin": li,
            "instagram": ig,
            "note_en": "Drafts for Jonas — nothing is posted, scheduled or produced.",
            "note_da": "Udkast til Jonas — intet er postet, intet er planlagt, intet er produceret.",
        },
        "sources": [
            "marketing-engine/calendar/marketing-calendar.json",
            "marketing-engine/social/content-examples-linkedin.md",
            "marketing-engine/social/content-examples-instagram.md",
        ],
    }


def render_block(snapshot: dict) -> str:
    payload = json.dumps(snapshot, ensure_ascii=False, indent=2)
    payload = payload.replace("</", "<\\/")   # cannot close the host <script> from inside JSON
    return (
        f"{BEGIN}\n"
        "<!-- GENERATED by scripts/build-marketing-calendar-snapshot.py — DO NOT HAND-EDIT. -->\n"
        '<script id="marketing-calendar-snapshot" type="application/json">\n'
        f"{payload}\n"
        "</script>\n"
        f"{END}"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Rebuild the inline marketing-calendar snapshot.")
    parser.add_argument("--check", action="store_true", help="Exit 1 if the page block is stale; write nothing.")
    args = parser.parse_args()

    if not PAGE.exists():
        print(f"FAIL: {PAGE} does not exist.", file=sys.stderr)
        return 1
    html = PAGE.read_text(encoding="utf-8")
    if BEGIN not in html or END not in html:
        print(f"FAIL: markers {BEGIN} / {END} not found in {PAGE}.", file=sys.stderr)
        return 1

    snapshot = build_snapshot()
    block = render_block(snapshot)
    start = html.index(BEGIN)
    stop = html.index(END) + len(END)
    current = html[start:stop]

    strip_ts = lambda s: re.sub(r'"generated_at":\s*"[^"]*"', '"generated_at":""', s)
    if strip_ts(current) == strip_ts(block):
        print("marketing-calendar snapshot: already current.")
        return 0
    if args.check:
        print("STALE: marketing/kalender.html snapshot differs from its sources.", file=sys.stderr)
        return 1

    PAGE.write_text(html[:start] + block + html[stop:], encoding="utf-8")
    c = snapshot["counts"]
    print(f"marketing-calendar snapshot: rewritten ({c['items']} items, {c['lanes']} lanes, "
          f"{c['awaiting_jonas']} awaiting Jonas, {c['reachable_states']} reachable states / {c['dead_states']} dead, "
          f"{len(snapshot['examples']['linkedin'])} LinkedIn + {len(snapshot['examples']['instagram'])} Instagram examples, "
          f"default period {snapshot['meta']['default_period']}).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
