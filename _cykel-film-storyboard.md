# Frankly Go™ · "Cyklen er til at cykle på" — 30-second film storyboard (v2)

Status: storyboard v2 for Jonas's approval. No video generated. v1 (2026-10-12, same file in git
history) was written from memory and its stills were rendered in Higgsfield; both are superseded.
Internal Lab material.

## What changed from v1, and why

- **v1 did not use the location agent.** It wrote the places from memory, which is exactly the
  failure `frankly-system:location-anchor` exists to stop. v2 ran the repository form of the
  agent, `os-visualization/scripts/resolve-location.py`, on the brief and pastes the cards'
  verified Location blocks verbatim. Every place fact below traces to a card.
- **Two places had no card and are replaced.** Cykelslangen and Inderhavnsbroen are not in the
  library (and Inderhavnsbroen sits at Nyhavn, which the canon lists as avoid-as-primary-anchor).
  Shot 3 is now Superkilen, shot 6 is now Havnebadet at Islands Brygge. Both have cards.
- **One place has no card and is kept, flagged.** Shot 1, the Nørrebro courtyard, is a scene type
  the library names as a gap (`courtyard`). Its block is hand-written from the canon's Nørrebro
  grammar and marked "anchor missing", as the skill instructs.
- **Stills move to Google Flow.** Jonas's rule: Flow does not bill per image. The stills are the
  storyboard and the first frames of the film; prompts below are Flow-ready (six-block, one line,
  reference role line last). They cannot be run from this cloud session, which has no logged-in
  Chrome; they run from the Cowork lane with the `lifestyle-flow-images` and `location-anchor`
  skills, or by hand.
- **Light follows the canon.** v1 asked for lens flare and a visible sun; `light.md` forbids both.
  Every Style block now uses the canon's street side-light or evening phrasing with the sun out
  of frame and a described sky.
- **Energy without slow motion.** Every video prompt says real-time speed. Each clip stays inside
  the Seedance motion budget: one main action and one camera move per 3 to 6 seconds.
- **The rider is one person.** Built from identity outward per `personality.md`, written
  identically in all eight prompts, and carried from shot to shot by the Flow still as the
  image-to-video first frame, which locks identity and composition.

## The idea in one line

A woman and her good bike, one day in Copenhagen in fri-mode: she takes the long way, parks
where she is going, takes the bike to the party, and never once checks over her shoulder.
Message and end-card line: `journal/frankly-blog-05-cyklen.html`, published copy.

## The rider (identical in every prompt)

A woman of about 30 who runs a small ceramics studio off Blågårdsgade and knows every shortcut in
the city. Hero move: a men's oxide-red cotton workwear jacket two sizes too big, sleeves pushed up.
Tension: worn with cream pleated trousers and white leather trainers. Personal marker: a dented
steel thermos clipped into the bike basket. Attitude cue: she rides upright with one hand on the
bar and looks ahead, not at the camera. Dark hair tied low. Her bike: an upright steel city bike
with mudguards, a rear rack and a wicker basket, painted a clear pale pink in the #FFD3E3 to
#FFACCA range. The pink in every shot is the bike; nothing else is pink.

## Shot list (8 shots, about 26 s of picture + 4 s end card)

| # | Time | Place | Card | Action | Camera | Sound |
|---|---|---|---|---|---|---|
| 1 | 0–3 | Nørrebro courtyard | **no card: anchor missing (courtyard)** | She wheels the bike out of a rack, swings a leg over, pushes off through the gateway | Close on hands and pedal, handheld whip to follow her out | Lock click, chain, pedal strike |
| 2 | 3–7 | Dronning Louises Bro | `dronning-louises-bro` | Inside the morning stream of cyclists, she overtakes one | Tracking alongside at bike speed, real-time | Dozens of tyres, bells, wind |
| 3 | 7–10 | Superkilen, Black Market | `superkilen` | She rides the curving white lines over the asphalt mounds | Low rear tracking, real-time | Tyres on asphalt, kids on the slide |
| 4 | 10–13 | Peblinge Sø bank path | `dronning-louises-bro` (lake facts) | The long way: lake path instead of the road, past benches and swans | Side tracking, then she passes the lens | Gravel, swans, voices |
| 5 | 13–16 | Jægersborggade | `jaegersborggade` | Leans the bike at the coffee bar wall, walks straight in, no look back | Static wide across the street, bike stays in frame | Street, a door, a cup |
| 6 | 16–20 | Havnebadet, Islands Brygge, evening | `islands-brygge-havnebad` | She and two friends ride the granite promenade along the harbour bath, real speed | Front tracking, low | Three bikes, water, evening voices |
| 7 | 20–23 | Reffen, Refshaleøen, night | `refshaleoen-reffen` | Drops the bike in the pile outside the lit yard, walks into the light | Handheld, following from behind the bikes | Music leaking, voices, a bike dropped |
| 8 | 23–26 | Christianshavns Kanal, morning | `christianshavn-canals` | Same bike, fast along the sett quay | Side tracking, real-time, exits frame | Tyres on setts, gulls |
| 9 | 26–30 | End card | n/a | Frankly wordmark on limestone, "Cyklen er til at cykle på." then "Frankly Go™" | Static, text in post, never generated | Ambient tail, then quiet |

Canon flags from the resolver: none of the eight is avoid-as-primary-anchor. Jægersborggade is
canon-listed; the canon says do not default to it, and here it is one of eight, chosen because
the journal names flower shops and independent streets.

## Pipeline

1. **Stills in Google Flow** (Cowork lane, free). One 16:9 still per shot from the prompts
   below. Per the location-anchor skill: upload the card's reference photos first (they live in
   the machine repo under `os-visualization/location-library/refs/<slug>/`, gitignored, on
   Jonas's machine), then paste the prompt, ratio on the chip, Agent toggle off. Judge each still
   against the card's "What AI gets wrong" list. Shot 1 is generated without an anchor and must be
   labelled so in the handover.
2. **Jonas approves the eight stills.** This is the storyboard.
3. **Video, image-to-video.** Seedance 2.5 on Higgsfield, each approved still as `start_image`,
   4 s per clip (shots 2 and 6 at 5 s), audio on, real-time. The I2V prompt describes motion only
   and preserves the still's grade, per the Seedance canon. About 8 × 35 = 280 credits.
4. **Edit.** ffmpeg to the timings above, ambient crossfades, end card from
   `assets/frankly-wordmark.png` on `--limestone` #F5F4F1. Export 1920×1080.
5. **Review.** Pass³ per clip plus the location check against the cards. File what was seen.

## Flow still prompts (six-block, one line each; paste as is)

Shared blocks reused verbatim across all eight, per the series-consistency rule:

STYLE (street, day): *Low warm side light enters from the left, the sun entirely out of frame below the roofline; the warmth lives in skin tones and surfaces, not in a visible flare. Sunny Danish sky with soft structured cumulus, lower edges pale warm pink and peach, deeper grey-blue above, no blown-out white. Colour grade: warm amber skin tones, clear pink only on the bike (#FFD3E3 to #FFACCA), warm amber-brown shadows never blue, creamy textured highlights, Kodak Portra 400 grain. Three layers of depth: a soft foreground element nearest the lens, the rider sharp in the midground, a background with its own small life unaware of the camera.*

AVOID (every prompt): *stock-photo energy, direct camera gaze, catalogue smile, open-mouth laughing, arms raised, high-fives, jumping, AI-smooth skin, generic European street, tourist cliché, empty white sky, visible sun disk, lens flare, orange glow, fake background blur, extra fingers, readable or gibberish lettering, logos, racing bikes, helmets, lycra.*

### Shot 1 · Courtyard (ANCHOR MISSING: courtyard — hand-written from canon Nørrebro grammar)
SUBJECT: [rider paragraph]. COMPOSITION: close medium shot from knee height, her hands and the pedal sharp in the lower third, the gateway arch off-centre right, a bike-shed roof edge soft in the extreme foreground. ACTION: she wheels the pink bike out of a galvanised hoop rack, swings her right leg over the frame and pushes off toward the gateway, mid-motion, weight already on the pedal. LOCATION: a Nørrebro back courtyard of 1890–1920 tenements, continuous five-storey rear facades in dark red brick with white-painted small-pane timber windows, downpipes and water-staining below the sills, a cobbled yard with moss at the wall base, a galvanised bike shed and overflowing hoop racks, washing on a line, a vaulted brick gateway (port) opening to the street. STYLE: [STYLE]. TECH: photorealistic 35mm film still, eye-level, slight handheld imperfection. Avoid: [AVOID].

### Shot 2 · Dronning Louises Bro (card: dronning-louises-bro)
SUBJECT: [rider paragraph]. COMPOSITION: tracking position level with her at bike speed, she occupies the left third, other cyclists crossing the right two thirds, the near parapet soft in the foreground. ACTION: she rides inside the morning stream of cyclists and overtakes a slower rider on her right, upright, one hand on the bar, eyes ahead. LOCATION: Dronning Louises Bro over the Lakes in Copenhagen: a long, low causeway-bridge of warm pinkish-grey granite with three small arched openings just above still lake water on both sides, a solid granite parapet carrying pairs of ornate red-brown cast-iron lamp standards with globe lanterns and four white flagpoles with gilded spheres, long benches with green wooden slats along the parapet, an asphalt deck with four-metre cycle lanes each way, granite kerbs and wide granite-flagged footways framing a narrow two-lane road, pendant lamps on wires overhead; at the inner-city end the four symmetrical five-storey Paris-style blocks of Søtorvet with stucco facades, mansard roofs and green copper towers; stone-edged lake banks with mature trees, swans and gulls; big open Danish sky. STYLE: [STYLE]. TECH: photorealistic 35mm film still, motion blur on the passing cyclists only. Avoid: [AVOID]. Use dronning-louises-bro/01-bridge-three-arches-sotorvet.jpg, 02-on-bridge-bike-lane-widths.jpg, 03-lamp-standard-benches-parapet.jpg and 04-sotorvet-facades-across-lake.jpg only for the bridge structure and stone colour, lane widths and surfaces, lamp and bench types, Søtorvet's architecture and the lake edge of the place. Do not copy people, composition, weather, time of day or camera position from them.

### Shot 3 · Superkilen, Black Market (card: superkilen)
SUBJECT: [rider paragraph]. COMPOSITION: low rear three-quarter view from behind and to the right, the white contour lines curving under the lens in the foreground, she rides away over the mounds in the midground, the red section and gable wall in the background. ACTION: she rides the curving white lines over the low asphalt mounds, standing slightly on the pedals, real speed. LOCATION: Superkilen in Nørrebro, the Black Market section: black asphalt covered in continuous parallel white lines that curve and swell over low asphalt mounds like contour lines, a glossy black octopus slide with round tunnel openings, a low star-shaped fountain in white and blue tiles, a tall pole carrying a green neon crescent with a white tooth, multi-headed steel lamp masts, a small cluster of windmill palms, red-yellow-green striped bollards where the red section begins and a whole ground plane and gable wall painted saturated red, orange and salmon to the south, five- and six-storey red- and yellow-brick tenement blocks with dormers enclosing the whole strip. STYLE: [STYLE]. TECH: photorealistic 35mm film still. Avoid: [AVOID]. Use superkilen/01-black-market-white-lines-lamps.jpg, 02-red-square-painted-gable.jpg, 03-octopus-slide-brick-blocks.jpg and 04-green-park-picnic-shelters.jpg only for the ground colours and line pattern, the objects, lamp types, mound shapes and the surrounding brick blocks of the place. Do not copy people, composition, weather, time of day or camera position from them.

### Shot 4 · Peblinge Sø bank path (card: dronning-louises-bro, lake facts)
SUBJECT: [rider paragraph]. COMPOSITION: side view from the water side of the path, a swan soft in the foreground, she rides left to right in the midground, the far bank's blocks across the water in the background. ACTION: she takes the lake path instead of the road, passes two people on a bench and a jogger, and rides on past the lens. LOCATION: the stone-edged south-west bank of Peblinge Sø in Copenhagen: a still, shallow rectangular city lake with stone-edged banks, a gravel path under a row of mature trees, long benches with green wooden slats, swans and gulls on the water, and across the lake the symmetrical five-storey Paris-style stucco blocks of Søtorvet with mansard roofs and green copper towers at the Dronning Louises Bro end. STYLE: [STYLE]. TECH: photorealistic 35mm film still. Avoid: [AVOID]. Use dronning-louises-bro/04-sotorvet-facades-across-lake.jpg only for the lake edge, the trees, the benches and the facades across the water. Do not copy people, composition, weather, time of day or camera position from it.

### Shot 5 · Jægersborggade (card: jaegersborggade)
SUBJECT: [rider paragraph]. COMPOSITION: static wide from across the street at eye level, a parked car's rear wing soft in the foreground, the pink bike leaning at the wall beside a coffee bar door in the midground, the street sliding out of view at its gentle bend in the background. ACTION: she has just leaned the bike against the wall and is stepping in through the coffee bar door, one hand on the frame, her back to the bike, not looking back. LOCATION: Jægersborggade in Nørrebro, Copenhagen: a straight one-way street of granite setts with one gentle bend so the far end slides out of view, walled on both sides by continuous five-storey turn-of-the-century tenements of equal height, most plastered in white, pale grey, cream and pale yellow with a few red-brick blocks, rusticated ground floors, plain rectangular windows and straight cornices; small independent shops one or two windows wide at pavement level or a few steps down, black wrought-iron sign brackets with hanging painted signs, small red and green fabric awnings, café chairs and blackboards on the narrow pavement; cars parked nose-to-tail on both kerbs, dense clusters of bicycles, pendant lamps hung on wires across the street. STYLE: [STYLE]. TECH: photorealistic 35mm film still. Avoid: [AVOID]. Use jaegersborggade/01-street-establishing-cobbles.jpg, 02-red-brick-and-plaster-mix.jpg, 03-shopfront-meyers-bageri.jpg and 04-white-plaster-awning-cobbles.jpg only for the architecture, facade colours, storey count, roadway surface, shopfront grammar, lamp type and parking/bike clutter of the place. Do not copy people, composition, weather, time of day or camera position from them.

### Shot 6 · Havnebadet, Islands Brygge, evening (card: islands-brygge-havnebad)
SUBJECT: [rider paragraph] with two friends on upright black city bikes, a man in a navy knit and a woman in a cream shirt, both calm. COMPOSITION: low front view on the promenade, the three bikes filling the midground and coming toward the lens, the pontoon handrail soft in the foreground, the glass fronts across the water in the background. ACTION: the three ride the granite promenade along the harbour bath at real speed, she slightly ahead, all three looking ahead, a small quiet smile at most. LOCATION: Havnebadet at Islands Brygge: floating pontoons of weathered silver-grey timber decking edged with white cylindrical piles and thin steel handrails, framing rectangular pools of grey-blue harbour water, a stepped grandstand of grey timber rising to a diving platform, a tapered red-and-white horizontally banded lifeguard tower like a buoy, a grass lawn and mature trees of Havneparken behind a wide granite-sett promenade, five-storey yellow and red brick apartment blocks with green copper turrets along the street, across the water the glass office fronts of Kalvebod Brygge with the Nykredit glass cube and Copenhagen City Hall's spire beyond, the low flat arches of Langebro to the north, wind-rippled water. STYLE: warm late-evening light low from the west across the water, the sun entirely out of frame behind the Kalvebod Brygge fronts, long soft shadows along the promenade, the sky a deep grey-blue with a pale peach band low over the rooftops, no blown-out white; colour grade as the shared block. TECH: photorealistic 35mm film still, slight motion blur on the wheels. Avoid: [AVOID]. Use islands-brygge-havnebad/01-havnebad-from-harbour-establishing.jpg, 02-bath-pontoons-stands-tower.jpg, 03-timber-stands-view-to-kalvebod-brygge.jpg and 04-diving-tower-langebro.jpg only for the pontoon materials, tower shape and colours, grandstand form, quay and lawn, the buildings on both banks and the bridge shape. Do not copy people, composition, weather, time of day or camera position from them.

### Shot 7 · Reffen, night (card: refshaleoen-reffen)
SUBJECT: [rider paragraph]. COMPOSITION: handheld from behind and below, parked bike frames and a wheel soft in the extreme foreground, she walks away from the lens in the midground toward the lit yard, the shipyard hall's gable black against the sky in the background. ACTION: she has just dropped the pink bike into the pile of parked bikes and walks toward the light and the music without turning round. LOCATION: Reffen on Refshaleøen: a street-food yard on compacted pale gravel and patched asphalt with grey concrete pavers, built from stacked shipping containers painted saturated red, pink, blue and turquoise, festoon bulbs strung between them, rusted steel planters with ornamental grasses, oil-drum bins, timber pergolas with wicker lamps and beer-bench tables, behind it the huge grey corrugated Burmeister & Wain shipyard hall with its giant gable and a white-painted brick hall, a dark timber quay edge with black tyre fenders, three tall white chimneys on the skyline. STYLE: night; the brightest point in the frame is the warm festoon bulbs and the yard beyond them, the foreground bikes several stops darker, a deep blue-black sky with thin cloud catching a little city glow, warm amber-brown shadows; colour grade as the shared block. TECH: photorealistic 35mm film still, high ISO grain. Avoid: [AVOID], and no readable lettering on the containers. Use refshaleoen-reffen/01-container-entrance-sign.jpg, 02-bw-halls-quay-from-water.jpg, 03-gravel-planters-pergola.jpg and 04-footbridge-ship-chimneys.jpg only for the container colours and stacking, ground surfaces, furniture, quay edge, the shipyard halls and the bridge and chimney silhouettes of the place. Do not copy people, composition, weather, time of day or camera position from them.

### Shot 8 · Christianshavns Kanal, morning (card: christianshavn-canals)
SUBJECT: [rider paragraph]. COMPOSITION: side view from the water side of the quay street, a mooring ring and the timber quay edge soft in the foreground, she rides left to right in the midground, the houseboats and the painted houses behind. ACTION: she rides fast along the sett quay, upright, the thermos rattling in the basket, and exits frame right. LOCATION: Christianshavns Kanal in Copenhagen: a straight, narrow, sheltered canal with mirror-calm water, low timber-edged quays with iron mooring rings, a continuous row of mature trees along both banks and granite-sett quay streets with cars parked on the water side; houseboats with cabins, masted sailing boats and wooden motorboats moored along both sides; two-to-four-storey seventeenth- and eighteenth-century merchant houses plastered in oxide-red, ochre, pale blue, mustard-yellow and white with red clay-tile roofs, dormers and white window frames; a low single-arch stone bridge with brick spandrels and an iron railing; one block behind the roofs the black-and-gold spiral spire of Vor Frelsers Kirke with its gilded globe, glimpsed between the trees. STYLE: pale early-morning light low from the east along the canal, the sun out of frame, long quiet shadows across the setts, a pale strip of structured cloud above the roofline; colour grade as the shared block. TECH: photorealistic 35mm film still, motion blur on the wheels only. Avoid: [AVOID]. Use christianshavn-canals/01-canal-establishing-masts-trees.jpg, 02-overgaden-oven-vandet-facades.jpg, 03-houseboat-and-houses.jpg and 04-snorrebroen-arch-bridge.jpg only for the architecture, facade colours, roofline, quay construction, tree row, boat and houseboat types and bridge form of the place. Do not copy people, composition, weather, time of day or camera position from them.

## Seedance image-to-video prompts (motion only; the still carries everything else)

Shared preserve line, every clip: *Use the start image as the identity, composition and colour anchor. Keep the same woman, jacket, bike, place and light throughout. Real-time speed, no slow motion. Preserve the exact palette and exposure; only motion and camera change.*

1. She finishes swinging her leg over and pushes off through the gateway, the bike rolling out of frame right; handheld camera whips to follow her for the last second. 4 s.
2. She overtakes the rider on her right and pulls ahead; the stream of cyclists keeps flowing in both lanes; tracking camera holds level with her at bike speed. 5 s.
3. She rides away over the mounds along the curving white lines, standing on the pedals; low camera tracks behind her at the same speed. 4 s.
4. She rides left to right along the lake path, passes the bench and the jogger, and passes close to the lens; the swan drifts in the foreground; camera tracks sideways then holds. 4 s.
5. She steps through the door and it swings closed; a cyclist passes in the background; the bike stays leaning at the wall; locked camera. 4 s.
6. The three bikes ride toward the lens along the promenade and pass on either side of it; the water ripples; low camera tracks backward at their speed. 5 s.
7. She walks away from the lens into the lit yard, the festoon bulbs swaying slightly; handheld camera follows two steps and stops. 4 s.
8. She rides fast left to right along the quay and exits frame right; a houseboat's mooring line moves; camera tracks sideways at her speed. 4 s.

## Open points for Jonas

- Approve the place swaps: Superkilen for Cykelslangen, Havnebadet for Inderhavnsbroen. If
  Cykelslangen matters to the story, a card has to be written first (fetch refs, write facts,
  build index). That is the agent's own add-a-place method, about an hour in the repo.
- The courtyard shot has no anchor. Keep it flagged, or replace it with a carded place.
- The rider as written. Say if the jacket, the trousers or the thermos should change.
- Reference photos: the eight cards' refs are on your machine under
  `os-visualization/location-library/refs/`. Several cards' manifests list files that are not
  in the folder (the resolver warns on four cards), so check the folders before upload.
- Go/no-go for the Flow stills (Cowork lane), then for the Seedance clips (about 280 credits).

## Resolver record (2026-10-12)

`resolve-location.py --brief _cykel-film-storyboard.md` (v1 brief): 8 cards matched, scene
types bridge and canal-quay recognised, gaps named: courtyard, cafe-interior. Canon flag: Nyhavn
avoid-as-primary-anchor (v1's shot 6 neighbour; removed in v2). Four cards carry schema warnings
about missing ref files; the blocks themselves validate.

## Lesson

A brief for a Copenhagen film goes through the location agent before anyone writes a place
description. v1 skipped it and produced "looks like Copenhagen, isn't". The resolver takes
seconds and names both the verified block and the gaps.
