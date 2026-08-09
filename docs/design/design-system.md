# Organic design system

This is the living guide to the styling shipped by the site. `src/styles/global.css` is the source of truth. The files in `organic-handoff/` preserve the designers' original reference, but do not ship.

## Tokens

### Role colours

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#faf6ef` | Cream page ground |
| `--color-surface` | `#f1e9db` | Raised and contrasting surfaces |
| `--color-text` | `#2b2118` | Default text |
| `--color-accent` | `#c05c21` | Terracotta primary accent |
| `--color-accent-2` | `#b68725` | Gold secondary accent |
| `--color-accent-3` | `#7a8a5e` | Sage tertiary accent |
| `--color-divider` | `color-mix(in srgb, var(--color-text) 16%, transparent)` | Subtle borders and rules |
| `--focus` | `#7040a0` | Global keyboard focus ring |

`--ease-spring` is `cubic-bezier(.34, 1.4, .64, 1)`. It is retained from the previous system for spring-like motion.

### Colour ramps

Each ramp uses the same perceptual lightness structure.

| Step | Neutral | Accent, terracotta | Accent 2, gold | Accent 3, sage |
| --- | --- | --- | --- | --- |
| 100 | `--color-neutral-100`, `#faf3ee` | `--color-accent-100`, `#fff2ec` | `--color-accent-2-100`, `#fbf4e9` | `--color-accent-3-100`, `#f0fae1` |
| 200 | `--color-neutral-200`, `#f1e6dc` | `--color-accent-200`, `#ffe1d2` | `--color-accent-2-200`, `#f5e6cc` | `--color-accent-3-200`, `#e1eecc` |
| 300 | `--color-neutral-300`, `#dfd1c5` | `--color-accent-300`, `#ffc5aa` | `--color-accent-2-300`, `#eed09c` | `--color-accent-3-300`, `#ccdbb2` |
| 400 | `--color-neutral-400`, `#c4b4a7` | `--color-accent-400`, `#ff9a66` | `--color-accent-2-400`, `#deaf59` | `--color-accent-3-400`, `#aebf92` |
| 500 | `--color-neutral-500`, `#a59588` | `--color-accent-500`, `#df7841` | `--color-accent-2-500`, `#bf8f2f` | `--color-accent-3-500`, `#8fa073` |
| 600 | `--color-neutral-600`, `#85776b` | `--color-accent-600`, `#ba5b25` | `--color-accent-2-600`, `#9d7109` | `--color-accent-3-600`, `#728157` |
| 700 | `--color-neutral-700`, `#665b51` | `--color-accent-700`, `#934312` | `--color-accent-2-700`, `#7a5600` | `--color-accent-3-700`, `#56633f` |
| 800 | `--color-neutral-800`, `#4a4139` | `--color-accent-800`, `#692f0c` | `--color-accent-2-800`, `#573d00` | `--color-accent-3-800`, `#3d472b` |
| 900 | `--color-neutral-900`, `#302a26` | `--color-accent-900`, `#43210e` | `--color-accent-2-900`, `#382809` | `--color-accent-3-900`, `#272e1b` |

Use steps 100–300 for tinted fills, hovers, and subtle borders. Step 500 is the role's base. Use steps 700–900 for text on tinted fills and for pressed states. Paragraph-size text in an accent must use its 700 step, never the base role colour. The base-to-ground pair reaches only about 3:1, while each 700 step clears 4.5:1 against the cream ground.

### Type

| Token or element | Value |
| --- | --- |
| `--font-heading` | `'Caprasimo', 'Rubik Variable', system-ui, sans-serif` |
| `--font-heading-weight` | `400` |
| `--font-body` | `'Figtree Variable', 'Rubik Variable', system-ui, sans-serif` |
| Body | `15px`, weight `400`, line-height `1.55` |
| `h1` | `42px` |
| `h2` | `32px` |
| `h3` | `25px` |
| `h4` | `20px` |
| `h5` | `16px` |
| `h6` | `13px`, uppercase, `0.08em` tracking |

Headings use a `1.12` line-height and `-0.015em` tracking. The scale is fixed in pixels by design. `.display` is the single fluid exception.

Rubik Variable deliberately trails both stacks. Browser fallback therefore happens per glyph, so Arabic remains legible without a language-specific selector.

### Spacing, radius, and shadow

The spacing scale is based on 4px at 1.10 density. It genuinely skips 5 and 7.

| Token | Value | Token | Value |
| --- | --- | --- | --- |
| `--space-1` | `4.4px` | `--radius-sm` | `8px` |
| `--space-2` | `8.8px` | `--radius-md` | `16px` |
| `--space-3` | `13.2px` | `--radius-lg` | `28px` |
| `--space-4` | `17.6px` | `--shadow-sm` | `0 1px 2px`, neutral 900 at 14% |
| `--space-6` | `26.4px` | `--shadow-md` | `0 3px 10px`, neutral 900 at 16% |
| `--space-8` | `35.2px` | `--shadow-lg` | `0 12px 32px`, neutral 900 at 22% |

Buttons, tags, segmented controls, and single-line inputs use `999px` radii. Textareas use `--radius-md`. Cards and dialogs use `calc(var(--radius-lg) * 1.15)`.

### Page scaffolding

| Token | Value | Purpose |
| --- | --- | --- |
| `--leading` | `28px` | Base unit for section rhythm |
| `--half` | `14px` | Half-leading unit |
| `--edge` | `clamp(20px, 5vw, 72px)` | Responsive page gutter |
| `--measure` | `58ch` | Reading measure |
| `--wrap` | `1200px` | Maximum page width |

## Page classes

- `.wrap` centres content up to `--wrap` and applies `--edge` gutters.
- `.section` adds three leading units of vertical padding. Add `.section-contrast` for a surface-coloured section. Cards inside a contrast section fall back to the page ground, because a surface card on a surface band has nothing to separate it.
- `.eyebrow` is the small uppercase terracotta kicker placed before a heading.
- `.section-heading` is a balanced 32px heading with no margin.
- `.display` is the fluid hero heading, from 40px to 76px. Wrap each intended line in `<span class="line">...</span>` when the composition needs fixed line breaks.

Sections should part on whitespace. The system prefers air to dividing rules.

## Components

### Buttons

Apply `.btn` to a native `<button>` or link, then add one variant:

```html
<button class="btn btn-primary">Save</button>
<a class="btn btn-secondary" href="/about">About</a>
<button class="btn btn-ghost">Cancel</button>
```

`.btn-primary` is solid terracotta, `.btn-secondary` is outlined, and `.btn-ghost` is a text-only accent action with no border. `.btn-icon` creates a 2.75rem square icon button. Organic specifies 36px, but the site holds every interactive target at the 44px minimum, so that decision wins here in the same way the focus ring does. `.btn-block` fills its container and adds top spacing. Disabled native buttons drop to 45% opacity.

#### Button rename

This is a migration trap. Organic's `.btn-ghost` means text-only accent with no border. The previous system used `.btn-ghost` for an outlined button. Anything outlined is now `.btn-secondary`. The old `.button`, `.button-primary`, and `.button-secondary` aliases are gone.

### Tags

Use `.tag` with one of `.tag-accent`, `.tag-accent-2`, `.tag-accent-3`, `.tag-neutral`, or `.tag-outline`:

```html
<span class="tag tag-accent-2">Featured</span>
```

Filled tags pair a 100-step ground with 800-step text. The outline variant uses the primary accent border and 700-step text.

### Forms

A labelled field expects a direct child label followed by an `.input`:

```html
<div class="field">
  <label for="name">Name</label>
  <input class="input" id="name" name="name">
</div>
```

Use `.input` on inputs, selects, and textareas. A `textarea.input` gets a 90px minimum height, vertical resizing, and a medium radius.

A radio expects the native input immediately before its visible dot:

```html
<label class="radio">
  <input type="radio" name="size" value="small">
  <span class="dot"></span>
  Small
</label>
```

A segmented control contains `.seg-opt` labels. Each label contains a native radio input:

```html
<div class="seg">
  <label class="seg-opt"><input type="radio" name="view" checked>Grid</label>
  <label class="seg-opt"><input type="radio" name="view">List</label>
</div>
```

These patterns hide native radio controls visually while retaining their semantics and keyboard behaviour. Keep the shown structure because checked and focus styles depend on sibling and `:has()` selectors.

### Cards and elevation

```html
<article class="card elev-sm">
  <div class="card-kicker">Category</div>
  <h3 class="card-title">Title</h3>
  <p class="card-body">Summary</p>
  <div class="card-meta">Metadata</div>
</article>
```

`.card` is a surface-filled flex column. Its optional parts are `.card-kicker`, `.card-title`, `.card-body`, and `.card-meta`. Add `.elev-sm`, `.elev-md`, or `.elev-lg` wherever the corresponding tokenised shadow is needed.

### Navigation

```html
<nav class="nav">
  <a class="nav-brand" href="/">Brand</a>
  <a href="/work" aria-current="page">Work</a>
</nav>
```

`.nav-brand` pushes the remaining links to the far side. Mark the current link with `aria-current="page"`.

### Tables

Apply `.table` to a semantic table with `<thead>`, `<tbody>`, `<th>`, and `<td>` elements. The class supplies collapsed borders, compact cells, uppercase headers, row rules, and a subtle row hover.

```html
<table class="table">
  <thead><tr><th>Item</th><th>Status</th></tr></thead>
  <tbody><tr><td>Example</td><td>Ready</td></tr></tbody>
</table>
```

### Dialogs

```html
<div class="dialog-backdrop">
  <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
    <h2 class="dialog-title" id="dialog-title">Title</h2>
    <div class="dialog-body">Content</div>
    <div class="dialog-actions"><button class="btn btn-primary">Confirm</button></div>
  </div>
</div>
```

`.dialog-backdrop` covers the viewport and centres `.dialog`. The optional internal parts are `.dialog-title`, `.dialog-body`, and `.dialog-actions`. The CSS provides presentation only. Dialog behaviour, focus management, labelling, and dismissal remain the caller's responsibility.

### Rules and photographs

`.hr` is a one-pixel divider using `--color-divider`, but should be avoided. Separate sections with whitespace.

`.washed` applies the system's photograph treatment directly to an image or image wrapper: reduced saturation and contrast, raised brightness, and slight opacity. It applies to rectangular content photographs, so they sit back into the warm page instead of on top of it. It is currently unused: the site's one photograph is the hero portrait, which is a background-removed cutout standing on a gold-tinted circle rather than a framed image. Washing a cutout on a tint reads as faded rather than settled, so that treatment deliberately skips it.

Images are served through Astro's `<Image>`, which emits responsive webp from a single master under `src/assets/`. The hero portrait is `loading="eager"` with `fetchpriority="high"` because it is above the fold; anything below the fold should stay lazy.

### Icons

No icon dependency is installed. When icons are introduced, use Lucide icons consistently at `stroke-width="2.75"`. The heavier stroke is part of Organic's visual direction.

## Focus and motion

Keyboard focus is global: `:focus-visible` receives a 3px solid purple `--focus` outline with a 4px offset. This deliberately overrides Organic's 2px accent ring. Purple belongs to the site's palette, and the 3px width is an accessibility decision. Never restyle focus per component. Radios and segmented controls reproduce the same ring on their visible control because the native inputs are visually hidden.

Reduced-motion preferences disable smooth scrolling, collapse animation and transition durations, prevent repeated animation, and remove translation.

## Standing overrides

### The colour palette wins

Organic's role-colour architecture and 100–900 ramps were adopted, but populated with the site's existing warm palette. The ramps were regenerated in OKLCH using Organic's perceptual lightness scale at the site's hues. Every 700 step was required to clear 4.5:1 against the cream ground for body copy. Gold, previously unused, became `--color-accent-2`. Organic's sage is retained verbatim as tertiary `--color-accent-3`.

### Islamic geometric ornament wins

`Arabesque.astro`, an eight-point star or octagram, and `Monogram.astro`, a square-Kufic "EY" in an octagonal frame, occupy decorative slots where Organic specifies circles and blobs. Organic's restriction against sharp corners and hairline-only geometry is overridden for ornament only. The rounded frame remains unchanged: buttons and inputs are pills, while cards and dialogs use `calc(var(--radius-lg) * 1.15)`.

`Arabesque.astro` takes three variants. `divider` and `tile` emit a repeating SVG pattern at a fixed tile size, for strips and full-bleed backdrops. `mark` emits a single star at a caller-controlled `size` and `stroke`, which is what the repeating variants cannot do: it carries the hero medallion and the process step markers. All three are `aria-hidden` and take no pointer events.

### Arabic stays legible

Caprasimo and Figtree do not cover Arabic, while the site's game renders Arabic. `'Rubik Variable'` is therefore the final named font in both `--font-heading` and `--font-body`. This gives Arabic per-glyph fallback everywhere without relying on a selector that a future component could omit.
