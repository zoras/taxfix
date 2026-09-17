# Maintenance Rules

## Purpose

Keep feature docs accurate without ceremony. Update the minimum set of docs when something meaningful changes.

## Maintenance Tiers

| Tier         | When                                                      | What to update                                                                             |
| ------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **None**     | No meaningful progress (read-only resume, quick check)    | Nothing                                                                                    |
| **Progress** | Task/phase work completed or status changed               | `current-feature-state.md`, affected task file(s), phase status in `roadmap.md` if changed |
| **Handoff**  | Session end with meaningful progress, phase exit, or ship | Full session-end checklist below                                                           |

Do not run the full session-end checklist for no-change sessions.

## Update Triggers

| Document                           | Update when                                             |
| ---------------------------------- | ------------------------------------------------------- |
| `current-feature-state.md`         | Meaningful progress, handoff, status/phase/task change  |
| `decision-log.md`                  | Real decision made or superseded                        |
| `CONTEXT.md` (repo root)           | Domain term crystallized or meaning changed             |
| `docs/adr/*`                       | Operator accepted an ADR offer (three criteria)         |
| `roadmap.md`                       | Phase status or task set changes (not per-task status)  |
| `prds/phase-XX.prd.md`             | Requirements change for active phase                    |
| `prds/feature.prd.md`              | Product intent changes (rare)                           |
| `tasks/phase-XX-task-YY-<slug>.md` | Task scope, status, expected files, or evidence changes |
| `research/<topic>.md`              | Add correction section — do not rewrite findings        |

## Do NOT Update Mechanically

- After every small code edit
- Decision log for convention-following choices
- Roadmap for every PR merge — batch at task/phase boundaries
- Research artifacts when nothing new was learned
- Current state on no-change sessions

## Single Source of Truth

| Information                    | Authoritative doc                                                                   |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| Where are we now?              | `current-feature-state.md`                                                          |
| What do these words mean?      | Root `CONTEXT.md`                                                                   |
| Why did we choose X? (durable) | `docs/adr/` when an ADR exists; else feature `decision-log.md`                      |
| Why did we choose X? (working) | `decision-log.md` (summary + log)                                                   |
| What phases exist?             | `roadmap.md`                                                                        |
| What must this phase deliver?  | `prds/phase-XX.prd.md`                                                              |
| What work happens next?        | Active phase task table + `current-feature-state.md` **Active tasks**               |
| Task status?                   | Each `tasks/phase-XX-task-YY-<slug>.md` **Status** field                            |
| What stack areas and proof?    | Relevant task's implementation requirements, test coverage, and completion evidence |

Avoid duplicating full PRD content or task status in current state.

## Open Questions and Assumptions Hygiene

- Remove from `current-feature-state.md` when resolved
- Move to decision log if resolution was a decision
- Record defaults as **Assumptions** when proceeding without operator confirmation
- Remove assumptions when promoted to a decision or invalidated

## Blockers

Record explicitly in current state:

```markdown
## Blockers

- **<title>:** <what is blocked, by whom/what, since when>
```

Clear blockers when resolved; note resolution in last completed work.

## Source Control

The feature workspace is the continuity mechanism only if it is **committed**. Uncommitted docs are lost context for the next session.

- **Session start:** run `git status` and note pre-existing uncommitted changes.
- **Session end (handoff tier):** after updating `current-feature-state.md`, **offer to commit** the `docs/features/<slug>/` updates together with related code and any `CONTEXT.md` / `docs/adr/` changes.
- **Approval required:** never commit without the user's explicit go-ahead (repo git-safety rule). Propose the commit and message; let the user confirm.
- **Coherent commits:** keep each task's docs + code in one commit. Follow the repo's existing commit-message style (inspect recent `git log`).
- Do **not** push unless the user asks.
- If the user declines commit, note uncommitted WIP in `current-feature-state.md` **Next recommended action**.

## Session-End Checklist

Run at **handoff tier** only — meaningful progress, phase exit, or ship:

- [ ] `current-feature-state.md` reflects actual status and next action
- [ ] Active phase status in `roadmap.md` is accurate
- [ ] Active task links in current state are accurate (status read from task files; include all non-complete tasks)
- [ ] New decisions appended to `decision-log.md` (if any)
- [ ] `CONTEXT.md` updated if terms crystallized; ADR offered only if criteria met
- [ ] Open questions pruned; assumptions still valid or removed
- [ ] Last verification updated if implementation ran
- [ ] Blockers recorded or cleared
- [ ] Offered to commit workspace + code + any `CONTEXT.md`/`docs/adr/` updates (with user approval; never push unprompted)

## On Ship

When the feature is done:

1. Set status `Shipped` in `current-feature-state.md`
2. Keep `docs/features/<slug>/` as the historical working record
3. Light graduation only: sync durable terms into `CONTEXT.md` and add any
   still-missing qualifying ADRs ([domain-context.md](./domain-context.md)) —
   do not copy PRDs/tasks into `docs/adr/`

## Relationship to AGENTS.md

Each phase task includes a **Test coverage** section:

- Pure functions and utilities to test (prefer `it.each`, exhaustive cases)
- Spec files to add/update
- Component tests when the change warrants them

Respect **Boundaries — Ask before doing** (Drizzle/migrations, deps, routes, auth, env).

## Anti-drift

- If code and docs disagree, **fix docs or code** — do not leave silent drift
- If resuming and docs are stale, trust code + update docs in first action
- Never mark/start the next phase before every current-phase task and exit criterion is complete
- Prefer updating current state over creating new summary files
