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
- [ ] Footer block (§2.5) adopted verbatim.
- [ ] Page header uses `.fl-page-head` + `.fl-kicker` + `.fl-lede`.
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
