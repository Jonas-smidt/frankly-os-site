# Frankly Go™ · "Cyklen er til at cykle på" — ONE prompt, ONE film (v4, single generation)

Jonas, 2026-10-12: "du skal ikke klippe det sammen... jeg vil ha det som en prompt en film."
So: one Seedance 2.5 text-to-video generation, 30 s, 16:9, audio on, no editing. The model
carries the transitions itself. Built from storyboard v4 (seats R4.3 + R4): ordinary Copenhagen
only, camera placed inside the action, real-time, understated people. Not generated: waits for
Jonas's go. Cost preflighted 2026-10-12: 90 credits at 480p, 210 at 720p (30 s).

Note: a text end card cannot be generated reliably (lettering), so the film ends on the last
rider filling the lens. If the "Cyklen er til at cykle på." card is wanted, it is a 4-second
tail appended after, not a cut inside the film. Jonas decides.

## Settings (set as parameters, not in the prompt text)
model seedance_2_5 · mode t2v · duration 30 · aspect 16:9 · resolution 480p for the test (720p for the keeper) · generate_audio on · declined preset "IN THE DARK".

## The prompt

A single continuous 30-second film of everyday cyclists in ordinary Copenhagen, seven shots joined by match cuts, every shot at real-time speed with no slow motion, the camera always placed inside or on the action. Warm amber skin tones, amber-brown shadows never blue, creamy highlights, Kodak Portra 400 grain, the sun always out of frame, skies of structured cumulus with pale pink-peach lower edges or dense grey overcast, never blown-out white. People are calm and absorbed; at most a small asymmetric smile arriving; nobody looks at the camera. Ambient sound only, no dialogue.

0-4 s, from the ground: the lens sits in a rut of brown water on a narrow singletrack through a Danish beech wood in autumn, smooth grey trunks, copper leaves, black wet earth, roots across the track, overcast even light. A carpenter of about 35 in a faded forest-green waxed rain jacket and canvas work trousers on a hardtail mountain bike tears through the rut right beside the lens, standing on the pedals, and flings a sheet of brown mud from right to left onto the glass.

Match cut on the spray: 4-7 s, from the water: the droplets clear and the lens now sits at the surface of a rain puddle on a plain dark-grey asphalt cycle track, raised one granite kerb step above a street of wet granite setts, below a pavement of concrete flags with cobble rows, five-storey red-brick and pale-plaster walls with white timber windows, black conical lamps hanging on wires across the street, bikes leaned on the walls. A girl of about 7 in a bright yellow rain jacket a size too big, a small round helmet and navy wellies, on a clear pale-pink child's bike with a white basket, rides straight through the puddle, water flying right to left, and passes so close that her yellow jacket fills the whole frame.

Cut on the fill: 7-11 s, through the grass: a navy wool jersey fills the frame and pulls away: a woman of about 45 with short grey hair and tortoiseshell glasses on a steel road bike, low in a tuck, rides left to right down a straight pale gravel track across a wide flat common at the city's edge, pale dry grass and reeds, a single line of low willows, a completely flat horizon, dust lifting; the low camera hidden in the dry grass tilts up to the sky in the last second.

Cut on the sky: 11-15 s, from the coping looking up: the same cumulus sky, and a teenager of about 17 in a black hoodie and black helmet on a chrome BMX launches from below across the frame left to right, front wheel spinning at the top of the arc, over a plain pale-grey concrete quarter pipe in a neighbourhood skatepark set in a park lawn with lime trees and a five-storey brick block beyond; he lands with both wheels compressing.

Graphic match on the spinning wheel: 15-19 s, through the spokes: a grass-level camera looks through the slowly turning front wheel of an upright city bike lying on its side on the grass bank of a still shallow city lake, a pale-pink picnic blanket, a low stone edge, flat calm water holding the sky, a gravel path behind under mature lime and chestnut trees, a dark-green slatted bench, swans on the water, the far shore closed off by tree crowns. A couple of about 28, he in a worn denim jacket over a burgundy knit, she in a moss-green chunky knit and a pleated silver skirt; she reaches across without looking at him, stops the wheel with one finger and flicks the bell; he turns to her and a small smile arrives; in the final half second the camera whip-pans right toward the water into a blur.

Whip-pan continues into night: 19-23 s, handlebar POV: the blur settles into a camera mounted on the handlebars of a city bike travelling forward down an ordinary five-storey residential street at night, dark red brick and grey plaster walls, a few windows lit warm, one small kiosk window glowing, black conical lamps on wires throwing round pools onto damp asphalt, a plain dark-grey cycle track, a plain egg-yolk-yellow single-deck bus with a black window band sliding past side-on behind. Two friends ride alongside in a loose wobbling line: a woman of about 27 in a long cobalt coat over a short black party dress and white trainers standing on her pedals, and a man of about 30 with a forest-green jumper knotted round his neck over a white shirt, wobbling because he is laughing at a half-sung song without grinning at the camera; the rider's own hand in a rust-orange corduroy sleeve flicks the bell; at the end the bikes swing together into a dark carriage arch and the frame goes black.

Cut on black: 23-30 s, mounted on the front of a cargo trike's plywood box, travelling forward out of the black cobbled courtyard passage into morning light onto a busy ordinary Copenhagen street: five-storey dark red-brick blocks with white timber windows, plastered shopfronts with small dark awnings, the plain dark-grey cycle track one kerb step above the road, trees in granite-edged pits, a short blue-painted cycle crossing at the junction, a small bicycle signal, a plain galvanised footrest rail, hoop racks full of bikes, lamps on wires, a yellow city bus at the corner, pale morning light from the left. The whole morning stream overtakes left to right at real speed: the girl in the yellow jacket on her pink bike beside her mother, the woman on the road bike in a dark mac, the teenager carrying the BMX on his shoulder on the pavement, commuters on upright steel city bikes in everyday clothes; the last rider crosses close to the lens and fills the frame as the film ends.

Avoid: slow motion, speed ramps, grinning, open-mouth laughing, arms raised, high-fives, thumbs up, direct camera gaze, posing, lens flare, a visible sun disk, blown-out sky, readable or gibberish lettering, logos, landmarks, towers, bridges, red or green cycle lanes, extra fingers, text on screen.

## Risk
Seven shots in one generation is beyond the canon's motion budget for a single clip (10-15 s: two beats or one transition). The model may merge shots, drop the match cuts, or drift on identity across the film. That is the test: if it holds, it is the method; if it does not, the fallback is the seats' per-shot plan with shared frames. Judge pass/fail on place, energy, people, grade and on whether the seven cuts are visible.
