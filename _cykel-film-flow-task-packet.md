# Task Packet · Flow storyboard stills for the Frankly Go bike film (v3)

Dispatched 2026-10-12 by the cloud session "Frankly lifestyle film Highfield"
(session_01ThH8ZykBJxZFDMgFphrdm3) on Jonas's instruction. Run this in a session on Jonas's Mac
with Chrome access (Claude Desktop in the Frankly os folder, or `claude remote-control` there).

## Objective
Produce the nine Google Flow storyboard stills for the 30-second Frankly Go bike film,
storyboard v3, using the location anchor, and deliver a contact sheet. Zero Higgsfield
credits: Flow only.

## Route
`lifestyle-flow-images` with `location-anchor` (repo form:
`os-visualization/skills/frankly-copenhagen-location-anchor-skill.md` +
`os-visualization/scripts/resolve-location.py`), then
`os-visualization/skills/frankly-flow-image-generation-skill.md` for driving Flow.
Read the canon at source first (lesson 2026-09-11): `canon/library/personality.md`, `light.md`,
`color.md`, `copenhagen-location.md`, `brand-guide.md` (Imagery),
`canon/library/routes/visual-production/lifestyle.md`.

## Target surface
Stills only, 16:9, Nano Banana 2 in Flow, x4 per prompt, one chosen per shot.
Output: `os-visualization/reports/20261012-cykel-film-storyboard/stills/`. Lab material.

## Read first
The storyboard lives in the nested `frankly-os-site/` repo on branch `ccr-b07d3c32-nu56nm`:

    git -C frankly-os-site fetch origin ccr-b07d3c32-nu56nm
    git -C frankly-os-site show origin/ccr-b07d3c32-nu56nm:_cykel-film-storyboard.md > /tmp/cykel-storyboard-v3.md

Read the whole file: seven shots, seven match cuts, shared STYLE and AVOID blocks, nine
six-block Flow prompts (stills 1 to 7 plus transition pairs 1A/2B and 5A/6B), card refs per shot.

## Allowed work, in order
1. **Location cards first.** Three places have no card: a beech-forest MTB trail (Hareskoven),
   Amager Fælled (open grassland, gravel track), Fælledparken skatepark (concrete bowls, quarter
   pipe). Add them with the library's method: `fetch-location-refs.py <slug> --query "<place>"`
   from Wikimedia Commons, curate by looking, write the card (verified facts, What-AI-gets-wrong,
   one-line prompt block 40–140 words, role line), `build-location-index.py` with 0 errors.
   Slugs: `hareskoven-mtb-trail`, `amager-faelled`, `faelledparken-skatepark`. If Commons has no
   licence-clean photo for one, say so and generate that still without an anchor, labelled
   degraded. Re-run `resolve-location.py --brief /tmp/cykel-storyboard-v3.md` and replace the
   three hand-written Location blocks in the prompts with the new cards' blocks.
2. **Flow, nine stills.** Per prompt: upload the card's reference photos FIRST
   (`os-visualization/location-library/refs/<slug>/`; some manifests list files missing from
   disk, use what exists), paste the prompt LAST via real keyboard paste, ratio 16:9 on the
   chip, Agent toggle OFF, x4. Transition pairs: generate still 1, then still 2 with the chosen
   still 1 uploaded as a composition reference and the role line in the storyboard; same for 5A
   then 6B. Normalise the prompt body to ASCII before pasting. Use your own Chrome tab.
3. **Pick one frame per prompt** against the card's researched and observed tells and the
   storyboard rules: real-time energy, sun out of frame, no flare, no readable lettering,
   understated faces, pink only where the storyboard names it. Download native size from
   Download Drive, rename `01-mtb-mud.jpg` … `07-everyone.jpg`, `1A-mud-splash.jpg`,
   `2B-puddle-splash.jpg`, `5A-bell-night.jpg`, `6B-bell-grass.jpg`, place in the report folder,
   build one contact sheet (3 columns, shot numbers burned in).
4. **File what you saw:** `file-card-observation.py` per tell per card for the five cards used,
   run id `20261012-cykel-film-storyboard-stills`.
5. **Close:** `record-frankly-run.py` (run id above, status completed-local, batch crew-adhoc,
   agents M1 + R4 + R9, tool flow) and one lesson via `file-learning.py`.

## Do not touch
No Higgsfield generation. No video. No publishing, deploy, Drive writes outside Download Drive
pickup, Slack or company-visible actions. No edits to canon files or routes. Do not commit into
`frankly-os-site/`; the storyboard file is owned by the cloud session.

## Validation
`build-location-index.py` 0 errors after the three cards · nine stills on disk at native Flow
size · contact sheet exists · `resolve-location.py` on the storyboard reaches a card for every
shot except any labelled degraded · run-card recorded.

## Stop rule
Stop and ask Jonas if: Flow returns a policy block you cannot reword in two tries, Commons has no
usable photo for a new card, Chrome is in use by another seat, or anything would spend credits.
Otherwise run to completion.

## Report back
Send the contact sheet path, chosen still filenames, the three new card slugs, the degraded list
(if any) and the run id to `session_01ThH8ZykBJxZFDMgFphrdm3` with the Claude Code Remote
`send_message` tool, and give Jonas the 6-line Final Response Contract in your chat.
