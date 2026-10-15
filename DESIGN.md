# Euflorea design system: "Herbár"

Design manual for the public site (direction A, "Herbár", approved by the client) and the admin, on **Laravel 13 + Inertia 3 + React 19 + Tailwind CSS 4 + shadcn/ui**. Every UI change follows this file. Tokens live in `resources/css/app.css`; keep the two in sync.

Source of truth, in order of priority:
1. This document (tokens, rules, component specs)
2. `_handoff/reference/home-desktop.html` and `_handoff/reference/home-mobile.html`: the exact approved homepage markup with every pixel value (local only, `_handoff/` is gitignored; open in a browser)
3. `_handoff/screenshots/`: what the homepage must look like (desktop 1440 and 1920, mobile 390)

The reference HTML is a **design export, not production code**. Rebuild it as React components with Tailwind tokens. Do not copy inline styles. Only the homepage is visually designed; Gallery, Album and Contact are specified in `PRODUCT.md` and are built from this system, reusing homepage components wherever possible.

Assets in the repo:
- `resources/images/brand/logo-plum.png`: working logo (wordmark + dill sprig, plum on transparent, 891×249). The tagline is **not** part of the image (see §7.2).
- `resources/images/brand/logo-original.jpg`: the client's original JPG, reference only. Never served.
- `resources/images/svg/`: line art and icons (see §6).

---

## 1. Concept

A **herbarium sheet**: pressed flowers on warm paper. Everything looks like a physical object laid on a table:

- **Warm paper** background with a subtle grain texture
- Photos as **prints** on a paper mat, held by **washi tape** strips
- Cards are paper sheets, **slightly rotated** (each one differently, never more than ±1.2°)
- **Fine hand-drawn line botanicals** (a dill/umbel sprig taken from the logo, stems, buds) as decoration
- One strong colour: the logo's **plum**. Everything else is paper neutrals plus a soft rose for line art.
- Photos are always **full colour** (B&W was rejected as too dark)
- Mood: happy, romantic, artistic, calm. Never dark, never template-like, never flat.

### Rules
- Keep the palette small. If you reach for a new colour, use a tint or shade of an existing token instead.
- Rotation is the signature. Use it on paper objects (cards, prints, tape, social cards, carousel controls), **never on text blocks, buttons or inputs inside a card**.
- Corners are **square** (paper). The only round things are icon buttons, step badges and the carousel arrow buttons.
- No gradients, no glassmorphism, no emoji, no drop shadows on text.
- Copy rules: Slovak, no em/en dashes, no lorem ipsum.

---

## 2. Colour tokens (OKLCH)

All colours below are taken from the approved design. The single theme is **light only**: the paper look is the brand, so there is **no dark mode** anywhere (public site and admin). Set `color-scheme: light`; the starter kit's `.dark` tokens and appearance setting are removed.

### Core palette

| Token | OKLCH | Hex (reference) | Use |
|---|---|---|---|
| `paper` | `oklch(97.5% 0.007 67.7)` | `#FAF6F2` | Page background |
| `paper-card` | `oklch(98.0% 0.009 84.6)` | `#FBF8F2` | Cards, photo mats, control strip |
| `white` | `oklch(100% 0 0)` | `#FFFFFF` | Step badges |
| `plum` | `oklch(34.9% 0.081 336.4)` | `#54284A` | **Primary.** Headings, links, borders of buttons, IG card fill, active flower |
| `plum-hover` | `oklch(47.5% 0.079 340.4)` | `#7A4A6A` | Link hover |
| `ink` | `oklch(29.7% 0.053 338.3)` | `#3E2236` | Default text colour on paper (root), shadow base |
| `ink-deep` | `oklch(23.0% 0.036 340.2)` | `#281622` | Shadow base for the large photo-section card |
| `text` | `oklch(42.8% 0.025 346.6)` | `#5A4A52` | Body copy |
| `muted-ink` | `oklch(48.6% 0.024 354.8)` | `#6B5A60` | Footer text |
| `taupe` | `oklch(59.1% 0.027 59.1)` | `#8A7A6E` | Header tagline (decorative serif italic). See accessibility note |
| `taupe-text` | `oklch(52.5% 0.026 58.4)` | `#76675C` | Accessible variant of taupe for small text (5.0:1) |
| `rose` | `oklch(57.2% 0.083 342.7)` | `#9A6485` | Botanical line art, stems, eyebrow labels. See accessibility note |
| `rose-text` | `oklch(53.2% 0.077 343.3)` | `#8C5A78` | Accessible variant of rose for small text (5.1:1) |
| `rose-line` | `oklch(73.9% 0.063 346.1)` | `#C99BB3` | Step badge borders, vertical vine on mobile |
| `rule` | `oklch(85.1% 0.024 73.6)` | `#D8CCBD` | Hairlines (header bottom, section rules, footer top) |
| `rule-strong` | `oklch(81.2% 0.028 72.7)` | `#CDBFAE` | Card borders, dashed inner card frame |
| `photo-bg` | `oklch(91.2% 0.010 48.6)` | `#E8E0DC` | Behind photos while loading |

### On-plum colours (inside the plum Instagram card)

| Token | OKLCH | Hex |
|---|---|---|
| `cream` | `oklch(95.8% 0.012 75.4)` | `#F6F0E8` |
| `blush` | `oklch(87.3% 0.040 351.5)` | `#EBCBD8` |

### Detail colours (illustrations only)

| Token | OKLCH | Hex | Use |
|---|---|---|---|
| `bud` | `oklch(89.8% 0.024 351.4)` | `#EBD7DF` | Closed bud fill (carousel) |
| `leaf` | `oklch(89.0% 0.022 348.8)` | `#E7D5DD` | Leaf fill (carousel) |
| `pollen` | `oklch(90.1% 0.072 86.9)` | `#F3DCA8` | Centre of the active flower |
| `heart` | `oklch(57.6% 0.124 353.4)` | `#B0577F` | Footer heart only |
| `tape-sand` | `oklch(82.8% 0.041 77.1 / 0.72)` | `#D6C4AA` @ 70–75% | Washi tape |
| `tape-lilac` | `oklch(77.8% 0.030 336.6 / 0.68)` | `#C4B0BE` @ 65–70% | Washi tape (second strip) |

### Contrast (WCAG 2.2, on `paper`)

| Pair | Ratio | OK for |
|---|---|---|
| plum / paper | 11.0 | everything |
| ink / paper | 13.1 | everything |
| text / paper | 7.7 | everything |
| muted-ink / paper | 6.0 | everything |
| cream on plum | 10.4 | everything |
| blush on plum | 7.9 | everything |
| rose / paper | **4.3** | large text (≥24px) and decoration only |
| taupe / paper | **3.8** | large text and decoration only |

**Rule:** the eyebrow labels ("O nás", 11–12px) and the 16–17px header tagline currently use `rose` / `taupe`. In production use **`rose-text`** and **`taupe-text`** for any text under 24px. The difference is barely visible and makes it pass AA. Keep `rose` for strokes and line art.

### Tailwind 4 theme (`resources/css/app.css`)

`app.css` is the source of truth for the values; this table is the vocabulary. Every palette colour above is a `--color-*` token (`bg-paper`, `text-plum`, `border-rule-strong`, `bg-tape-sand`, …) with two renames to avoid clashing with shadcn: the footer colour is **`muted-ink`** (shadcn owns `muted`), and font sizes use their own names:

| Utility | Size | Line height / tracking | Use |
|---|---|---|---|
| `text-eyebrow` | 11px (12px via `md:text-xs`) | 1.4 / 0.24em | eyebrow labels |
| `text-nav` | 13px | 1 / 0.14em | nav links |
| `text-button` | 13px | 1 / 0.16em | buttons |
| `text-small` | 14px | 1.5 | footer |
| `text-copy` | 15px | 1.6 | card and step descriptions |
| `text-lead` | 17px | 1.7 | body on mobile, process intro |
| `text-lead-lg` | 18px | 1.7 | body on desktop |

Other tokens: `font-serif` / `font-sans`; `max-w-page` (1320px), `max-w-sheet` (720px), `max-w-prose` (460px); shadows `shadow-print(-sm)`, `shadow-card(-sm)`, `shadow-float(-sm)`, `shadow-lift`, `shadow-sheet(-sm)`, always tinted with ink; easings `ease-soft`, `ease-bloom`; the `paper-grain` utility (paper colour + tiling grain from `resources/images/paper-grain.webp`). shadcn variables (`--background`, `--primary`, `--ring`, `--sidebar-*`, …) are mapped onto the palette in `:root` with `--radius: 0`. There is no `.dark` theme; the `dark:` variant is bound to a class that is never set.

`tailwind-merge` is extended in `resources/js/lib/utils.ts` with the custom font-size names; add new size tokens there too.

Font weights in use: **Jost 300 (default body), 400, 500**; **Cormorant Garamond 400, 500 + italic 400, 500**.

---

## 3. Typography

Two families only:
- **Cormorant Garamond** (serif): every heading, the tagline, serif links, step numerals, social handles. Use *italic* to emphasise one word or phrase in a heading ("Kvety, ktoré *rozprávajú* váš príbeh.", "Ako to *rastie*", "Plánujete svadbu? *Porozprávajme sa.*").
- **Jost** (sans, weight 300 by default): body, navigation, buttons, labels.

**Self-host both** (GDPR: no Google Fonts CDN in production). Use `@fontsource/cormorant-garamond` and `@fontsource/jost` (or the variable versions), including the **`latin-ext` subset**, which Slovak needs (č ď ľ ň ť ž ô ä ŕ ĺ).

### Type scale (mobile first)

| Role | Family / weight | Mobile (<768) | md (≥768) | lg (≥1024) | Line height | Notes |
|---|---|---|---|---|---|---|
| Display H1 (intro) | serif 400 | 44px | `clamp(44px, 5vw, 72px)` | → 72px max | 1.02 | `text-wrap: balance`, colour plum |
| H2 feature (process, CTA) | serif 400 | 42px | `clamp(40px, 4.4vw, 64px)` (CTA up to 68px) | | 1.02–1.05 | |
| H2 section (services) | serif 400 | 34px | 40px | 48px | 1.1 | |
| H3 card | serif 500 | 24px | 26px | 28px | 1.2 | service cards |
| H3 step | serif 500 | 26px | 28px | 28px | 1.2 | process steps |
| Step numeral | serif italic 400 | 22px (48px badge) | | 30px (72px badge) | 1 | i, ii, iii, iv |
| Social handle | serif italic 400 | 30px | | 36px | 1.1 | |
| Serif link | serif italic 400 | 21px | | 22px | 1.3 | "Pozrite si naše svadby →", underline offset 6px |
| Tagline | serif italic 400 | 16px | | 17px | 1.3 | header, colour taupe-text |
| Body large | sans 300 | 17px | | 18px | 1.7 | intro paragraphs, CTA |
| Body | sans 300 | 17px | | 17px | 1.7 | process intro |
| Card text | sans 300 | 15px | | 15px | 1.55–1.65 | |
| Small | sans 300 | 14px | | 14px | 1.5 | footer |
| Eyebrow | sans 300, UPPERCASE | 11px / 0.24em | 12px | 12px | 1.4 | colour rose-text |
| Nav | sans 300, UPPERCASE | | | 13px / 0.14em | 1 | desktop header + footer |
| Button | sans 300, UPPERCASE | 13px / 0.16em | | 13px / 0.14–0.16em | 1 | |
| Social label | sans 300, UPPERCASE | 11px / 0.22em | | 12px / 0.22em | 1.4 | "INSTAGRAM", "FACEBOOK" |

Readable line length: body paragraphs max ~60ch (CTA paragraph is capped at 460px, process intro at 420px).

---

## 4. Layout, spacing and breakpoints

Built **mobile first**: the base styles are the 390px phone layout; each breakpoint adds to it.

| Breakpoint | Tailwind | What changes |
|---|---|---|
| base | none | Single column. 16–24px side gutters. Mobile header (tagline + menu button). |
| `sm` 640px | `sm:` | Wider gutters (24px), service cards still 1 column but more padding |
| `md` 768px | `md:` | Services grid → 2 columns; process steps → 2 columns; intro still stacked |
| `lg` 1024px | `lg:` | Desktop header (nav left, tagline centre, socials + CTA right). Intro → 2 columns. CTA → 2 columns. Process card floats left over photo. Carousel controls move to bottom right of the frame. 40px gutters |
| `xl` 1280px | `xl:` | Services → 4 columns. Page container reaches max 1320px |
| 2xl / wide | | Nothing new; content stays centred in 1320px, backgrounds are full-bleed |

### Container
- `max-w-page` (1320px), centred, `px-4 sm:px-6 lg:px-10` (16 / 24 / 40px).
- Full-bleed sections (the "Ako to rastie" photo) span the viewport; their content sits in the same container.

### Spacing scale
Use Tailwind's default 4px scale. Key rhythm values from the design:

| Where | Mobile | Desktop (lg) |
|---|---|---|
| Header height / padding | 10px y, 16–20px x | 22px y, 40px x |
| Logo hero top padding | 40px | 64px |
| Carousel section | 36px top | 56px top, 40px bottom |
| Intro section | 80px top / 72px bottom | 150px top / 130px bottom |
| Services section | 0 top / 90px bottom; gap 22px | 0 / 150px; heading gap 48px; grid gap 28px |
| Process section | photo window 300px above card; card padding 52px 24px | section padding 120px; card padding 64px 56px |
| CTA section | 80px top / 64px bottom | 140px / 120px; columns gap 56px |
| Footer | 36px top / 44px bottom | 44px y |
| Inside cards | gaps 6–18px | gaps 14–16px |

Vertical spacing between sections is generous on desktop (120–150px). Never cramp it.

---

## 5. Surfaces, texture and effects

### Paper background
- Page background `paper` + a full-page **grain overlay** (`resources/images/svg/texture-paper-grain.svg`: fine grain + low-frequency mottle via `feTurbulence`). Render it once as an absolutely-positioned, `pointer-events: none` layer over the whole page.
- For performance, rasterise the grain to a small tiling PNG/WebP (~256px) and use it as a CSS `background-image` on `body`. The SVG filter version is acceptable but costs paint time on long pages.

### Paper card (`.paper-card`)
- Background `paper-card`, outer padding 8px (mobile) / 12px (desktop), inner frame `1px dashed rule-strong`.
- Shadow `shadow-card` (desktop) / `shadow-card-sm` (mobile).
- Rotation from the pattern below. Desktop cards 2 and 4 also drop slightly (`translateY(18px)` / `10px`) so the row reads hand-laid.

### Photo print (carousel frame)
- Mat: `paper-card`, padding 10px (mobile) / 20px (desktop), `shadow-print`, rotate −0.6° (mobile) / −0.4° (desktop).
- Image area: height 440px (mobile) / 640px (desktop), `photo-bg` while loading, `object-fit: cover`.
- **Washi tape:** absolutely positioned rectangles on the top edge, overlapping it by about 12px:
  - Desktop: sand 130×34px at left 60px, −4°; lilac 110×32px at right 80px, +5°
  - Mobile: one sand strip 90×26px at left 30px, −5°

### Taped sheet (process card over photo)
- `paper` at 96% opacity, `shadow-sheet`, rotate −0.4° (desktop) / −0.6° (mobile), two tape strips (sand left −4°, lilac right +5°).
- Desktop: max-width 720px, left-aligned in the container, photo visible on the right.
- Mobile: full width minus 16px margins; the photo shows as a 300px window above the card.

### Rotation pattern (approved values)

| Element | Mobile | Desktop |
|---|---|---|
| Carousel print | −0.6° | −0.4° |
| Carousel control strip | −1° | +1.2° |
| Service cards 1–4 | −0.8° · +0.7° · −0.5° · +0.9° | −1° · +0.8° (+18px y) · −0.6° · +1.1° (+10px y) |
| Process sheet | −0.6° | −0.4° |
| Instagram card | −1° | −1° |
| Facebook card | +0.6° | +0.6° |
| Tape | −3° to −5° / +5° | same |

Implement as a small utility set (`rotate-[-0.6deg] lg:rotate-[-0.4deg]`) or a `tilt` prop on the paper components. Keep values deterministic: no random rotation at runtime, so renders stay stable between visits.

### Borders and radius
- Hairlines `1px solid rule`; card frames `1px dashed rule-strong` or `1px solid rule-strong`.
- Radius **0** everywhere, except: icon/arrow buttons `rounded-full` (44px), step badges `rounded-full`.

---

## 6. Illustration and iconography

All line art is **outline, round caps, 1.1–1.4px strokes, `currentColor`**, drawn in-house (no icon library look). Files are in `resources/images/svg/`:

| File | Use | Colour |
|---|---|---|
| `service-bouquet.svg` | Svadobné kytice | plum |
| `service-ceremony-arch.svg` | Výzdoba obradu | plum |
| `service-table.svg` | Stolovanie a hostina | plum |
| `service-venue-vase.svg` | Styling priestoru | plum |
| `sprig-dill.svg` | Decorative sprig (from the logo motif): next to the carousel (desktop, bottom left, 170×370) and the intro (mobile, top right, 100×220, 80% opacity) | rose |
| `carousel-stem.svg` | Wavy stem line under the carousel buds | rose |
| `carousel-bud.svg` | Inactive slide indicator (stalk, bud, optional leaf) | fixed colours inside |
| `carousel-flower.svg` | Active slide indicator (plum 5-petal flower, pollen centre) | fixed colours inside |
| `vine-vertical.svg` | Mobile process steps: vine connecting the step badges | rose-line |
| `icon-instagram.svg`, `icon-facebook.svg` | Header (20px), social cards (42/52px) | currentColor |
| `icon-menu.svg` | Mobile menu button (26px in 48px button) | plum |
| `icon-chevron-left/right.svg` | Carousel arrows (16px in 44px circle) | plum |
| `icon-heart.svg` | Footer "Made with ♥" (13×12) | heart |

The `.svg` files are the source drawings; the site uses them as hand-written React components in `resources/js/components/site/icons.tsx` (so they inherit `currentColor` and accept classes). `vite-plugin-svgr` was dropped because it is incompatible with the project's Babel 8. The carousel bud and flower are drawn inline in `hero-carousel.tsx` so their parts can animate.

Use **lucide-react** (ships with shadcn) only for generic UI inside the admin and forms (check, x, upload, trash). Do not use it on the public site's decorative elements.

---

## 7. Components (homepage)

Component names are suggestions. Each lists the mobile base first, then larger breakpoints.

### 7.1 `SiteHeader`
- **Mobile:** row with the tagline "Kvety pre váš veľký deň" (serif italic 16px, taupe-text) on the left and a 48px menu button (`icon-menu`) on the right, bottom hairline `rule`. The menu button opens a **shadcn `Sheet`** (side right, `paper` background with grain): nav links (Domov, Galéria, Kontakt) in serif 34px, plus Instagram/Facebook links and the "Napíšte nám" button. Focus trap, Esc closes it, and the current page is marked.
- **lg:** three-column bar (`grid-cols-[1fr_auto_1fr]`, so the tagline is truly centred). Left: nav links (uppercase 13px / 0.14em, 36px gap, 1px bottom border on hover and active). Centre: tagline. Right: Instagram and Facebook icon links (44×44 hit area) + outline button "Napíšte nám" → `/kontakt`.
- On every page other than the homepage the tagline slot shows the small wordmark (linking home) instead, so inner pages carry the brand; the homepage has the big logo right below.
- Not sticky (by design). Optionally add a slim sticky version later.

### 7.2 `Logo` and `LogoHero`
- The logo image is the wordmark only (`resources/images/brand/logo-plum.png`). The tagline **"Svadobný a kvetinový styling"** is real text wherever it appears, never baked into an image. Build one `Logo` component with an optional `tagline` prop so hero and any future use stay identical.
- Tagline style (matches the original logo): sans (Jost) 400, UPPERCASE, letter-spacing ~0.2em, colour plum, centred under the wordmark. Gap above it ≈ 4.5% of the wordmark width. Its width is ≈ 60% of the wordmark: size it relative to the logo (container query, e.g. `clamp(0.75rem, 2.6cqi, 1.25rem)`) and never below 12px.
- Hero: wordmark + tagline, centred. Width: 100% of the container on mobile (20px side padding); `min(760px, 86%)` on desktop.
- Footer and mobile menu use the wordmark without the tagline.
- The PNG is a cut-out of a 1068px JPG and is slightly soft on retina screens at hero size. A vector version is a late task in `PLAN.md`.
- It is the page's visual H1. Wrap it in a heading or give the page a visually hidden `<h1>Euflorea, svadobný a kvetinový styling</h1>`, and keep the intro heading as `h2` in production. In the reference the intro headline is `h1`; adjust semantics without changing visuals.

### 7.3 `HeroCarousel` (approved signature component)
Structure: photo print (see §5) + flower-stem control strip + decorative sprig (desktop).

**Slides:** 6 images (managed in the admin as the homepage carousel album; initial order and focal points in `PLAN.md`). Stacked absolutely; **crossfade** (opacity 1.2s ease) plus a slow **zoom-out** on the active slide (scale 1.06 → 1, 7s ease-out). Autoplay every **5.5s**, and the timer restarts after any manual navigation.

**Controls strip:**
- A paper strip (`paper-card`, `1px solid rule-strong`, `shadow-float`) with one sand tape strip centred on top (92×26, −3°).
- Mobile: centred under the photo, overlapping it by 34px, rotate −1°, padding 12px 10px 8px, bud width 34px.
- lg: absolutely positioned at the bottom right of the frame (right 88px, bottom −8px), rotate +1.2°, padding 14px 18px 10px, bud width 40px.
- Contents: `[‹]` round 44px arrow button · row of buds on the wavy stem · `[›]` arrow button. Arrows are outline plum circles that fill plum on hover (icon turns paper).
- **Buds:** one per slide, each a `<button>` (40×62 or 34×62) with `aria-label="Fotka 3 z 6"` and `aria-current="true"` on the active one. Every second bud has a small leaf.
  - Inactive: closed bud (`carousel-bud.svg`).
  - Active: the bud scales to 0 (0.45s) and the **flower blooms**: scale 0 → 1 with rotation −60° → 0 over 0.7s using `--ease-bloom` (slight overshoot).
  - Hover: bud sways (rotate −6°, translateY −2px, 0.4s).
  - Focus-visible: 2px plum outline, 2px offset.
- **First-load bug to avoid:** the active slide's zoom only plays when its scale changes. Render the first slide at scale 1.06, then flip to 1 after the first paint (double `requestAnimationFrame`), or the first slide sits still.
- Behaviour:
  - Pause autoplay while hovered and while focus is inside.
  - Swipe on touch.
  - ← → keys when focused.
  - `prefers-reduced-motion`: no autoplay, no zoom, instant crossfade.
- Implementation: a small custom component (`resources/js/components/home/hero-carousel.tsx`): stacked slides, CSS transitions, pointer-event swipe. No carousel library.
- Images: first slide `fetchpriority="high"` and no lazy loading; others lazy. Use `srcset` from the media library responsive images (see `PRODUCT.md`, Images).

### 7.4 `IntroSection` ("O nás")
- Mobile: stacked. Eyebrow "O nás" → heading (44px, max-width 300px) → paragraph (17px) → serif link "Pozrite si naše svadby →" (`/galeria`). Sprig decoration top right.
- lg: 2-column grid (`minmax(420px,1fr)` each, 64px gap). Left: eyebrow + heading (up to 72px). Right: two paragraphs (18px) + link, offset 44px down.

### 7.5 `ServicesSection` ("Čo pre vás urobíme")
- Heading (34px mobile → 48px desktop) above a `rule` hairline.
- **Mobile card:** horizontal layout inside the paper card: 48px icon left, then title (24px) + one-line description (15px).
- **md:** 2-column grid. **xl:** 4 columns. From md the cards switch to a vertical layout: 56px icon, title 28px, description; inner padding 34px 26px 30px; min-height 300px.
- Hover (from lg, optional, approved as "quiet"): straighten to 0° and lift 2–3px, no extra shadow. The icon may sway slightly. Cards are not links.

### 7.6 `ProcessSection` ("Ako to rastie")
- Full-bleed **colour** photo background (`object-position: center 58%` desktop / `center 40%` mobile). No overlay or veil: the photo must stay vivid.
- The taped sheet (§5) contains: heading "Ako to *rastie*", intro line (desktop only, 17px, max 420px), and an ordered list of 4 steps.
- **Mobile steps:** vertical list, 48px round badges (white, `1px rose-line`, italic serif numeral) on the left, joined by `vine-vertical.svg`; title 26px + text 15px.
- **md+ steps:** 2×2 grid (`minmax(260px,1fr)`, gap 40px 48px), 72px badges above the title. No connecting line on desktop.
- Use `<ol>`; numerals are roman (i–iv) as visual badges. The `<ol>` already carries the order for screen readers.

### 7.7 `CtaSection` ("Plánujete svadbu? Porozprávajme sa.")
- Mobile: heading (42px) → paragraph → full-width outline button "Kontaktujte nás" (`/kontakt`) → Instagram card → Facebook card.
- lg: 2 columns (`minmax(460px,1fr)`, gap 56px). Left: heading (up to 68px), paragraph (max 460px), button. Right: the two social cards stacked (gap 18px).

### 7.8 `SocialCard` (approved hover)
- Large link card: icon (42px mobile / 52px desktop) · label (uppercase small) + handle (serif italic 30/36px) · arrow "→" (desktop only).
- **Instagram:** plum background, cream text, blush label, rotate −1°. **Facebook:** `paper-card`, `1px rule-strong` border, plum text, rose-text label, rotate +0.6°.
- Padding 24px (mobile) / 30px 34px (desktop).
- **Hover + focus-visible:** the tilt flips (IG → +0.6°, FB → −0.8°), card lifts (`translateY(-4px) scale(1.012)`), `shadow-lift` appears, icon rotates −8°, arrow slides 8px right. Duration 0.5s, `--ease-soft`.
- Links: Instagram `https://www.instagram.com/euflorea_/`; Facebook URL is an open item.

### 7.9 `Button` (shadcn `Button`, custom variants)
- `outline` (default on this site): transparent, `1px solid plum`, plum text, uppercase 13px / 0.14–0.16em, square corners, padding 13px 24px (header) / 17–18px 24–34px (CTA). Hover: fill plum, text paper (0.25s).
- `icon`: 44px circle, `1px plum` border, same hover fill.
- On mobile, CTA buttons are full width.

### 7.10 Links
- Body links: plum, hover plum-hover, underline offset 6px for serif links.
- Nav links: no underline, 1px bottom border on hover and active.

### 7.11 `SiteFooter`
- Top hairline `rule`.
- Mobile: centred column: wordmark (34px high) → nav links (12px padding each) → credit line.
- lg: one row, space-between: wordmark (40px) · nav (uppercase 13px) · credit.
- Credit: `© {year} Euflorea · Made with [heart icon] by Legacy Upgrade` (link to https://legacy-upgrade.com/). 14px, `muted-ink`. The heart is `icon-heart.svg` with `aria-label="love"`.

---

## 8. Motion

| Token | Value | Used for |
|---|---|---|
| fast | 0.25s ease | button fills, link colours |
| hover | 0.4–0.5s `--ease-soft` | social cards, bud sway, arrows |
| bloom | 0.7s `--ease-bloom` | carousel flower |
| crossfade | 1.2s ease | carousel slides |
| ken-burns | 7s ease-out, scale 1.06 → 1 | active slide |
| autoplay | 5.5s | carousel interval |

- Animate only `transform` and `opacity`.
- `@media (prefers-reduced-motion: reduce)`: disable autoplay and ken-burns, make transitions ≤ 0.01s, and keep hover states as colour changes only.
- No scroll-triggered reveal animations are part of the approved design. If added later, content must be visible without JavaScript.

---

## 9. Imagery rules

- Photos are full colour, never desaturated, never under a coloured overlay.
- Always `object-fit: cover` with a **per-photo focal point** (`object-position`), stored with each photo (`focal_x`, `focal_y`, see `PRODUCT.md`).
- Use the `photo-bg` colour as the placeholder; optionally a tiny blurred LQIP.
- Alt text in Slovak, describing the flowers and scene ("Nevesta s kyticou lúčnych kvetov a oranžových kál").

---

## 10. Accessibility checklist

- `<html lang="sk">`.
- All interactive elements are real `<a>` / `<button>` with ≥44×44px hit areas.
- Icon-only buttons have Slovak `aria-label`s ("Otvoriť menu", "Predchádzajúca fotka", "Ďalšia fotka", "Fotka N z 6").
- Visible focus: 2px plum outline with 2px offset on every interactive element.
- Small text uses `rose-text` / `taupe-text` (see §2).
- The carousel is a labelled region (`aria-roledescription="carousel"`, `aria-label="Naše svadby"`). Slides are not announced on every autoplay tick: use `aria-live="off"` during autoplay and `polite` after a manual change.
- Decorative SVGs (sprigs, tape, vines, grain) are `aria-hidden="true"`.

---

## 11. shadcn/ui usage

Initialise shadcn with the theme variables from §2 (radius 0). Components expected:

| shadcn | Where |
|---|---|
| `Button` | everywhere (custom `outline` and `icon` variants as in §7.9) |
| `Sheet` | mobile menu |
| `embla-carousel-react` | gallery lightbox (swipe between photos) |
| `Dialog` | lightbox container |
| `Form`, `Input`, `Textarea`, `Select`, `Checkbox`, `Label`, `Calendar`/`Popover` (date) | contact form |
| `Sonner` (toast) | form success and error |
| `Card`, `Table`, `Dialog`, `AlertDialog`, `DropdownMenu` | admin |

Restyle inputs to the paper look: `paper-card` background, `1px rule-strong` border, square corners, plum focus ring, labels in uppercase eyebrow style. The admin can use stock shadcn styling with the same colour variables. It does not need the herbarium decoration.

Add a variant in the `components/ui` file (`cva`) instead of overriding with `className` in many places. Use semantic or palette tokens only, never raw Tailwind colours (`bg-blue-500`) or hex/oklch values in components.

---

## 12. Gallery, Album and Contact (not visually designed)

Build from the homepage parts. Behaviour and content are in `PRODUCT.md`; visual rules:

- **Page intro** (all three): eyebrow → display heading with one italic word ("Naše *svadby*", "Plánujete *svadbu*?") → one line of body-lg.
- **Album card** (Gallery): a photo print. Cover (4:5, focal point) on a `paper-card` mat (padding 10–12px), one tape strip, rotation cycling −0.8° · +0.6° · −0.4° · +0.9°. Inside the mat under the photo: title serif 24–28px, meta line in eyebrow style. The whole card is one link. Hover / focus-visible: straighten to 0°, lift 4px, `shadow-lift`. Grid 1 → `md` 2 → `xl` 3 columns, gap 28–40px.
- **Filter tabs** (optional): "Všetko" / "Svadby" / "Editoriály", styled like the desktop nav.
- **Empty state**: paper card with the sprig, "Čoskoro tu pribudnú naše svadby." and an Instagram link.
- **Album page**: back link "← Všetky svadby" (serif link style), eyebrow (Svadba / Editorial), display title, meta line, optional description (body-lg, max 60ch). Photos in CSS columns 1 → `md` 2 → `lg` 3, gap 16–24px, **not rotated**, thin paper mat (6–8px) with `shadow-card-sm`. Then "Ďalšia svadba →" and the homepage `CtaSection`.
- **Lightbox**: full screen, paper at 96%, photo contained; carousel-style round arrow buttons, counter "3 / 14", "Zavrieť" top right. Optionally the bud indicator as the counter for ≤ 16 photos.
- **Contact**: contact-person paper cards, the two `SocialCard`s (full width on mobile, side by side from `md`), and the form on a taped sheet (same component as "Ako to rastie", max 720px). On `lg` either two columns (info + socials left, form right) or the form centred below, whichever reads cleaner.
- **Form**: inline errors under each field (destructive, 14px) plus a screen-reader summary at the top. Submit is the outline button, full width on mobile, "Odoslať správu" / "Odosielam…". Success replaces the form with a paper card (sprig + "Ďakujeme! Ozveme sa vám do dvoch dní.") and a Sonner toast.

## 13. Error and legal pages

- **Error page** (`site/error`): page intro pattern (eyebrow "Chyba 404", display heading with one italic word, one line of body) with the large dill sprig on the right and two outline buttons (úvod, galéria).
- **Privacy page**: page intro, then prose capped at 68ch with serif H2s per section.

## 14. Admin

Stock shadcn with the palette variables above, no herbarium decoration, light only.

- Shell: the starter kit sidebar layout (`layouts/app/app-sidebar-layout.tsx`), `Sheet` on mobile. Breadcrumbs below the top level.
- Tables scroll horizontally inside their own container on mobile; numbers `tabular-nums`.
- Destructive actions always behind an `AlertDialog`. Results of actions as Sonner toasts (flash, see `README.md`).
- Every list has an empty state (icon, one line, primary action). Loading content uses `Skeleton` matching the final layout.
- No drag-only interactions: every drag reorder (albums, photos) also has move up / down buttons. Focal point is set by tapping the thumbnail.
- `lucide-react` icons are allowed here (and in forms), not on the public site's decoration.
- Dates `DD.MM.YYYY`, 24-hour time.
