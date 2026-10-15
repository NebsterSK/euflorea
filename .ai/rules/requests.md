---
paths:
  - 'app/Http/Requests/**'
---

# Requests

## FormRequests validate, authorize and map to a DTO
One FormRequest per action in `app/Http/Requests/{Module}`, suffixed `Request`. Define `rules()` with Laravel's array syntax and authorization in `authorize()`.
Every FormRequest that carries a payload has a `toData(): SomeData` method building the Data object from `$this->validated()` (e.g. `PostData::from($this->validated())`). Controllers call `$request->toData()` and never touch validated input directly.
