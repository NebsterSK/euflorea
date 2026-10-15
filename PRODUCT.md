# Product

What Euflorea's website is, who it's for and what it must do. Code conventions live in `CLAUDE.md` and `.ai/rules/`; the UI design system in `DESIGN.md`; build progress and open items in `PLAN.md`. The original design handoff is in `_handoff/` (local only, gitignored).

## 1. Summary

**Euflorea** is a small Slovak floral studio specialising in **wedding decoration and floral styling** ("svadobný a kvetinový styling"). They design and deliver the flowers and décor for a couple's whole wedding day: the bride's bouquet, the ceremony, the reception tables and the overall styling of the venue. Besides weddings they produce **styled editorial shoots** as promotional material: *Structured Grace* (indoor, pink gerberas, carnations and calla lilies on crumpled paper backdrops) and *Wild West* (outdoor meadow, horses, cowboy hats, orange callas and wildflowers).

This website shows their work as photo albums, turns visitors into wedding inquiries and sends them to Instagram and Facebook. A small admin lets the studio manage albums and photos themselves.

## 2. Problem

The studio has no website, only Facebook and Instagram ([@euflorea_](https://www.instagram.com/euflorea_/)). Couples comparing decorators can't browse complete weddings in one place, and there is no structured way to send the date, venue and wishes. Instagram stays the main channel, so the site must point there prominently rather than replace it.

## 3. Users

| Role | Who | Main goals | Permissions |
| --- | --- | --- | --- |
| Visitor | Couples planning their wedding, mostly in Slovakia. Arrive inspired and emotional, compare several decorators, mostly on a phone. | See real past work, feel the studio's taste, send an inquiry, follow on Instagram | Public pages only |
| Studio (admin) | Euflorea staff, non-technical, occasional use | Add albums and photos after each wedding, set covers and focal points, swap homepage carousel photos, read inquiries | Everything in `/admin` |

- **No roles:** any authenticated user can do everything in the admin. `spatie/laravel-permission` stays installed but **unused for now**.
- Users are inserted into the DB manually. Fortify **registration stays enabled for now** (decide before launch, see `PLAN.md`).

## 4. Goals and non-goals

**Goals**
1. **Show the work.** Real weddings are the main product; every wedding becomes an album in the Gallery.
2. **Convert to an inquiry.** Couples send date, venue and wishes easily through the Contact form.
3. **Send people to Instagram and Facebook**, where the client is most active.
4. **Express the brand.** Floral, handmade, artistic, happy and romantic; never a generic wedding template. An earlier dark, moody direction was rejected as sad.

**Non-goals**
- Online shop, pricing, booking calendar or payments.
- Blog or news.
- Multiple languages (Slovak only).
- Roles and permissions in the admin.
- Dark mode.
- Server-side rendering (client-side Inertia only).

**Success metrics:** inquiries sent through the form; clicks to Instagram/Facebook; homepage LCP under 2.5s on 4G.

## 5. Features

| Module | Feature | Priority | Status |
| --- | --- | --- | --- |
| Public | Homepage: logo hero, photo carousel, intro, services, process, CTA + socials | Must | planned |
| Public | Gallery: album list with optional Svadby / Editoriály filter | Must | planned |
| Public | Album page: photo grid + lightbox, next album, CTA | Must | planned |
| Public | Contact: contact people, big social cards, inquiry form | Must | planned |
| Public | Privacy policy page (GDPR, needed for the form) | Must | planned |
| Public | SEO: titles, meta descriptions, OG image, sitemap, robots, JSON-LD | Should | planned |
| Admin | Albums CRUD with publish toggle and reordering | Must | planned |
| Admin | Photos: multi-upload with progress, reorder, alt text, focal point, set cover, delete | Must | planned |
| Admin | Homepage carousel managed as a flagged album | Should | planned |
| Admin | Inquiries: read-only list with "handled" checkbox | Could | planned |
| Auth | Login, password reset, email verification, 2FA (Fortify, starter kit) | Must | done |
| Settings | Profile, password and 2FA | Must | done |

## 6. Pages and routes

Slovak slugs, no trailing slashes. Shared layout: `SiteHeader` + `SiteFooter`; the active nav item is marked.

| Route | Name | Page |
| --- | --- | --- |
| `GET /` | `home` | Domov |
| `GET /galeria` | `gallery.index` | Galéria: album list |
| `GET /galeria/{album:slug}` | `gallery.show` | One album |
| `GET /kontakt` | `contact` | Kontakt |
| `POST /kontakt` | `contact.send` | Inquiry form submit |
| `GET /ochrana-osobnych-udajov` | `privacy` | Privacy policy |
| `/admin/*` | `admin.*` | Admin (auth required) |

### Homepage (`/`)

Fully designed; see `DESIGN.md` §7 and `_handoff/screenshots/`. Sections in order:

1. **Header**: nav (Domov, Galéria, Kontakt), tagline "Kvety pre váš veľký deň", Instagram/Facebook, "Napíšte nám" → `/kontakt`.
2. **Logo hero**: wordmark + tagline "Svadobný a kvetinový styling" (text).
3. **Carousel**: photos of the homepage carousel album.
4. **O nás**: "Kvety, ktoré *rozprávajú* váš príbeh." + intro + "Pozrite si naše svadby →".
5. **Čo pre vás urobíme** (services):

| Title | What it covers |
| --- | --- |
| Svadobné kytice | Bride's bouquet, boutonnières for witnesses, flowers for the hair |
| Výzdoba obradu | Floral arches, aisles and altars, in church or outdoors |
| Stolovanie a hostina | Table arrangements, candles, name cards, the newlyweds' head table |
| Styling priestoru | Overall concept: colours, textiles and flowers tying the day together |

6. **Ako to rastie** (process) over a full-bleed photo (`wild_west_editorial/9`): i Zoznámenie (meeting, the couple shares who they are, the venue and their ideas) · ii Návrh (moodboard, flower selection, clear budget) · iii Príprava (ordering seasonal flowers, finalising details) · iv Svadobný deň (installation on the day, clean-up after).
7. **CTA**: "Plánujete svadbu? *Porozprávajme sa.*" + "Kontaktujte nás" + Instagram and Facebook cards.
8. **Footer**: wordmark, nav, "© {year} Euflorea · Made with ♥ by [Legacy Upgrade](https://legacy-upgrade.com/)".

### Gallery (`/galeria`)

- Intro: eyebrow "Galéria" → "Naše *svadby*" → "Každá svadba je iná. Pozrite sa, ako sme ich oblečili do kvetov." (copy to confirm).
- Published albums only, as photo-print cards (cover, title, meta line: date or season · location). Order: `sort_order` asc, then `wedding_date` desc.
- Filter "Všetko" / "Svadby" / "Editoriály" by album `type`. Optional for v1.
- Empty state: "Čoskoro tu pribudnú naše svadby." + Instagram link.

### Album (`/galeria/{slug}`)

- Back link "← Všetky svadby", type eyebrow (Svadba / Editorial), title, meta line, optional description.
- Photo grid (masonry columns), lazy load all but the first 3.
- Lightbox: prev/next, counter "3 / 14", close "Zavrieť", keyboard (← → Esc), swipe, focus trap, focus returns to the clicked photo.
- "Ďalšia svadba →" to the next album, then the homepage CTA section.
- **404** for unknown or unpublished slugs. The homepage carousel album is never listed or reachable here.

### Contact (`/kontakt`)

1. Intro: eyebrow "Kontakt" → "Plánujete *svadbu*?" → "Napíšte nám termín a miesto a ozveme sa do dvoch dní."
2. Contact people: name, role, phone (`tel:`), email (`mailto:`). Data pending from the client.
3. Instagram and Facebook cards, **big and prominent** (client requirement).
4. Inquiry form on a taped paper sheet.

| Field | Label | Type | Required | Validation |
| --- | --- | --- | --- | --- |
| `name` | Meno a priezvisko | text | yes | max 120 |
| `email` | E-mail | email | yes | `email:rfc,dns` |
| `phone` | Telefón | tel | | max 30 |
| `wedding_date` | Dátum svadby | date picker | yes, unless `date_unknown` | today or later |
| `date_unknown` | Neviem presne | checkbox | | makes `wedding_date` optional |
| `venue` | Miesto svadby | text | | max 160 |
| `guests` | Približný počet hostí | select: do 30 / 30 až 60 / 60 až 100 / 100 až 150 / viac ako 150 | | in list |
| `services[]` | Čo vás zaujíma | checkbox chips: the 4 services | | subset of list |
| `message` | Vaša predstava | textarea (6 rows) | yes | max 3000 |
| `consent` | Súhlasím so spracovaním osobných údajov (link to privacy page) | checkbox | yes | accepted |
| `website` | honeypot, visually hidden | text | | must be empty |

## 7. Key user flows

**Couple sends an inquiry:** opens Kontakt (from header, CTA or menu) → fills the form → submits. On success the form is replaced with a thank-you card and a toast; the inquiry is stored and a mail is queued to the studio (plus an optional confirmation to the couple). On validation errors: inline messages under fields and a summary for screen readers; input is kept. When rate limited: an error toast, nothing stored. A filled honeypot is silently accepted and dropped.

**Studio publishes a wedding:** logs in → Admin → new album (title, slug auto from title, type, date, location, description) → uploads photos (drag and drop or picker, progress per file) → orders them, writes alt text, taps each thumbnail to set its focal point, picks the cover → toggles Published. The album appears in the Gallery. Responsive image variants are generated on the queue; until they exist the original is never served (the photo is skipped or shown as a placeholder in admin).

**Studio swaps carousel photos:** edits the homepage carousel album like any other album; order and focal points drive the hero.

## 8. Domain model

**Glossary:** *Album* (one wedding or editorial shoot), *Svadba* (wedding, `wedding`), *Editorial* (styled promo shoot, `editorial`), *Cover* (the album's card photo), *Focal point* (x/y % kept visible when a photo is cropped), *Homepage carousel* (the special album driving the hero), *Inquiry* (contact form submission).

```
albums
  id, title, slug (unique), type enum('wedding','editorial') default 'wedding',
  wedding_date date null, location string null, description text null,
  cover_photo_id fk null, is_published bool default false,
  is_homepage_carousel bool default false, sort_order int default 0, timestamps

photos
  id, album_id fk (cascade), alt string null,
  focal_x tinyint default 50, focal_y tinyint default 50,
  sort_order int default 0, timestamps
  file + responsive variants: spatie/laravel-medialibrary (one media item per photo)

inquiries
  id, name, email, phone null, wedding_date date null, date_unknown bool,
  venue null, guests null, services json null, message text,
  handled_at timestamp null, ip, user_agent, timestamps
```

Relations: Album hasMany Photo (ordered by `sort_order`), Album belongsTo cover Photo. Album lifecycle: `draft (is_published = false) → published`.

## 9. Business rules

- Only one album may have `is_homepage_carousel`; it is never shown in the Gallery and does not need to be published.
- A cover must be one of the album's own photos; deleting the cover photo clears `cover_photo_id` (cards fall back to the first photo).
- Deleting an album deletes its photos and their files.
- Slug: generated from the title (Slovak diacritics stripped), editable, unique.
- The same photo must not appear twice inside one album or in a "latest work" strip (the carousel may reuse album photos).
- Contact form: rate limited to 5 submissions per hour per IP; `ip` and `user_agent` stored with each inquiry.
- Copy: Slovak only, formal "vy" toward the couple, "we" voice. **No em/en dashes** in copy, no lorem ipsum. "sezónne kvety", "na mieru" and "ozveme sa do dvoch dní" are not yet confirmed by the client.
- Dates shown as `DD.MM.YYYY`, 24-hour time.

## 10. Notifications

| Trigger | Recipient | Channel | Content |
| --- | --- | --- | --- |
| Inquiry submitted | Studio (recipient address pending) | Mail, queued | All form fields, reply-to the couple |
| Inquiry submitted (optional) | The couple | Mail, queued | Thank you + copy of their message |
| Inquiry submitted | Visitor | Sonner toast + success card | "Ďakujeme! Ozveme sa vám do dvoch dní." |
| Admin save / delete / upload | Admin user | Sonner toast via flash | Success or error |

## 11. Integrations

- **Instagram** `https://www.instagram.com/euflorea_/` and **Facebook** (URL pending): outbound links only, no API or embeds.
- **Mail:** inquiry mails must work without a paid mail service (solution to be decided later). Inquiries are always stored in the DB first, so nothing is lost while mail is not set up.
- **Storage:** spatie/laravel-medialibrary; WebP variants on the `public` disk, originals on a private disk; S3-compatible later if needed.
- **Analytics:** none decided; if added, cookie-less (e.g. Plausible) to avoid a consent banner.

## 12. Non-functional requirements

- **Language:** website Slovak only (`<html lang="sk">`); code, comments and docs in English. Time zone Europe/Bratislava.
- **Devices:** mobile first, verified at 390px; no horizontal overflow, ≥44px touch targets, no drag-only interactions.
- **Rendering:** client-side Inertia, no SSR. Per-page `<title>`, Slovak meta description, canonical URL and OG tags via `laravel/head`.
- **Images:** every photo (initial import and admin uploads alike) goes through one `spatie/laravel-medialibrary` pipeline. The uploaded original is stored on a **private** disk, never served, and kept only to regenerate variants. The site serves **WebP only** (quality ~82, a balance of quality and fast loads) in responsive widths (e.g. 480, 800, 1200, 1800, 2400), EXIF stripped (GPS) and orientation respected, generated on the queue (a queue worker must run). No AVIF or JPEG fallback. Render with `srcset` + `sizes`, explicit `width`/`height`, lazy loading except above the fold, focal point → `object-position: {focal_x}% {focal_y}%`. Hero first slide `fetchpriority="high"`.
- **Initial content:** photos are content, not code; the database plus storage is their source of truth and must be in server backups. The initial albums are loaded by an idempotent `photos:import {path}` artisan command (skips albums whose slug exists) that uses the same pipeline as admin uploads. See `PLAN.md` for the one-time production flow.
- **Performance:** homepage LCP under 2.5s on 4G (the hero carousel image is the LCP).
- **Accessibility:** WCAG 2.2 AA, see `DESIGN.md` §10.
- **Privacy:** GDPR. Self-hosted fonts (no Google Fonts CDN), privacy policy page, explicit consent checkbox on the form, no tracking cookies.
- **SEO:** `sitemap.xml` including albums, `robots.txt`, JSON-LD `Florist` with Instagram and Facebook in `sameAs`, OG image (logo on paper 1200×630 or album cover).

## 13. Roadmap

Build order and progress are tracked in `PLAN.md`. v1 = everything marked Must and Should above.

## 14. Open questions

Tracked with checkboxes in `PLAN.md` → "Open items".
