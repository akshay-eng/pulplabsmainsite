# PulpLabs — 4K art prompt pack (Higgsfield)

Generate each image below, **save it with the exact filename shown** (any of
`.png`, `.jpg`, `.webp`), put them all in one folder, then run:

```bash
node scripts/ingest-art.mjs ~/Downloads/pulplabs-art
```

The script crops, encodes 4K + 1920 + 960 WebP versions, and wires them into
the site automatically (via `src/data/art-manifest.json` and `<Art>`).

## Settings

- **Resolution:** the highest the model offers. Use 4K output, or run
  Higgsfield's upscaler before downloading. The script warns about anything
  under ~2900px wide.
- **Aspect:** `1:1` for tiles, `16:9` for plates (given per image).
- **Style:** photoreal, cinematic. Keep the same style suffix on every prompt so the
  set looks like one shoot.

## Shared style suffix (append to every prompt)

> shot on a full-frame cinema camera, 35mm lens, shallow depth of field, almost
> entirely black environment, low-key lighting, a single soft band of
> spectral light (deep blue fading through cyan and green to warm amber)
> raking across the subject, subtle volumetric haze, fine film grain,
> ultra-detailed, 4K, no text, no logos, no watermarks, no identifiable faces

**Why these rules:** the site's design rule is a black interface where the
only colour comes from light. The spectral band matches the hero, so every
image looks lit by the same source. Avoid faces, logos and readable screens:
a sector image must not look like it shows a specific real client.

---

## Sector tiles: industries (1:1)

| Filename | Prompt |
|---|---|
| `ind-financial` | A trading-floor desk at night: a curved glass monitor wall seen from behind, abstract charts glowing softly out of focus, a brushed-steel desk edge catching the light. |
| `ind-healthcare` | A modern clinical lab bench at night: rows of glass sample vials and a pipette rack, cool reflections in the glass, a microscope silhouette in soft focus behind. |
| `ind-manufacturing` | A precision CNC machine interior: a polished metal part on the spindle, fine coolant mist hanging in the air, steel surfaces carrying the light band. |
| `ind-retail` | A premium boutique after hours: minimalist product shelving with a few sculptural packages, glossy floor reflections, the light band sweeping along the shelf edge. |
| `ind-professional` | A dark boardroom: a long walnut table with neat document stacks and a fountain pen, floor-to-ceiling glass with city lights blurred far behind. |
| `ind-public` | A civic building atrium at night: tall stone columns and a broad staircase, the light band falling across the steps, large and calm. |

## Sector tiles: teams (1:1)

| Filename | Prompt |
|---|---|
| `dept-it-operations` | A server room aisle: rack fronts with tiny status LEDs, fibre cables in neat looms, depth fading into darkness. |
| `dept-sales` | A close-up of a handshake-free deal moment: a signed contract page and a closed laptop on a dark desk, a coffee cup steaming faintly, warm amber end of the band. |
| `dept-support` | A headset resting on a dark desk beside a softly glowing keyboard; the screen is blurred and illegible; calm, quiet, late-evening mood. |
| `dept-marketing` | A creative studio table: printed layout proofs and colour swatches fanned out, a camera lens lying on its side, light band across the paper edges. |
| `dept-finance` | A neat ledger desk: a stack of invoices held by a steel clip, a calculator, a fountain pen; precise, orderly, quiet. |
| `dept-data` | An abstract macro of fibre-optic strands carrying points of light, converging into a single bundle, extremely shallow focus. |

## Home section plates (1:1)

| Filename | Prompt |
|---|---|
| `sec-connect` | Industrial cable connectors and network patch ports in macro, one plug seated precisely; it says "it runs on what you already have". |
| `sec-approve` | A single physical key turning in a brushed-steel lock, a fingertip on it, macro; it says "a person commits the action". |

## Widescreen plates (16:9)

| Filename | Prompt |
|---|---|
| `advisory-strategy` | A dark strategy room: a large table with a printed systems map, pins and thread connecting cards, seen from a low angle. |
| `enablement-workshops` | A workshop space after hours: whiteboards with abstract diagrams (illegible), chairs in a loose circle, the light band through a window. |
| `mo-hero` | A night operations centre seen from the back: a wall of softly glowing, illegible dashboards, a single empty chair, calm. |
| `hero-bleed` | Pure abstract light: the spectral band as soft volumetric ribbons in black space, no objects. |

---

### Not in this pack, on purpose

- **Case-study art** is now interactive 3D (`src/components/cases/CaseScene.jsx`).
  A realistic photo next to a named client would read as a photo of that
  client's site.
- **Solution cards** (`public/void/cards/*`) are product-UI illustrations, not
  photos. They belong with the product screenshots.
