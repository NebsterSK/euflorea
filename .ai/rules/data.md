---
paths:
  - 'app/Data/**'
---

# Data

## One Data object per payload

Create one `spatie/laravel-data` `Data` object per payload in `app/Data/{Module}`, suffix it with `Data`, and annotate it with `#[TypeScript]`.
Data objects are plain typed DTOs: they carry validated input from a FormRequest's `toData()` onward and type output to the frontend. Do not hand-map arrays.

## No validation in Data objects

Validation and authorization live in the FormRequest. Do not add `rules()`, `authorize()`, `messages()`, `attributes()` or validation attributes (`#[Required]`, `#[Max(255)]`, …) to Data objects.

## Index query params

Validate `index()` query params in an `Index{Model}Request` (`filter.*`, `sort` via `Rule::in([...])`, `page` as `integer|min:1`). Its `toData()` returns the query Data object; model a nested `filter` as a nested Data object.

## Regenerate TypeScript after every change

Run `php artisan typescript:transform` after adding or changing a Data object.
The transformer is `AttributedClassTransformer` + `->replaceType(\Illuminate\Support\Carbon::class, 'string')` — do not use laravel-data's `DataTypeScriptTransformer`.
