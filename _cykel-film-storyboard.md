# Frankly Go™ · "Cyklen er til at cykle på" — 30-second film storyboard (v3)

Status: storyboard v3 for Jonas's approval. No video generated. v2 (one rider, one day) is
superseded by Jonas's direction of 2026-10-12: many kinds of bikes and cyclists, joined by
transitions. v1 and v2 stay in git history. Internal Lab material.

## The idea in one line

Every kind of cyclist in and around Copenhagen, one after the other, each shot handing its motion
to the next: mud to puddle, whoosh to whoosh, a landing to a pedal stroke, a bell to a bell. The
bike is for riding, whoever you are. End line from the published journal post:
"Cyklen er til at cykle på."

## The rules this version keeps

- **Transitions carry the film.** Every cut is a match cut: same screen direction, same frame
  position, the motion of shot A finishing inside shot B, and a sound that bridges. Seven cuts,
  each specified below. The cut rhythm is the energy: nothing is slowed down.
- **Real-time only.** Every prompt says real-time speed. One action and one camera move per clip.
- **Real places, from the location agent.** Three of the seven places have verified cards
  (Superkilen, Dronning Louises Bro, the lake bank off the same card). Three are outside the
  library and are flagged as missing anchors, with their blocks written from the Notion place
  library where it covers them (Amager Fælled) or marked unverified where it does not (Hareskoven
  trail, Fælledparken skatepark). Those three are exactly the cards the agent should get next.
- **People understated.** Energy comes from motion and cutting. Faces calm, a smile arriving.
  The night ride home is allowed to be loud in sound and loose in body, not in grins.
- **Light per canon.** Sun out of frame, described sky, no flare. Pink only where the place
  gives it: the child's bike, the picnic blanket, the clouds' lower edges.
- **Stills in Google Flow first** (free), then Seedance image-to-video from the approved stills.

## Shot list (7 shots, about 26 s, + 4 s end card)

| # | Time | Bike / rider | Place | Anchor | Action | Camera |
|---|---|---|---|---|---|---|
| 1 | 0–4 | Mountain bike, man about 35 | MTB trail in Hareskoven beech forest, wet | **missing (forest trail)**, unverified | Rear wheel rips through a brown mud rut, mud flung right to left | Low, close on the rear wheel, locked |
| 2 | 4–7 | Child's bike, girl about 7, helmet | Superkilen, red section, after rain | `superkilen` | Small wheel hits a rain puddle on the red surface, splash right to left, she rides on past the lens | Low, close on the wheel, then she passes |
| 3 | 7–11 | Road bike, woman about 45 | Amager Fælled, open grassland, gravel track | **missing (open field)**, Notion library grammar | She blasts past the camera left to right and shrinks toward the flat horizon | Low static beside the track, whip to follow |
| 4 | 11–15 | BMX, teen about 17 | Fælledparken skatepark, concrete bowl and quarter pipe | **missing (skatepark)**, unverified | He launches off the quarter pipe left to right, holds the top of the arc, lands | Static at coping height, the jump crosses the frame |
| 5 | 15–19 | Three city bikes, friends 25–30, night | Dronning Louises Bro, night | `dronning-louises-bro` | Riding home from a party, wobbling in a loose line, one singing, one ringing a bell | Tracking alongside at bike speed |
| 6 | 19–23 | Two city bikes lying in grass, couple about 28 | Sortedams Sø bank, late afternoon | `dronning-louises-bro` (lake facts) | A date: picnic blanket, two bikes on their sides, she flicks his bell with a finger, they look at the water | Static low across the blanket, slow push-in |
| 7 | 23–26 | All of them | Dronning Louises Bro, day | `dronning-louises-bro` | The stream: a racer, a cargo trike, a child with a parent, a BMX carried on a shoulder, commuters, all passing one frame | Static wide on the parapet |
| 8 | 26–30 | End card | — | — | Wordmark on limestone, "Cyklen er til at cykle på." then "Frankly Go™" | Static, text in post |

## The seven transitions (the actual work)

| Cut | Match | Screen direction | Sound bridge | How it is built |
|---|---|---|---|---|
| 1→2 | Mud splash becomes puddle splash: same wheel position (lower centre), same spray arc | right to left | The wet slap of shot 1 continues as the puddle slap of shot 2 | Two Flow stills with identical composition (wheel lower centre, spray at the same angle). Clip 1 ends on still A as `end_image`; clip 2 starts on still B as `start_image`. |
| 2→3 | Exit match: the child's jacket fills the frame as she passes the lens; cut on the full-frame blur to the racer's jersey filling the frame as she passes | left to right | The child's freewheel ratchet becomes the road bike's hum | Both clips end/start on a near-solid colour frame (jacket, jersey). Cut on the blur. |
| 3→4 | Whoosh to whoosh: the racer leaves frame right; the BMX enters frame left and rises | left to right | The tyre hum becomes the wheel on concrete and the clack of the landing | Clip 3 ends with an empty track; clip 4 starts with an empty quarter pipe. Cut on the empty frame. |
| 4→5 | Landing to pedal stroke: the BMX wheel compresses on landing; cut to a trainer pushing down on a pedal in the dark | downward | The landing clack becomes the click of a pedal and a bell | Clip 4 ends on the compressed landing; clip 5 opens on a close pedal stroke, then the camera lifts to the three riders. |
| 5→6 | Bell to bell: a thumb flicks a bell at night; cut on the ring to a finger flicking a bell on a bike lying in daylight grass | — | One bell ring crosses the cut | Two Flow stills with the bell in the same frame position; clip 5 ends on still A, clip 6 starts on still B. |
| 6→7 | Tilt-up to wide: the camera lifts from the blanket to the lake and Søtorvet's towers; cut to the bridge wide with the same towers in the same place | upward | Lake birds carry across | Clip 6 ends on the towers across the lake; clip 7 opens with the towers in the same frame position behind the bridge. |
| 7→card | The last rider exits right; limestone wipes in behind the motion | left to right | Ambient fades under the card | ffmpeg wipe. |

## Pipeline

1. **Flow stills.** Nine stills: shots 1 to 7 plus the two transition pairs (1A/2B, 5A/6B). Six-block
   prompts below. Run from a browser-capable session on Jonas's machine with the
   `lifestyle-flow-images` and `location-anchor` skills: card refs uploaded first, prompt pasted
   last, ratio on the chip, Agent off. Judge each still against its card's tells.
2. **Jonas approves the stills.** This is the storyboard.
3. **Seedance 2.5 image-to-video** on Higgsfield: `start_image` = approved still, `end_image` on
   the two matched pairs, 4 s each, audio on. Motion-only prompts below. About 7 × 35 = 245 credits.
4. **Edit in ffmpeg** to the cut list, sound bridges by overlapping ambient tails, end card from
   `assets/frankly-wordmark.png` on `--limestone` #F5F4F1.
5. **Review:** pass³ per clip, location check per card, and the transition check: does each cut
   land on the match?

## Flow still prompts

Shared STYLE (day): *Low warm side light from the left, the sun entirely out of frame; the warmth lives in skin tones and surfaces, not in a visible flare. Sunny Danish sky with soft structured cumulus, lower edges pale warm pink and peach, deeper grey-blue above, no blown-out white. Colour grade: warm amber skin tones, clear pink only where named (#FFD3E3 to #FFACCA), warm amber-brown shadows never blue, creamy textured highlights, Kodak Portra 400 grain. Three layers of depth: a soft foreground element nearest the lens, the subject sharp in the midground, a background with its own small life unaware of the camera.*

Shared AVOID: *stock-photo energy, direct camera gaze, catalogue smile, open-mouth laughing, arms raised, high-fives, AI-smooth skin, generic European scenery, empty white sky, visible sun disk, lens flare, orange glow, fake background blur, extra fingers, readable or gibberish lettering, logos.*

### Still 1 · Mountain bike in mud (ANCHOR MISSING: forest trail. Place facts unverified, from memory: Hareskoven is a beech forest north-west of the city with marked MTB trails. Needs a card.)
SUBJECT: a man of about 35, a carpenter, on a hardtail mountain bike with knobbly tyres and a dropper post, mud to the knees, a faded green rain jacket, no logos. COMPOSITION: very low camera at ground level, the rear wheel sharp in the lower centre of the frame, a rut of brown water in the extreme foreground, tree trunks soft behind. ACTION: the rear wheel rips through a brown mud rut and flings a sheet of mud from right to left across the lower frame, the rider standing on the pedals, real speed. LOCATION: a singletrack trail through a Danish beech forest in autumn, smooth grey trunks, a floor of copper leaves, black wet earth, roots across the trail, a low grey-white sky closed off by the canopy. STYLE: overcast forest light, broad and even, no visible sun, the sky dense grey not white; colour grade as the shared block, the pink in this still is none. TECH: photorealistic 35mm film still, the spray frozen. Avoid: shared list. (Generated without a location reference; labelled as a degraded, anchor-missing still.)

### Still 2 · Child through a puddle (card: superkilen)
SUBJECT: a girl of about 7 in a yellow rain jacket and a small round helmet on a child's bike painted clear pink (#FFD3E3 to #FFACCA) with a white basket, concentrating. COMPOSITION: the same framing as still 1: very low camera, her front wheel sharp in the lower centre, the puddle in the extreme foreground, the red ground plane and painted gable soft behind. ACTION: her front wheel hits a rain puddle on the red surface and throws water from right to left across the lower frame, real speed. LOCATION: Superkilen in Nørrebro, the red section: a whole ground plane and gable wall painted saturated red, orange and salmon, wet after rain and reflecting, multi-headed steel lamp masts, red-yellow-green striped bollards where the black section begins, five- and six-storey red- and yellow-brick tenement blocks with dormers enclosing the strip. STYLE: shared STYLE after rain, the sky breaking grey-blue with structured cloud. TECH: photorealistic 35mm film still, the splash frozen. Avoid: shared list. Use superkilen/01-black-market-white-lines-lamps.jpg, 02-red-square-painted-gable.jpg, 03-octopus-slide-brick-blocks.jpg and 04-green-park-picnic-shelters.jpg only for the ground colours and line pattern, the objects, lamp types, mound shapes and the surrounding brick blocks of the place. Do not copy people, composition, weather, time of day or camera position from them.

### Still 3 · Road bike on the fælled (ANCHOR MISSING: open field. Grammar from the Notion place library, "Amager Fælled": open flat grassland, low horizon, no buildings casting shadows, golden light dramatic over flat terrain. Needs a card.)
SUBJECT: a woman of about 45 on a steel road bike, drop bars, a plain dark blue jersey, no logos, sunglasses, calm. COMPOSITION: low camera right beside a gravel track, the track running from the left foreground to the right horizon, she is mid-frame passing at speed, tall dry grass soft in the foreground. ACTION: she blasts past the camera from left to right in a tuck, real speed, dust lifting behind the rear wheel. LOCATION: Amager Fælled on the edge of Copenhagen: a wide flat grassland of pale dry grass and reeds under a very low horizon, a straight compacted gravel track, a single line of low willows, no buildings near, the city's spires tiny on the horizon. STYLE: shared STYLE with the sun low behind the camera, long shadows ahead of her. TECH: photorealistic 35mm film still, motion blur on her and the wheels only. Avoid: shared list.

### Still 4 · BMX on the quarter pipe (ANCHOR MISSING: skatepark. Place facts unverified, from memory: Fælledparken skatepark is a large concrete park with bowls and a street section. Needs a card.)
SUBJECT: a teenager of about 17 on a chrome BMX, a black hoodie, a black helmet, jeans. COMPOSITION: camera at coping height, the quarter pipe's lip in the lower left, open sky above it, the park's concrete bowls and the park's big trees soft in the background. ACTION: he launches off the quarter pipe from left to right and is at the top of the arc, bike turned slightly, real speed. LOCATION: a large concrete skatepark in a Copenhagen park, pale grey smooth concrete bowls and a quarter pipe with steel coping, a street section with ledges, mature park trees and a lawn behind. STYLE: shared STYLE, the sky with structured cloud behind him. TECH: photorealistic 35mm film still, him frozen at the apex. Avoid: shared list.

### Still 5 · Riding home at night (card: dronning-louises-bro)
SUBJECT: three friends of 25 to 30 on upright city bikes: a man in a corduroy jacket, a woman in a long coat over a party dress, a man with a jumper tied round his neck, loose and happy, faces calm, one mid-song. COMPOSITION: tracking position level with them at bike speed, the three in a loose line across the frame, a lamp standard's globe soft in the foreground, the lamps receding along the parapet. ACTION: they ride home across the bridge at night in a wobbling line, the woman stands on the pedals, the man in corduroy rings his bell with his thumb. LOCATION: Dronning Louises Bro over the Lakes in Copenhagen: a long, low causeway-bridge of warm pinkish-grey granite with three small arched openings just above still lake water on both sides, a solid granite parapet carrying pairs of ornate red-brown cast-iron lamp standards with globe lanterns and four white flagpoles with gilded spheres, long benches with green wooden slats along the parapet, an asphalt deck with four-metre cycle lanes each way, granite kerbs and wide granite-flagged footways framing a narrow two-lane road, pendant lamps on wires overhead; at the inner-city end the four symmetrical five-storey Paris-style blocks of Søtorvet with stucco facades, mansard roofs and green copper towers; stone-edged lake banks with mature trees, swans and gulls. STYLE: night; the brightest points in the frame are the globe lanterns, warm and soft, the lake black with their reflections, the sky deep blue-black with thin cloud catching city glow, warm amber-brown shadows; colour grade as the shared block, high ISO grain. TECH: photorealistic 35mm film still. Avoid: shared list. Use dronning-louises-bro/01-bridge-three-arches-sotorvet.jpg, 02-on-bridge-bike-lane-widths.jpg, 03-lamp-standard-benches-parapet.jpg and 04-sotorvet-facades-across-lake.jpg only for the bridge structure and stone colour, lane widths and surfaces, lamp and bench types, Søtorvet's architecture and the lake edge of the place. Do not copy people, composition, weather, time of day or camera position from them.

### Still 6 · The date (card: dronning-louises-bro, lake facts)
SUBJECT: a couple of about 28, he in a worn denim jacket, she in a green knit, both sitting on a blanket in the #FFD3E3 to #FFACCA range, a paper bag of pastries, two glasses, two upright city bikes lying on their sides in the grass beside them. COMPOSITION: low camera across the blanket, the bikes' wheels soft in the foreground, the couple sharp mid-frame looking out at the water, the lake and Søtorvet's towers behind. ACTION: she reaches over and flicks the bell on his bike with one finger; he looks at her, a smile arriving. LOCATION: the grass bank of Sortedams Sø in Copenhagen: a still, shallow rectangular city lake with stone-edged banks, a gravel path under a row of mature trees, long benches with green wooden slats, swans and gulls on the water, and across the lake the symmetrical five-storey Paris-style stucco blocks of Søtorvet with mansard roofs and green copper towers at the Dronning Louises Bro end. STYLE: shared STYLE, late afternoon. TECH: photorealistic 35mm film still. Avoid: shared list. Use dronning-louises-bro/04-sotorvet-facades-across-lake.jpg only for the lake edge, the trees, the benches and the facades across the water. Do not copy people, composition, weather, time of day or camera position from it.

### Still 7 · Everyone (card: dronning-louises-bro)
SUBJECT: the morning stream on the bridge: a woman on a road bike, a father on a cargo trike with a plywood box and a child under its canopy, a girl on a pink child's bike beside her mother, a teenager with a BMX over his shoulder on the footway, commuters on upright city bikes, a yellow Movia bus in the road. COMPOSITION: static wide at eye level from the footway, the parapet and a lamp standard framing the left, the cycle lane crossing the frame, Søtorvet's towers in the same frame position as in still 6. ACTION: all of them passing left to right at once, real speed. LOCATION: [Dronning Louises Bro block, verbatim as in still 5]. STYLE: shared STYLE. TECH: photorealistic 35mm film still, motion blur on the riders only. Avoid: shared list. Role line as in still 5.

### Transition stills
- **1A / 2B:** stills 1 and 2 already share the framing; generate still 1 first, then still 2 with still 1 uploaded as a composition reference and the line "Use the uploaded reference only for camera height, wheel position and spray direction; change the place, the bike and the rider completely."
- **5A / 6B:** a close still of a thumb on a bell at night on the bridge (5A), and a close still of a finger on a bell on a bike lying in grass (6B), bell in the same frame position; same reference method.

## Seedance image-to-video prompts (motion only)

Shared line: *Use the start image as the identity, composition and colour anchor; keep the same people, bikes, place and light. Real-time speed, no slow motion. Preserve the palette and exposure; only motion and camera change.*

1. The rear wheel rips through the rut and flings mud right to left; the rider stands on the pedals and rides out of frame left; locked low camera. End on the mud spray at its widest (end image 1A). 4 s.
2. Start on the puddle splash (start image 2B); the water flies right to left; the girl rides on and passes close to the lens, her yellow jacket filling the frame in the last half second; locked low camera. 3 s.
3. Start on the jersey filling the frame; she pulls away left to right down the gravel track, dust lifting, and shrinks toward the horizon; camera whips to follow then holds; the frame ends on the empty track. 4 s.
4. Start on the empty quarter pipe; the rider enters from the left, launches, holds the apex, lands with the wheels compressing; static camera at coping height. 4 s.
5. Open close on a trainer pushing down on a pedal, then the camera lifts to the three riders wobbling along the bridge; the woman stands on her pedals; the corduroy man flicks his bell; tracking at bike speed. End on the thumb on the bell (end image 5A). 4 s.
6. Start on the finger flicking the bell in the grass (start image 6B); the bell swings; the couple look at the water, he turns to her; the camera lifts slowly to the lake and the towers. 4 s.
7. Start wide on the bridge with the towers in place; the whole stream passes left to right, the cargo trike nearest, the bus behind; static camera; the last rider exits right. 3 s.

## Open points for Jonas

- The concept: seven cyclists, seven match cuts. Yes, or change the cast or the order.
- Three places have no card: the forest trail, Amager Fælled, the skatepark. Either accept them as
  flagged (unverified place facts) for the stills, or have the agent add the three cards first.
  Fælledparken's skatepark and Amager Fælled are both in the Notion place library's spirit; the
  forest trail is new ground for the library.
- Rider ages and bikes as written.
- Go for the Flow stills on your machine (nine stills), then the Seedance clips (about 245 credits).

## Resolver record (2026-10-12, v3 scenes)

`resolve-location.py` on the v3 scene list: Dronning Louises Bro and Superkilen matched; the
forest trail, open field and skatepark reached no card; the scene-type list has no type for
them (gaps today: balcony, cafe-interior, courtyard, flat-kitchen, flat-living-room, rooftop,
shop-interior, stairwell). Three new card candidates for the library: `hareskoven-mtb-trail`,
`amager-faelled`, `faelledparken-skatepark`.
