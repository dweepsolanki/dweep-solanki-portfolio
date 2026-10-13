# Dweep Solanki — Portfolio

Single-page portfolio built with Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS and Framer Motion, deployed on Vercel at <https://dweep-solanki-portfolio.vercel.app>.

---

## 1. Run it

Requires Node 18+.

```bash
npm install
npm run dev         # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run build` | Production build |
| `npm run start` | Serve the production build (`-p <port>` to change port) |
| `npm run lint` | ESLint (`next/core-web-vitals` + one project rule, see §5) |
| `npm run typecheck` | `tsc --noEmit` (strict) |

No backend and no required environment variables. Optional: `NEXT_PUBLIC_SITE_URL` overrides the production URL used for canonical links, the sitemap and the social card (see `lib/siteConfig.ts`).

Self-hosting note: on Vercel, image optimization works out of the box. If you run `next start` elsewhere, install `sharp` (`npm i sharp`) — without it Next.js falls back to a much slower image encoder.

---

## 2. Where things live

```text
app/
  layout.tsx            root layout, metadata, fonts (Inter + JetBrains Mono via next/font)
  page.tsx              renders <SiteShell />
  globals.css           Tailwind entry, font variables, shared keyframes, focus styles
  opengraph-image.tsx   1200×630 social preview card, generated at build time
  icon.png, apple-icon.png   favicon (192px) and Apple touch icon (180px)
  robots.ts, sitemap.ts

components/
  SiteShell.tsx         top-level client component; owns the single page-wide useScroll()
  chapter/              ChapterEnvironment (scroll-driven background), ChapterMarker, ScrollProgressBar
  motion/               Reveal, Stagger, MagneticButton, CountUp, GridDistort, useReducedMotionSafe
  nav/Nav.tsx           fixed header, active-section underline, mobile menu
  sections/             one component per chapter, in page order
  terminal/             the ~/dweep terminal (boot sequence, commands, history, mobile chips)

data/                   all copy: projects, recognitions, timeline, thinking posts, "beyond" cards
lib/
  chapters.ts           chapter colors / glow / grain, and the waypoint measurement
  siteConfig.ts         production URL
  useLockBodyScroll.ts  stops page scroll behind dialogs
```

### Design rules the code relies on

- **One background.** `ChapterEnvironment` is the only thing that paints the page background. Sections stay transparent so the color changes continuously instead of in blocks.
- **Copy lives in `data/`.** Components read from `data/*.ts`; editing text should never require touching a component. The terminal's `projects` command also reads `data/projects.ts`.
- **GSAP is isolated to `JourneyDesktop.tsx`** and dynamically imported, so only desktop visitors who reach the Journey section load it. Everything else uses Framer Motion.

---

## 3. Common edits

| Task | Where |
|---|---|
| Add or edit a project | `data/projects.ts`. Put the image in `public/images/projects/`. For the expanded panel, use `treatment: 'diagram'` with a `diagram` (rendered by `ProjectDiagram.tsx`), or `'redacted'` / `'quiet'`. |
| Update a "How it works" diagram | The `diagram` on that project in `data/projects.ts`. Each one is mapped from the project's public repository (the source files are named in a comment above it) — re-check against the code when the repo changes, and don't describe anything the code doesn't do. |
| Add a LinkedIn post | `data/thinkingPosts.ts`. See the comment there for how `date` is decoded from the post URL. |
| Change a chapter's color | `lib/chapters.ts` only. |
| Add a new chapter | Add the section with an `id`, then add a waypoint in `lib/chapters.ts` with that id as `sectionId`. |
| Change the headline / role | `components/sections/Hero.tsx`, `TITLE` in `app/layout.tsx`, `WHOAMI` in `components/terminal/useTerminalCommands.ts`, and the text in `app/opengraph-image.tsx`. |

---

## 4. How the background works

Each waypoint in `lib/chapters.ts` maps a color/glow/grain to a section (`sectionId`). On load, and whenever the page height changes, `ChapterEnvironment` measures where each section's center falls in the total scroll range and interpolates between those points. The hero is pinned to 0 and Contact to 1, so the page starts and ends on the same graphite.

The measurement is necessary because section heights differ a lot between desktop and mobile, and the pinned Journey timeline adds scroll length on desktop only. The `progress` fractions in `chapters.ts` are just a fallback until the first measurement.

---

## 5. Gotchas

**Use `useReducedMotionSafe`, never Framer's `useReducedMotion`.** Framer's hook returns `null` on the server but `true` on the client for reduced-motion visitors, so any component that renders differently based on it breaks hydration (React errors #418/#423). `useReducedMotionSafe` returns `false` until mount. A lint rule blocks direct imports of the Framer hook.

**Don't attach a viewport trigger to an element whose initial transform moves it out of view.** `Reveal`'s mask variant observes the untransformed outer wrapper and passes the in-view state to the translated inner element via variants. Observing the inner element directly means it never counts as "in view", and every masked headline stays invisible.

**Don't put CSS transitions or hover transforms on an element Framer Motion moves.** Motion writes the element's inline `transform` every frame, so a CSS `transition` makes it lag and a Tailwind `hover:translate-*` never applies. Put the hover effect on an inner element (see `ThinkingCard.tsx`) or use `whileHover` (see `PersonalReveal.tsx`).

**Cards use a stretched button, not `role="button"`.** In `ProjectCard.tsx` the title is a real `<button>` whose `::after` overlay covers the card. Anything else clickable inside the card (the GitHub link) needs `relative z-10` to sit above that overlay.

**Server-rendered numbers must be locale-fixed.** `CountUp` formats with `toLocaleString('en-US')`; an unpinned locale renders differently on server and client.

**Don't unmount `JourneyDesktop` across the breakpoint.** GSAP's pin wraps the element in its own spacer, and React unmounting it mid-pin throws `removeChild` errors. `Journey.tsx` keeps it mounted and toggles it with CSS. The long comment in `JourneyDesktop.tsx` explains the history.

---

## 6. Accessibility

- `prefers-reduced-motion` is respected everywhere: masked reveals, parallax, the progress bar, the hero grid and the chapter background are disabled; the count-up shows its final value.
- Dialogs (project panel, thinking panel, terminal) trap focus, close on `Escape` or a backdrop click, restore focus to the trigger, and lock page scroll while open.
- The terminal: `Tab` autocompletes, `Shift+Tab` moves focus back to the close button and output links, `↑`/`↓` walk history. Below the `md` breakpoint it shows tappable command chips instead of a text input.
- Chapter labels (`02 / HUMAN`) are `aria-hidden` spans next to the real headings.
- Below the `md` breakpoint the header shows a MENU button with the section links.

---

## 7. Before you deploy

```bash
npm run typecheck && npm run lint && npm run build
```

There's no automated test suite. Before a release, check at least: the site in a desktop and a ~390px-wide window, with reduced motion turned on in your OS (no console errors), opening and closing a project card and a Thinking card, and the terminal.

---

## 8. Known gaps

- **Google post excerpt** in `data/thinkingPosts.ts` is a neutral placeholder built only from the post's hashtags. Replace it with the post's real summary.
- **Thinking post excerpts** in general are conservative summaries, not quotes — LinkedIn blocks automated fetching of post text, so none were copied.
- **Cross-browser:** the GSAP-pinned Journey timeline has been tested in Chromium only; check Safari and Firefox with a real trackpad before major releases.
- **SecureShareVault is a prototype:** its post-quantum step is simulated in the repository (`kyberMock`; the file key is stored unwrapped) and it encrypts with AES-256-CBC. The card and diagram say so. If the repo gains real ML-KEM key encapsulation and AES-GCM, update its `footerNote` and the "Wrap the key" step.
- **Social card font:** `opengraph-image.tsx` uses the image renderer's built-in font (regular weight only). Embedding Inter as a TTF would let the name render bold.
