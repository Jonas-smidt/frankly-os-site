# Frankly Go™ · "Cyklen er til at cykle på" — 30-second film storyboard

Status: storyboard for Jonas's approval. Nothing generated yet. Internal Lab material.
Source message: `journal/frankly-blog-05-cyklen.html` (published, approved copy).
Direction from Jonas (2026-10-12): real-time energy, not slow motion; real Copenhagen places
only; storyboard before film; no batch of new clips.

## The idea in one line

A woman and her good bike, one day in Copenhagen, in fri-mode: she takes the long way, parks
where she is going, takes the bike to the party, and never once checks over her shoulder.

## What the film must feel like

- **Life energy.** Real-time speed, bikes moving through frame, cuts every 3 to 4 seconds,
  handheld, direct sound (tyres, chain, bells, voices). Batch 03 drifted into slow motion and
  stillness; this film does the opposite. Every prompt says "real-time speed, no slow motion".
- **Hero-film grade.** Warm highlights, teal shadows, soft grain, flare welcome.
- **Understated people.** Calm, absorbed, a small smile at most. Energy comes from motion and
  cutting, not from faces.
- **Real Copenhagen.** Each shot names a real place and describes it so the model cannot swap
  it for a generic European city. Locations below are flagged for the location agent to verify
  before generation. No fictional truss bridges.
- **No product on screen.** The insurance is the end card only.

## Shot list (8 shots, ~26 s of picture + 4 s end card)

| # | Time | Place (real) | Action | Camera | Sound |
|---|---|---|---|---|---|
| 1 | 0–3 | Nørrebro courtyard (baggård), Jægersborggade quarter: cobbled yard, bike racks, red-brick rear facades, laundry on a line | A hand pulls the good bike (pale pink city bike) out of the rack, swings a leg over, pushes off | Close on hands and pedal, whip to follow her out of the gate, handheld | Lock click, chain, pedal strike |
| 2 | 3–7 | **Dronning Louises Bro**: wide stone bridge over the Lakes, granite balustrades, green cast-iron lamp posts, bike lanes packed in both directions, Nørrebrogade's facades at the end | She rides inside the morning stream of cyclists, overtakes one, lake water either side | Tracking at bike speed alongside, real-time, other cyclists cross the frame | Dozens of tyres, bells, wind |
| 3 | 7–10 | **Cykelslangen**: elevated cycle ramp with orange floor and white railings snaking over the harbour at Fisketorvet | She sweeps round the curve of the ramp, water below, leaning into the bend | Low rear tracking shot following her down the curve | Tyres on the ramp surface, harbour |
| 4 | 10–13 | **Søerne / Peblinge Sø**: gravel path along the rectangular lake, benches, swans, lakeside apartment blocks | The long way: she takes the lake path instead of the road, passes people on benches, swans on the water | Side tracking, then she rides past camera | Gravel, swans, voices |
| 5 | 13–16 | **Jægersborggade**: narrow Nørrebro street, small shops, coffee bar, plant shop, bikes against every wall | She rolls up, leans the bike against the shop wall by the door, walks straight in without looking back | Static wide, she rides in from the left, the bike stays in frame as she exits | Street, a door, a cup |
| 6 | 16–20 | **Inderhavnsbroen** ("Kyssebroen"): the flat steel cycle bridge from Nyhavn to Christianshavn, Nyhavn's coloured houses and masts behind, evening light | Evening. She and two friends cross the bridge on bikes toward the camera, city lights coming on, real-time | Front tracking, low, the three bikes fill the frame | Three bikes, water, evening traffic |
| 7 | 20–23 | **Refshaleøen**: former shipyard, corrugated industrial halls, string lights, a crowd of bikes outside a party | Night. She rides up, leaves the bike in the pile, walks into the light and the music. No lock fuss, no look back | Handheld, following her in from behind the bikes | Music leaking out, voices, a bike dropped against another |
| 8 | 23–26 | **Christianshavns Kanal**: cobbled quay, houseboats, canal, morning | Next morning she rides along the canal, fast, the same bike, sun low | Side tracking, real-time, then she exits frame | Tyres on cobbles, gulls |
| 9 | 26–30 | End card | Limestone background, Frankly wordmark, line: "Cyklen er til at cykle på." then "Frankly Go™" | Static, text in post (ffmpeg), never generated | Last ambient tail, then quiet |

Copy on the end card is lifted verbatim from the published journal headline. Any other line
(e.g. "At komme rundt skal føles frit. Ikke bevogtet.") is also published copy. Claims-review
marker applies if the card wording changes: `ved udgangen: claims-review`.

## Why these places

They are the Copenhagen the journal post names: "hen over broerne, langs søerne, den lille
omvej forbi vandet". Dronning Louises Bro is the busiest bike bridge in the country. Cykelslangen
is unmistakable. The lakes, Jægersborggade, Inderhavnsbroen, Refshaleøen and the Christianshavn
canal are all real, recognisable and cycle-first. None is a truss bridge.

## Build plan (after approval)

1. **Storyboard stills first.** One 16:9 still per shot from an image model, to check that each
   location reads as the real place before any video credits are spent. Cost is a few credits
   per still.
2. **Video.** Eight clips on Seedance 2.5, 16:9, 720p, 4 s each (shots 2 and 6 at 5 s), native
   ambient audio, real-time. Roughly 8 × 35 = 280 credits. Each prompt carries the shot's
   location description verbatim, the energy rule and the expression rule.
3. **Edit.** Assemble in ffmpeg to the timings above, crossfade audio, add the end card from
   `assets/frankly-wordmark.png` on `--limestone` (#F5F4F1) with Almarena from
   `effekt-lab/fonts` if available, else Switzer. Export 1920×1080 and a 1280×720 preview.
4. **Review.** Pass³ per shot plus a location check: does each place look like itself?

## Open points for Jonas

- Location agent: please run the eight places through it; I could not reach it from this
  session. Swap any place it rejects.
- Rider: one woman in her 30s, pale pink city bike (matches `photo-bike-lifestyle.jpg`). OK?
- End card line: "Cyklen er til at cykle på." OK, or the closing line from the post?
- Go/no-go for step 1 (stills) and step 2 (video).

## Shot prompts (ready, not submitted)

Shared anchor prepended to each: *Candid Copenhagen lifestyle film, real-time speed, no slow
motion, energetic handheld, warm golden grade with teal shadows and soft 35mm grain, like a real
brand hero film. People calm and absorbed, a small quiet smile at most, never laughing, nobody
looks at the camera. Ambient sound only. No dialogue, no text, no logos.*

1. Inside a Nørrebro courtyard in Copenhagen: cobbled yard enclosed by red-brick rear facades with white window frames, a row of bike racks, washing on a line. A single woman in her 30s in a light jacket pulls a pale pink city bike out of the rack, swings her leg over and pushes off toward the arched gateway to the street. Camera: close on her hands and the pedal, then a quick handheld whip to follow her out of the gate.
2. Dronning Louises Bro in Copenhagen: a wide flat stone bridge over the city lakes with granite balustrades and green cast-iron lamp posts, bike lanes crowded in both directions in the morning, calm lake water on both sides, five-storey apartment facades at the far end. A single woman in her 30s on a pale pink city bike rides inside the stream of cyclists and overtakes one. Camera: tracking alongside at bike speed, other cyclists crossing the frame.
3. Cykelslangen in Copenhagen: an elevated cycle ramp with a bright orange floor and white railings snaking in a long curve above the harbour water beside a glass shopping mall, harbour and modern apartment blocks beyond. A single woman in her 30s on a pale pink city bike leans into the curve of the ramp. Camera: low rear tracking shot following her down the bend.
4. The gravel path along Peblinge Sø in Copenhagen: a long rectangular city lake, wooden benches, swans on the water, lakeside apartment blocks with balconies on the far shore, cyclists and joggers on the path. A single woman in her 30s on a pale pink city bike rides the lake path past people on the benches. Camera: side tracking at bike speed, she then passes close to the lens and exits frame.
5. Jægersborggade in Copenhagen: a narrow Nørrebro street of four-storey brick buildings with small shopfronts, a coffee bar, a plant shop with pots on the pavement, bikes leaning against every wall. A single woman in her 30s rides in on a pale pink city bike, leans it against the wall beside the coffee bar door and walks straight in without looking back. Camera: static wide across the street, the bike stays in frame.
6. Inderhavnsbroen in Copenhagen at evening: the low flat steel cycle and pedestrian bridge across the inner harbour, with the coloured townhouses and old masts of Nyhavn behind, city lights coming on over calm water. A single woman in her 30s on a pale pink city bike and two friends on bikes cross the bridge toward the camera at real speed. Camera: front tracking, low, the three bikes filling the frame.
7. Refshaleøen in Copenhagen at night: a former shipyard with corrugated-steel industrial halls, string lights, a dense pile of parked bikes outside an open door spilling warm light and music. A single woman in her 30s rides up on a pale pink city bike, drops it among the other bikes and walks into the light without looking back. Camera: handheld, following her from behind the bikes.
8. Christianshavns Kanal in Copenhagen in the morning: a cobbled quay along a narrow canal lined with wooden houseboats and old coloured merchant houses, low sun on the water. A single woman in her 30s on a pale pink city bike rides fast along the quay. Camera: side tracking at bike speed, she exits frame right.
