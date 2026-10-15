# Euflorea

A starter template for personal Laravel apps — Laravel, Inertia, and React with typed routes and a ShadCN-based UI, based on the official Laravel React starter kit. Clone it as the baseline for a new project, then build features on top of the conventions below.

> When starting a project: replace the title and the paragraph above with a 2–3 sentence recap of `PRODUCT.md` (what it is, who it's for, what it does).

## Documentation

- `PRODUCT.md` — product specification: users, features, domain, business rules, roadmap.
- `DESIGN.md` — frontend design system: tokens, typography, spacing, component usage.
- `CLAUDE.md` + `.ai/rules/` — coding rules and conventions for contributors and AI agents.

## Stack

- PHP 8.5, Laravel 13, MySQL
- Inertia.js v3 + React 19 (React Compiler) + TypeScript, Tailwind CSS v4, ShadCN (Radix), sonner (toasts), lucide-react (icons); client-side rendering only (SSR off)
- Laravel Fortify (auth, email verification routes, 2FA), Laravel Wayfinder (typed routes), Laravel Head (document head)
- `spatie/laravel-data` (DTOs), `spatie/laravel-typescript-transformer` (TS codegen), `spatie/laravel-query-builder` (filtering/sorting), `spatie/laravel-permission` (roles & permissions)
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
