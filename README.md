# Euflorea

Website for Euflorea, a small Slovak wedding and floral styling studio. Couples planning a wedding browse real weddings and editorial shoots as photo albums, send an inquiry through the contact form and are sent on to Instagram and Facebook. A simple admin lets the studio manage albums, photos and the homepage carousel. Slovak only, mobile first, in the "Herbár" design: warm paper, taped photo prints, plum.

## Documentation

- `PRODUCT.md` — product specification: users, pages, domain, business rules.
- `DESIGN.md` — "Herbár" design system: tokens, typography, components. Follow it for all UI work.
- `PLAN.md` — build order with checkboxes, content to seed, open items.
- `CLAUDE.md` + `.ai/rules/` — coding rules and conventions for contributors and AI agents.
- `_handoff/` (local only, gitignored) — original design handoff: approved homepage reference HTML, screenshots and the client's full-quality photos.

## Stack

- PHP 8.5, Laravel 13, MySQL
- Inertia.js v3 + React 19 (React Compiler) + TypeScript, Tailwind CSS v4, ShadCN (Radix), sonner (toasts), lucide-react (admin and form icons only); client-side rendering only (SSR off); light theme only
- Laravel Fortify (auth, email verification routes, 2FA), Laravel Wayfinder (typed routes), Laravel Head (document head)
- `spatie/laravel-data` (DTOs), `spatie/laravel-typescript-transformer` (TS codegen), `spatie/laravel-query-builder` (filtering/sorting), `spatie/laravel-permission` (installed, unused for now: no roles, any logged-in user can do everything)
- Self-hosted fonts via `@fontsource` (Cormorant Garamond, Jost), `embla-carousel-react` (lightbox swipe); being added (see `PLAN.md`): `spatie/laravel-medialibrary` (photos and responsive variants)

## Assets

- `resources/images/brand/logo-plum.png` — working logo (wordmark + sprig, transparent). The tagline is rendered as text. `logo-original.jpg` is the client's original, reference only.
- `resources/images/svg/` — source drawings of the line art and icons; used on the site as React components in `resources/js/components/site/icons.tsx`.
- `resources/images/paper-grain.webp` — tiling paper grain; `resources/images/home/` — the "Ako to rastie" background in three WebP widths.
- Photos are uploaded through the admin; the seeder imports the initial albums from `_handoff/photos/` when present.
- Dev: Laravel Boost (AI guidelines + MCP), Laravel IDE Helper (model doc blocks), Debugbar, Checkpoint, Rapidlogin
- Quality: Pest (feature + arch tests), Larastan with banned-code rules, Pint, Vite+ (`vp check`: oxlint + oxfmt)

## Local development

Served by **lerd** at `https://euflorea.test` (`.lerd.yaml`); lerd provides `php`, `composer`, `node` and `npm`. Requires Node 26+.

```bash
# first run
lerd link                    # register the site (HTTPS via .lerd.yaml)
lerd env                     # point .env at lerd's services
composer install
npm install
php artisan migrate --seed   # seeds admin@example.com / password with the "admin" role

composer resetup             # full reinstall + npm install + migrate:fresh --seed

# frontend (lerd serves PHP)
npm run dev                  # Vite dev server / HMR
npm run build                # production build

# codegen — run after backend changes
php artisan wayfinder:generate --with-form   # regenerate @/routes + @/actions (keep --with-form)
php artisan typescript:transform             # regenerate App.Data.* types
composer models                              # regenerate model doc blocks (also runs on composer update)

# tests (MySQL database `euflorea_test`, see phpunit.xml)
php artisan test --compact

# quality (run manually)
composer pint
composer larastan
npm run check                # lint + format check (npm run check:fix to fix)
npm run types:check          # tsc
```

> Wayfinder note: the Vite plugin generates route helpers with `formVariants: true` (`vite.config.ts`). When regenerating from the CLI, always pass `--with-form`, otherwise pages that use `route.form()` (auth/settings) break.

## Architecture

### Requests, DTOs and TypeScript

Every action that takes input type-hints a FormRequest (`app/Http/Requests/{Module}`), which validates and authorizes. Its `toData()` method maps `$this->validated()` to a `spatie/laravel-data` DTO, and the controller works only with that DTO from there on — it never reads raw request input or type-hints `Illuminate\Http\Request`.

DTOs live in `app/Data/{Module}`, carry no validation, and are also what controllers return from `Inertia::render`. Each is annotated `#[TypeScript]` and compiled to ambient `App.Data.{Module}.*` types in `resources/js/generated/generated.d.ts` by `php artisan typescript:transform` (config in `app/Providers/TypeScriptTransformerServiceProvider.php`). React pages use those types rather than re-declaring interfaces.

Caveat: laravel-data's bundled `DataTypeScriptTransformer` targets typescript-transformer v2 and breaks on v3, so the project uses the v3-native `AttributedClassTransformer` plus Carbon → `string` type replacements.

### Toasts

Controllers flash toasts with `Inertia::flash('toast', ['type' => 'success', 'message' => __('…')])`; the `useFlashToast` hook renders them with sonner. Failed writes are caught, logged, and flashed as `error` toasts.

### Forms

Forms use Inertia's `<Form>` with Wayfinder `.form()` helpers. While submitting, the contents are wrapped in `<fieldset disabled={processing}>` and the submit button shows a spinner.

### Listing pages

Index pages use `spatie/laravel-query-builder` for search, filtering, and sorting with `paginate(20)`. An `Index{Model}Request` validates the query params; the controller returns DTO rows, a pagination `meta` block, the filter options, and the active `filters`/`sort`. The React page mirrors that state to the URL (`router.get` with `preserveState`/`replace`), debounces only the search box (300ms), and applies filters/sort/pagination instantly.

### Migrations

Migrations never reference app classes (models, enums, …). Data inserted by a migration uses `DB::table(...)` and hardcoded values, so each migration stays an immutable, dependency-free snapshot. Seeders may use models and factories.

### Strict Eloquent

Models are not unguarded. Outside production, `Model::shouldBeStrict()` makes lazy loading, reading unselected attributes, and mass assigning non-fillable attributes throw; in production, lazy loading is logged as a warning instead.

### Architecture tests

`tests/Unit/ArchTest.php` enforces the conventions above: FormRequests extend `FormRequest`, are suffixed `Request` and expose `toData()`; controllers never use the raw request; DTOs extend `Data` with `#[TypeScript]`; models use `HasFactory` and declare `#[Fillable]`.
