# Phased Roadmap

## Purpose

Outcome-based, sequential phases that show delivery order and current status. Each phase contains tasks grouped into execution waves. The roadmap stays concise: phase PRDs own detailed contracts, and task files own implementation details and status.

## File Location

`docs/features/<feature-slug>/roadmap.md`

## Template

```markdown
# Roadmap: <Feature Name>

## Feature outcome

<What success looks like for users/system when fully shipped>

## Phase 0 — Discovery / framing (optional)

**Goal:** <framing only — skip if feature is already well understood>

**Exit criteria:**

- [ ] Problem and users validated
- [ ] Major unknowns identified or researched

**Status:** Not started | In progress | Complete | Skipped

---

## Phase 1 — <Thin vertical slice title>

**Goal:** <Smallest useful end-to-end outcome>

**User/system outcome:** <What a user can do after this phase>

**Dependencies:** <other phases, teams, infra — or "none">

**Phase PRD:** [phase-01.prd.md](./prds/phase-01.prd.md)

### Tasks

| Task                                                   | Wave | Buckets     | Outcome              |
| ------------------------------------------------------ | ---- | ----------- | -------------------- |
| [Phase 01 Task 01](./tasks/phase-01-task-01-<slug>.md) | 1    | Backend/API | <Workstream outcome> |

Task status is authoritative in each task file — do not duplicate here.

**Risks:**

- ...

**Exit criteria:**

- [ ] All phase PRD acceptance criteria met with task evidence
- [ ] All required phase tasks complete
- [ ] Task results integrated and verified together (per wave, then phase)
- [ ] Current state updated

**Status:** Not started | In progress | Complete

---

## Phase 2 — <Expansion / hardening>

...

## Phase 3 — Polish / rollout

...
```

## Phase Design Rules

1. **Phase 1 = vertical slice** — user-visible or system-observable outcome across stack
2. **Phases are sequential** — Phase N+1 waits for Phase N exit criteria
3. **Tasks within a phase use execution waves** — same-wave tasks are dependency-free and file-disjoint; later waves may depend on earlier waves
4. Individual tasks may be horizontal; their combined phase must deliver the vertical outcome
5. Phase 0 only when genuine discovery is needed — add it to the roadmap when Phase 0 criteria apply; the scaffold does not create Phase 0 by default
6. Active phases link one phase PRD and a task table with wave + bucket coverage
7. Task filenames include both phase and task number; numbers are identifiers, not order
8. Phase PRDs own detailed scope, contracts, and acceptance — do not duplicate them here
9. Keep future phases at headline level until they become active

## Status Values

| Status      | Meaning                                          |
| ----------- | ------------------------------------------------ |
| Not started | Phase not yet begun                              |
| In progress | Active phase — detailed PRD/tasks should exist   |
| Complete    | Exit criteria met with verification evidence     |
| Skipped     | Consciously deferred with reason in decision log |

Task status values (`Not started | In progress | Blocked | Complete`) live in task files only — see [phase-tasks.md](phase-tasks.md).

## Status Sync

| Layer   | Authoritative location        | Values                                                 |
| ------- | ----------------------------- | ------------------------------------------------------ |
| Feature | `current-feature-state.md`    | `Planning \| Building \| Blocked \| Paused \| Shipped` |
| Phase   | `roadmap.md`                  | `Not started \| In progress \| Complete \| Skipped`    |
| Task    | `tasks/phase-XX-task-YY-*.md` | `Not started \| In progress \| Blocked \| Complete`    |

**Transitions:**

- Feature `Planning` → `Building` when active phase moves to `In progress` or first task starts
- Feature `Building` → `Blocked` when a blocker prevents all forward progress (record in current state)
- Feature `Building` → `Paused` when work is intentionally deferred (not blocked)
- Feature `Blocked` / `Paused` → `Building` when work resumes
- Feature `Building` → `Shipped` when planned work is done (or remaining work consciously deferred) — set status only; keep the folder as history
- Phase `Not started` → `In progress` when its PRD and tasks exist and work begins
- Phase `In progress` → `Complete` when all exit criteria pass with evidence
- Task `Not started` → `In progress` when work begins on that task
- Task `In progress` → `Blocked` when blocked (note in task; link from current state **Active tasks**)
- Task `Blocked` → `In progress` when blocker clears
- Task `In progress` → `Complete` when completion rules pass (see [phase-tasks.md](phase-tasks.md))

A blocked task does not automatically change phase status — the phase stays `In progress` unless all work is blocked.

## Sync with Other Docs

- Active phase → `current-feature-state.md` **Active phase** field
- Started/incomplete tasks → `current-feature-state.md` **Active tasks** links (read status from task files)
- Active phase → create/update `prds/phase-XX.prd.md` and its `tasks/phase-XX-task-YY-*.md` files
- Phase complete → update status here + last verification in current state

## Anti-patterns

- "Phase 1: Create repository and DTOs" with no user outcome
- Phases named after files (`add-user.ts`)
- Starting the next phase before the current phase exit criteria pass
- Same-wave tasks with dependencies or overlapping files
- Duplicating task status in the roadmap task table
- Duplicating the detailed phase PRD acceptance contract
- Detailed tasks for Phase 3 before Phase 1 ships
- Marking Complete without verification evidence
