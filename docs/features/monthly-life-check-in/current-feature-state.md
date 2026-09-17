# Current Feature State

## Status

Scaffolding

## One-paragraph summary

Product framing for **This Month** + **the File** is locked. App chrome is now a shadcn sidebar shell (This Month, The File) with auth temporarily off.

## What is currently true

- Workspace created 2026-09-17 via `/feature-development`
- Operator chose Option B, then asked for flows plus a File page (expenses + life changes e.g. moving)
- [pitch.md](./pitch.md), [prds/feature.prd.md](./prds/feature.prd.md), [user-flows.md](./user-flows.md) written
- Web app has a shadcn sidebar shell: `/` (This Month), `/file` (The File)
- Auth session checks are disabled so UI work can proceed without login

## Active phase

**UI scaffold:** app shell, no check-in or File add yet

## Active tasks

none

## Assumptions

- No push notifications or deadline countdowns
- File is the return object; euro refund is not the hero
- English UI for hackathon speed; German tax meaning in the engine
- First visit may offer year catch-up but must not force it
- Five yes/no questions is the monthly ceiling; follow-ups only on yes
- File-add does not complete the month; check-in skips topics already on file this month
- First slice types: move, job, WFH, expense; family optional

## Last completed work

- 2026-09-17: User flows + File page model; PRD updated
- 2026-09-17: Scaffolded shadcn sidebar app shell; disabled auth gating

## Next recommended action

- Build File (true today + timeline + add) and the monthly check-in inside the existing shell

## Blockers

- None

## Open questions

- File only vs labeled euro footnote
- English vs German UI copy
- Catch-up-the-year as default first visit vs empty File
- Confirm: File-add does not complete This Month

## Known risks

- Weak organic return without notifications
- Two concepts (File vs This Month) to explain in a demo
- Judges may still expect a money number (Option A)

## Last verification

- 2026-09-17: Browser-checked `/` with sidebar nav and collapse, `/dashboard` redirects home without login, `/login` has no app chrome. `/file` added after flows named The File.

## Entry points

- Docs: [user-flows.md](./user-flows.md), [prds/feature.prd.md](./prds/feature.prd.md), [pitch.md](./pitch.md)
- Code: `apps/web/src/components/app-shell.tsx`, `apps/web/src/pages/index.astro`, `apps/web/src/pages/file.astro`
