# Current Feature State

## Status

Scaffolding

## One-paragraph summary

**This Month** is a calendar dashboard plus a five-question check-in dialog. Tax Memory (zoras PR #3) is absorbed as related vision/tagline, not a rename. OCR, agents, and a second File page stay parked.

## What is currently true

- Workspace created 2026-09-17 via `/feature-development`
- Operator chose Option B
- Live UI: one calendar page (`/`) with year sections and a check-in dialog; auth off
- [pitch.md](./pitch.md), [prds/feature.prd.md](./prds/feature.prd.md) updated to calendar + Tax Memory vision
- Research: [german-tax-ontology-and-analogs.md](./research/german-tax-ontology-and-analogs.md), [tax-memory-absorption.md](./research/tax-memory-absorption.md)
- [user-flows.md](./user-flows.md) still describes the richer File-add model; that path is deferred

## Active phase

**UI scaffold:** calendar dashboard + check-in dialog (client localStorage)

## Active tasks

none

## Assumptions

- No push notifications or deadline countdowns
- Calendar year sections are the return object; euro refund is not the hero
- English UI for hackathon speed; German tax meaning in the engine
- First visit stays empty until the first check-in; do not force catch-up
- Five yes/no questions is the monthly ceiling; follow-up mini-forms deferred
- File-add / second route deferred; check-in is the only writer for now
- Tax Memory AI (OCR, agents, MCP, readiness %) only if the calendar slice is done
- Demo tax year **2026** (Pendlerpauschale €0.38 from km 1)
- Default **220** workdays (used if File-add / meter reopens)

## Last completed work

- 2026-09-17: User flows + File page model; later deferred in favor of calendar
- 2026-09-17: Scaffolded shadcn sidebar + calendar dashboard; disabled auth gating
- 2026-09-17: Ontology research
- 2026-09-17: Ingested Tax Memory from [PR #3](https://github.com/yarychh/taxfix/pull/3) as related vision

## Next recommended action

- Confirm calendar + check-in is the slice to demo; do not merge GH PR #3 as-is (File-era rewrite)

## Blockers

- None

## Open questions

- Year sections only vs labeled euro / lump-sum footnote
- English vs German UI copy
- Catch-up-the-year as default first visit vs empty calendar (default: empty)
- How far to show Tax Memory AI if time remains after the slice

## Known risks

- Weak organic return without notifications
- Judges may still expect a money number (Option A) or OCR wow (Tax Memory)
- user-flows.md still File-centric while PRD/code are calendar

## Last verification

- 2026-09-17: Browser-checked `/` with sidebar nav and collapse, `/dashboard` redirects home without login, `/login` has no app chrome. Calendar dashboard is the home surface.

## Entry points

- Docs: [prds/feature.prd.md](./prds/feature.prd.md), [research/tax-memory-absorption.md](./research/tax-memory-absorption.md), [user-flows.md](./user-flows.md)
- Code: `apps/web/src/components/calendar-dashboard.tsx`, `apps/web/src/lib/check-in.ts`, `apps/web/src/components/app-shell.tsx`
