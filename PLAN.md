# Plan

Build order and progress for the Euflorea website. Specs live in `PRODUCT.md` (what) and `DESIGN.md` (how it looks); the original handoff is in `_handoff/` (local only, gitignored). Tick items as they land.

## 0. Setup

- [x] Gitignore `_handoff/`
- [x] Working logo `resources/images/brand/logo-plum.png` (transparent, wordmark only; tagline is text), original kept as `logo-original.jpg`
- [x] Line art and icons copied to `resources/images/svg/`
- [x] Rewrite `README.md`, `PRODUCT.md`, `DESIGN.md` from the handoff

## 1. Foundation

- [x] Install `@fontsource/cormorant-garamond`, `@fontsource/jost`, `embla-carousel-react` (svgr dropped: incompatible with Babel 8; icons are React components in `icons.tsx`)
- [x] Tailwind theme tokens and shadcn variables from `DESIGN.md` §2 in `resources/css/app.css`; remove `.dark` tokens
- [x] Remove dark mode: appearance setting, `use-appearance` hook, `.dark` toggle
- [x] Fonts self-hosted (Cormorant Garamond 400/500 + italics, Jost 300/400/500), `font-display: swap`
- [x] Paper grain as a small tiling raster on `body`
- [x] `<html lang="sk">`, Slovak app locale, Europe/Bratislava time zone
- [x] Public layout: `SiteHeader` (desktop bar + mobile `Sheet` menu), `SiteFooter`, `Logo` component with tagline text
- [x] Shared paper primitives: `PaperCard`, `Tape`, `TapedSheet`, `Eyebrow`, `Button` `paper` variant + `header`/`cta`/`round` sizes, `SocialCard`

## 2. Homepage

- [x] `LogoHero`
- [x] `IntroSection`
- [x] `ServicesSection`
- [x] `ProcessSection` (full-bleed photo `wild_west_editorial/9` as static WebP in `resources/images/home/`, focal desktop `center 58%`, mobile `center 40%`)
- [x] `CtaSection`
- [x] `HeroCarousel` with flower-stem controls (custom, no library)
- [x] Feed the carousel from the homepage carousel album
- [ ] Compare against `_handoff/screenshots/` at 390, 1440 and 1920

## 3. Data, media and admin

- [x] Install and configure `spatie/laravel-medialibrary`: originals on a private disk, WebP-only responsive variants (quality ~82), EXIF stripped, orientation fixed, queued conversions (`AddPhotoToAlbum` cleans every source first)
- [x] Migrations, models, factories: `albums`, `photos`, `inquiries`
- [x] Admin routes under `/admin` (auth), sidebar nav entries, Slovak admin screens
- [x] Albums: list (cover, title, type, date, published, photo count, reorder), create/edit form, delete with confirm
- [x] Photos: multi-upload with progress (downscaled in the browser to 3000px), reorder (drag + arrow buttons), alt text, focal point by tap with crop previews, set cover, delete
- [x] Homepage carousel album (`is_homepage_carousel`, only one)
- [x] Inquiries list with "handled" switch
- [x] `photos:import {path}` artisan command (manifest `database/data/initial-albums.json`): creates the albums and carousel album below through the same media pipeline as admin uploads; idempotent (skips existing slugs). Locally run on `_handoff/photos`
- [x] Slovak validation messages (`lang/sk/validation.php`)
- [ ] Translate the starter kit auth and settings screens (login, password reset, profile) to Slovak

### Content to seed

| Album | Slug | Type | Source folder | Photos |
| --- | --- | --- | --- | --- |
| Anna a Jakub | `anna-a-jakub` | wedding | `svadby/anna_a_jakub` | 16 |
| Barbora a Peter | `barbora-a-peter` | wedding | `svadby/barbora_a_peter` | 14 |
| Kristína a Michal | `kristina-a-michal` | wedding | `svadby/kristina_a_michal` | 14 |
| Structured Grace | `structured-grace` | editorial | `editorials/structured_grace_editorial` | 11 |
| Wild West | `wild-west` | editorial | `editorials/wild_west_editorial` | 14 |

Homepage carousel, in this order (desktop frame ~2:1 landscape, mobile ~4:5 portrait; mobile focal point `center` for all):

| # | File | Alt | Desktop focal |
| --- | --- | --- | --- |
| 1 | `uvod/1.jpg` | Obrad pod holým nebom: novomanželia pri bráne z pampovej trávy | `center 40%` |
| 2 | `uvod/3.jpeg` | Tanec medzi gerberami | `center 25%` |
| 3 | `uvod/2.jpg` | Nevesta so závojom a kyticou lúčnych kvetov | `center 25%` |
| 4 | `uvod/4.jpeg` | Ružová elegancia: nevesta s ružovými gerberami | `center 30%` |
| 5 | `uvod/5.jpg` | Kaly a lúčne kvety | `center 50%` |
| 6 | `uvod/6.jpg` | Detail kytice z pampovej trávy | `center 50%` |

Notes: `uvod/4.jpeg` is only 900×1600 with no full-size copy; we use it anyway (slightly soft in the desktop frame). `uvod/6.jpg` is landscape. Files `uvod/1, 2, 3, 5, 6` duplicate album photos (`kristina_a_michal/1`, `wild_west/3`, `structured_grace/8`, `wild_west/6`, `kristina_a_michal/4`); fine for the carousel, never twice in one album. Normalise `.jpeg` → `.jpg` on import.

## 4. Gallery

- [ ] Gallery index with album cards, empty state, optional type filter
- [ ] Album page with masonry grid, next album link, CTA section, 404 for unpublished/unknown
- [ ] Lightbox (keyboard, swipe, focus trap and return)

## 5. Contact

- [ ] Contact page layout (people cards, social cards, taped form sheet)
- [ ] `ContactRequest` validation, honeypot, rate limit 5/hour/IP
- [ ] Store inquiry in the DB (always, before any mail)
- [ ] Queued mail to the studio (+ optional confirmation to the couple) without a paid mail service; decide how later
- [ ] Success card + toast, inline errors + summary

## 6. Launch pass

### Initial photos to production (one time)

- [ ] Select the photos to publish; downscale to ~2560px long side (high-quality JPG) and strip EXIF
- [ ] Put them in `storage/app/import/photos/` (same `uvod/`, `svadby/…`, `editorials/…` structure, `.gitignore` exception) and commit
- [ ] Deploy, then run `php artisan photos:import storage/app/import/photos` on production by hand (never from the deploy script)
- [ ] Next commit: remove `storage/app/import/photos/`

### Everything else


- [ ] Privacy policy page
- [ ] SEO: titles, descriptions, canonical, OG image, `sitemap.xml`, `robots.txt`, JSON-LD `Florist`
- [ ] Favicon from the dill sprig
- [ ] Decide on Fortify registration (currently enabled; users are meant to be added manually)
- [ ] Accessibility pass (axe/Lighthouse, AA) and performance pass (LCP < 2.5s on 4G)
- [ ] Mobile check of every page at 390px

## 7. Later

- [ ] Turn the logo into an SVG (trace `resources/images/brand/logo-original.jpg`, or use the client's vector if it arrives); then favicon and OG image from it
- [ ] Decide whether `spatie/laravel-permission` is needed or remove it

## Open items (client or Lukas)

- [ ] Facebook page URL (currently `#`)
- [ ] Contact people: names, roles, phones, emails
- [ ] Inquiry recipient email + free way of sending mail (no paid service)
- [ ] Vector logo (SVG) from the client
- [ ] Photographer credits for every wedding and editorial, and permission to publish
- [ ] Couples' consent to be named (album titles use first names)
- [ ] Confirm copy: "sezónne kvety", "na mieru", "ozveme sa do dvoch dní"
- [ ] Album meta: dates and locations for the 3 weddings
- [ ] Privacy policy text and company details (IČO, address)
- [ ] Domain + hosting
- [ ] Analytics: none, or which (cookie-less)?
