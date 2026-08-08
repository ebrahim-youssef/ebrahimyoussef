# Organic design reference

`organic-handoff/` is the Claude Design export for the Organic theme. It is permanent reference material, not code shipped by the site. The designers' authoritative guide is [`organic-handoff/project/readme.md`](organic-handoff/project/readme.md). The export's HTML, CSS, assets, and theme data record the original system and its examples.

The site adopted Organic with three standing overrides:

1. The site's warm colour palette wins. Organic's role colours and 100–900 ramp structure remain, with ramps regenerated in OKLCH and every 700 step checked for body-copy contrast against the cream ground. Gold is `--color-accent-2`; Organic's sage remains as `--color-accent-3`.
2. Islamic geometric ornament wins. The octagram and square-Kufic monogram fill decorative slots intended for circles and blobs. Sharp or hairline geometry is allowed for ornament only. Controls and containers remain rounded.
3. Arabic stays legible. Rubik Variable is the final named face in both font stacks, providing per-glyph Arabic fallback where Caprasimo and Figtree have no coverage.

See [`design-system.md`](design-system.md) for the system that actually shipped.
