# Current Feature State

## Purpose

The **most important doc** in the feature workspace. Read this first on every resume. Keep it short enough to read in **under 2 minutes**.

## When to Update

- After meaningful progress (task complete, phase change, blocker found/resolved)
- At session end when meaningful progress occurred (see [maintenance-rules.md](./maintenance-rules.md) maintenance tiers)
- When status, active phase/tasks, or next action changes

Do **not** update after every trivial edit or no-change sessions.

## Template

Copy into `docs/features/<feature-slug>/current-feature-state.md`:

```markdown
# Current Feature State

## Status

Planning | Building | Blocked | Paused | Shipped

## One-paragraph summary

<What this feature is, current phase, and where work stands.>

## What is currently true

- <Fact 1 — deployed, merged, or decided>
- <Fact 2>

## Active phase

**Phase N — <title>:** <one-line goal>

## Active tasks

| Task                                                             |
| ---------------------------------------------------------------- |
| [Phase NN Task NN — <title>](./tasks/phase-NN-task-NN-<slug>.md) |

Read task status from each linked task file. List every non-complete task (`Not started`, `In progress`, or `Blocked`); write "none" when all tasks are complete or during framing before tasks exist.

## Assumptions

- <Default accepted without operator confirmation — consequence and when to validate>

Remove when promoted to a decision or invalidated.

## Last completed work

- <YYYY-MM-DD: what was done>

## Next recommended action

- <Single clearest next step for the next session>

## Blockers

- <None, or explicit blocker with owner/context>

## Open questions

- <Unresolved items requiring operator input or research>

## Known risks

- <Risk + mitigation if known>

## Last verification

- <YYYY-MM-DD: commands run, result summary, or "not yet verified">

## Entry points

- Code: `<paths to key files/modules>`
- Docs: `<links to roadmap, active phase PRD, and active tasks>`
```

## Field Guidance

| Field                   | Content                                                                     |
| ----------------------- | --------------------------------------------------------------------------- |
| Status                  | One of the enum values; `Blocked` only with explicit blocker                |
| What is currently true  | Facts only — not plans or wishes                                            |
| Active tasks            | Links to all non-complete tasks — status is authoritative in each task file |
| Assumptions             | Defaults used without confirmation; remove when resolved                    |
| Next recommended action | One primary action; secondary items go in roadmap                           |
| Open questions          | Remove when resolved; distinguish from assumptions                          |
| Last verification       | Evidence from verification-gates — not "looks good"                         |
| Entry points            | Where the next agent should start reading code                              |

## Status Sync

See [phased-roadmap.md](./phased-roadmap.md) **Status Sync** for feature ↔ phase ↔ task transition rules.

## Resume Protocol

1. Read this file completely
2. If active phase is clear, open `roadmap.md` for that phase only
3. Open `prds/phase-XX.prd.md` for active phase
4. Open linked active/incomplete tasks and confirm their scopes/status against code
5. Read decision log summary only; drill into entries if a choice seems stale

## Anti-patterns

- Pasting entire PRDs or roadmaps into current state
- Leaving stale "next action" from a previous session
- Listing completed tasks as active
- Duplicating task status here — read it from the task file
- Listing open questions that were already decided
- Omitting last verification after implementation work
