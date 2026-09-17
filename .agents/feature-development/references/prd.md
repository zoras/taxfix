# PRD Templates

## Two Levels

| File                   | Purpose                                      | Detail level                     |
| ---------------------- | -------------------------------------------- | -------------------------------- |
| `prds/feature.prd.md`  | Durable product intent for the whole feature | Stable — changes rarely          |
| `prds/phase-XX.prd.md` | Buildable contract for one phase             | Detailed — drives implementation |

**Rule:** Create detailed PRDs only for the **active or next** phase. Future phases get roadmap headlines only until activated.

## Feature PRD Template

`docs/features/<feature-slug>/prds/feature.prd.md`

```markdown
# PRD: <Feature Name>

## Problem

<What problem exists today>

## Users

<Who is affected — User, unauthenticated visitor, system>

## Desired outcome

<What success looks like at full delivery>

## Scope (feature-level)

### In scope

- ...

### Out of scope

- ...

## User stories (summary)

- As a ..., I want ..., so that ...

## Non-functional requirements

- Performance: ...
- Accessibility: ...

## Permissions (feature-level)

<Roles, session, and authorization boundaries>

## Data implications (feature-level)

<Entities, ownership, retention — high level. Ask before Drizzle schema/migrations.>

## External integrations

<Or "none">

## Risks

- ...

## Open questions

- <Feature-level unknowns not yet phase-specific>
```

## Phase PRD Template

`docs/features/<feature-slug>/prds/phase-XX.prd.md`

```markdown
# PRD: <Feature Name> — Phase XX: <title>

## Problem (this phase)

<What this phase solves — subset of feature problem>

## Users

<Who interacts in this phase>

## Desired outcome

<Observable outcome when phase is done>

## Scope

### In scope

- ...

### Out of scope

- ...

## User stories

- As a ..., I want ..., so that ...

## Functional requirements

- ...

## Non-functional requirements

- ...

## UX states

| State             | Behavior |
| ----------------- | -------- |
| Loading           | ...      |
| Empty             | ...      |
| Error             | ...      |
| Success           | ...      |
| Permission denied | ...      |

## Permissions

- Roles affected: ...
- Session / ownership boundaries: ...
- Middleware / API routes: ...

## Data implications

- Drizzle tables/columns: ...
- New columns: ...
- Indexes needed: ...
- Push/generate/migrate: ... (ask before creating/running)

## External integrations

<Or "none for this phase">

## Cross-task interface contracts

<Frozen API, DTO, event, schema, or route contracts needed by same-wave or cross-wave tasks; otherwise "none">

## Failure cases

- <What happens when X fails>

## Observability

- Logging: ...
- Metrics/analytics: ...

## Acceptance contract

- [ ] <Verifiable criterion 1>
- [ ] <Verifiable criterion 2>

## Risks

- ...

## Open questions

- <Phase-specific only>
```

## Writing Rules

1. Phase PRD acceptance criteria must map to verification steps
2. UX states are mandatory for user-facing phases
3. Permissions must address auth**z**, not just auth**n** — session, ownership, role checks
4. Data implications use Zod as source of truth; ask before Drizzle schema/migrations
5. Do not duplicate feature PRD content — reference it and narrow scope
6. Freeze API/DTO/event/schema contracts needed by same-wave or cross-wave tasks

## Link to Implementation

Phase PRD informs:

- `tasks/phase-XX-task-YY-<slug>.md` — wave-grouped workstreams with test coverage and verification
- `roadmap.md` — sequential phase status, wave + bucket coverage, and task links

Do not create separate phase plans, implementation buckets, stack-impact docs, or verification reports. Keep executable detail and evidence in the relevant task.
