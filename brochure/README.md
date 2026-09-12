# PulpLabs flyer

One-page A4, two treatments of the same design.

| File | Use |
|---|---|
| `pulplabs-flyer-screen.jpg` | Black brand version. Email, WhatsApp, LinkedIn. |
| `pulplabs-flyer-print.jpg` | Ink-light version. Physical printing. |

Both are **2481 × 3509 px, 300 DPI** — A4 at commercial print resolution.

## Why two

A full-bleed black A4 drinks ink, prints patchy on office lasers, and costs
more at a print shop. The screen version is brand-true; the print version is
the same layout with the palette inverted and each opacity tier nudged up,
because black on white reads lighter than white on black at the same alpha.

## Editing

The artboards are `Main.dc.html` (screen) and `PrintLight.dc.html` (print).
**Only edit `Main.dc.html`** — the print version is derived from it by a
palette swap, so editing it directly gets overwritten on the next regenerate.

Live canvas: https://claude.ai/code/artifact/85196df2-689d-431f-8eee-4b4f45ceb666

## Deliberately excluded

No performance metrics and no client names. `PULPLABS-BRIEF.md` §13 lists the
19 solution metrics, both case-study figures and the "certified instructors"
claim as unverified. A flyer is the worst place for a wrong number, because
people keep it. Add them once they are substantiated, and add client logos
once naming permission is in writing.

## Contact details differ from the site

The flyer carries `contact@pulplabs.ai` and `+91 98865 40403`. The website
currently uses `hello@pulplabs.ai` and WhatsApp `+91 9448055577`. Both are
live in different places; worth reconciling.
