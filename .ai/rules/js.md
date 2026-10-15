---
paths:
  - 'resources/js/**'
---

# Js

## File naming follows the React starter kit

Name files in kebab-case (`delete-user.tsx`, `use-flash-toast.ts`); hooks live in `resources/js/hooks`, pages in `resources/js/pages`. Inertia page names match the file path (`Inertia::render('settings/profile')`).

## Type props with the generated ambient types

Use the generated `App.Data.{Module}.*` types for props. Never hand-write DTO interfaces.

## Add UI components with the ShadCN CLI

Add ShadCN components with `npx shadcn@latest add <component>`; check for an existing component before writing a new one.
For frontend bugs or precise styling, use the Chrome DevTools MCP to diagnose and verify.

## Forms disable themselves while processing

Wrap the `<Form>` render-prop contents in `<fieldset disabled={processing}>` and put `{processing && <Spinner />}` in the submit button.
Put the form's `space-y-*` spacing on the fieldset, not on `<Form>` — `space-y-*` only spaces direct children. Use `className="contents"` only when `<Form>` spaces its children with flex/grid `gap`.

## Pass Wayfinder route functions directly

Pass the route function to `href` directly (`href={dashboard()}`); do not call `.url()`. Spread `.form()` into `<Form>` (`<Form {...store.form()}>`).
The homepage route is named `index`, not `home`.

## Toasts come from Inertia flash data

Show toasts by flashing from the controller (`Inertia::flash('toast', ['type' => 'success', 'message' => __('…')])`); `useFlashToast` renders them. Don't call `toast()` for server outcomes.

## Listing pages sync state to the URL

`router.get(url, query, { preserveState: true, preserveScroll: true, replace: true })`, toggling a `loading` state in `onStart` / `onFinish`.
Debounce only the search input (300ms) — filters, sort, clear and pagination are instant.
Disable controls while loading except the search input, and dim the table body.

## Listing page controls

Order filter controls to match the table column order.
Build multiselect filters with `DropdownMenuCheckboxItem` + `onSelect={(event) => event.preventDefault()}`.
Always provide sortable headers, pagination, and a Clear-filters button that appears only when a filter or sort is active.

## Pointer cursor is global

`resources/css/app.css` gives every interactive element (buttons, links, menu/select/tab items, checkboxes, switches) `cursor: pointer` and disabled ones `cursor: not-allowed`. Don't add `cursor-pointer` per component, and don't add `cursor-default` to clickable shadcn items.
