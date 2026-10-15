# Product

What this product is, who it's for and what it must do. Code conventions live in `CLAUDE.md` and `.ai/rules/`; the UI design system in `DESIGN.md`.

> **Template note:** fill every `TODO` when starting a project. Keep it current: when scope or a business rule changes, update this file in the same change.

## 1. Summary

TODO: one paragraph: name, what it does, for whom, and why it exists. This is the source for the README intro.

## 2. Problem

TODO: the problem or pain today, who has it, how they solve it now, and why that isn't good enough.

## 3. Users

TODO: each user type / persona: who they are, their goal, how often they use the app, on which device (mobile / desktop), technical skill.

| Role | Who | Main goals | Permissions |
| --- | --- | --- | --- |
| `admin` | TODO | TODO | Everything (seeded role) |
| TODO | | | |

Roles map to `spatie/laravel-permission` roles.

## 4. Goals and non-goals

TODO:
- **Goals:** measurable outcomes the product must achieve.
- **Non-goals:** things explicitly out of scope, to stop scope creep.
- **Success metrics:** how we know it works (usage, time saved, revenue, error rate).

## 5. Features

TODO: features grouped by module, each with a priority (Must / Should / Could) and status (planned / in progress / done).

| Module | Feature | Priority | Status |
| --- | --- | --- | --- |
| Auth | Login, registration, password reset, email verification, 2FA (Fortify) | Must | done |
| Settings | Profile, password and 2FA, appearance | Must | done |
| TODO | | | |

## 6. Key user flows

TODO: the most important journeys step by step (e.g. "Customer creates an order: …"), including what happens on failure.

## 7. Domain model

TODO: glossary of domain terms (use these names in code and UI), main entities with their key attributes and relations, and lifecycles / states (e.g. `draft → submitted → approved`).

## 8. Business rules

TODO: rules the system enforces: validation, limits, permissions, calculations, deadlines, what can be edited or deleted and when.

## 9. Notifications

TODO: emails, in-app notifications and toasts: trigger, recipient, channel, content.

## 10. Integrations

TODO: external services and APIs (payments, mail provider, storage, SSO, webhooks), what data flows each way and what happens when they're down.

## 11. Non-functional requirements

TODO:
- Languages and localization, time zone, currency, date format.
- Devices and browsers (mobile-first by default).
- Performance and scale expectations (users, records, response time).
- Security, privacy and compliance (GDPR, data retention, audit log).
- Availability, backups, hosting and environments.

## 12. Roadmap

TODO: phases / milestones with their scope (MVP, v1, later).

## 13. Open questions

TODO: undecided items, who decides, and by when.
