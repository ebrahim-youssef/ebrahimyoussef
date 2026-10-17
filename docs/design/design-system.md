# Site design system

This document describes the visual foundation shared by the English and Arabic landing pages. The source of truth is `src/styles/global.css`. The landing chapters add their own layout rules while using these tokens and primitives.

## Palette

The palette uses a dark brown ground and warm paper surfaces. Each role has a specific job.

| Token | Value | Role |
| --- | --- | --- |
| `--ground` | `#43210e` | Deep brown chapter ground and button text contrast. |
| `--ground-2` | `#692f0c` | A lighter deep brown for secondary chapter bands. |
| `--night` | `#1f1a16` | The page background behind the chapter stack. |
| `--ink` | `#2b2118` | Ink-colored text on paper and gold surfaces. |
| `--cream` | `#f7f1e8` | Main light text and the warm light chapter surface. |
| `--paper` | `#fffaf2` | Paper cards and clipped notes. |
| `--soft` | `#ffe1d2` | Soft supporting text on dark and rust surfaces. |
| `--muted` | `#665b51` | Muted text and quiet supporting detail. |
| `--gold` | `#deaf59` | Primary action fill, emphasis, and focus ring. |
| `--gold-line` | `#c9a227` | Drawn gold lines, the inked name, and scrollbar thumb. |
| `--gold-ink` | `#7a5600` | Dark gold text on light surfaces. |
| `--rust` | `#df7841` | Rust accent for painted details. |
| `--rust-ink` | `#934312` | Dark rust text and strong rust contrast. |
| `--brand-rust` | `#c05c21` | Brand rust chapter and retained game accent. |
| `--sage` | `#3d472b` | Sage chapter background. |
| `--tape` | `#f5e6ccd9` | Translucent tape over a clipped note. |

The design uses `color-scheme: dark`. The page is dark even when a browser preference is light, because the dark ground is part of the composition.

## Type

Three self-hosted faces cover the site.

`Readex Pro Variable` is the body face. It carries paragraph text, navigation, controls, and headings that need a clear reading texture in both English and Arabic. It is stored in `--body`.

`Reem Kufi Variable` is the Arabic display face. It is used for Arabic display labels and the large outlined ghost words. It is stored in `--kufi`.

`Aref Ruqaa` is reserved for painted Arabic words and the inked name SVG. It is stored in `--ruqaa`, with only the Arabic Fontsource subsets loaded.

The base body is `300 18px/1.65`. Arabic body text uses `1.85` line-height. The `.button` primitive uses a 600 weight and a 16px size. The heading and body roles are also exposed as `--font-heading` and `--font-body` for the play shelf, where they resolve to the display and body faces above.

## Direction and motion tokens

The direction tokens let the same composition work in both writing directions.

| Token | LTR | RTL | Use |
| --- | --- | --- | --- |
| `--shift` | `-40px` | `40px` | Direction-aware translation. |
| `--drift-from` | `-16%` | `16%` | Starting position for a directional drift. |
| `--drift-to` | `12%` | `-12%` | Ending position for a directional drift. |
| `--mirror` | `1` | `-1` | Mirrors arrow shapes and other directional SVG details. |

The base transition curve is `--ease-out: cubic-bezier(.16, 1, .3, 1)`. Reveal content is visible by default. When the client script adds `js` to the document, `.js .reveal:not(.in)` starts hidden and enters when it receives the `in` class. This keeps the content available with JavaScript disabled.

The reduced-motion rule removes the name animation and reveal transition, restores reveal opacity, and keeps the clipped note's rotation. It also prevents a hidden reveal state when reduced motion is requested.

## Clipping and tape

`.clip` is a paper note. It uses `--paper` with `--ink`, generous padding, a small offset shadow, and a controlled rotation from `--r`. Its `::before` pseudo-element is a 96px by 26px strip of `--tape`, positioned across the top edge and rotated slightly. The clipping pattern is decorative but remains readable because the note keeps a paper foreground and ink text.

## Controls and browser surfaces

`.button` is an inline-flex action with a gold background, ground-colored text, and a short background and vertical press transition. `.ghost-button` keeps the surrounding text color and draws its border with an inset shadow. Disabled buttons are dimmed and use a progress cursor.

Links inherit the current chapter color, keep a 5px underline offset, and increase underline thickness on hover. Keyboard focus uses a 2px gold outline with a 3px offset. Text selection uses gold with ink text. The scrollbar uses `--gold-line` over `--night`.

The skip link is visually moved above the viewport until focused. On focus it appears at the start edge with a gold background and ground-colored text.

## Game tokens

The play shelf still consumes the following compatibility tokens. They remain in `global.css` under the `Game tokens` comment so the game can keep its existing styles while the landing system changes around it.

```css
--color-accent: #c05c21;
--color-accent-2: #b68725;
--color-accent-2-200: #f5e6cc;
--color-accent-2-300: #eed09c;
--color-accent-2-600: #9d7109;
--color-accent-2-700: #7a5600;
--color-accent-700: #934312;
--color-bg: #faf6ef;
--color-divider: color-mix(in srgb, var(--color-text) 16%, transparent);
--color-neutral-300: #dfd1c5;
--color-neutral-700: #665b51;
--color-neutral-900: #302a26;
--color-surface: #f1e9db;
--color-text: #2b2118;
--ease-spring: cubic-bezier(.34, 1.4, .64, 1);
--edge: clamp(20px, 5vw, 72px);
--font-body: var(--body);
--font-heading: var(--kufi);
--font-heading-weight: 400;
--leading: 28px;
--measure: 58ch;
--radius-lg: 28px;
--radius-md: 16px;
--shadow-lg: 0 12px 32px color-mix(in srgb, var(--color-neutral-900) 22%, transparent);
--space-1: 4.4px;
--space-2: 8.8px;
--space-3: 13.2px;
--space-4: 17.6px;
--space-6: 26.4px;
```
