# Dweep Solanki — Portfolio (Production Implementation)

Next.js + React + TypeScript implementation of the Dweep Solanki portfolio, built from:

1. **Visual source of truth** — the live Framer site (`good-condor-027934.framer.app`)
2. **Motion/interaction source of truth** — the approved *Dweep Solanki Portfolio — Design, Motion & Technical Specification*

This README is written for whoever continues this project next (referred to below as "Codex" per the handoff brief), not just as a changelog.

---

## 1. How to install and run

Requires Node 18+ (built and tested on Node 22).

```bash
npm install
npm run dev        # http://localhost:3000, hot reload
```

Other scripts:

```bash
npm run build       # production build
npm run start        # serve the production build (defaults to :3000; pass -p <port> to change)
npm run lint          # ESLint (next/core-web-vitals) — currently clean
npm run typecheck   # tsc --noEmit (strict mode) — currently clean
```

No environment variables or external services are required. There is no backend — the terminal, project panels, and chapter environment are all client-side state.

---

## 2. Architecture

```text
app/
  layout.tsx          — root layout, metadata, font variables
  page.tsx             — renders <SiteShell />
  globals.css          — Tailwind entry + shared keyframes (status pulse, terminal caret, grain texture, focus ring)

components/
  SiteShell.tsx        — top-level client component: mounts ChapterEnvironment, Nav, all sections, Terminal, owns terminal open/close state

  chapter/
    ChapterEnvironment.tsx  — the single, continuous, scroll-driven background (spec §3). useScroll + useTransform interpolate
                              background/glow/grain across the waypoints in lib/chapters.ts. Reduced-motion fallback is a flat graphite div.
    ChapterMarker.tsx        — renders "0X / NAME" labels, marked up as a decorative span next to the real heading (not the heading itself)

  motion/
    Reveal.tsx           — shared viewport-triggered reveal primitive. variant="fade" (translate+opacity) or variant="mask"
                            (the premium clip-path headline wipe). See §5 below for an important implementation note.
    Stagger.tsx           — <Stagger>/<StaggerItem> for staggered group entrances
    MagneticButton.tsx     — pointer-attraction wrapper for primary CTAs, no-ops under reduced-motion/touch
    CountUp.tsx            — numeral count-up, used once (Proof of Work's "5,000+" figure)
    GridDistort.tsx        — hero-only pointer-reactive background grid, CSS-custom-property driven (no per-frame React state)

  sections/
    Hero.tsx, Human.tsx, Build.tsx, SelectedWork.tsx, ProjectCard.tsx, ProjectExpandedPanel.tsx,
    ProjectTreatment.tsx, Proof.tsx, Journey.tsx, JourneyDesktop.tsx, JourneyMobile.tsx,
    Beyond.tsx, Thinking.tsx, RightNow.tsx, Contact.tsx
    — one component per chapter, matching the section order from the Framer site 1:1

  terminal/
    Terminal.tsx, TerminalLine.tsx, useTerminalCommands.ts
    — the interactive ~/dweep terminal: boot sequence, real command input (desktop), tappable chips (mobile)

  nav/
    Nav.tsx              — fixed header, section anchor links, terminal trigger

data/
  projects.ts             — the 6 case studies, typed, with a `treatment` field driving ProjectTreatment.tsx
  recognitions.ts         — Proof of Work entries, ranking preserved exactly (Second Place stays primary)
  timeline.ts              — the 4 Journey entries
  thinkingPosts.ts        — placeholder-safe schema exactly as specified (title/excerpt/date/topic/url/image)
  beyondCards.ts           — the 6 "Beyond the Job Title" cards, each with its own parallax factor

lib/
  chapters.ts               — single source of truth for chapter waypoints (progress/background/glow/grain).
                              ChapterEnvironment reads this array; edit colors/thresholds here only.
```

### Why this shape
- **One `<ChapterEnvironment>`, not per-section backgrounds.** Every section renders on a transparent background; the fixed, full-page environment behind everything is the only thing that ever sets a background color. This is what makes the scroll feel continuous instead of a stack of colored divs.
- **`data/*.ts` is the only place project/recognition/timeline copy lives.** Section components read from these files and never hardcode content inline, so editing copy never requires touching a component.
- **GSAP is isolated to one file** (`JourneyDesktop.tsx`), dynamically imported so its bundle cost is never paid by mobile users or by anyone who doesn't scroll that far. Everything else uses Framer Motion (`framer-motion` package — this is "Motion for React").

---

## 3. What was implemented (verified, not just described)

All of the following were built, then verified against a real production build running in a real headless browser (Playwright + Chromium) — not just visually inspected. See §7 for the exact validation results.

- **Chapter Environment** — continuous scroll-driven background interpolation across all 10 waypoints (graphite → indigo → graphite → dark graphite → warm charcoal → midnight slate → graphite → muted plum → graphite → graphite). Confirmed the loop: the Contact section's computed background exactly matches the Hero's.
- **Hero** — full staged reveal (status → chapter marker → masked headline → subhead → body → CTAs → terminal status block), cursor-reactive metadata, pointer-reactive grid distortion, scroll-linked compression, magnetic CTAs, and a non-looping keyword row (replaces the generic infinite marquee from the audit).
- **Chapter transition grammar** — every chapter heading (Human, Build, Selected Work, Journey, Beyond, Thinking, Right Now, Contact) uses the same masked-reveal primitive as the hero headline, confirmed firing correctly on all of them after the fix described in §5.
- **Selected Work** — all 6 projects, each opens into a shared-layout (`layoutId`) expanded case-study panel. Verified: opens on mouse click, opens on keyboard `Enter` while a card is focused, closes on `Escape`, closes on click-outside, and the "Next case study" control cycles content correctly. Each project renders its own `treatment` (sequence flow for Pension Pathfinder, connected flow diagram for RBI HaRBInger, redacted bars for YellowSense, sparkline for GTM Signal, typewriter spec-sheet for SecureShareVault, and a deliberately quiet/no-extra treatment for Project Mactus).
- **Proof of Work** — Second Place renders as the visually dominant entry with the medal scale/settle animation and a genuine count-up on "5,000+"; the three secondary recognitions render below it, smaller, no count-up. No CMS/placeholder text (e.g. "STATUS / SOURCE LINK READY") is present in the shipped copy.
- **Journey** — desktop renders a GSAP `ScrollTrigger`-pinned horizontal timeline with a synced progress marker on a guide line; mobile renders a separate vertical-timeline component (`JourneyMobile.tsx`), selected via a `matchMedia` check, not a CSS-only reflow of the same markup.
- **Beyond the Job Title** — all 6 cards, each with its own scroll-linked parallax factor and a restrained hover rotation/scale.
- **Thinking in Public** — fully data-driven from `thinkingPosts.ts` against the exact schema in the spec (`title/excerpt/date/topic/url/image`). No fabricated post content — see §4.
- **Terminal** — opens via the `~/dweep` nav trigger, runs the exact boot sequence from the spec (`whoami` → `ls` → `cat philosophy.txt`), then a real interactive prompt supporting `help`, `whoami`, `ls`, `cat philosophy.txt`, `contact` (renders real clickable links), `projects`, `clear`, `exit`, `Tab` autocomplete, `↑`/`↓` history, and an unknown-command message. Verified working via keyboard on desktop and via tappable command chips on mobile (no fake on-screen keyboard interaction is forced).
- **Accessibility** — `prefers-reduced-motion` fallback verified (content still renders, chapter environment falls back to flat graphite, no console errors); focus trap + focus restoration on both the project panel and the terminal; `Escape` closes both; visible focus rings site-wide; semantic heading hierarchy preserved (chapter markers are decorative spans next to real headings, not the headings themselves).
- **Mobile** — verified no horizontal overflow at 390px width; Journey correctly renders its vertical variant; terminal correctly renders tappable chips instead of a text input.
- **Performance discipline** — all scroll-linked animation uses `transform`/`opacity`/`background-color` through Motion's `useTransform`, driven off a single `useScroll` call per section rather than multiple independent scroll listeners; GSAP is code-split and only loaded on desktop when the Journey section mounts; pointer-driven hero effects use `useMotionValue`/CSS custom properties rather than per-frame React state.

---

## 4. Content integrity — what was NOT invented

Per the brief's explicit instruction, nothing was fabricated. Specifically:

- **All project descriptions, tags, and results in `data/projects.ts`** are transcribed from the live Framer site's actual copy — nothing was added or embellished.
- **Proof of Work entries in `data/recognitions.ts`** preserve the exact ranking and wording from the live site. Second Place is still described as the final result, not downgraded to "Top 12" or similar.
- **`data/thinkingPosts.ts` contains zero real post content.** Every entry is the literal placeholder (`"Title / Thought"`, `"Short excerpt"`, empty date) — no LinkedIn posts, titles, or excerpts were invented. The `url` field defaults to the real LinkedIn profile (`https://www.linkedin.com/in/dweep-solanki/`) so the placeholder cards are still functional links.
- **GitHub and email links in `Contact.tsx` and `TerminalLine.tsx` are placeholder `#` hrefs** — no GitHub URL or email address was available in the source material, so none was invented. **This is the one placeholder that needs a real value before shipping** (see §6).
- **No screenshots, client names, testimonials, or metrics were invented** for any project — where a real visual asset doesn't exist yet, the project card/panel shows a labeled placeholder slot (e.g. "EDITORIAL PRODUCT STUDY", "CONFIDENTIAL / NO CLIENT DATA") rather than a fabricated image.

---

## 5. Bug found and fixed during validation

**Masked headline reveal was permanently invisible on first load.** `Reveal`'s `variant="mask"` implementation originally attached Framer Motion's `whileInView` trigger directly to the inner element — the same element whose *initial* state is `transform: translateY(110%)` (pushed below the visible mask window as part of the wipe effect). Because Motion's viewport detection is based on the element's actual rendered (post-transform) position, that inner element was never considered "in view" at rest, so the reveal could never fire — a permanent deadlock, with no console error. This meant **every chapter headline sitewide, including "DWEEP SOLANKI" in the hero, was invisible** until this was found and fixed.

**Fix:** the `whileInView` trigger now lives on the *outer*, untransformed wrapper (which sits in its normal layout position), and its in-view state propagates to the transformed inner child via shared Motion `variants`. See `components/motion/Reveal.tsx` for the implementation and an inline comment explaining why.

This was caught by rendering the production build in a real headless browser and asserting on computed styles, not by visual inspection of a screenshot alone — screenshots taken mid-scroll-animation looked plausible even while the bug was present, which is why the fix is documented here for anyone extending `Reveal.tsx` in the future: **never attach a viewport/intersection trigger to an element whose own initial transform could move it out of the observed area.**

---

## 6. Remaining placeholders (need real values before shipping)

| Location | Placeholder | What's needed |
|---|---|---|
| `Contact.tsx`, `TerminalLine.tsx` | GitHub link (`href="#"`) | Real GitHub profile URL |
| `Contact.tsx`, `TerminalLine.tsx` | Email link (`href="#"`) | Real `mailto:` address |
| `data/thinkingPosts.ts` | All 6 entries are literal placeholders | Real, verified LinkedIn post data (title/excerpt/date/topic/url/image) |
| `ProjectCard.tsx` / `ProjectExpandedPanel.tsx` visual slots | Text-labeled placeholder boxes (e.g. "EDITORIAL PRODUCT STUDY") | Real project imagery, wired through `next/image` once assets exist — the aspect-ratio-locked slot is already sized so swapping in a real image won't cause layout shift |
| `app/layout.tsx` fonts | Falls back to system fonts (`system-ui`) | The Framer site's exact display/mono typefaces weren't identifiable from the recording alone — confirm the exact families and self-host them via `next/font/local` per the spec's "self-hosted fonts" requirement |
| `Contact.tsx` footer | `© 2026` is a placeholder | Confirm/replace with real copyright line if different |

None of these block `npm run build` or the site working correctly end-to-end — they're content/asset gaps, not code gaps.

---

## 7. Validation — exact commands and results

```bash
npx tsc --noEmit     → PASS, no errors
npm run lint          → PASS, "✔ No ESLint warnings or errors"
npm run build          → PASS
  Route (app)                              Size     First Load JS
  ┌ ○ /                                    59 kB           146 kB
  └ ○ /_not-found                          873 B          88.3 kB
  + First Load JS shared by all            87.4 kB
```

Additionally, a 35-point Playwright script (`/home/claude/pw-tests/validate.js` in the build environment, not part of the shipped repo) was run against the actual production server (`npm run start`) in a real Chromium instance and **passed 35/35**, covering:

- All 10 section headings/content strings present in the DOM
- Zero browser console errors and zero uncaught page errors, both on initial load and after a full programmatic scroll through the entire page
- Project panel: opens via click, opens via keyboard `Enter`, closes via `Escape`, closes via click-outside, "Next case study" correctly swaps content
- Terminal: opens, boot sequence completes with correct content, `help`/`contact`/unknown-command all behave correctly, `↑` history recall works, `Escape` closes it
- Mobile (390×844, touch emulation): no horizontal overflow, Journey section renders its mobile variant, terminal shows tappable chips instead of a keyboard, a chip tap executes its command, zero console errors
- `prefers-reduced-motion: reduce`: content still renders, the Chapter Environment correctly falls back to a flat color, zero console errors

A second, targeted check confirmed **no masked headline anywhere on the site is stuck in its hidden state** after scrolling through every chapter (the regression test for the bug in §5).

---

## 8. Known limitations

- **Fonts are currently system fallbacks**, not the self-hosted display/mono typefaces the spec calls for — see §6. `app/globals.css` already defines the `--font-display` / `--font-body` / `--font-mono` custom properties Tailwind consumes, so swapping in real fonts via `next/font/local` is a contained change (edit `app/layout.tsx` + point the CSS variables at the loaded fonts).
- **No real project imagery** — every visual slot is a labeled placeholder. Swapping in real assets should not require touching any layout code (slots are aspect-ratio-locked), but hasn't been tested with actual images.
- **The `treatment` visuals in `ProjectTreatment.tsx`** (sequence flow, flow diagram, redaction bars, sparkline, spec-sheet typewriter) are intentionally simple/decorative implementations matching the spec's "don't overengineer" guidance — they're real, working, but not exhaustively cross-browser tested beyond Chromium.
- **GSAP `ScrollTrigger` pin behavior on desktop** was verified via programmatic `mouse.wheel()` scrubbing in Playwright/Chromium, which confirmed the pin, horizontal scrub, and marker sync all work — but hasn't been tested against real trackpad/momentum-scroll input or in Safari/Firefox specifically. GSAP's pinning is generally more robust than a hand-rolled equivalent, but cross-browser QA on real devices is still worth doing before ship.
- **Terminal's hidden desktop `<input>`** renders a visible thin focus-ring rectangle when focused (by design — the site's global `:focus-visible` style is intentionally never suppressed, per the accessibility requirement not to remove focus indication without a replacement). This is a minor cosmetic detail, not a functional bug; if a fully invisible-but-still-accessible input is wanted, that would need a custom (non-default) focus treatment scoped to just this element.
- **Chapter background color calibration is approximate.** The waypoint colors in `lib/chapters.ts` are directionally correct per the spec (graphite → indigo → warm charcoal at Proof → plum at Thinking → back to graphite) and were confirmed to interpolate continuously and correctly, but exact hex values and the precise `progress` fraction at which each tone peaks should be fine-tuned against final content length and against the Framer build with an eyedropper, as the spec itself notes.
- **No automated test suite ships in the repo** — the Playwright validation described in §7 was run as an ad hoc verification pass in the build environment, not committed as a maintained test suite. Recommend adding it (or a trimmed version) as `tests/` + a `test` script if ongoing regression coverage is wanted.

---

## 9. Dependencies added

```json
"dependencies": {
  "next": "14.2.35",
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "framer-motion": "11.11.17",
  "gsap": "3.12.5",
  "lucide-react": "0.454.0",
  "clsx": "2.1.1"
},
"devDependencies": {
  "typescript": "5.6.3",
  "@types/react": "18.3.12",
  "@types/react-dom": "18.3.1",
  "@types/node": "22.9.0",
  "tailwindcss": "3.4.14",
  "postcss": "8.4.47",
  "autoprefixer": "10.4.20",
  "eslint": "8.57.1",
  "eslint-config-next": "14.2.15"
}
```

Notes:
- `next` was pinned to `14.2.35` (patched) rather than the originally-planned `14.2.15` after checking for the latest patch in the `14.2.x` line during setup.
- No Three.js/React Three Fiber, no additional animation libraries beyond `framer-motion` + the single scoped `gsap` usage, per the spec's explicit constraint.
- `clsx` is included as a small utility but is barely used yet — safe to remove if unwanted, or keep for future conditional className composition.

---

## 10. Notes for whoever continues this project (Codex)

- **Start with §6** (remaining placeholders) — those are the fastest path from "structurally complete" to "shippable."
- **`lib/chapters.ts` is the one file to touch for any background/color-timing adjustment** — don't hand-edit colors inside `ChapterEnvironment.tsx` itself, the waypoint array is the single source of truth by design.
- **If you add a 7th project**, add it to `data/projects.ts` with a `treatment` value from the existing union type — `ProjectExpandedPanel.tsx` and `ProjectTreatment.tsx` are already written to be reusable and shouldn't need changes.
- **If you touch `Reveal.tsx`**, re-read §5 first — it's a subtle bug class (transform-based initial state + viewport trigger on the same element) that's easy to reintroduce by accident in a future edit.
- **The GSAP usage is intentionally isolated to `JourneyDesktop.tsx`.** If you're tempted to reach for GSAP elsewhere, check the spec first — Motion covers everything else in this codebase by design, and adding GSAP elsewhere would work against the "don't overengineer" constraint it was built under.
- **Before deploying**, run through §7's commands once more (`typecheck` → `lint` → `build`) — all three were clean at handoff time.
