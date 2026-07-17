# amirnoorafkan.com — Portfolio Rebuild Design Spec

Date: 2026-07-17 · Status: approved by Amir (design presented in chat, "Design looks good")

## Goals

1. Rank #1 on Google for "Amir Noorafkan" (employers, contract/consulting leads).
2. Portfolio: showcase three shipped projects with live + source links.
3. Personal achievement record ("The Ledger") — Amir's own reminder of what he's done.
4. Interactive, mobile-first, excellent on desktop. Memorable, technically credible.
5. Keep Firebase Hosting + existing domain.

## Non-goals (V1)

- No hire-me framing, no availability signal, no services page (positioning: neutral personal site).
- No contact form, no headshot, no blog (explicitly declined). Contact = plain email/LinkedIn/GitHub links.
- No CMS. Content lives in typed data files.
- Old repo (AmirNcode/amir-nrfkn-site) is not reused in any form.

## Content rules (sensitive)

- Aecon exit framed positively: "left to go independent / build things." Never mention disliking the work or the company.
- Dubai move / Middle East war / personal setback: **off the site entirely.** Timeline says: left Aecon Aug 2025, went independent, traveled.
- BJ ERP: not referenced until Amir supplies a description (no context on record). Current-work copy: "building products with AI."
- Numbers must be real: ~$160M total Aecon portfolio; York BESS + Goreway BESS ~$120M combined (Capital Power). No invented metrics (no fake user counts, etc.).
- Haus of Balloons framed as: built and runs the tech stack (site, email, invoicing) for a real events business (his wife's company).

## Concept: "The Ledger"

Cost-control aesthetic as design language. A cost engineer's ledger, rebuilt as a modern
interactive site: mono-spaced numerals, line items, S-curves, a battery gauge.

### Visual system

- **Dark theme default**, light theme via toggle; respects `prefers-color-scheme` on first visit, persists choice in `localStorage`.
- Palette (dark): bg `#0B0E14`, surface `#131826`, line `#2A3245`, muted `#8A93A6`, text `#E6EAF2`, accent amber `#FFB224`.
- Palette (light): warm paper `#FAF7F2`, surface `#FFFFFF`, line `#E4DFD5`, muted `#6B7280`, text `#171A21`, accent `#B87400` (darkened amber for AA contrast on light).
- Type: Archivo Variable (headings, wide/heavy cuts), IBM Plex Sans (body), IBM Plex Mono (numbers, dates, labels, chips). Self-hosted via Fontsource — no external font CDN. (Swapped from the mockup's Space Grotesk/Inter/JetBrains during build for a more distinctive, engineering-heritage pairing.)
- WCAG AA contrast minimum everywhere, both themes.

### Sections (single page, in order)

1. **Hero** — "Amir Noorafkan" oversized; kicker "TORONTO, CANADA"; tagline: "I build web apps — and I've run the numbers on nine-figure construction." Links row: GitHub, LinkedIn, email, resume PDF. Background: blueprint grid + S-curve that draws itself on load (SVG stroke animation).
2. **Stats strip** — mono numerals counting up on scroll-into-view: `$160M+` projects managed · `3` apps shipped · `2` BESS projects · `1` business powered. Labels in plain language beneath.
3. **Projects** — three cards: World Cup 2026 Teams & Stats, Haus of Balloons, SimpleQR. Each: screenshot thumbnail, one-line pitch, 2-3 sentence description, tech chips, links (Live ↗, Source ↗). Real facts from the repos (React 18/Vite/PWA/ESPN API; static HTML/CSS/JS/Netlify Forms/Resend; React/TS/qr-code-styling).
4. **The Ledger** — career + achievements timeline as expandable line items. Mono date column, entry title, amber "value" column where a real number exists. Tap/click row → expands with 1-3 sentence detail. Entries (newest first): now/building with AI + running HoB tech; YouTube channel started (investing focus); left Aecon Aug 2025 → independent + travel; York + Goreway BESS ~$120M (2023–2025, exact dates from resume/LinkedIn PDFs at build time); Aecon cost control ~$160M portfolio total (start date from resume); earlier roles + education (from resume PDFs); each shipped app as its own entry (dates from GitHub repo history).
5. **About** — short, human, first person. Toronto. Numbers → code arc. Likes: automating things, building tools, learning in public. Neutral close (no CTA).
6. **Footer** — email, GitHub, LinkedIn, resume PDF; colophon "Designed + built by me. Astro · Firebase."; last-updated stamp (build date).

### Interactivity

- S-curve hero draw-on-load; battery icon in sticky nav fills with scroll progress (BESS nod).
- Stat count-up on first scroll into view (IntersectionObserver, vanilla).
- Ledger rows expand/collapse (the one React island).
- Theme toggle (vanilla inline script in `<head>` to avoid theme flash).
- Card hover lift + accent border sweep (CSS only).
- All motion gated behind `prefers-reduced-motion: no-preference`; site fully usable with JS disabled (rows default open via `<details>` semantics or noscript-visible content).

## Architecture

- **Astro 5**, static output. One page (`/`) + generated `sitemap.xml`, `robots.txt`, `404.html`.
- **React island**: `Ledger.tsx` only (`client:visible`). Everything else zero-JS or small vanilla scripts.
- Content as typed data: `src/data/projects.ts`, `src/data/ledger.ts`, `src/data/profile.ts` (links, tagline, stats). Site copy separated from markup for easy edits.
- Components: `Hero.astro`, `Stats.astro`, `ProjectCard.astro`, `Ledger.tsx`, `About.astro`, `Footer.astro`, `Nav.astro`, `BaseLayout.astro`.
- Styling: hand-written CSS (matches Amir's no-framework habit), CSS custom properties for theming, one global stylesheet + component-scoped styles.
- Images: project screenshots captured from live sites, stored as optimized AVIF/WebP with fallback, explicit dimensions (no CLS).

## SEO

- `<title>Amir Noorafkan — Engineer & Developer in Toronto</title>`; meta description mentioning cost control, web apps, Toronto.
- JSON-LD `Person`: name, url, sameAs [GitHub, LinkedIn], jobTitle "Engineer & Developer", address Toronto/CA.
- Canonical `https://amirnoorafkan.com/`; OG + Twitter card with generated OG image (name + amber curve on ink, 1200×630).
- Semantic HTML (single `h1`, ordered `h2`s), descriptive alt text, sitemap + robots.
- Perf budget: Lighthouse 100/100/100/100 target; total JS < 50KB gzipped (actual: 61KB — React runtime for the Ledger island; Lighthouse perf still 100, accepted); fonts subset + `font-display: swap`.
- Firebase: `cleanUrls`, long-cache immutable assets, 404 page. Post-launch (Amir's side): Search Console re-index request.

## Resume PDF

- Content rebuilt fresh: Jan 2024 resume + LinkedIn PDF + new facts ($160M portfolio, BESS projects, Aug 2025 exit, independent work since).
- Built as a print-styled HTML page in-repo, rendered to `public/AmirNoorafkan_Resume.pdf` via headless Chromium at build time (script, not committed binary-only — regenerable).
- Linked from hero + footer. Dated 2026.

## Deploy

- `firebase.json` + `.firebaserc` targeting Amir's existing Firebase project (discover via `firebase projects:list`).
- **Always preview channel first** (`firebase hosting:channel:deploy`), share URL, get Amir's explicit OK, then `firebase deploy --only hosting` to production. Prod overwrites the live site — never without approval.

## Verification

- `astro build` clean; `astro check` (TS) clean.
- Browser pass: mobile 375px + desktop 1280px, both themes, reduced-motion on/off, keyboard nav through Ledger.
- Lighthouse run on preview URL (target 100s, minimum ≥95 each).
- Link check: all external links (2 live sites + 3 repos + LinkedIn + mailto) resolve.
- Validate JSON-LD (schema.org validator) and OG tags.

## Open items

- BJ ERP one-liner from Amir → optional Ledger entry before or after launch (site ships without it).
- Exact dates for earlier roles/education pulled from resume/LinkedIn PDFs during content build; anything ambiguous gets flagged to Amir at preview review rather than guessed.
