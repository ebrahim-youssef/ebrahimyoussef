# Client-First Portfolio Refresh Design

## Objective

Refresh ebrahimyoussef.com into a client-first portfolio for startups and small businesses while preserving a restrained, recognizable personal brand. The finished static Astro site must build reliably for Cloudflare Pages, deploy from the repository's primary `main` branch, and work at the production URL.

## Audience and positioning

The primary audiences are startup teams that need product or frontend work and small businesses that need complete websites. The homepage must quickly explain what Ebrahim builds, show credible evidence through shipped work, reduce uncertainty about working together, and provide two direct conversion paths: email and booking a call.

Personal branding remains visible through the EY monogram, Arabic geometric motifs, warm visual language, personal story, and one quiet note about helping new and self-taught developers. Developer education and the interactive game are supporting details, not competing primary journeys.

No testimonials, client outcomes, or metrics may be invented. Until verified client evidence is available, shipped products and visible engineering work provide the proof.

## Information architecture

The single-page journey is:

1. Compact navigation with the EY identity and anchors for work, services, about, and contact.
2. Left-aligned client-focused hero with an email action and a booking action.
3. Selected work that describes the problem, contribution, and visible result for each featured product.
4. Services covering product interfaces, business websites, and frontend engineering.
5. A concise four-step working process: understand, build, refine, ship.
6. A short personal section with a quiet sentence about sharing lessons with new and self-taught developers.
7. The existing interactive game as an optional personal-brand detail below the commercial content.
8. A strong closing contact section that repeats email and booking actions.

The page must favor progressive disclosure: a prospective client can understand the offer and reach Ebrahim quickly, while technical visitors can continue into project details and the game.

## Content direction

The hero thesis is:

> I build clear, dependable digital products for startups and small businesses.

Supporting copy should communicate that Ebrahim turns ideas into fast, accessible, maintainable marketing sites and production interfaces. Copy must be specific, plain-spoken, active, and supported by visible evidence.

Project entries should explain what was made and why it is useful rather than listing technologies without context. Services and process language should help non-technical clients recognize their needs. The developer-learning mission appears once as a quiet personal note.

The primary calls to action are `Email me about a project` and `Book a call`. Their destinations must come from centralized site data. A real, user-approved booking URL is a release prerequisite and must be verified before release. If one is unavailable, the user must explicitly approve a named fallback; silently removing the second conversion path does not satisfy this design.

## Selected-work inventory

The initial candidates are NABD (`https://nobd-frontend.vercel.app`, source at `https://github.com/ebrahim-youssef/nabd`), Quran Unified API (`https://ebrahim-youssef.github.io/quran-api-unified/`, source at `https://github.com/ebrahim-youssef/quran-api-unified`), and the Islamic Figures Game embedded on this site. Before implementation, each candidate must be opened and inventoried for a verified problem statement, Ebrahim's contribution, a visible result, usable image assets, and permission to publish those assets. Unsupported statements are omitted. The game remains supporting personal proof rather than one of the primary commercial case studies.

## Visual direction

Preserve the established sand, terracotta, gold, and dark-ink palette and the geometric EY monogram. Use the arabesque motif only as a restrained hero backdrop and occasional structural divider.

Move from a centered personal-homepage composition to a confident editorial layout with a left-aligned hero, stronger type scale, clearer evidence hierarchy, and quieter supporting surfaces. Continue using Rubik as the readable core family and create distinction through scale, weight, width, and spacing rather than decorative excess.

The EY geometric identity is the signature element. Motion is limited to one polished entrance and subtle purposeful interactions. Reduced-motion preferences must be respected. The site remains responsive from small mobile screens through wide desktop layouts, with visible focus styles and accessible contrast.

## Architecture and component boundaries

The site remains a statically generated Astro project. Page sections are focused Astro components, global tokens and shared primitives remain in the global stylesheet, and content that changes independently lives in typed data modules. The existing React game remains an isolated client-side island and must not control or delay the primary client journey.

Metadata and structured data are generated from centralized site information. External actions use valid destinations and safe link attributes. There is no server-side form or database in this scope.

## Failure handling

Missing booking data must fail validation and block release until the real URL or an explicitly user-approved named fallback is configured; it must never silently remove the approved action or render a dead link. External project and social links must be checked during release. The game retains clear user feedback for browser features such as sharing or clipboard access that may fail.

The static build must fail visibly on type, content, or integration errors. Cloudflare deployment is not considered complete until the production URL returns the built page and core assets successfully.

## Cloudflare Pages release

Astro remains in static output mode. Cloudflare Pages uses `npm run build` and publishes `dist`. The existing repository primary branch is `main`; the completed feature branch will be merged into `main`, pushed to `origin`, and used as the production branch.

Cloudflare configuration should be minimal and reproducible. A runtime adapter is unnecessary unless the architecture changes to server rendering. The production domain remains `https://ebrahimyoussef.com` unless deployment inspection establishes a different canonical URL.

Before implementation and again before release, inspect and record GitHub-origin push access, Cloudflare account/project access, the Cloudflare project name, production branch, build command, output directory, required environment variables, custom-domain and DNS status, HTTPS behavior, and the currently configured canonical origin. Missing access is an explicit external blocker, not a reason to claim completion.

Branch integration must record the starting branch and working-tree state, preserve unrelated user changes, synchronize safely with `origin/main`, and pass all checks on the feature branch. Merge into `main` without rewriting history, push `main`, and confirm local `main`, `origin/main`, the Cloudflare production deployment, and the deployed build all identify the same merged commit SHA.

Deployment succeeds only when Cloudflare reports a successful production deployment for that exact merged `main` commit; the canonical homepage and representative built assets return successful HTTP responses; HTTPS and canonical redirects are correct; and the rendered production page contains the approved hero plus valid email and booking actions.

## Verification

Release verification includes:

- Existing and new unit tests for pure logic and content invariants.
- Astro type/content checks.
- A clean production build with the expected `dist` output.
- Responsive visual review at mobile and desktop sizes.
- Keyboard navigation, focus visibility, contrast, semantic headings, and reduced-motion review.
- Validation of email, booking, project, repository, and social links.
- Metadata, canonical URL, sitemap, favicon, and social preview checks.
- A smoke test against the deployed production URL after the primary branch is pushed.

The responsive acceptance widths are 320, 375, 768, 1024, and 1440 CSS pixels, with no horizontal page overflow or obscured controls. Text and interactive controls must meet WCAG 2.2 AA contrast; every interaction must be completable by keyboard with visible focus; and reduced-motion mode must disable nonessential entrance and hover movement. Performance claims may be published only if a production Lighthouse run records at least 90 for Performance, Accessibility, Best Practices, and SEO on the tested mobile profile; otherwise the copy must not make an unsupported speed claim.

Metadata verification covers a unique title and description, canonical URL, Open Graph and Twitter card fields, a verified social image asset, favicon assets, sitemap, indexable robots behavior, and `Person` plus `WebSite` schema.org nodes with valid name, URL, email, job title, and same-as URLs. All absolute URLs must use the confirmed production origin.

Link validation checks internal anchors, HTTP and HTTPS destinations, redirects, `mailto:`, booking, featured-project, repository, and social links. Final HTTP(S) responses in the 200–399 range are acceptable when they resolve to the intended destination. A broken primary CTA, featured-project link, or internal anchor blocks release.

## Out of scope

This release does not add a CMS, server-side contact form, database, invented client testimonials, a full educational resource hub, or a broad rewrite of the game. Those can be separate, evidence-led projects later.
