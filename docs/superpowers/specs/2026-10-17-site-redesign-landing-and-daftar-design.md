# Site redesign: landing page and daftar

Status: draft, waiting for owner approval. Shaped through four design rounds (concepts in the
`redesign/` folder) and a grilling session on 2026-10-17.

## Problem Statement

The current site was written for a mixed and partly technical audience, and it still carries facts
that no longer hold (Arkan instead of Fastabiqu, an old product list). The people Ebrahim most wants
to reach are not developers: business owners, brands and individuals who want a website, app or
system built, and employers who want to hire him. They need to see quickly what he does, what he has
delivered and how to reach him, without reading about frameworks.

A second, smaller audience wants to know him as a person: what he is building, studying and
making. The site has no place for that today, so his writing, videos and the figures game have no
home that fits them.

The site is English only, while his work and his market are Arabic first.

## Solution

Replace the site with two connected parts that share one visual identity (paper, ink, terracotta and
gold, Ruqaa and Kufi display type, the existing monogram):

1. **The landing page**, based on concept 29 "Stacked Chapters". Each section is a full card that
   slides up over the previous one as the visitor scrolls. The Work chapter borrows concept 28's
   pinned wall: projects appear as taped, slightly rotated clippings in front of a large painted
   Arabic word. It speaks to clients and employers in plain language, shows results, and offers four
   ways to get in touch.
2. **The daftar (دفتر, "notebook")**, based on concept 28 "Clipping Wall". A wall of pinned items for
   people who want to go deeper: a dated "now" card, his YouTube videos, the figures game, and later
   his blog posts and studying notes.

Both parts exist in full English and full Arabic. English is the default at the root, Arabic lives
under `/ar/`, and a visible switch in the nav moves between them. The Arabic version mirrors the
layout right to left.

The work ships in two releases: the landing page first, then the daftar.

## User Stories

### Clients (business, brand or individual with something to build)

1. As a business owner, I want to understand in one screen what Ebrahim does, so that I know quickly whether he fits my need.
2. As a non-technical visitor, I want the services described in plain words (websites, mobile apps, systems for my team, Arabic done properly), so that I do not need to understand technology to judge them.
3. As a client, I want to see real projects he delivered with who they were for and what came out of them, so that I can trust he finishes work.
4. As a client, I want to see real results stated as facts, so that I can judge the size and kind of work he does.
5. As a client, I want to read how working with him goes step by step (talk, agree, design, build, launch), so that I know what to expect before I contact him.
6. As a client, I want to read the full story of his strongest project, Fastabiqu, so that I can see how he thinks about a product from idea to release.
7. As a client, I want to message him on WhatsApp with one tap and a message already written, so that starting a conversation takes no effort.
8. As a client, I want to copy his email address with one tap, so that I can write to him from my own mail app.
9. As a client, I want to send a short form with my name, a way to reach me and what I want to build, so that I can contact him without leaving the page.
10. As a client, I want a clear confirmation after sending the form, so that I know my message arrived.
11. As a client, if sending the form fails, I want to be told to use WhatsApp or email instead, so that I still have a way to reach him.
12. As a client, I want to book a call from a calendar once that option exists, so that I can pick a time that suits me.
13. As a client, I want the landing page to show only his professional channels (LinkedIn, GitHub, YouTube), so that I am not pulled into personal content.
14. As a client in Egypt or the Gulf, I want to read the whole landing page in Arabic, so that I can share it with partners who do not read English.

### Employers

15. As an employer, I want to download his CV as a PDF, so that I can attach it to a hiring process.
16. As an employer, I want to see his experience as a short timeline on the landing page, so that I can judge his background without opening another page.
17. As an employer, I want a LinkedIn link, so that I can check his profile and contact him there.

### People who want to know him

18. As a curious visitor, I want a quiet link from the landing page to the daftar, so that I can go deeper if I want to.
19. As a visitor in the daftar, I want a dated "now" card at the top, so that I can see what he is doing this month and how fresh that information is.
20. As a visitor, I want to see his latest YouTube videos in the daftar, so that I can watch what he makes.
21. As a visitor, I want to play the figures guessing game in the daftar, so that I can try something he built.
22. As a visitor, I want a link back to working with him from the daftar, so that I can contact him if what I read convinces me.
23. As a visitor, I want the daftar to show all his public channels except TikTok, so that I can follow him where he is active.
24. As a visitor, I want to see that his first blog post is on its way rather than an empty list, so that the section does not look abandoned.

### Readers (later, once posts exist)

25. As a reader, I want each blog post marked with its language, so that I know before opening it whether I can read it.
26. As a reader, I want to filter posts by a simple tag such as building, studying or life, so that I find what interests me.
27. As a reader, I want an RSS feed, so that I can follow new posts in my reader.
28. As a reader, I want a share link on each post, so that I can send it to someone.

### Language and access

29. As an Arabic reader, I want every page to be fully in Arabic with a right-to-left layout, so that it reads naturally.
30. As a visitor, I want the site to open in English and stay in the language I last chose, so that I am never switched against my will.
31. As a visitor on a phone, I want the stacked chapters, the pinned wall and the swipe rows to work with my thumb, so that the phone version is as good as desktop.
32. As a visitor who prefers reduced motion, I want the animations replaced by a still layout, so that the page does not make me uncomfortable.
33. As a keyboard or screen reader user, I want every link, button and form field reachable and labeled, so that I can use the whole site.
34. As a visitor, I want no cookie banner, so that I can read the site without dismissing anything.

### Ebrahim (owner)

35. As the owner, I want form messages to arrive in my email inbox, so that leads are in one place.
36. As the owner, I want spam blocked before it reaches my inbox, so that the form stays useful.
37. As the owner, I want to add a blog post by adding one Markdown file, so that writing has no extra tooling.
38. As the owner, I want my YouTube shelf to update on its own whenever the site builds, so that I never maintain it by hand.
39. As the owner, I want to update the "now" card by editing one small entry with a date, so that keeping it fresh takes a few minutes a month.
40. As the owner, I want a cookieless analytics view of visits, so that I know traffic without a consent banner.
41. As the owner, I want the Cal.com button hidden until I set up my calendar, so that the site never shows a dead button.
42. As the owner, I want the site to stop mentioning my town, so that only Egypt appears as my location.
43. As the owner, I want the build to fail when copy contains em dashes, buzzwords or placeholders, so that bad copy never ships.
44. As the owner, I want the build to fail when an Arabic translation is missing, so that the two languages never drift apart.

## Implementation Decisions

### Structure and routing

- Stays on the current stack: Astro static build served by the existing Cloudflare Worker, which keeps serving static assets and gains one form endpoint.
- Astro's built-in internationalization routing: English at the root, Arabic under `/ar/`. No automatic redirect by browser language. The language switch links to the same page in the other language, and the chosen language is remembered on the device as a convenience only.
- Pages: landing (`/`, `/ar/`), Fastabiqu case study (one per language), daftar (`/daftar`, `/ar/daftar`), CV PDF, and in release 2 the RSS feed.
- Each page declares its `lang` and `dir`, and links to its other-language version with `hreflang`.

### Content model

- All landing copy lives in typed content modules, one shared structure with an English and an Arabic value per entry, so a missing translation is a type error and a test failure.
- Content carries over from the round 4 concepts: the role line and subtitle, audiences (build, hire, know), four services, five steps (نتكلم, نتفق, أصمم, أبني, نطلق), six work entries (Fastabiqu, the educational institution, the store, the calendar, Quote Vault, the figures game), six results, and the journey timeline. Every fact traces to the branding docs; nothing is invented.
- The product list replaces Arkan with Fastabiqu and drops products that are not shown.
- Arabic voice: simple Modern Standard Arabic on the landing page. Claude drafts it and Ebrahim reviews it. The daftar is in Ebrahim's own voice.
- Location everywhere is "Egypt".
- Blog posts and the "now" entry are Astro content collections (Markdown with frontmatter). A post carries a title, date, language, tags and an optional link to its translation. Posts are written in one language each; translation is optional.

### Landing page (release 1)

- Concept 29 structure: chapters stack as sticky cards. A tall chapter sticks by its bottom edge so its content is never cut off.
- The Work chapter uses concept 28's pinned clippings over a large painted Arabic word (أعمال).
- Fastabiqu has its own case-study page. The other projects link to their live product or source.
- The journey chapter carries the experience timeline, so there is no separate hire page.

### Contact

- Four routes, in this order of prominence: WhatsApp, email, form, Cal.com.
- WhatsApp: a `wa.me` link to +201287877420 with a ready-made message. English: "Hi Ebrahim, I found you through your website. I'd like to talk about building something." Arabic: "أهلاً إبراهيم، وصلت لك من موقعك وحابب نتكلم عن مشروع." The message is URL-encoded and matches the page language.
- Email: `me@ebrahimyoussef.com` shown as selectable text with a copy button.
- Form fields: name, a way to reach you (email or WhatsApp), what you want to build. Spam protection with Cloudflare Turnstile.
- Form endpoint on the Worker: accepts a POST, validates the fields (required, length limits), verifies the Turnstile token with Cloudflare, then emails the message to `me@ebrahimyoussef.com`. Responses: success; a validation error listing which field to fix; and a general failure that tells the visitor to use WhatsApp or email instead. The visitor never sees internal error details.
- Cal.com: a button driven by a single setting. While the setting is empty the button is not rendered.

### Daftar (release 2)

- Concept 28 style: a wall of pinned items behind large painted Arabic words.
- Shelves in v1: the dated "now" card, YouTube (own videos only), and a "play" shelf holding the existing figures game.
- Blog: the infrastructure ships (collection, post page, tags, RSS, share link), but with no posts the shelf shows a "first post soon" note instead of an empty list.
- Studying shelf: deferred until Ebrahim gives a final list. Early candidates are storytelling, personal branding, forward deployed engineering and software engineering. When it ships, each item has a topic, source, status and date, and can link to a post.
- YouTube: at build time, read the public channel feed for `@ebrahimyoussef391` and turn it into a video list. If the feed cannot be read, the build still succeeds and the shelf is hidden.
- Social links in the daftar: LinkedIn, GitHub, YouTube, Qabilah, Facebook. No TikTok anywhere.

### Arabic presentation

- Full right-to-left mirroring, including the sideways swipe rows and their progress indicators.
- The Ruqaa and Kufi display words appear in both languages. Body text in Arabic uses a reading font such as IBM Plex Sans Arabic or Readex Pro.
- Claude mocks the Arabic version of both parts before the build starts, for owner approval.

### Analytics and privacy

- Remove Google Analytics completely: the tag, the consent banner, the consent script, and the regional privacy endpoint in the Worker, with their tests.
- Add Cloudflare Web Analytics, which sets no cookies, so no banner is needed.

### CV

- A designed English PDF generated from the CV in the branding folder, in the site's visual style, with "Egypt" as the location. No Arabic CV.

### Motion and accessibility

- Desktop and phone both get the motion: the stacking cards and pinned wall work on phones, and sideways films become thumb-swipe rows with a peeking next panel.
- With reduced motion requested, every animation is replaced by a still layout.
- Every reveal-on-scroll element is visible without JavaScript.

### Design system and releases

- The design system document is rewritten for the new identity (tokens, type pairing, components) and stays the styling source of truth.
- Release 1: landing page in both languages, the Fastabiqu case study, contact routes and form, the CV PDF, the analytics swap. Version `1.0.0`.
- Release 2: the daftar in both languages with the now card, YouTube, the play shelf and the blog infrastructure. Version `1.1.0`.

## Testing Decisions

A good test checks what a visitor or the owner can observe: rendered pages, links, responses and
content. It does not check how components are built internally, so the tests survive a restyle.

Four seams, all at the highest point available:

1. **Content contract** (unit, extends the existing content test). Every content entry has both an English and an Arabic value; links are absolute and valid; the WhatsApp link targets the right number and carries the encoded message for each language; no copy in any source file contains em dashes, buzzwords or placeholders; the location never names the town; TikTok appears nowhere; the work list is the intended six in the intended order.
2. **Built-site check** (extends the existing build verification script, run against the production build). Every page exists in both languages; Arabic pages declare `lang="ar"` and `dir="rtl"`; each page links its other-language version; canonical, social metadata and structured data are present; the CV PDF exists; the Cloudflare analytics beacon is present and no Google Analytics or consent marker remains; the Cal.com button is absent while its setting is empty; release 2 adds the daftar pages and the RSS feed.
3. **Worker contact endpoint** (unit, the request handler is called with a fake environment, as the existing privacy-region test does). A valid message with a passing Turnstile check is emailed and returns success; missing or oversized fields return a validation error; a failed Turnstile check is rejected and sends nothing; a failed email send returns the general failure message; non-POST methods are refused.
4. **YouTube feed reader** (unit, a pure function). A sample channel feed becomes the expected list of videos; an empty, malformed or unreachable feed yields an empty list without throwing.

The existing figures game tests (reducer, streak, Arabic normalization, share card) stay as they are,
since the game moves pages without changing behavior.

## Out of Scope

- Books and games library shelves, and a "worth watching" list (later).
- The studying shelf until Ebrahim provides the final list.
- Writing blog posts. Claude may suggest topics but does not write posts in Ebrahim's voice.
- An Arabic CV.
- Setting up Cal.com itself.
- A CMS or web editor for posts.
- Comments on posts.
- Telegram or other notifications for form messages.
- Case-study pages for projects other than Fastabiqu.

## Further Notes

- Research before the build: how the Worker can send email to `me@ebrahimyoussef.com` (Cloudflare Email Routing and its send-email binding, or an email API), and whether the domain's mail setup allows it. This decides one dependency of the form.
- Research before the build: the channel ID behind `@ebrahimyoussef391`, needed for the feed address.
- The `redesign/` concepts folder moves to the branding folder on the E drive and is not committed.
- Concept references: 29 Stacked Chapters (landing), 28 Clipping Wall (daftar and the Work chapter), with motion and paper ideas from 11, 18, 21 and 22.
