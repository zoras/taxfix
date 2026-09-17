# Phase Tasks

## Purpose

Tasks are the executable workstreams inside a phase:

- **Phases are sequential.** Do not start Phase N+1 until Phase N meets its exit criteria.
- **Tasks within a phase are grouped into execution waves.** Tasks in the same wave are dependency-free and file-disjoint; later waves may depend on earlier waves.
- **The phase owns the vertical outcome.** Individual tasks may be horizontal (model, persistence, backend, frontend, infrastructure, tests, rollout).

Use tasks instead of a separate implementation plan, stack-impact document, or verification report.

## Location and Naming

Keep one flat folder:

```text
docs/features/<feature-slug>/tasks/
├── phase-01-task-01-backend-api.md
├── phase-01-task-02-admin-flow.md
└── phase-01-task-03-client-flow.md
```

- Filename: `phase-XX-task-YY-<short-kebab-scope>.md`
- Task number is a stable identifier, not execution order
- Numbering restarts at `01` within each phase
- No phase subfolders
- Create detailed tasks only for the active phase (or next phase during handoff)

## Execution Waves

Before approving a phase's tasks:

1. Load [implementation-buckets.md](implementation-buckets.md) and cover every relevant bucket.
2. Assign each task a **wave** number starting at `1`. Tasks in the same wave must be dependency-free and file-disjoint.
3. If Task B requires Task A's implementation, put Task B in a later wave (or the next phase if the dependency is too large).
4. Compare expected files/modules across tasks in the same wave. A file may appear in only one same-wave task.
5. If tasks meet at an API, DTO, event, or schema boundary, freeze that contract in the phase PRD before implementation.
6. Pair tests with the task that owns the implementation unless a separate test workstream is genuinely conflict-free within the same wave.

When a shared file is unavoidable, assign it to one task and keep it out of all other same-wave task scopes.

**Wave integration gate:** After each wave completes, verify its tasks integrate before starting the next wave.

## Task Template

```markdown
# Phase XX Task YY: <Scope>

## Status

Not started | In progress | Blocked | Complete

## Phase, wave, and buckets

- Phase PRD: [Phase XX](../prds/phase-XX.prd.md)
- Roadmap: [Feature roadmap](../roadmap.md)
- Wave: <1 | 2 | …>
- Buckets: <Domain/Data | Persistence | Backend/API | Frontend | Infrastructure | ...>

## Outcome

<Concrete result produced by this workstream. It need not be a vertical slice by itself.>

## Scope

### In scope

- ...

### Out of scope

- ...

## Expected files and modules

- `<path>` — <expected responsibility/change>

Paths are planning aids. Update this section before parallel work continues if implementation discovers a different boundary.

## Interface contracts (only when relevant)

- <Link to the frozen phase-PRD contract this task implements or consumes>

Remove this section when the task has no cross-task boundary.

## Implementation requirements

- ...

## Acceptance criteria

- [ ] <Task-local criterion that contributes to the phase PRD>

## Test coverage

- **Unit:** <pure functions/utilities and exhaustive cases, or reason not applicable>
- **Integration:** <contract/repository/API cases, or reason not applicable>
- **E2E/component:** <user-critical flow, optional component tests, or reason not applicable>
- **Existing specs to update:** <paths>

## Verification

### Commands

- `bun test path/to/file.spec.ts`
- `bun run check`
- <build/type-check/manual checks when relevant>

### Manual checks

- [ ] <Observable behavior>

## Completion evidence

Complete before changing status to `Complete`.

- **Commands run:** <command + result>
- **Acceptance coverage:** <criterion → evidence>
- **Manual verification:** <result or not applicable>
- **Remaining risks:** <none or explicit risk>

## Notes

- <Discoveries affecting the phase; durable decisions belong in decision-log.md>
```

## Status Authority

**The task file `## Status` field is authoritative for task status.** Do not duplicate task status in `roadmap.md` or `current-feature-state.md`. The roadmap lists task links with wave and bucket coverage; current state links active tasks only.

| Status      | Meaning                                       |
| ----------- | --------------------------------------------- |
| Not started | Task not yet begun                            |
| In progress | Actively being worked on                      |
| Blocked     | Cannot proceed — record blocker in task notes |
| Complete    | Acceptance criteria met with evidence         |

## Phase Decomposition

1. Read the phase PRD acceptance contract.
2. Use the implementation buckets reference to identify all required work.
3. Group work into coherent tasks; horizontal tasks are valid.
4. Assign wave numbers and expected files/modules; remove all same-wave overlaps.
5. Move hard cross-phase dependencies into later phases.
6. Record cross-task contracts in the phase PRD.
7. Add every task to the roadmap's phase task table (wave + buckets + outcome; no status column).
8. List all non-complete task links under `current-feature-state.md` **Active tasks**.

When subagents implement the phase, dispatch **one wave at a time**. Within the current wave, start all tasks in a single parallel batch. Run the wave integration gate before dispatching the next wave. Give each subagent only its task, the phase PRD, and relevant project context.

## Completion Rules

A task can move to **Complete** only when:

- [ ] Its acceptance criteria are checked
- [ ] Targeted checks ran, or every skipped check has a reason
- [ ] Completion evidence is recorded
- [ ] New decisions appended to `decision-log.md` (if any)
- [ ] Follow-up work is represented by a later-phase task, risk, or open question

A phase can move to **Complete** only after all its tasks are complete, their changes work together, and the phase PRD acceptance contract is verified.

## Anti-patterns

- Treating task numbers as a serial execution order
- Same-wave tasks with hard dependencies
- Same-wave tasks modifying the same file
- Requiring every task to be a vertical slice
- One giant task for the entire phase
- Detailed tasks for speculative future phases
- Duplicating the phase PRD in each task
- Duplicating task status in roadmap or current state
- Marking complete without evidence
