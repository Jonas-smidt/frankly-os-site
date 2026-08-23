# Frankly Lab — Binding Design Spec (v1)

**Status: binding.** This is the single source every Lab page-writer implements against.
It is paired with `frankly-lab-brand.css` (same repo root), which now contains the full
shared component layer. Every class name in this spec exists in that file, spelled exactly
as written here.

Scope: Lab pages at the repo root of `frankly-os-site`. Out of scope (do not touch):
`journal/`, `journal-drafts/`, `data/`, `scripts/`, `site/`, `guide/`, `publish-dry-run/`,
`CNAME`, `robots.txt`, `.git`. No page-writer deploys anything — publish is Jonas's gate.

---

## 0. The two-line contract

Every Lab page:

```html
<link rel="stylesheet" href="frankly-lab-brand.css">
<body class="fl">
```

That is not optional. `body class="fl"` opts headings into Almarena 600 / bordeaux and body
copy into Switzer / grey-1. A page that skips either is off-canon by definition.

---

## 1. Token table

All values live in `:root` of `frankly-lab-brand.css`. **Never hardcode a hex that has a
token.** Never invent a page-private palette fork (`--cockpit-*`, `--studio-*`, `--obs-*`
style prefixed forks are the documented failure mode — do not repeat it).

### 1.1 Color — with roles

| Token | Hex | Role (binding) |
|---|---|---|
| `--limestone` | `#F5F4F1` | THE page background. Every Lab page body sits on this. |
| `--limestone-soft` / `--stone-2` | `#F0EEE9` | Secondary quiet surface: shelf heads, neutral chips. |
| `--stone` | `#ECE9E4` | Tertiary neutral surface. |
| `--stone-4` / `--edge` | `#E3DDD5` | THE card/pill/input border. |
| `--stone-deep` | `#D9D1C8` | Deepest stone; input hover border. Rare. |
| `--paper` / `--white` | `#FFFFFF` | Card and panel backgrounds on limestone. |
| `--pink-stone` | `#F3DEE4` | Dirty Pink. UI/graphic only (inline code bg etc.), never imagery. |
| `--bordeaux` / `--grounded` | `#2D0011` | THE brand ink: all headings, chip text, primary button fill, links, the ONE permitted dark panel surface (`.fl-panel`). Tinted hairlines/shadows are `rgba(45,0,17,x)`. |
| `--ink` | `#111111` | Off Black. Wordmark color in external/brand contexts. On-Lab the inline SVG wordmark renders bordeaux via `currentColor` — that is the Lab convention. |
| `--grey-1` / `--grey` / `--muted` | `#585C60` | Body text. |
| `--grey-2` | `#7C7A77` | Muted secondary text, footer, placeholders. |
| `--calm-pink` / `--pink` | `#FFD3E3` | Pale Calm. Selection bg, accent washes. |
| `--calm-deep` / `--pink-deep` | `#FFACCA` | Deep Calm. THE interaction color: hover borders, focus rings. |
| `--blush` / `--pink-wash` / `--pink-soft` | `#FFF6FA` | Faint pink wash surfaces. |
| `--line` | `#E9E6E1` | Hairline section dividers. |
| `--line-dark` | `rgba(45,0,17,.14)` | Bordeaux-tinted hairline (ghost button border, brand divider). |
| `--ok` | `#CFE8BF` | **Semantic only.** Live/success chip fill. Never a section, card, page or large surface. |
| `--success` | `#057642` | Deep semantic green: live-state text. Semantic only. |
| `--success-live` | `#27C966` | Live dot. Semantic only. |
| `--warn` | `#F3D187` | Locked/warning chip fill only. |
| `--blue` | `#CCD8F0` | Draft chip fill only. |
| `--sky` | `#CEEBFF` | Public chip fill only. Flagged for review — no new uses beyond chips. |
| `--recover` | `#E7D7F1` | Missing/recover chip fill only. |
| `--lavender` | `#F0EEFC` | Flagged for review — do not introduce new uses. |
| `--alert` | `#C2244F` | Form-error / destructive TEXT only. Never a surface. |

### 1.2 Type

Families (never hardcode a font stack — use the vars):

- `--fl-display` — Almarena Neue Display. **Headlines/hero only. Weight 600, always.**
  Almarena ships only as 600/700 — `font-weight: 800/900` produces browser-faked bold and
  is banned. 600 is the ceiling for display type.
- `--fl-sans` / `--font` — Switzer. All body and UI copy. Weights 400/500/600 only
  (self-hosted; do not load Fontshare/Google Fonts — the local `@font-face` in the brand
  css is the source).

Scale (as executed on the canon pages):

| Slot | Spec |
|---|---|
| Hero h1 | `clamp(52px, 8.4vw, 104px)`, lh .94, ls −.02em, max-width 9ch |
| Page h1 (non-hero) | `clamp(38px, 6vw, 64px)`, lh 1, ls −.02em |
| Section h2 | 32px, lh 1.04 (27px ≤520px) |
| Shelf h3 | 26px, lh 1.06 |
| Card h3 | 23px, lh 1.1 |
| Panel display | 34px Almarena 600 |
| Metric number | 26px, `tabular-nums` (`.fl-num`) |
| Lede | 19px Switzer, lh 1.55 (`.fl-lede`) |
| Body | 16px, lh 1.6, `--grey-1` |
| Card body | 14.5px, lh 1.5 |
| Kicker | 12px / 600 / ls .12em / uppercase / `rgba(45,0,17,.62)` (`.fl-kicker`) |
| Chip | 11px / 600 / uppercase / ls .02em / bordeaux text (`.fl-chip`) |
| Pill nav | 13px / 500 (`.fl-pill`) |
| Button | 15px / 600 (`.fl-btn`) |

Headings get `text-wrap: balance`, paragraphs `text-wrap: pretty` (both from `.fl`).

### 1.3 Spacing / radius / shadow / motion

| Token | Value | Role |
|---|---|---|
| `--sp-1`…`--sp-8` | 4 / 8 / 12 / 16 / 20 / 26 / 34 / 52 px | Spacing scale. Use these before inventing a pixel value. |
| `--wrap-max` | 1180px | Content column: `width:min(var(--wrap-max), calc(100% - 40px))` — that is `.fl-wrap`. |
| `--r-sm` | 10px | Inputs, metric cells. |
| `--r-card` | 16px | Cards, panels. **8px radii are banned** (generic-admin tell). |
| `--r-lg` | 24px | Hero/status panels, gate card. |
| `--r-pill` | 999px | Pills, buttons, chips. |
| `--shadow-card` | bordeaux-tinted, soft | Resting/hover card shadow. |
| `--shadow-lift` | bordeaux-tinted, deep | Lifted panels, gate card. Shadows are never grey/black. |
| `--ease` / `--ease-out` | canon cubic-beziers | All transitions. |
| `--dur-ui` / `--dur-hover` | 300 / 320 ms | Buttons snap at 140ms transform. |

Interaction grammar: hover = border→`--calm-deep` + small lift (−1..−3px) + `--shadow-card`;
`:active` = `scale(.97)`; focus = 2px `--calm-deep` outline (provided globally). Motion only
where it explains state or flow; everything respects `prefers-reduced-motion`.

---

## 2. Shared page anatomy — exact markup

Adopt these blocks **verbatim** (change only href/text content). Class names are binding.

### 2.1 Topbar — `.fl-wrap.fl-topbar`

The wordmark is the real inline SVG (`<symbol id="frankly-logo" viewBox="0 0 147.16 36.63">`
— copy the `<svg width="0" height="0">` defs block from `index.html` once into your page),
rendered via `currentColor` in bordeaux. Never the PNG-inverted-with-filters trick, never
recolored, never distorted.

```html
<header class="fl-wrap fl-topbar">
  <a class="fl-brand" href="index.html" aria-label="Frankly Lab">
    <svg role="img" aria-hidden="true" focusable="false" viewBox="0 0 147.16 36.63"><use href="#frankly-logo"/></svg>
    <span class="lab">Lab</span>
  </a>
  <nav class="fl-nav" aria-label="Lab pages">
    <a class="fl-pill" href="index.html">Tools</a>
    <a class="fl-pill" href="journal/frankly-blog-index.html">Journal</a>
  </nav>
</header>
```

### 2.2 Page header — `.fl-page-head`

```html
<section class="fl-wrap fl-page-head">
  <p class="fl-kicker">Tool</p>
  <h1>Signature generator.</h1>
  <p class="fl-lede">One calm sentence saying what this page does and for whom.</p>
</section>
```

### 2.3 Card grid — `.fl-band` + `.fl-section-head` + `.fl-grid` + `.fl-card`

```html
<section class="fl-wrap fl-band" id="tools">
  <div class="fl-section-head">
    <div>
      <p class="fl-kicker">Tools</p>
      <h2>Tools in the online Lab</h2>
    </div>
  </div>
  <div class="fl-grid">
    <a class="fl-card" href="frankly-dictionary.html">
      <span class="fl-chip is-live">Live</span>
      <h3>Dictionary</h3>
      <p>Search recurring brand answers locally without any AI runtime.</p>
      <span class="fl-go">Open</span>
    </a>
  </div>
</section>
```

Chip vocabulary (fills only, bordeaux text unless noted): `is-live` (green — semantic),
`is-draft` (blue), `is-locked` (warn), `is-public` (sky), `is-missing` (recover),
`is-experiment` (blush wash + dashed Deep Calm border — for glass-lab-family cards),
`is-os` (bordeaux fill, limestone text — marks OS operating surfaces, never public-hub cards).

### 2.4 Tool page shell — `.fl-tool`

Wrap the tool's working UI (the existing JS stays untouched) in:

```html
<main class="fl-wrap fl-tool">
  <nav class="fl-crumb" aria-label="Breadcrumb">
    <a href="index.html">Lab</a><span aria-hidden="true">/</span><span>Signature generator</span>
  </nav>
  <!-- page header block (2.2) may follow here, then: -->
  <section class="fl-tool-panel">
    <!-- existing tool markup + JS, restyled with .fl-field/.fl-input/.fl-btn -->
  </section>
</main>
```

`.fl-tool-panel` is the white 16px-radius working card. Multiple panels stack with
`--sp-5` gaps. Form controls inside use `.fl-field` (label + control + optional
`.fl-help` / `.fl-error`), `.fl-input`, `.fl-select`, `.fl-textarea`; actions use
`.fl-actions` with `.fl-btn` / `.fl-btn--ghost`.

### 2.5 Footer — `.fl-footer`

```html
<footer class="fl-wrap fl-footer">
  <p>Frankly Lab is a gated preview space. Tools run locally in your browser; nothing here is customer-facing product, claims or legal material.</p>
</footer>
```

### 2.6 Code-gate screen — `.fl-gate`

Tools are code-gated (default code `frankly`). Two cases:

1. **Deploy-injected gate** (`scripts/sync_from_drive.py` appends `#__flab_gate`): do
   nothing — the brand css now restyles the injected overlay on-canon automatically
   (Switzer/Almarena, bordeaux, pill button). Never edit the script.
2. **A page that carries its own gate** uses this markup; the page's own JS does the
   code check exactly as before:

```html
<div class="fl-gate" role="dialog" aria-modal="true" aria-labelledby="gateTitle">
  <div class="fl-gate-card">
    <p class="fl-kicker">Frankly Lab</p>
    <h1 id="gateTitle">Access code</h1>
    <p>Enter the code to continue.</p>
    <input class="fl-input" id="gateInput" type="password" autocomplete="off" aria-label="Access code">
    <p class="fl-gate-error" id="gateError" aria-live="polite"></p>
    <button class="fl-btn" id="gateUnlock" type="button">Unlock</button>
  </div>
</div>
```

### 2.7 Dark status panel — `.fl-panel` (optional, the ONE dark surface)

```html
<aside class="fl-panel" aria-label="Status">
  <span class="fl-kicker">Boundary</span>
  <b>Tools, pages, play.</b>
  <p>One short paragraph.</p>
  <div class="fl-metrics">
    <div><strong>17</strong><small>Lab pages</small></div>
    <div><strong>3</strong><small>previews</small></div>
  </div>
</aside>
```

### 2.8 Hero-led page — `.lg-hero` (the grip variant, spec §6)

A page built on the grip (§6) is a named **variant** of the anatomy above, not an exception to it:

- `.fl-page-head` (§2.2) is **replaced** by `.lg-hero` — kicker (`.fl-kicker`), couplet, 2–3
  snapshot numbers, "as of" line, one object still. No `.fl-lede`.
- `.fl-footer` (§2.5) is **replaced** by the stage caption's provenance line `.lg-cap__prov`,
  which becomes **mandatory**: as of · built · source; generator in `title`/`data-generator`, rendered from the page's own
  snapshot. A hero-led page with no `.lg-cap__prov` fails. On a hero-led page with **no `.lg-stage`**, the
  provenance line is `.lg-asof.is-prov` (13px `--grey-1`): one human-words line, **as of · built · source**,
  in that order, written by the page's generator into its inline snapshot. The generator's own name is
  **machine-readable only** — `title` and `data-generator` on the same element — never hero copy
  (M4 §12 amendment, 2026-08-23). One line, not two: the as-of and the provenance merge.
  (M4.1 index attack gap 6, 2026-08-22.)
- The topbar (§2.1) stays verbatim. The tool-shell and gate blocks (§2.4, §2.6) are unchanged
  where the page has them.

Adopted from M4 review 2026-08-22 (item 7). Source: `marketing/kalender.html`, accepted by Jonas 2026-08-22.

---

## 3. Copy rules

- Durable Lab surface copy is **English**. (Deliberately Danish pages — e.g. the coverage
  tool — stay Danish; do not half-translate. But no stray Danish strings inside English
  pages: "dækning og quiz"-type leftovers get fixed.)
- Voice: calm, concrete, plain. Empowerment, never fear. No marketing fluff, no
  exclamation-mark enthusiasm, no "supercharge/unlock/seamless".
- Sentence case everywhere, including buttons ("Open tools", not "OPEN TOOLS"). The only
  uppercase is the kicker/chip microtype, which the CSS applies for you.
- Never write claims/product/legal customer-facing copy — that scope is locked.

---

## 4. Hard rules (a page failing any of these is rejected)

1. **Green is semantic only.** `--ok`/`--success`/`--success-live` appear exclusively in
   small chips/dots meaning live/success. Never a theme, background, section, card, kicker
   or neutral tint (the progress-map green-tinted-neutrals failure).
2. **No generic SaaS/AI chrome.** No left-sidebar app shells, no 8px-radius hairline admin
   cards, no dark sticky nav with an inverted PNG logo, no grid-line "mission control"
   backgrounds, no glow/noise gradients. Composition carries the brand before color does.
3. **Fonts:** only `--fl-display` (600) and `--fl-sans` (400/500/600), self-hosted. No
   Google Fonts / Fontshare loads, no League Spartan/Inter, no weight 700+ on display type.
4. **Keep tool logic untouched.** Reskin is markup/class/CSS work only; every existing JS
   behavior, id hook and form flow must still work identically after the pass.
5. **Every page** links `frankly-lab-brand.css` and uses `body class="fl"`.
6. **No new tokens, no palette forks, no page-private hex** for anything the token table
   covers. If you genuinely need a new token, stop and flag it — do not mint it locally.
7. Wordmark: inline SVG symbol via `currentColor` (bordeaux on-Lab; `--ink` #111111 in any
   external/brand context). Never filtered, stretched, or given effects. Ribbon asset:
   never a figure-eight, always enters one frame edge and exits another.
8. `--alert` is text-only; never an alarm-red surface. Errors stay calm.

---

## 5. Per-page writer checklist

Before marking a page done, verify every line:

- [ ] `<link rel="stylesheet" href="frankly-lab-brand.css">` present (before any page `<style>`).
- [ ] `<body class="fl">`.
- [ ] Topbar block (§2.1) adopted **verbatim**, including the inline SVG wordmark defs.
- [ ] Footer block (§2.5) adopted verbatim — **or** the §2.8 provenance line (`.lg-cap__prov` on a stage, `.lg-asof.is-prov` on a stage-less hero-led page: as of · built · source, generator in `title`/`data-generator`, both from the page's own generated snapshot).
- [ ] Page header uses `.fl-page-head` + `.fl-kicker` + `.fl-lede` — **or** §2.8 `.lg-hero` (hero-led page).
- [ ] All off-canon colors removed: no page-private hex/palette forks; every color maps to
      a token from §1.1; green only in `is-live` chips/dots.
- [ ] No `font-weight` above 600 on Almarena; no external font CDNs; no non-canon families.
- [ ] No `border-radius: 8px`; cards/panels are `--r-card`, inputs `--r-sm`, buttons/chips `--r-pill`.
- [ ] Tool logic untouched: every id/class the page JS hooks still exists; the tool works
      end-to-end after the reskin (test it).
- [ ] Gate (if the page has its own) uses §2.6 markup; check code `frankly` still unlocks.
- [ ] Responsive: no horizontal scroll or text overflow at 375px, 768px, 1280px; grids
      collapse (the shared classes handle this — don't fight them with local overrides).
- [ ] Copy pass: English (unless the page is deliberately Danish end-to-end), calm voice,
      no marketing fluff, no stray Danish strings.
- [ ] Reduced motion: no page-local animation that ignores `prefers-reduced-motion`.
- [ ] Nothing outside your page touched; no deploy, no push, no `gh workflow run`.

---

## 6. The grip — components (`.lg-*` + `.fl-chip` modifiers)

**Status: binding** (codified 2026-08-22, run `20260822-lab-design-grip`; R4.5 draft → M4 13 amendments →
M4.1 byte-identity ruling → this section). Source: `marketing/kalender.html` (CSS L10–257), accepted by
Jonas 2026-08-22 ("kan vi opdatere lab med det design greb"). The CSS lives in `frankly-lab-brand.css`
under the delimiter `/* ===== GRIP … ===== */` (the last block of the sheet). `kalender.html` itself is
**not** refactored onto the block yet — it stays pixel-faithful on its own CSS until its own pass.

**What the grip IS, in one sentence:** one crisp object, one couplet, two or three numbers that are true
as of a date — then ONE instrument whose stage is an image, with everything the page knows sitting ON
that image as glass, never beside it as prose.

Three classes of every part (the question a sibling page asks): **REUSABLE** (take from the block),
**LOOM** (the calendar's own instrument logic — do not copy), **SIBLING DECIDES** (its ONE hero object,
its ONE instrument).

### 6.1 Tokens added to `:root` (the only additions; nothing renamed or removed)

| Token | Value | Role / provenance |
|---|---|---|
| `--ease-lead` `--ease-spring` `--dur-pop` `--dur-count` `--shadow-soft` | byte-identical to `canon/library/frankly-deck-motion-glass-spec.md` §1 | **Hosted canon motion tokens.** The comment above them names the canon path + the canon file's `sha256[:12]`; `check-grip-block.py` re-hashes canon and value-diffs the five on every pass. `--shadow-lift` is **deliberately not hosted** — the Lab value wins. |
| `--on-stage-soft` / `-story` / `-muted` / `-faint` | limestone at .92 / .9 / .78 / .72 | Text ON imagery or bordeaux: caption body / storyboard copy / glass-card date / provenance. Values **match kalender.html's source** — no two-stop normalisation (M4 item 2, facilitator ruling). |
| `--on-stage-hairline` | limestone .2 | Caption divider; canon glass §6 hairline. |
| `--scrim-stage` | bordeaux 0 → .38 → .66, bottom 62% | The stage scrim under caption/cards. |
| `--scrim-frame-story` | bordeaux .55 → .78 → .92 | Storyboard frame only (used once, still a token — rule 6). |
| `--scrim-card` / `--scrim-card-hover` / `--scrim-cap` / `--scrim-counter` | bordeaux .68 / .82 / .56 / .55 | Glass card, its hover, caption + count pill, carousel counter. |
| `--veil` | bordeaux .38 | Sheet backdrop. |
| `--ink-soft` | bordeaux .62 | Kicker / control-label / `dt` ink. Replaced the two inline `.62` in this sheet (`.fl-kicker`, `#__flab_card` eyebrow); `.fl-field>label` is `.7` and untouched. |
| `--glass-pill` / `--glass-hover` / `--glass-dot` | white .6 / .28 / .55 | **Canon glass family**, not Lab colour (provenance: glass spec §6). Lane pill resting fill, glass-pill hover, carousel dots. |

**Geometry knobs are page-level, not `:root`:** `--lg-hero-split-a/-b` (40fr/60fr) and `--lg-hero-h`
(900px) are declared on `.lg-hero`; `--lg-stage-h` (640 / 720 ≤980 / 780 ≤520) and `--lg-stage-inset`
(22px / 14px ≤520 — the source value, not the `--sp` scale) on `.lg-stage`. A page overrides them on
those elements only.

**What may stay page-private:** a page may add *new* selectors the block does not define (`marketing/index.html`:
`.lg-stop__l` stop labels, `.lg-count .lg-pill{white-space:nowrap}`) and may set the declared geometry knobs.
It may **not** re-declare a selector the block already defines — if it needs to, the rule belongs in the block.

### 6.2 Hard-rule 6 — extensions that the grip makes binding

- **A literal equal to a token's hex is still a violation.** `#F5F4F1` on a page is wrong even though it
  *is* `--limestone`; write `var(--limestone)`.
- **A page may not re-declare a token that `frankly-lab-brand.css` declares.** Pasting canon §1 into a
  page `:root` re-declared `--shadow-lift` with a different value and silently changed every `.fl-panel`
  / `.fl-modal` on that page — the hosted tokens exist so that no page pastes §1 again.
- Tints of `--bordeaux` / `--limestone` used to put text on imagery are the `--scrim-*` / `--on-stage-*`
  / `--veil` / `--ink-soft` tokens above — never written inline. Need another stop? Flag it; do not mint it.
- **`--grey-2` is forbidden below 14px inside grip components** (≈3.9:1 on limestone, ≈4.2:1 on paper);
  small chrome text uses `--grey-1`.

### 6.3 Hero — `.lg-hero` (REUSABLE; the object is SIBLING DECIDES)

`.lg-hero > .lg-hero__grid > (.lg-hero__copy + .lg-hero__stage)`. Copy column: `.fl-kicker`, `h1.lg-couplet`
with two `<span>` lines, optional `.lg-sub`, `.lg-numbers` (`<div><strong data-count>…</strong><small>label</small></div>` × 2–3),
`.lg-asof`. Stage column: one `<img>` at native size or below, on the limestone halo, bleeding to the
right viewport edge (that bleed is how the hero reaches ≥50% imagery inside the 1180 wrap). Every
number is written by the page's generator into its inline snapshot — never counted from markup, never
`fetch()`ed. Prose budget for the hero ≤30 words for siblings (kalender measures 41 incl. its optional sub-line).

New type slots: **Couplet** `clamp(42px,4.9vw,70px)` lh .96 (smaller than the hero h1 because two lines
must fit beside a ≥50% stage) · **Snapshot number** 44px Almarena 600 tabular · **As-of** 13px `--grey-1`.
`.lg-asof.is-prov` is the as-of line doing provenance duty on a stage-less page (§2.8): same slot, one line
(`white-space:nowrap; width:max-content`, wrapping again ≤980; content as of · built · source, generator in
`title`/`data-generator`). At ≤520 `.lg-numbers` is a pinned three-up grid
(30px numbers, 10px labels) — never 2+1.

### 6.4 Stage — `.lg-stage` (REUSABLE; what the image MEANS is SIBLING DECIDES)

The stage IS the image: full content width, `--lg-stage-h`, `--r-lg`, `--bordeaux` ground, `--shadow-soft`.
`.lg-stage__media` covers (photos) or contains right-weighted (`is-object`, `is-wide` for alpha objects).
Scrim `::after` (bottom 62%). Z-order: media → scrim → `.lg-cap` / `.lg-count` / `.lg-cards` / `.lg-empty` at z 2.
Glass caption top-left: `.lg-cap__title` (22px Almarena) · `.lg-cap__body` · `.lg-cap__prov` (mandatory on a
hero-led page, §2.8 — on a stage-less hero-led page the same duty is carried by `.lg-asof.is-prov` in the hero,
§2.8 / §6.3). Count pills top-right: `.lg-pill` "<period> · N items" and, on overflow, `.lg-pill.is-btn`
"+N · scrub →". Glass cards bottom-left, two columns: `.lg-card` = **≤3 visible fields** (`.lg-card__t`,
`.lg-card__d`, `.lg-card__row` of chips), **max 4 cards**; `div[role=button][tabindex=0]` with Enter/Space
(a `<button>` cannot contain chip buttons). Glass only over image or bordeaux — never over bare limestone.

The page still pastes the canon `.glass.glass-standard` block (glass spec §6). Because that block is `(0,2,0)`
and loads after this sheet, the grip mirrors it: `.lg-cap.glass-standard`, `.lg-pill.glass-standard`,
`.lg-card.glass-standard` re-assert the scrims and snap the radius to **`--r-sm`** (10px; canon's 9.98px is
0.02px away — below a device pixel at any DPR, no spec row blesses 9.98).

**Radius — a frame is not a card.** `.lg-device` (the Instagram 4:5 frame) has a 22px border-radius and a
7px bordeaux edge: that is a **device edge**, not a card, and is the one radius in the block outside the
10/16/24 scale. `.lg-sheet__panel code` 4px is an inline code chip. Everything else is `--r-sm` / `--r-card` /
`--r-lg` / `--r-pill`.

**On-stage focus.** The global focus ring is bordeaux and invisible on a bordeaux card; `.lg-card`,
`.lg-lane[aria-checked=true]` and `.lg-pill.is-btn` get a `--limestone` ring on `:focus-visible`.

### 6.5 Chips — `.fl-chip` modifiers (REUSABLE; which gates its data carries is SIBLING DECIDES)

Six gate values → six chips, named from the source data's own vocabulary: `is-gate-none` (`--ok` — green
means **cleared**, still chip-size only), `is-gate-claims` (`--warn`), `is-gate-blocked` (bordeaux/limestone),
`is-gate-jonas` (`--recover`, "Awaiting Jonas"), `is-gate-number` (`--pink-stone`), `is-gate-partner`
(`--stone` + dashed `--stone-deep`). Each gate chip adds `is-gate` for the 8px `currentColor` dot. Plus
`is-est` (`~ estimate · owner`, `--calm-pink`), `is-canon` (bordeaux, sentence case), `is-slot` (dashed
pink-stone), `is-verdict` (paper + border). `.fl-chip`'s own 11px / .02em / 5px 11px apply — kalender's .05em
/ 4px 10px are dropped. **Every chip may be a tap target** (`button.fl-chip.is-btn[data-sheet]` → a sheet
with the one-line glossary from the page's own snapshot); hover is never the only path. The UA button
border is reset at `button.fl-chip` (0,1,1) so no bordered modifier loses its border (M4 item 11).

### 6.6 Instrument — `.lg-controls` = `.lg-lanes` + `.lg-scrub` (REUSABLE; the axes are SIBLING DECIDES)

A radio group of `button.lg-lane[role=radio][aria-checked]` (roving tabindex, Arrow keys) and a period
scrubber `input[type=range]` in `.lg-scrub` (`.lg-scrub__top` with `.lg-scrub__now` readout) with a
`.lg-stops` dot row (`button.lg-stop`, 24px hit area, `is-now`, `position:relative` so a page may hang a label
under each stop; `.lg-scrub` keeps 18px beneath the track for it). `.lg-lane i` is the lane count and stretches
to a pill for 3-digit counts (`min-width:22px`, `--r-pill`). **Reachable-states rule (binding):** the
scrubber's stops are the populated states only — empty states are unreachable by construction; the
generator writes the stop list, the page never computes it from text. A panel becomes a stage state
**only if its full item set is reachable by the scrubber**; otherwise it stays a section below the stage
(a 72-card truth cannot survive a ≤4-cards stage without becoming a lie). Re-selecting the active value
does nothing. Deep-link hash state `#lane=<id>&period=<id>[&page=n]` read on boot + `hashchange`, written
with `replaceState` — headless Chrome renders any state from the hash, which is how evidence is captured.
Keyboard: Arrows in the radio group and on the range; Enter/Space on cards; Esc closes the sheet; focus
returns to the opener. Reduced motion: instant render, no count-up, no autoplay.

### 6.7 Feed frames — `.lg-feed` + `.lg-frame` (REUSABLE; whether a page has a feed is SIBLING DECIDES)

Only as a stage state. `.lg-badge` channel pill + `is-draft` "Proposal · nothing posted". Frames:
`.lg-frame.lg-frame-li` (LinkedIn document: `.lg-frame__head` with `.lg-avatar` monogram, `.lg-frame__copy`
folded at 3 lines + `.lg-more`, `.lg-media`, `.lg-bar`, `.lg-frame__foot` with `.lg-details`), `.lg-device`
(Instagram 4:5: `__head`, `.lg-media.r4x5`, `__bar`, `__cap`), `.lg-media.is-story` (storyboard — approved
still at .42 under `--scrim-frame-story`, shot list verbatim, **no stand-in face, ever**), `.lg-media.is-type`
(hook verbatim, Almarena 600 on limestone). Masonry: `.lg-feed__grid` 8px rows, each frame spans `--span`
set by the page JS. The wordmark symbol may be reused as a monogram avatar via `currentColor`.

### 6.8 Sheet — `.lg-sheet` (REUSABLE)

`.lg-sheet` (fixed, `--veil`) › `.lg-sheet__panel` (paper, `--r-lg`, `--shadow-lift` — the **Lab** value) with
`.lg-sheet__close`, `dl` two-column (150px / 1fr), `dt` in `--ink-soft`, `.row`, `.note`. Bottom-sheet below
760px, centred dialog above.

### 6.9 Motion — what the grip uses and the one rule

Used: `--ease`, `--ease-out`, `--ease-lead`, `--ease-spring`, `--dur-ui`, `--shadow-soft`, `--dur-pop` /
`--dur-count` (count-up), the canon reveal keyframes `fk-rise` / `fk-riseHead` / `fk-fade` / `fk-word` (the page
pastes canon §2a as before) and the grip's own `lg-stamp` (= canon §3 `s6stamp`). **Spring rule:**
`--ease-spring` only at proof moments — gate chips stamping when a state opens, and on feed reveal. Never on
hover, never on navigation. Reveal threshold for 900px stages: observe at `[.25,.6]` (a deliberate
deviation from canon §2b's `.6`, recorded here). Every grip animation has a `prefers-reduced-motion` guard
in the block; a future `.lg-sheet` open transition must add its own.

### 6.10 Breakpoints, data, measures

- **980 is the stage breakpoint** (added; the Lab's 860 / 640 / 520 are untouched): hero to one column with a
  4:5 stage, controls to one column, cards to one column, stage to 720px. At 520: couplet 40px, stage 780px
  with `--r-card` and 14px inset, caption body hidden.
- **Data:** `<!-- <NAME>-SNAPSHOT:BEGIN/END -->` around `<script id="<name>-snapshot" type="application/json">`,
  written by a generator in `scripts/` with `--check` (exit 1 when stale), `</` escaped; never `fetch()`,
  never a `data/` folder. Every number on the page comes from the snapshot; everything data-rendered sits in
  `[data-content]`; the soft-fail is one caption line naming the script to run.
- **Measures (per 1440×900 band, reduced motion):** prose ≤50 words outside `[data-content]` / the sheet;
  imagery ≥50%; dead states = 0; card fields = 3; horizontal overflow false. Source script:
  `os-visualization/reports/20260822-marketing-calendar-social-examples/measure-kalender.py`.

### 6.11 What a sibling page must bring (the brief's minimum)

1. ONE hero object (approved still, native size, alpha or clean ground) — different from its stage art.
2. ONE couplet (≤14 words) and 2–3 numbers its snapshot can prove, with an "as of" date.
3. ONE instrument: its axes, its populated-state list (written by its generator), its stage image per state,
   its ≤3 card fields — and, per panel it absorbs, the item count it must preserve (reachable-states rule).
4. Its gate vocabulary — only values its data carries, each with a one-line glossary in the snapshot.
5. A generator with `--check`, and a measure run with the three numbers in its scorecard.

Everything else is the shared block. Adopting the grip never rewrites a tool to fit it (hard rule 4): the
`.lg-stage` / `.lg-controls` shell wraps the existing JS and id hooks.
