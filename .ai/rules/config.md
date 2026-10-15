---
paths:
  - 'app/**'
  - 'routes/**'
  - 'bootstrap/**'
---

# Config

## Never set config at runtime
Don't change config from application code: no `config([...])`, `config()->set()` / `->push()` / `->prepend()`, or `Config::set()`. It is hidden global state that leaks across requests and jobs on long-running workers, breaks with cached config, and hides the real dependency. Define values in `config/*.php` / `.env`, or pass them explicitly (constructor, method argument, DTO). Reading config with `config('key')` is fine. Tests are exempt: `config([...])` is the standard way to arrange state there.
