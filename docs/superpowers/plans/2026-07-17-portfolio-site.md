# amirnoorafkan.com Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> Executor note: this plan is executed inline in the originating session, which holds the spec, Amir's resume/LinkedIn PDFs, and repo recon in context. Component tasks specify contracts + key code; visual internals follow the spec's design system (docs/superpowers/specs/2026-07-17-portfolio-site-design.md).

**Goal:** Ship the new single-page interactive portfolio ("The Ledger") to a Firebase preview channel, ready for Amir's prod approval.

**Architecture:** Astro 5 static site, one React island (`Ledger`), typed content data files, hand-written CSS with custom-property theming (dark default + light), tiny vanilla scripts for motion. Build artifacts deploy to existing Firebase Hosting site via preview channel.

**Tech Stack:** Astro 5 + @astrojs/react + @astrojs/sitemap, TypeScript strict, Fontsource (Space Grotesk / Inter / JetBrains Mono), sharp (image + OG generation), puppeteer-core (resume PDF via system Chrome), firebase-tools CLI (already installed + authed).

## Global Constraints

- Positioning: neutral personal site — no hire-me copy, no availability signals, no contact form.
- Sensitive: no Dubai/war/setback content; Aecon exit = "left to go independent"; no negative framing of Aecon.
- BJ ERP never referenced (no context on record) — current work copy is "building products with AI."
- Real numbers only: `$160M+` total Aecon portfolio, `~$120M` York+Goreway BESS combined, exit August 2025.
- Palette dark: `#0B0E14` bg, `#131826` surface, `#2A3245` line, `#8A93A6` muted, `#E6EAF2` text, `#FFB224` accent. Light: `#FAF7F2` bg, `#FFFFFF` surface, `#E4DFD5` line, `#6B7280` muted, `#171A21` text, `#B87400` accent.
- All motion behind `prefers-reduced-motion: no-preference`; content readable with JS disabled.
- JS budget < 50KB gzipped total; Lighthouse target 100s (floor 95).
- No external CDNs at runtime (fonts self-hosted).
- Old repo AmirNcode/amir-nrfkn-site is never consulted or copied.
- Commit after every task (messages: conventional, `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`).

---

### Task 1: Scaffold Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` (stub), `.gitignore`, `public/favicon.svg`

**Interfaces:**
- Produces: running Astro 5 project, `npm run dev` / `npm run build` green; React + sitemap integrations registered; `site: "https://amirnoorafkan.com"` set in config.

- [ ] **Step 1:** `node --version` (need ≥ 20; abort and report if older). `npm create astro@latest . -- --template minimal --no-git --install --yes` then `npx astro add react sitemap --yes`.
- [ ] **Step 2:** Install deps: `npm i @fontsource/space-grotesk @fontsource/inter @fontsource/jetbrains-mono && npm i -D sharp puppeteer-core`.
- [ ] **Step 3:** Set in `astro.config.mjs`: `site: 'https://amirnoorafkan.com'`, integrations `[react(), sitemap()]`. tsconfig: `"strict"` preset (astro strict template default).
- [ ] **Step 4:** Verify: `npm run build` → exits 0, `dist/index.html` exists.
- [ ] **Step 5:** Commit `chore: scaffold astro 5 project with react + sitemap`.

### Task 2: Design tokens, base layout, nav + footer shell

**Files:**
- Create: `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/Nav.astro`, `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces: `BaseLayout` props `{ title: string; description: string }`; CSS custom props `--bg --surface --line --muted --text --accent --font-display --font-body --font-mono`; `[data-theme="light"]` overrides; `.container` (max-width 1100px, padding-inline clamp).

- [ ] **Step 1:** `global.css`: `:root` dark palette custom props + light overrides under `[data-theme="light"]`; font stacks; reset (box-sizing, margin 0); base type scale (`clamp()` for h1 2.5–4.5rem); `.container`; focus-visible ring in accent; `@media (prefers-reduced-motion: reduce) { *{animation:none!important;transition:none!important} }`.
- [ ] **Step 2:** `BaseLayout.astro`: imports fontsource css (`space-grotesk/500,700`, `inter/400,500`, `jetbrains-mono/400,500` latin) + global.css; `<head>` with charset/viewport/title/description; inline theme script BEFORE any paint:

```html
<script is:inline>
  const t = localStorage.getItem('theme') ??
    (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.dataset.theme = t;
</script>
```

- [ ] **Step 3:** `Nav.astro`: sticky top bar — mono "AN" wordmark (links `#top`), right side: battery SVG (scroll gauge, `id="battery-fill"`) + theme toggle button (`id="theme-toggle"`, aria-label "Switch theme"). Inline script at end of BaseLayout body: toggle writes `localStorage.theme` + dataset; scroll listener (passive, rAF-throttled) sets battery fill width = scroll %.
- [ ] **Step 4:** `Footer.astro`: links email (`mailto:amir.dev21@gmail.com`), GitHub (`https://github.com/AmirNcode`), LinkedIn (`https://www.linkedin.com/in/amirnoorafkan`), Resume (`/AmirNoorafkan_Resume.pdf`); colophon "Designed & built by Amir · Astro · Firebase"; `Updated <build date>` via `new Date()` at build.
- [ ] **Step 5:** Verify in browser (preview_start dev server): dark default, toggle flips + persists on reload, no flash-of-wrong-theme, battery fills on scroll (temp tall page), 375px + 1280px sane.
- [ ] **Step 6:** Commit `feat: base layout, theming, nav battery gauge, footer`.

### Task 3: Content data files

**Files:**
- Create: `src/data/profile.ts`, `src/data/projects.ts`, `src/data/ledger.ts`

**Interfaces:**
- Produces (consumed by all section components):

```ts
// profile.ts
export const profile = {
  name: 'Amir Noorafkan',
  location: 'Toronto, Canada',
  tagline: 'I build web apps — and I’ve run the numbers on nine-figure construction.',
  email: 'amir.dev21@gmail.com',
  github: 'https://github.com/AmirNcode',
  linkedin: 'https://www.linkedin.com/in/amirnoorafkan',
  resume: '/AmirNoorafkan_Resume.pdf',
  stats: [
    { value: 160, prefix: '$', suffix: 'M+', label: 'in projects managed' },
    { value: 3, suffix: '', label: 'apps shipped & live' },
    { value: 2, suffix: '', label: 'battery storage projects' },
    { value: 1, suffix: '', label: 'business powered' },
  ],
} as const;

// projects.ts
export type Project = {
  slug: string; title: string; pitch: string; description: string;
  tech: string[]; live: string; source: string; shot: string; shotAlt: string;
};
export const projects: Project[] = [ /* worldcup, hausofballoons, simpleqr — copy per spec §Sections.3, facts from repo recon only */ ];

// ledger.ts
export type LedgerEntry = {
  period: string; title: string; value?: string; detail: string; confirm?: boolean;
};
export const ledger: LedgerEntry[] = [ /* newest→oldest per spec §Sections.4 */ ];
```

- [ ] **Step 1:** Write all three files with full real content. Ledger entries: (now) independent — building products with AI, running Haus of Balloons tech; 2025 YouTube channel on investing started; Aug 2025 left Aecon → independent + travel; York + Goreway BESS `~$120M`; Aecon cost control tenure `$160M+` portfolio; earlier roles + education transcribed from resume/LinkedIn PDFs (in-context) — any entry whose dates aren't explicit in the PDFs gets `confirm: true`; one entry per shipped app (year from GitHub `created_at` via `gh api repos/AmirNcode/<repo> --jq .created_at` — fall back to `curl https://api.github.com/repos/...` if `gh` absent).
- [ ] **Step 2:** Verify: `npx astro check` clean (types compile, no unused).
- [ ] **Step 3:** Commit `feat: profile, projects, ledger content data`.

### Task 4: Hero + S-curve + stats strip

**Files:**
- Create: `src/components/Hero.astro`, `src/components/Stats.astro`, `src/scripts/countup.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `profile` from Task 3.
- Produces: `<Hero />` (no props), `<Stats />` (no props); sections with `id="top"`, `id="stats"`.

- [ ] **Step 1:** `Hero.astro`: kicker (mono, accent, letterspaced) → `<h1>Amir Noorafkan</h1>` → tagline → links row (GitHub / LinkedIn / Email / Resume, underline-on-hover). Background: absolutely-positioned SVG — faint grid lines (`--line` at low opacity) + S-curve path, animated via CSS `stroke-dasharray/dashoffset` keyframe (1.4s ease-out, runs once; static full curve under reduced-motion). Amber underline bar after tagline animates scaleX on load.
- [ ] **Step 2:** `Stats.astro`: grid (2-col mobile / 4-col ≥720px) of mono numerals + labels from `profile.stats`, each numeral `data-target/prefix/suffix`. `countup.ts`: IntersectionObserver, on first intersect animate 0→target over 900ms (rAF, ease-out cubic, integers via `Math.round`); reduced-motion or no-JS → server-rendered final values already in markup (script only animates, never required for correctness).
- [ ] **Step 3:** Verify in browser: curve draws once, counts run once on scroll-into-view, values end exactly `$160M+ / 3 / 2 / 1`, reduced-motion (emulate via resize_window colorScheme? no — toggle via macOS setting unavailable: verify by forcing `@media` in devtools `javascript_tool` matchMedia check) shows static finals, mobile layout clean.
- [ ] **Step 4:** Commit `feat: hero with s-curve animation and count-up stats`.

### Task 5: Project screenshots + cards

**Files:**
- Create: `scripts/capture-shots.mjs`, `src/assets/shots/{worldcup,hausofballoons,simpleqr}.png` (raw) → emitted responsive images via `astro:assets`; `src/components/ProjectCard.astro`, `src/components/Projects.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `projects` from Task 3.
- Produces: `<Projects />` section `id="projects"`; `ProjectCard` props `{ project: Project }`.

- [ ] **Step 1:** `capture-shots.mjs`: puppeteer-core, `executablePath` from mac Chrome default (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`, error with instructions if missing), viewport 1280×800 deviceScaleFactor 2, goto each live URL (`networkidle2`), full-viewport PNG → `src/assets/shots/`. Run it. Fallback if capture fails for a site: styled placeholder frame (surface bg + mono title) noted in PR/report.
- [ ] **Step 2:** `ProjectCard.astro`: browser-chrome frame (3 dots + mono domain bar) around `<Image>` (astro:assets, widths [400,800], loading lazy, explicit aspect), title + external-link glyph, pitch, description, tech chips (mono, bordered), links "Live ↗" + "Source ↗". Hover: translateY(-3px) + accent border sweep (CSS gradient border-image or ::after sweep), transition 200ms.
- [ ] **Step 3:** `Projects.astro`: `<h2>Projects</h2>` + 1-col mobile / 3-col ≥960px grid.
- [ ] **Step 4:** Verify: images crisp on retina, lazy-loaded, no CLS (explicit dimensions), links correct, keyboard focus visible.
- [ ] **Step 5:** Commit `feat: project cards with live screenshots`.

### Task 6: Ledger island

**Files:**
- Create: `src/components/Ledger.tsx`, `src/components/LedgerSection.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `ledger` from Task 3.
- Produces: `<LedgerSection />` (`id="ledger"`) rendering `<Ledger client:visible entries={ledger} />`.

- [ ] **Step 1:** `Ledger.tsx`: list of rows — grid `[period | title | value]`, period+value mono (value in accent), amber left rule on hover/expanded. Row = `<button aria-expanded>` toggling detail panel (`grid-template-rows 0fr→1fr` transition; no height hacks). Entries with `confirm: true` render normally (flagging happens in report, not UI). Keyboard: native button semantics suffice.
- [ ] **Step 2:** SSR fallback: Astro renders the same rows with details visible inside `<noscript>`? No — simpler per spec: island renders server-side via Astro's React SSR (default), initial state first row expanded, others collapsed; content is in the HTML payload regardless (collapsed via CSS only when JS hydrates — set `data-hydrated` on mount, CSS collapses only under `[data-hydrated]`). Details remain visible when JS never runs.
- [ ] **Step 3:** Verify: expand/collapse smooth, aria-expanded toggles, tab order sane, JS-disabled page (devtools) shows all details, mobile grid stacks `[period+value / title]` cleanly.
- [ ] **Step 4:** Commit `feat: interactive ledger timeline island`.

### Task 7: About section + polish pass

**Files:**
- Create: `src/components/About.astro`
- Modify: `src/pages/index.astro`, `src/styles/global.css`

**Interfaces:**
- Produces: `<About />` (`id="about"`); final assembled page order Hero→Stats→Projects→Ledger→About→Footer.

- [ ] **Step 1:** About copy (first person, ~120 words): Toronto; a decade around construction numbers → taught himself to build software; ran cost control on $160M of heavy construction incl. two grid-scale battery projects; now builds web apps and runs the tech behind a family events business; likes automating things end-to-end. Neutral close: "This site doubles as my own ledger — a running record of what I've built." No CTA.
- [ ] **Step 2:** Polish: section spacing rhythm (`clamp(4rem,10vw,7rem)`), scroll-margin-top for anchored headings, selection color accent, subtle section-heading mono index (`01 /`, `02 /`…), smooth-scroll (media-gated).
- [ ] **Step 3:** Verify both themes / both widths again end-to-end; fix contrast issues (light-theme accent `#B87400` on `#FAF7F2` ≥ AA for text usage; amber `#FFB224` only decorative in light theme).
- [ ] **Step 4:** Commit `feat: about section and global polish`.

### Task 8: SEO layer

**Files:**
- Create: `scripts/make-og.mjs`, `public/og.png` (generated), `public/robots.txt`, `src/pages/404.astro`
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Produces: head meta complete; `https://amirnoorafkan.com/sitemap-index.xml` (integration) referenced by robots.txt.

- [ ] **Step 1:** `make-og.mjs`: sharp renders 1200×630 SVG template (ink bg, grid, amber S-curve, "Amir Noorafkan" Space Grotesk (embed font file as base64 in SVG), "Engineer & Developer · Toronto" mono) → `public/og.png`. Run it.
- [ ] **Step 2:** BaseLayout head: canonical (`Astro.site` + pathname), description "Amir Noorafkan — engineer and developer in Toronto. Ran cost control on $160M of construction including two grid-scale battery storage projects; now builds web apps.", OG/Twitter tags (`summary_large_image`, absolute og.png URL), theme-color both schemes, JSON-LD:

```json
{ "@context": "https://schema.org", "@type": "Person",
  "name": "Amir Noorafkan", "url": "https://amirnoorafkan.com",
  "jobTitle": "Engineer & Developer",
  "address": { "@type": "PostalAddress", "addressLocality": "Toronto", "addressCountry": "CA" },
  "sameAs": ["https://github.com/AmirNcode", "https://www.linkedin.com/in/amirnoorafkan"] }
```

- [ ] **Step 3:** `robots.txt`: allow all + `Sitemap: https://amirnoorafkan.com/sitemap-index.xml`. `404.astro`: mono "404 — line item not found" + link home (on-theme joke, one line).
- [ ] **Step 4:** Verify: `npm run build`; grep dist/index.html for canonical/og/json-ld; sitemap-index.xml present; paste JSON-LD into validator.schema.org via browser — passes.
- [ ] **Step 5:** Commit `feat: seo meta, json-ld, og image, sitemap, 404`.

### Task 9: Resume PDF

**Files:**
- Create: `resume-src/resume.html` (print-styled, self-contained), `scripts/make-resume-pdf.mjs`, `public/AmirNoorafkan_Resume.pdf` (generated, committed)

**Interfaces:**
- Produces: `/AmirNoorafkan_Resume.pdf` served statically; linked from Hero + Footer (already wired via `profile.resume`).

- [ ] **Step 1:** `resume.html`: single-page A4/Letter, restrained print design (ink on white, amber rules, Inter/JetBrains Mono via same fontsource files linked relatively). Content rebuilt from the two PDFs in context + new facts: header (name, Toronto, email, site, GitHub, LinkedIn); summary line; Experience — Independent (Aug 2025–present: web apps incl. the three shipped projects, tech operations for Haus of Balloons); Aecon Cost Control Analyst (dates from LinkedIn PDF → Aug 2025; York + Goreway BESS ~$120M, portfolio $160M+, forecasting/reporting/progress-measurement bullets from old resume, plus an automation bullet); earlier roles + education + skills transcribed from PDFs. Anything uncertain → mark in report for Amir's preview review (not in the PDF as placeholder — use only facts the PDFs state).
- [ ] **Step 2:** `make-resume-pdf.mjs`: puppeteer-core (same Chrome path helper as Task 5), `page.pdf({ format: 'Letter', printBackground: true })` → `public/AmirNoorafkan_Resume.pdf`. Run; open PDF (Read tool renders) and check: one page, no orphan lines, fonts embedded.
- [ ] **Step 3:** Commit `feat: rebuilt resume + pdf generation script`.

### Task 10: Firebase config + preview deploy + verification

**Files:**
- Create: `firebase.json`, `.firebaserc`

**Interfaces:**
- Produces: live preview channel URL for Amir; verification report.

- [ ] **Step 1:** `firebase projects:list` + `firebase hosting:sites:list --project <id>` → identify existing project/site serving amirnoorafkan.com. `.firebaserc` default = that project.
- [ ] **Step 2:** `firebase.json`:

```json
{ "hosting": { "public": "dist", "cleanUrls": true,
  "ignore": ["firebase.json", "**/.*"],
  "headers": [
    { "source": "/_astro/**", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "**/*.@(png|webp|avif|svg|woff2|pdf)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=604800" }] }
  ] } }
```

- [ ] **Step 3:** `npm run build` → `firebase hosting:channel:deploy preview --expires 30d`. Capture channel URL.
- [ ] **Step 4:** Verify against preview URL: Lighthouse (mobile + desktop) via `npx lighthouse` — all ≥95, record scores; click-through every external link (2 live sites, 3 repos, LinkedIn, mailto renders); JS bundle size check (`du` on dist `_astro/*.js` gzipped < 50KB); both themes; 375px/1280px.
- [ ] **Step 5:** Commit `chore: firebase hosting config`. Report to Amir: preview URL, Lighthouse scores, `confirm:true` content items, resume PDF link. **STOP — prod deploy only after Amir's explicit approval.**

### Task 11 (gated): Production deploy

- [ ] After Amir approves preview: `firebase deploy --only hosting`, verify https://amirnoorafkan.com serves new site (curl title + browser check), suggest Search Console re-index. Commit any final content tweaks first.
