---
paths:
  - 'database/migrations/**'
---

# Migrations

## Never reference app classes

Do not reference enums, models, or other app classes in migrations — they change or disappear while old migrations must still run.

## Insert data with the query builder

When a migration inserts data, hardcode the values and write them with `DB::table(...)`, not Eloquent models.
