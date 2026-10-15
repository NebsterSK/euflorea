---
paths:
  - 'app/Http/Controllers/**'
---

# Controllers

## Validate input with a FormRequest, then work with its DTO

Type-hint a FormRequest on every action that takes input, including `index()` query params (e.g. `store(StorePostRequest $request)`). It validates and authorizes before the method body runs; a failed validation redirects back with errors that Inertia picks up.
Call `$request->toData()` once at the top and use only the returned Data object from there on. Never read `$request->validated()`, `$request->input()` or request properties in the controller.
Never type-hint a Data object as action input (laravel-data would validate it a second time), and never type-hint `Illuminate\Http\Request` — actions without input take no request; use `#[CurrentUser]` for the authenticated user.

## Return Data objects from Inertia::render

Build output from models with `SomeData::from($model)` / `SomeData::collect(...)` and return those from `Inertia::render`. `store`/`update`/`destroy` `return back()`.

## Build index queries with laravel-query-builder

Query with `spatie/laravel-query-builder`: `allowedFilters(...)`, `allowedSorts(...)`, `defaultSort(...)`, `->paginate(20)`.
Pass spread arguments to `allowedFilters()` / `allowedSorts()`, never an array.
Search → `AllowedFilter::partial`. Filters → `AllowedFilter::exact` (comma-separated input becomes a `whereIn`).
Sort a related column with `AllowedSort::callback()` + a correlated subquery, not a join.

## Index responses carry meta, options and current state

Return `SomeData::collect($paginator->getCollection())` plus a `meta` array, the filter options, and the current `filters` / `sort`.

## Wrap writes in try/catch

Wrap `store`/`update`/`destroy` bodies in `try/catch (Throwable)`.
Log `exception_message`, `exception_file`, `exception_line`, plus `user_id` when authenticated.
On catch, flash an error toast (`Inertia::flash('toast', ['type' => 'error', 'message' => …])`) and redirect back. Flash a `success` toast after a successful write.
