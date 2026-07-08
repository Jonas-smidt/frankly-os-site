# Frankly Lab — tool image prompts (NEW, tool-specific, in the Frankly 3D-object style)

Goal: one render per tool that ILLUSTRATES that tool, made in the exact style of the
Frankly 3D object library (camera, vespa, speakers …).

**Best results:** in Flow / Nano Banana, attach a real Frankly render as a **style
reference** (e.g. `~/Desktop/refferance images/3d visuels/All/FRANKLY_CAMERA.jpg`) and
use the prompt below. That locks the material, palette, ribbon and lighting.

**Slots are already wired.** Save each output with the exact filename in the table and
drop it into `frankly-os-site/assets/tools/` — the card swaps to it automatically
(replacing the placeholder object currently there). PNG, ~1200×900, transparent
background preferred (or the dusty-pink studio background).

## Style anchor (prepend to every subject)
> In the exact style of the Frankly 3D object renders: a single hero object in playful
> color-blocked MATTE plastic — cobalt blue, warm orange, fresh green, mustard yellow and
> blush pink — with a translucent pink satin ribbon weaving loosely around it. Floating,
> soft studio softbox lighting, soft contact shadow, seamless dusty-pink background.
> Premium playful CGI product render, centred, generous negative space. No text, no logos.

## Per-tool subject → filename
| Tool | Subject (append to the anchor) | File |
|---|---|---|
| Instore salgsguide | a compact retail card-payment terminal / point-of-sale device | `assets/tools/instore.png` |
| Email signature | an envelope with a fountain pen and a small ribbon-like signature swoosh | `assets/tools/signature.png` |
| Brand Reference | a fan of color-swatch chips beside a small color wheel | `assets/tools/brand-reference.png` |
| Brand Assistant | a friendly rounded chat speech-bubble with a small sparkle | `assets/tools/brand-assistant.png` |
| Business card | a business card lifting out of a card holder | `assets/tools/business-card.png` |
| Dictionary | an open book with little alphabet index tabs | `assets/tools/dictionary.png` |
| QR link | a chunky QR-code cube/tile | `assets/tools/qr.png` |
| Image resizer | a framed photo with corner crop/resize handles | `assets/tools/image.png` |
| Drop Protection (game) | a smartphone bouncing safely on a soft cushion | `assets/tools/drop.png` |
| Frankly's BMW (game) | a small stylised car, three-quarter view | `assets/tools/bmw.png` |
| Decision Chicken (toy) | a plump stylised chicken | `assets/tools/decision.png` |
| Quiz | a quiz buzzer / a question-mark block | `assets/tools/quiz.png` |
| Start here | an open doorway with a little welcome flag | `assets/tools/onboarding.png` |
| Coverage overview | an open umbrella sheltering a few small objects | `assets/tools/coverage.png` |
| Frankly Journal | an open journal / a small stack of story cards | `assets/tools/blog.png` |

## Alternative: Blender
If you open Blender with the MCP addon (Connect), I model + render each of these objects
directly into `assets/tools/` in the same look — no generation on your side.
