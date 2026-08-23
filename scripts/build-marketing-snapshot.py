#!/usr/bin/env python3
"""Regenerate the inline JSON snapshot inside `marketing/index.html`.

WHY THIS EXISTS
---------------
`marketing/index.html` is a status surface for the Frankly Marketing Engine branch.
It cannot `fetch()` a feed: zero allowlisted public pages on this site do, and
`check_upload_boundary.py` hard-fails CI on any `.json` whose parent directory is
named `data` (it walks the whole tree), so a `marketing/data/` folder is forbidden.
The one working pattern on this site is the INLINE SNAPSHOT — a
`<script type="application/json">` block between BEGIN/END markers, written by a
script, never by hand. Same shape as `render_index_shelf_snapshot()`.

    THE BLOCK BETWEEN THE MARKERS IS GENERATED. DO NOT HAND-EDIT IT.
    Change the source files, then re-run this script.

WHY THIS FILE LIVES IN `scripts/` AND NOT IN `marketing/`
---------------------------------------------------------
`sync_from_drive.py` rglob-copies the WHOLE `marketing/` tree into the uploadable
bundle (the effekt-lab precedent). A generator placed at `marketing/build-snapshot.py`
would therefore be copied into `site/` and published — a Python file carrying
workspace-relative paths, on a public (if gated) host. `scripts/` is never copied,
and is already this repo's home for build tooling. Documented deviation from the
Task Packet's suggested path; the reason is the rglob, not preference.

SOURCES (all read-only; all outside this repo except the page itself)
---------------------------------------------------------------------
  ../marketing-engine/backlog/backlog.json          -> backlog board
  ../marketing-engine/measurement/kpi-tree.md       -> KPI names, both phases
  ../marketing-engine/measurement/prompt-panel.json -> prompt-panel shape
  ../marketing-engine/measurement/prompt-panel.md   -> zero-reporting rule
  ../drafts-inbox/*.md                              -> route drafts
  ../marketing-engine/route-patches/*.md            -> patches + promotions
  ../marketing-engine/DECISIONS-NEEDED.md           -> open decision cards

A missing source degrades that one section to an explicit empty state. It never
invents a value and never fails the build.

Usage:  python3 scripts/build-marketing-snapshot.py [--check]
        --check exits 1 if the page's block is out of date (no write).
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent                    # frankly-os-site/
WORKSPACE = REPO_ROOT.parent                     # Frankly os/
ENGINE = WORKSPACE / "marketing-engine"
PAGE = REPO_ROOT / "marketing" / "index.html"

BEGIN = "<!-- MARKETING-SNAPSHOT:BEGIN -->"
END = "<!-- MARKETING-SNAPSHOT:END -->"

# Order the board renders in. Not alphabetical — it is the publish order the
# backlog's own priority rule implies (learning centre + trust pages first,
# comparisons last).
TYPE_ORDER = [
    "learning",
    "glossary",
    "tool",
    "partner",
    "icp-lp",
    "product-lp",
    "comparison",
]
TYPE_LABEL = {
    "learning": "Learning centre",
    "glossary": "Glossary",
    "tool": "Tools",
    "partner": "Partner pages",
    "icp-lp": "ICP landing pages",
    "product-lp": "Product landing pages",
    "comparison": "Comparisons",
}
GATE_LABEL = {
    "none": "open",
    "claims-gate": "claims-gate",
    "legal-blocked": "legal-blocked",
}
# Schema 2.0 additions (run 20260822-lab-design-grip, additive): the instrument's lane ids
# (deep-link safe slugs, one per page type + "all"), the scrubber's gate order (writability,
# left → right), and the gate glossary — wording taken verbatim from the page's previous
# legend / footnotes, so the chips' sheets say what the board always said.
LANE_ID = {
    "learning": "learning-centre",
    "glossary": "glossary",
    "tool": "tools",
    "partner": "partner-pages",
    "icp-lp": "icp-landing",
    "product-lp": "product-landing",
    "comparison": "comparisons",
}
GATE_ORDER = ["none", "claims-gate", "legal-blocked"]
GATE_GLOSSARY = {
    "none": {"label": "Open — no gate", "meaning": "Open — no gate. Writable now."},
    "claims-gate": {"label": "Claims-gate", "meaning": "Claims-gate — needs a Jonas-named scope."},
    "legal-blocked": {"label": "Legal-blocked", "meaning": "Legal-blocked — needs legal, not just claims."},
    "jonas": {"label": "Awaiting Jonas", "meaning": "New routes are a hard Jonas gate; Drive is read-only from here. Nothing is applied or moved."},
    "est": {"label": "~ estimate", "meaning": "A trailing ~ marks an estimate; its basis and its owner are shown here. The .est convention is an unratified proposal (open decision card 11). Anything not marked is read from a source file, not estimated."},
}
PAGE_SIZE = 4  # cards per stop page on the instrument (the page's renderer reads this, never assumes it)


def _read_text(path: Path) -> str | None:
    try:
        return path.read_text(encoding="utf-8")
    except OSError:
        return None


def _read_json(path: Path):
    text = _read_text(path)
    if text is None:
        return None
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return None


# --------------------------------------------------------------------------- backlog
def build_backlog() -> dict:
    data = _read_json(ENGINE / "backlog" / "backlog.json")
    if not data or "items" not in data:
        return {"available": False, "empty_state": "backlog.json not readable — board not rendered."}

    items = data["items"]
    phases = []
    for phase in ("foundation", "activation"):
        rows = [i for i in items if i.get("phase") == phase]
        if not rows:
            continue
        groups = []
        seen_types = [t for t in TYPE_ORDER if any(r.get("type") == t for r in rows)]
        seen_types += sorted({r.get("type") for r in rows} - set(seen_types))
        for type_name in seen_types:
            bucket = [r for r in rows if r.get("type") == type_name]
            bucket.sort(key=lambda r: (r.get("priority", 9), r.get("id", "")))
            groups.append({
                "type": type_name,
                "label": TYPE_LABEL.get(type_name, type_name),
                "count": len(bucket),
                "by_gate": dict(Counter(r.get("legal_gate", "none") for r in bucket)),
                "by_priority": dict(Counter(str(r.get("priority")) for r in bucket)),
                "items": [{
                    "id": r.get("id"),
                    "title_da": r.get("title_da"),
                    "url_slug": r.get("url_slug"),
                    "priority": r.get("priority"),
                    "status": r.get("status"),
                    "legal_gate": r.get("legal_gate", "none"),
                    "gate_label": GATE_LABEL.get(r.get("legal_gate", "none"), r.get("legal_gate")),
                    "dependencies": r.get("dependencies", []),
                } for r in bucket],
            })
        phases.append({
            "phase": phase,
            "total": len(rows),
            "by_gate": dict(Counter(r.get("legal_gate", "none") for r in rows)),
            "by_status": dict(Counter(r.get("status") for r in rows)),
            "by_priority": dict(Counter(str(r.get("priority")) for r in rows)),
            "groups": groups,
        })

    # ---- schema 2.0: the instrument's flat items + lanes with populated gate stops ----
    # Order = the phase groups' own order (foundation first, TYPE_ORDER, priority, id), so the
    # flat list is the same records the groups hold, nothing re-sorted by hand.
    flat = []
    for ph in phases:
        for grp in ph["groups"]:
            for r in grp["items"]:
                flat.append({
                    "id": r["id"],
                    "lane": LANE_ID.get(grp["type"], grp["type"]),
                    "type": grp["type"],
                    "type_label": grp["label"],
                    "phase": ph["phase"],
                    "gate": r["legal_gate"],
                    "gate_label": r["gate_label"],
                    "priority": r["priority"],
                    "url_slug": r["url_slug"],
                    "title_da": r["title_da"],
                    "dependencies": r["dependencies"],
                })

    def stops_for(rows):
        out = []
        for gate in GATE_ORDER:
            n = sum(1 for r in rows if r["gate"] == gate)
            if n:
                out.append({"gate": gate, "label": GATE_GLOSSARY[gate]["label"], "count": n,
                            "pages": -(-n // PAGE_SIZE)})
        return out

    lanes = [{
        "id": "all", "label": "All", "type": None, "count": len(flat),
        "by_phase": dict(Counter(r["phase"] for r in flat)),
        "stops": stops_for(flat),
    }]
    for type_name in TYPE_ORDER + sorted({r["type"] for r in flat} - set(TYPE_ORDER)):
        rows = [r for r in flat if r["type"] == type_name]
        if not rows:
            continue
        lanes.append({
            "id": LANE_ID.get(type_name, type_name), "label": TYPE_LABEL.get(type_name, type_name),
            "type": type_name, "count": len(rows),
            "by_phase": dict(Counter(r["phase"] for r in rows)),
            "stops": stops_for(rows),
        })

    return {
        "available": True,
        "source_generated": data.get("generated"),
        "total": len(items),
        "by_gate": dict(Counter(i.get("legal_gate", "none") for i in items)),
        "by_status": dict(Counter(i.get("status") for i in items)),
        "phases": phases,
        "lanes": lanes,
        "items": flat,
        "page_size": PAGE_SIZE,
        "reachable_states": sum(len(l["stops"]) for l in lanes),
        "dead_states": 0,
        "titles_note": (
            "Titles are PLANNED page titles from the backlog, not published copy. "
            "Nothing on this board states what Frankly covers, what anything costs, "
            "or what a policy says. The gate column is why."
        ),
    }


# --------------------------------------------------------------------------- KPIs
def build_kpis() -> dict:
    text = _read_text(ENGINE / "measurement" / "kpi-tree.md")
    if text is None:
        return {"available": False, "empty_state": "kpi-tree.md not readable — KPI tree not rendered."}

    foundation = []
    for match in re.finditer(r"^### (F\d+) — (.+?)\s*$", text, re.M):
        block = text[match.end(): match.end() + 2600]
        def field(name: str) -> str | None:
            m = re.search(rf"^- \*\*{name}:?\*\*\s*(.+?)(?=\n- \*\*|\n###|\n---)", block, re.M | re.S)
            return re.sub(r"\s+", " ", m.group(1)).strip() if m else None
        foundation.append({
            "id": match.group(1),
            "label": match.group(2),
            "cadence": field("Cadence"),
            "owner": field("Owner"),
            "not_a_measure_of": field("It does NOT mean"),
            "state": "not-yet-measured",
        })

    guardrails = []
    for row in re.finditer(r"^\|\s*\*\*(G\d+) — (.+?)\*\*\s*\|(.*?)\|(.*?)\|\s*$", text, re.M):
        guardrails.append({
            "id": row.group(1),
            "label": row.group(2),
            "definition": row.group(3).strip(),
            "red_when": row.group(4).strip(),
            "state": "not-yet-measured",
        })

    activation = []
    for row in re.finditer(r"^\|\s*\*\*(A\d+) — (.+?)\*\*\s*\|([^|]*)\|", text, re.M):
        activation.append({
            "id": row.group(1),
            "label": row.group(2),
            "definition": row.group(3).strip(),
            "state": "not-computed",
        })

    rule = None
    m = re.search(r"^> \*\*Fase 1 may be judged ONLY.*?\n> \*\*(.+?)\*\*\s*$", text, re.M | re.S)
    if m:
        rule = re.sub(r"\s*>\s*", " ", m.group(0)).replace("**", "").strip()

    gate = None
    m = re.search(r"\*\*Gate condition for the whole section:\*\*(.+?)\n\n", text, re.S)
    if m:
        gate = re.sub(r"\s+", " ", re.sub(r"`\[EST.*?\]`", "[EST]", m.group(1))).strip()

    return {
        "available": True,
        "phase_rule": rule or (
            "Fase 1 may be judged ONLY on the Foundation list. Any report placing an "
            "Activation metric next to Fase 1 work is a reporting defect, not a finding."
        ),
        "foundation": foundation,
        "guardrails": guardrails,
        "activation": activation,
        "activation_gate": gate,
        "activation_render_rule": (
            "Activation KPIs are listed by NAME ONLY. No value is computed, shown or "
            "implied for any of them until the gate condition is met. A number here "
            "would be a reporting defect."
        ),
    }


# --------------------------------------------------------------------------- prompt panel
def build_prompt_panel() -> dict:
    data = _read_json(ENGINE / "measurement" / "prompt-panel.json")
    if not data:
        return {"available": False, "empty_state": "prompt-panel.json not readable — panel not rendered."}

    prompts = data.get("prompts", [])
    engines = data.get("engines", {})
    engine_rows = []
    for key, value in engines.items():
        engine_rows.append({
            "id": key,
            "label": value.get("label") if isinstance(value, dict) else str(value),
        })

    runs_dir = ENGINE / "measurement" / "runs"
    run_files = sorted(p.name for p in runs_dir.glob("panel-*.json")) if runs_dir.exists() else []

    return {
        "available": True,
        "status": data.get("status"),
        "language": data.get("language"),
        "prompt_count": len(prompts),
        "engines": engine_rows,
        "by_intent_type": dict(Counter(p.get("intent_type") for p in prompts)),
        "by_priority": dict(Counter(str(p.get("priority")) for p in prompts)),
        "scoring_fields": data.get("scoring_fields", []),
        "sample_prompts": [
            {"id": p.get("id"), "prompt_da": p.get("prompt_da"), "intent_type": p.get("intent_type"),
             "priority": p.get("priority")}
            for p in prompts[:6]
        ],
        "runs": run_files,
        "first_signal_est": {
            "text": "3–6 months",
            "basis": "typical indexing-to-citation lag in English-language GEO reporting; no Danish evidence exists",
            "owner": "M3",
            "note": "First signal is not expected for 3–6 months after the first published cluster is indexed. Until then, absence is the expected reading.",
        },
        "run_count_state": "none",
        "empty_state": "No runs yet — baseline pending.",
        "zero_rule": (
            "When the panel does run, a Frankly score of zero is reported as "
            "'baseline — no signal yet', never as a 0 on a chart. Frankly is EXPECTED "
            "to score nothing for the first months; a wall of zeros is what gets a "
            "measurement foundation abandoned."
        ),
    }


# --------------------------------------------------------------------------- routes
def _first_status_line(text: str) -> str | None:
    m = re.search(r"^\*\*Status:\*\*\s*(.+?)$", text, re.M)
    if m:
        return m.group(1).strip()
    m = re.search(r"^> \*\*(DRAFT — NOT CANON\.)\*\*", text, re.M)
    return m.group(1) if m else None


def build_routes() -> dict:
    drafts = []
    drafts_dir = WORKSPACE / "drafts-inbox"
    if drafts_dir.exists():
        for path in sorted(drafts_dir.glob("draft-*.md")):
            text = _read_text(path) or ""
            dest = re.search(r"library/routes/[A-Za-z0-9\-/]+\.md", text)
            family = re.search(r"\*\*Format family chosen: ([AB])", text)
            drafts.append({
                "file": path.name,
                "kind": "route draft",
                "destination": dest.group(0) if dest else None,
                "format_family": family.group(1) if family else None,
                "status": _first_status_line(text) or "DRAFT — NOT CANON.",
                "gate": "Jonas — a new route is a hard gate; nothing routes to it until he files it.",
                "gate_state": "awaiting-jonas",
            })

    patches, promotions = [], []
    patch_dir = ENGINE / "route-patches"
    if patch_dir.exists():
        for path in sorted(patch_dir.glob("*.md")):
            text = _read_text(path) or ""
            target = re.search(r"^\*\*(?:Target file|Subject file):\*\*\s*(.+?)$", text, re.M)
            record = {
                "file": path.name,
                "target": target.group(1).strip() if target else None,
                "status": _first_status_line(text) or "PROPOSED — not applied.",
                "gate": "Jonas — Drive is read-only from here; nothing is applied or moved.",
                "gate_state": "awaiting-jonas",
            }
            if path.name.startswith("promote-"):
                record["kind"] = "route promotion"
                promotions.append(record)
            else:
                record["kind"] = "section patch"
                patches.append(record)

    return {
        "available": bool(drafts or patches or promotions),
        "drafts": drafts,
        "patches": patches,
        "promotions": promotions,
        "note": (
            "Everything in this map is a proposal sitting in a staging lane. "
            "Nothing has been filed into Drive, applied to a canon route, or promoted."
        ),
    }


# --------------------------------------------------------------------------- decisions
# DECISIONS-NEEDED.md (emitted by marketing-engine/build-decisions-needed.py) writes
# cards as `### ID — question` under `## <Group>  ·  N cards` sections, with an
# `## Answer these five first` table and a closing `## Index — N cards` list.
# The parser below is deliberately strict: a heading that does not match is a
# source change, not a reason to loosen a regex. Any inconsistency raises.
CARD_RE = re.compile(r"^###\s+([A-Z][A-Z-]*-\d+)\s+—\s+(.+?)\s*$", re.M)
GROUP_RE = re.compile(r"^##\s+(.+?)\s+·\s+(\d+)\s+cards\s*$", re.M)
H2_RE = re.compile(r"^##\s", re.M)
H2_OR_H3_RE = re.compile(r"^#{2,3}\s", re.M)
BLURB_RE = re.compile(r"^_(.+)_$", re.M)
FIVE_RE = re.compile(r"^\|\s*\d+\s*\|\s*\*\*([A-Z][A-Z-]*-\d+)\*\*\s*—\s*(.+?)\s*\|\s*(.+?)\s*\|$", re.M)
RAISED_RE = re.compile(r"<sub>Raised in `(.+?)`</sub>")
INDEX_RE = re.compile(r"^##\s+Index\s+—\s+(\d+)\s+cards\s*$", re.M)
FIVE_FIRST_ORDER = ["CA-01", "CA-09", "MK-SK-01", "MB-03", "MK-02"]


def _span_end(text: str, start: int, boundary: re.Pattern) -> int:
    m = boundary.search(text, start)
    return m.start() if m else len(text)


def build_decisions() -> dict:
    text = _read_text(ENGINE / "DECISIONS-NEEDED.md")
    if text is None:
        return {"available": False, "empty_state": "DECISIONS-NEEDED.md not readable."}

    # Cards: one per `### ID — question`; body = to the next h2/h3.
    cards_by_id: dict[str, dict] = {}
    for m in CARD_RE.finditer(text):
        card_id, question = m.group(1), m.group(2)
        if card_id in cards_by_id:
            raise ValueError(f"DECISIONS-NEEDED.md: duplicate card id {card_id}")
        body = text[m.end(): _span_end(text, m.end(), H2_OR_H3_RE)]
        raised = RAISED_RE.search(body)
        if not raised or not raised.group(1).strip():
            raise ValueError(f"DECISIONS-NEEDED.md: card {card_id} has no `<sub>Raised in ...</sub>` line")
        cards_by_id[card_id] = {
            "id": card_id,
            "question": question,
            "raised_in": raised.group(1).strip(),
            "pos": m.start(),
        }

    # Groups: `## Title  ·  N cards`; span = to the next h2; blurb = first `_..._` line.
    groups = []
    for g in GROUP_RE.finditer(text):
        span_start, span_end = g.end(), _span_end(text, g.end(), H2_RE)
        span = text[span_start:span_end]
        blurb = BLURB_RE.search(span)
        members = [c for c in cards_by_id.values() if span_start <= c["pos"] < span_end]
        declared = int(g.group(2))
        if len(members) != declared:
            raise ValueError(
                f"DECISIONS-NEEDED.md: group '{g.group(1)}' declares {declared} cards, found {len(members)}")
        groups.append({
            "title": g.group(1),
            "blurb": blurb.group(1).strip() if blurb else None,
            "count": declared,
            "cards": [{"id": c["id"], "question": c["question"], "raised_in": c["raised_in"]}
                      for c in members],
        })

    total = len(cards_by_id)
    group_sum = sum(g["count"] for g in groups)
    if total != group_sum:
        raise ValueError(f"DECISIONS-NEEDED.md: {total} cards parsed but groups declare {group_sum}")
    index = INDEX_RE.search(text)
    if not index:
        raise ValueError("DECISIONS-NEEDED.md: `## Index — N cards` heading not found")
    if total != int(index.group(1)):
        raise ValueError(f"DECISIONS-NEEDED.md: {total} cards parsed but Index heading says {index.group(1)}")

    # Five-first table: the card's own question is authoritative; why_first carried.
    five_first = []
    for row in FIVE_RE.finditer(text):
        card_id = row.group(1)
        if card_id not in cards_by_id:
            raise ValueError(f"DECISIONS-NEEDED.md: five-first row names unknown card {card_id}")
        five_first.append({
            "id": card_id,
            "question": cards_by_id[card_id]["question"],
            "why_first": row.group(3).strip(),
        })
    if [f["id"] for f in five_first] != FIVE_FIRST_ORDER:
        raise ValueError(
            f"DECISIONS-NEEDED.md: five-first order is {[f['id'] for f in five_first]}, "
            f"expected {FIVE_FIRST_ORDER}")

    flat = []
    for g in groups:
        for c in g["cards"]:
            flat.append({"id": c["id"], "question": c["question"], "raised_in": c["raised_in"],
                         "group": g["title"]})

    return {
        "available": True,
        "source": "marketing-engine/DECISIONS-NEEDED.md",
        "total": total,
        "five_first": five_first,
        "groups": groups,
        "cards": flat,
        "empty_state": (
            "No cards filed into DECISIONS-NEEDED.md yet — seats return them at close. "
            "This is 'not yet filed', not 'nothing to decide'."
        ),
    }


# --------------------------------------------------------------------------- assemble
def build_snapshot() -> dict:
    backlog = build_backlog()
    kpis = build_kpis()
    panel = build_prompt_panel()
    routes = build_routes()
    decisions = build_decisions()
    bg = backlog.get("by_gate", {})
    counts = {
        "items": backlog.get("total", 0),
        "writable_now": bg.get("none", 0),
        "claims_gate": bg.get("claims-gate", 0),
        "legal_blocked": bg.get("legal-blocked", 0),
        "by_type": {l["id"]: l["count"] for l in backlog.get("lanes", []) if l["id"] != "all"},
        "reachable_states": backlog.get("reachable_states", 0),
        "dead_states": backlog.get("dead_states", 0),
        "kpi": len(kpis.get("foundation", [])) + len(kpis.get("guardrails", [])) + len(kpis.get("activation", [])),
        "kpi_foundation": len(kpis.get("foundation", [])),
        "kpi_guardrails": len(kpis.get("guardrails", [])),
        "kpi_activation": len(kpis.get("activation", [])),
        "prompts": panel.get("prompt_count", 0),
        "prompt_samples": len(panel.get("sample_prompts", [])),
        "engines": len(panel.get("engines", [])),
        "intents": len(panel.get("by_intent_type", {})),
        "scoring_fields": len(panel.get("scoring_fields", [])),
        "runs": len(panel.get("runs", [])),
        "routes": len(routes.get("drafts", [])) + len(routes.get("patches", [])) + len(routes.get("promotions", [])),
        "decisions": decisions.get("total", 0),
        "five_first": len(decisions.get("five_first", [])),
        "awaiting_jonas": decisions.get("total", 0),
    }
    return {
        "schema_version": "2.0",
        "generated_at": datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds"),
        "generated_by": "frankly-os-site/scripts/build-marketing-snapshot.py",
        "hand_edit_warning": "GENERATED BLOCK — do not hand-edit. Re-run the generator instead.",
        "surface": {
            "path": "/marketing/",
            "host": "os.franklydesign.dk",
            "posture": "internal test surface · gated · noindex · Disallow: /marketing/",
            "status": "Prototype",
        },
        "claims_lock": {
            "state": "LOCKED",
            "since": "2026-07-04",
            "one_open_scope": "_scratch/ only",
            "note": (
                "Claims / product / coverage / legal copy may be produced freely inside "
                "Frankly os/_scratch/ and nowhere else. The boundary is the DIRECTORY, not "
                "the wording. Moving anything out of _scratch/ is a human act and it goes "
                "to Jonas — there is no machine door."
            ),
        },
        "phase": "foundation",
        "backlog": backlog,
        "kpis": kpis,
        "prompt_panel": panel,
        "routes": routes,
        "open_decisions": decisions,
        "gate_glossary": GATE_GLOSSARY,
        "counts": counts,
        "sources": [
            "marketing-engine/backlog/backlog.json",
            "marketing-engine/measurement/kpi-tree.md",
            "marketing-engine/measurement/prompt-panel.json",
            "marketing-engine/route-patches/*.md",
            "drafts-inbox/draft-*.md",
            "marketing-engine/DECISIONS-NEEDED.md",
        ],
    }


def render_block(snapshot: dict) -> str:
    payload = json.dumps(snapshot, ensure_ascii=False, indent=2)
    # Cannot terminate the host <script> element from inside a JSON string.
    payload = payload.replace("</", "<\\/")
    return (
        f"{BEGIN}\n"
        "<!-- GENERATED by scripts/build-marketing-snapshot.py — DO NOT HAND-EDIT. -->\n"
        '<script id="marketing-snapshot" type="application/json">\n'
        f"{payload}\n"
        "</script>\n"
        f"{END}"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Rebuild the inline marketing snapshot.")
    parser.add_argument("--check", action="store_true",
                        help="Exit 1 if the page block is stale; write nothing.")
    args = parser.parse_args()

    if not PAGE.exists():
        print(f"FAIL: {PAGE} does not exist.", file=sys.stderr)
        return 1
    html = PAGE.read_text(encoding="utf-8")
    if BEGIN not in html or END not in html:
        print(f"FAIL: markers {BEGIN} / {END} not found in {PAGE}.", file=sys.stderr)
        return 1

    block = render_block(build_snapshot())
    start = html.index(BEGIN)
    stop = html.index(END) + len(END)
    current = html[start:stop]

    # generated_at always differs; compare everything else.
    strip_ts = lambda s: re.sub(r'"generated_at":\s*"[^"]*"', '"generated_at":""', s)
    if strip_ts(current) == strip_ts(block):
        print("marketing snapshot: already current.")
        return 0
    if args.check:
        print("STALE: marketing/index.html snapshot differs from its sources.", file=sys.stderr)
        return 1

    PAGE.write_text(html[:start] + block + html[stop:], encoding="utf-8")
    snap = json.loads(re.search(r"<script id=\"marketing-snapshot\" type=\"application/json\">\n(.*?)\n</script>",
                                block, re.S).group(1).replace("<\\/", "</"))
    print(f"marketing snapshot: rewritten "
          f"({snap['backlog'].get('total', 0)} backlog items, "
          f"{len(snap['kpis'].get('foundation', []))} foundation KPIs, "
          f"{snap['prompt_panel'].get('prompt_count', 0)} prompts, "
          f"{len(snap['routes'].get('drafts', []))} drafts / "
          f"{len(snap['routes'].get('patches', []))} patches / "
          f"{len(snap['routes'].get('promotions', []))} promotions, "
          f"{snap['open_decisions'].get('total', 0)} decision cards).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
