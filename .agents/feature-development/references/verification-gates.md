# Verification Gates

## Purpose

Prevent unsupported "done" claims. Collect concrete evidence before marking tasks, phases, or features complete.

## When Required

- End of every phase task
- Phase completion (roadmap exit criteria)
- Before telling the operator work is complete

## Evidence Report Template

Record evidence in each task's **Completion evidence** section and summarize the latest phase result in `current-feature-state.md` **Last verification**:

```markdown
## Verification — YYYY-MM-DD

### Scope

<Task or phase verified>

### Commands run

| Command                                      | Package/target | Result                |
| -------------------------------------------- | -------------- | --------------------- |
| `bun test path/to/file.spec.ts`              |                | pass / fail           |
| `bun run check`                              |                | pass / fail           |
| `bun run check-types`                        |                | pass / fail / skipped |
| `bun run --filter web build`                 |                | pass / fail / skipped |

### Type check

- Result: pass / fail / skipped
- Notes:

### Migration validation

- [ ] N/A
- [ ] Schema/migration reviewed; operator approved push/generate/migrate
- Notes:

### Manual verification

- [ ] <Step 1 — observable outcome>
- [ ] <Step 2>

### Acceptance criteria coverage

- [ ] <Criterion from phase PRD → evidence>

### Skipped checks

| Check | Reason |
| ----- | ------ |
|       |        |

### Remaining risks

- ...

### Known limitations

- ...
```

## Project Commands

Use root scripts from `AGENTS.md`. Prefer targeted checks.

| Check         | Typical command                          |
| ------------- | ---------------------------------------- |
| Unit tests    | `bun test path/to/file.spec.ts`          |
| Package tests | `bun test`                               |
| Lint + format | `bun run check`                          |
| Types         | `bun run check-types`                    |
| Web build     | `bun run --filter web build`             |

Run **targeted** checks for the task — not the entire monorepo unless the change warrants it.

For UI changes, verify the flow in the browser (or the closest substitute) and record observable steps.

## Additional Checks (when relevant)

| Area       | Verification                                                                 |
| ---------- | ---------------------------------------------------------------------------- |
| Drizzle    | Ask before schema/push/migrate; validate in dev when approved                |
| Auth       | Ask before config/`auth:generate`; review generated `packages/db` auth schema |
| New routes | Authz review; unauthenticated rejection considered                           |
| Zod        | Types inferred from schemas — not duplicated                                 |
| Env        | Ask before `.env.schema` / Varlock codegen                                   |
| UI         | Loading/empty/error/success/permission-denied states                         |

## Skipped Checks

Skipping is allowed with an explicit reason. "Too small" is not sufficient alone — explain why the check is impossible or unnecessary.

## Anti-Rationalization Table

| Rationalization                               | Reality                                                                      |
| --------------------------------------------- | ---------------------------------------------------------------------------- |
| "The change is small, tests are unnecessary." | Small changes break contracts. Run targeted tests or explain why impossible. |
| "The code looks correct."                     | Subjective. Run checks or manual verification with observable steps.         |
| "The PRD says it should work."                | PRD defines the contract; tasks define and prove the implementation.         |
| "Documentation can be updated later."         | Feature docs are the continuity mechanism; update current state now.         |
| "Existing tests probably cover it."           | Confirm with test run or identify gap and add tests for pure logic.          |
| "Lint will pass in CI."                       | Run lint locally on affected packages.                                       |
| "I'll verify manually later."                 | Record manual steps now or schedule explicit follow-up in open questions.    |

## Phase Completion Gate

A phase may move to **Complete** in `roadmap.md` only when:

- [ ] All acceptance criteria checked with evidence
- [ ] All required phase tasks are complete with recorded evidence
- [ ] Wave and phase task results integrate without contract or file-scope conflicts
- [ ] No unresolved blockers for phase scope
- [ ] Current state updated
- [ ] Remaining risks documented
