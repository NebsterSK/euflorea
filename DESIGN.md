# Design system

The visual language and UI rules for this project's frontend. Every UI change follows this file. Tokens live in `resources/css/app.css`; components in `resources/js/components/ui` (ShadCN, `new-york` style, `neutral` base).

> **Template note:** values below are the starter kit defaults. When starting a project, replace each `TODO` and update the token tables to match `app.css`. Keep this file and `app.css` in sync.

## 1. Principles

TODO: 3–5 adjectives describing the look and feel (e.g. calm, dense, utilitarian), reference products or moodboard links, and what the design must never feel like.

- Mobile-first: write the phone layout first (unprefixed classes), enhance with `sm:` / `md:` / `lg:`.
- Semantic tokens only: `bg-primary`, `text-muted-foreground`, `border-border`. Never raw palette classes (`bg-blue-500`) or hex/oklch values in components.
- Reuse before creating: existing `components/ui` and app components first, then `npx shadcn@latest add`, then a new component.

## 2. Color

All colors are OKLCH CSS variables in `:root` (light) and `.dark` (dark), exposed to Tailwind via `@theme` as `--color-*`. Change a color in `app.css`, never per component.

| Token | Use | Light | Dark |
| --- | --- | --- | --- |
| `background` / `foreground` | Page background, body text | `oklch(1 0 0)` / `oklch(0.145 0 0)` | `oklch(0.145 0 0)` / `oklch(0.985 0 0)` |
| `card` / `card-foreground` | Cards, panels | `oklch(1 0 0)` / `oklch(0.145 0 0)` | `oklch(0.145 0 0)` / `oklch(0.985 0 0)` |
| `popover` / `popover-foreground` | Dropdowns, popovers, tooltips | `oklch(1 0 0)` / `oklch(0.145 0 0)` | `oklch(0.145 0 0)` / `oklch(0.985 0 0)` |
| `primary` / `primary-foreground` | Main actions, active state | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` | `oklch(0.985 0 0)` / `oklch(0.205 0 0)` |
| `secondary` / `secondary-foreground` | Secondary actions | `oklch(0.97 0 0)` / `oklch(0.205 0 0)` | `oklch(0.269 0 0)` / `oklch(0.985 0 0)` |
| `muted` / `muted-foreground` | Subtle backgrounds, helper text | `oklch(0.97 0 0)` / `oklch(0.556 0 0)` | `oklch(0.269 0 0)` / `oklch(0.708 0 0)` |
| `accent` / `accent-foreground` | Hover and selected items | `oklch(0.97 0 0)` / `oklch(0.205 0 0)` | `oklch(0.269 0 0)` / `oklch(0.985 0 0)` |
| `destructive` | Delete, errors | `oklch(0.577 0.245 27.325)` | `oklch(0.396 0.141 25.723)` |
| `border` / `input` | Borders, input borders | `oklch(0.922 0 0)` | `oklch(0.269 0 0)` |
| `ring` | Focus ring | `oklch(0.87 0 0)` | `oklch(0.439 0 0)` |
| `chart-1` … `chart-5` | Data visualisation series | see `app.css` | see `app.css` |
| `sidebar-*` | Sidebar surface, items, border, ring | see `app.css` | see `app.css` |

TODO:
- Brand color: set `primary` (and `ring`, `sidebar-primary`) to the brand hue; keep lightness so `primary-foreground` passes WCAG AA (4.5:1 for text).
- Status colors: add `success`, `warning`, `info` (+ `-foreground`) tokens in `:root`, `.dark` and `@theme` before using status UI. Don't fake them with `green-*` / `amber-*`.
- Opacity modifiers (`bg-primary/90`, `ring-ring/50`) are fine for hover and focus states.

## 3. Typography

Font: **Instrument Sans** (400, 500, 600), loaded via the Bunny fonts option in `vite.config.ts`, set as `--font-sans`. TODO: replace if the brand needs a different typeface; add `--font-mono` / display font here if used.

| Role | Classes |
| --- | --- |
| Page title (`Heading`) | `text-xl font-semibold tracking-tight` |
| Section title (`Heading variant="small"`) | `text-base font-medium` |
| Card title | `font-semibold leading-none` (ShadCN `CardTitle`) |
| Body | `text-sm` (default UI size) |
| Helper / description | `text-sm text-muted-foreground` |
| Label | `text-sm font-medium` (ShadCN `Label`) |
| Fine print, meta | `text-xs text-muted-foreground` |
| Numbers in tables / stats | add `tabular-nums` |

- Weights: 400 body, 500 labels and emphasis, 600 headings. No 700+.
- Use the `Heading` component for page and section titles; don't hand-roll title markup.
- Dates in `DD.MM.YYYY` (or ISO), 24-hour time. TODO: locale and number format.

## 4. Spacing and layout

Tailwind's 4px scale. Prefer `gap-*` and `space-y-*` over margins.

| Context | Value |
| --- | --- |
| Inside controls | `px-3`–`px-4`, height from component size |
| Form fields stack | `space-y-6` between fields, `gap-2` label → input |
| Card padding | `px-6` + `py-6` / `gap-6` (ShadCN default) |
| Between cards / sections | `gap-4` (mobile) → `gap-6` (`md:`) |
| Page padding | `p-4` (as in `dashboard.tsx`) |
| Max content width | `max-w-7xl` app content (`app-content.tsx`); TODO narrow width for forms |

Breakpoints: Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536). Every screen must work at ~390px: no horizontal page overflow, tables scroll inside their own container.

## 5. Shape and elevation

- Radius: `--radius: 0.625rem`; use `rounded-lg` (cards, dialogs), `rounded-md` (buttons, inputs), `rounded-sm` (small items), `rounded-full` (avatars, pills).
- Borders: 1px `border` (color comes from `border-border` globally). Separate regions with borders before shadows.
- Shadows: `shadow-xs` on controls, `shadow-sm` on cards, `shadow-lg` only on overlays (dialog, popover). TODO: adjust if the brand is flatter or more elevated.

## 6. Icons

`lucide-react` only. Default `size-4` (buttons set this automatically), `size-5` in navigation, `size-3.5` in badges. Icons inherit text color; icon-only buttons need `size="icon"` and an `aria-label` or `sr-only` text.

## 7. Motion

`tw-animate-css` provides enter/exit animations for Radix overlays. Keep transitions 150–200ms, `transition-colors` / `transition-[color,box-shadow]`. No decorative motion on data screens. Respect `motion-reduce:`.

## 8. Components

Variants are defined with `cva` in each `components/ui` file. Add a variant there instead of overriding with `className` in many places.

### Buttons

| Variant | Use |
| --- | --- |
| `default` | The one primary action per view/section |
| `secondary` | Alternative actions |
| `outline` | Neutral actions next to a primary (Cancel, Filter) |
| `ghost` | Toolbar, table row and icon actions |
| `destructive` | Delete / irreversible, always behind a confirm dialog |
| `link` | Inline navigation inside text |

Sizes: `sm` (h-8, tables, toolbars), `default` (h-9), `lg` (h-10, marketing / auth CTAs), `icon` (size-9). Submit buttons show `<Spinner />` while processing. Primary action sits right on desktop, full width on mobile when alone.

### Forms

ShadCN `Label` + `Input` / `Select` / `Checkbox`, `InputError` under the field, `PasswordInput` for passwords. Errors use `aria-invalid` styling, never color alone. Rules for `<Form>` and processing state are in `.ai/rules/js.md`.

### Cards and sections

- `Card` with `CardHeader` (`CardTitle`, `CardDescription`), `CardContent`, `CardFooter` for grouped content and dashboard widgets.
- Page = `Heading` + content sections; a section is a `Heading variant="small"` + its content, separated by `Separator` or spacing, not nested cards.
- Don't nest cards inside cards. TODO: grid patterns (e.g. stats row `grid gap-4 sm:grid-cols-2 lg:grid-cols-4`).

### Navigation

- App shell: sidebar layout (`layouts/app/app-sidebar-layout.tsx`, ShadCN `Sidebar`), `variant="inset"`, `collapsible="icon"` on desktop, `Sheet` on mobile. Header layout is available as an alternative (`app-header-layout.tsx`).
- Main nav items in `nav-main.tsx`, user menu in `nav-user.tsx`, footer links in `nav-footer.tsx`. Active item uses `sidebar-accent`.
- Breadcrumbs on every app page below the top level.
- TODO: public/marketing navbar style if the project has public pages.

### Tables and listing pages

TODO: table component choice (ShadCN `table` is not installed yet). Header `text-muted-foreground text-xs font-medium`, row hover `bg-muted/50`, numeric columns right-aligned with `tabular-nums`, horizontal scroll on mobile. Behavior rules are in `.ai/rules/js.md`.

### Feedback

| Need | Component |
| --- | --- |
| Result of an action | Toast (sonner via flash, see `.ai/rules/js.md`) |
| Persistent inline message | `Alert` (`default` / `destructive`) |
| Status label | `Badge` (`default`, `secondary`, `outline`, `destructive`) |
| Confirm / focused task | `Dialog`; side panel / mobile menu: `Sheet` |
| Loading content | `Skeleton` matching the final layout; deferred props always get one |
| Loading action | `Spinner` in the triggering button |
| Hint | `Tooltip` (never the only place for essential info) |

### Empty, error and loading states

Every list and widget defines an empty state: icon (`size-8 text-muted-foreground`), one line of text, and the primary action. TODO: error page (`403`, `404`, `500`) design.

## 9. Dark mode

Light, dark and system via the `appearance` setting (`use-appearance` hook toggles `.dark` on `<html>`). Every new token gets a `.dark` value; check every new screen in both modes.

## 10. Accessibility

WCAG AA contrast, visible focus (`focus-visible:ring-[3px] ring-ring/50`, built into components), touch targets at least 36–40px, no drag-only interactions, labels on every input, `alt` on images, semantic headings in order.

## 11. Copy and tone

TODO: voice (formal / friendly), language(s), capitalization (sentence case for buttons and titles), button wording (verbs: "Save", "Delete project").
