# Frankly Go™ · "Cyklen er til at cykle på" — storyboard v4 (30 s)

Status: v4, 2026-10-12, built by the seats after Jonas rejected the v3 test cut ("ingen overgange,
kedelige kamera føring, stederne ligner ikke københavn … ikke kendte steder … skuffende").
R4.3 Video producer wrote structure, camera, cuts, prompts and edit plan. R4 Visual Director wrote
the Location blocks, transition stills and riders (`_cykel-film-v4-locations.md`, the source for
every place fact; riders R1–R7 are quoted from there). v1–v3 and the v3 test record are in git
history. Internal Lab material.

## Place rule
No landmarks and nothing anyone could name. Copenhagen is carried by the culture cards' material
grammar: kerb-separated dark-grey cycle track, concrete flags with cobble rows, wire-hung conical
lamps, five-storey brick and plaster with white timber windows, flat cornices, the yellow bus.
Signage is described by structure and colour, never named. Sky per light.md, sun out of frame.
Scenes 1, 3, 4 have no card (facts from canon grammar, unverified); 2, 5, 6, 7 are card-built.

## Shots and camera (one idea per shot, hero-film register, one primary camera instruction)

| # | s | Rider | Place (R4 block) | Camera idea | Primary instruction |
|---|---|---|---|---|---|
| 1 | 4 | R1, MTB | 1 beech trail | From the ground: lens in the rut, the wheel tears past and the spray hits the glass | locked ground-level |
| 2 | 3 | R2, child | 2 side street after rain | From the water: lens at the puddle surface, she rides through and past, jacket fills the lens | locked at puddle level |
| 3 | 4 | R3, road bike | 3 open common | Through the grass: low beside the track, she pulls away, then one tilt up to the sky | one tilt up |
| 4 | 4 | R4, BMX | 4 skatepark | From the coping looking up: he launches over the lens, front wheel spinning top of frame | locked |
| 5 | 4 | R6a + R6b, date | 6 lake bank, low, no towers | Through the spokes: grass level through a lying bike's wheel at the blanket and the lake | locked, whip-pan right in the last 0.5 s |
| 6 | 4 | R5a/b/c, night | 5 residential street at night | Handlebar POV: friends alongside under the wire lamps, then all swing into a dark arch | mounted, travelling forward |
| 7 | 3 | R7, everyone | 7 morning street | Mounted on the cargo-trike box: out of a dark passage into the morning stream | mounted, forward |
| 8 | 4 | end card | — | Wordmark on limestone, "Cyklen er til at cykle på." then "Frankly Go™" | static |

Real-time in every clip. People understated: concentration, effort, one smile arriving (clip 5).

## The seven cuts

| Cut | Match | Dir. | Frame position | Sound bridge | Mechanic |
|---|---|---|---|---|---|
| 1→2 | mud spray on the lens becomes puddle spray on the lens | R→L | full frame, heaviest lower centre | wet slap carries 6 f | shared still S-A: clip 1 end_image = S-A, clip 2 start_image = S-A |
| 2→3 | exit-fill: yellow jacket fills the lens, cut to navy jersey filling the lens as it pulls away | L→R | full frame | freewheel tick becomes tyre hum, 4 f | edit cut on the fill frames |
| 3→4 | the sky continues: tilt up to cumulus, the BMX rises into the same sky | up | sky, cloud mass upper left | gravel into wheel buzz, 8 f | shared still S-B: clip 3 end_image = S-B, clip 4 start_image = S-B |
| 4→5 | graphic match: spinning BMX front wheel at the apex becomes the spinning wheel of the bike in the grass | clockwise | hub upper centre | whirr 8 f, then a bell | edit cut; clip 5 opens on the wheel in that position |
| 5→6 | whip-pan right off the lake; clip 6 opens in the same whip at night | L→R | full-frame blur | whoosh, singing under it, 6 f | edit whip: 3 blurred frames each side |
| 6→7 | darkness fill: riders turn into a black arch, trike rolls out of a black passage into morning | forward | black centre | arch echo into street, 10 f | edit cut on black |
| 7→card | last rider crosses the lens, limestone fades in | L→R | full frame | ambient ducks, 12 f | ffmpeg fade |

## Shared stills (generate first)
- S-A, lens splash: muddy brown-grey water droplets and streaks on a lens at ground level, full frame, heaviest lower centre, spray right to left, blurred dark wet ground behind, overcast light, photorealistic 35 mm. Must read as neither forest nor street.
- S-B, sky: light.md standard sky, structured cumulus with pale pink-peach lower edges, grey-blue above, sun out of frame; a fringe of tall dry grass in the lower 10 %. If the grass fights the skatepark opening, use pure sky.
Jonas's rule is Flow for stills; these two are neutral bridge frames and were made in Higgsfield for 1 credit each to avoid blocking on the Mac session (noted in the run record).

## Seedance prompts (T2V anatomy; I2V motion-only with the preserve line)
Avoid (every clip, hard terms): slow motion, speed ramp, grinning, open-mouth laughing, arms raised, high-five, thumbs up, direct camera gaze, posing, lens flare, sun disk, blown-out sky, readable lettering, logos, landmarks, towers, Dutch red lanes, extra fingers.
Preserve line (I2V): Use the start image as the composition and colour anchor; preserve the palette and exposure; only motion and camera change.

1. T2V, end_image S-A. Locked ground-level camera with the lens sitting in a muddy rut, shot of [R1] tearing through the rut right beside the lens and flinging a sheet of brown mud right to left onto the glass, in [Location 1], [Sky 1], Kodak Portra grain; he stands on the pedals and is gone in two seconds, the spray hits the lens at the end; real-time speed, no slow motion.
2. I2V, start_image S-A. The droplets on the lens run and clear in real time to reveal a rain puddle at lens level on a cycle track; [R2] rides straight through the puddle, water flying right to left, and passes close, her yellow jacket filling the frame in the last half second; locked camera at puddle level; real-time speed, no slow motion. Preserve line. The street is [Location 2, one sentence].
3. T2V, end_image S-B. Low camera hidden in tall dry grass beside a gravel track, shot of [R3] pulling away left to right from a full-frame blur of her jersey, dust lifting, in [Location 3], the sun low behind the camera out of frame; in the last second the camera tilts up to [Sky 3]; real-time speed, no slow motion.
4. I2V, start_image S-B. [R4] launches into the frame from below, crossing the sky left to right at the top of his arc, his front wheel spinning upper centre; locked camera from the coping looking up; real-time speed, no slow motion. Preserve line. The park is [Location 4, one sentence].
5. T2V. Grass-level locked camera looking through the spinning front wheel of a city bike lying on its side, shot of [R6a] and [R6b] on a blanket in the #FFD3E3 to #FFACCA range beside the bike; she reaches out, stops the wheel with one finger and flicks the bell; he turns to her and a smile arrives slowly; in [Location 6], [Sky 6]; in the final half second the camera whip-pans right toward the water; real-time speed, no slow motion.
6. T2V. Camera mounted on the handlebars of a city bike at night, travelling forward, shot of [R5b] and [R5c] riding alongside in a loose wobbling line, R5b standing on her pedals, [R5a]'s hand ringing his bell, the wire-hung lamps passing overhead, in [Location 5], [Sky 5]; the frame opens in a fast pan settling from the left; at the end the bikes swing together into a dark carriage arch and the frame goes black; real-time speed, no slow motion.
7. T2V. Camera mounted on the front of a cargo trike's plywood box, travelling forward out of a black cobbled passage into morning light onto the cycle track, shot of the morning stream overtaking left to right: [R7], in [Location 7], [Sky 7]; the last rider crosses close to the lens and fills the frame; real-time speed, no slow motion.

## Edit plan (ffmpeg, 24 fps)
Durations 4+3+4+4+4+4+3 = 26 s + 4 s card = 30 s. Hard cuts via concat/xfade; keep one copy of each shared frame. Whip 5→6: 3 blurred frames each side (xfade hblur 0.25 s). Audio overlaps per the cut table via acrossfade. QA at each shared-still cut: trim to the nearest matching frame if the first/last mode did not hold. Tool: `scratchpad/abtest/edit-v4.py` with a cut list.

## Why this answers the verdict
1. Transitions: two cuts share a literal generated frame; five are mechanical cuts specified to the frame with sound bridges. 2. Camera: every shot is placed somewhere, none is an eye-level observer. 3. Places: no landmarks; Copenhagen through the cards' ordinary tells. 4. Lettering handled by structure, not names. 5. Real-time everywhere, speed ramps forbidden. 6. No Ken Burns stills. 7. Cut rhythm 4-3-4-4-4-4-3 with a bridge on every cut. 8. One smile arriving, the rest concentrating or loose. 9. Motion budget respected. 10. Two cheap stills gate the credits.

## Gate / risk
Seedance clips are paid (about 84 credits at 480p for the test). Four scenes rest on no-card facts. Untested mechanics: end_image without start_image on Higgsfield; the neutral splash bridge; first/last drift if clip 1 ends far from S-A.
