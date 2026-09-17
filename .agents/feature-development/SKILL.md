---
name: feature-development
description: Opt-in workflow for structured feature workspaces under docs/features/<slug>/ in this Bun/Astro/Drizzle/Better Auth monorepo. Use only when the user invokes /feature-new, /feature-resume, mentions $feature-development, or explicitly requests a feature workspace — not for ordinary feature planning unless opted in.
metadata:
  short-description: Opt-in feature lifecycle from idea to shipped vertical slices
---

# Feature Development

Turn a vague feature request into a maintained workspace under `docs/features/<feature-slug>/`, then guide research, decisions, phased planning, vertical-slice implementation, verification, and state updates.

Follow root `AGENTS.md` for layout, commands, and ask-before boundaries. Load root `CONTEXT.md` (and relevant `docs/adr/` entries) whenever domain language or hard architectural choices are in play — see [domain-context.md](references/domain-context.md). When implementing auth, also load `.agents/skills/better-auth-best-practices/SKILL.md` (and the security / email-password skills when relevant).

## When to Use

Use this skill **only** when the operator explicitly opts in via:

- `/feature-new <name>`
- `/feature-resume <slug>`
- Mentioning `$feature-development` or this skill by name
- Explicitly asking for a `docs/features/<slug>/` feature workspace

Do **not** auto-apply this workflow for ordinary feature planning, implementation, or resume requests unless the operator chooses this model.

Do **not** use for:

- Tiny bug fixes, one-line refactors, pure explanations
- Throwaway experiments (unless the user wants them documented)
- **Adopting or rewriting** existing folders under `docs/features/` that predate this skill — leave those alone unless the operator explicitly asks to migrate one

## Lifecycle

```
understand → question → research? → decide → roadmap → phase PRD → tasks → implement → verify → update state
```

`research?` only when meaningful uncertainty exists.

## When to Load References

| Task                                   | Read                                                                             |
| -------------------------------------- | -------------------------------------------------------------------------------- |
| Create or repair feature workspace     | [references/feature-folder-structure.md](references/feature-folder-structure.md) |
| Shared domain language / ADRs          | [references/domain-context.md](references/domain-context.md), root `CONTEXT.md`  |
| Before asking the operator questions   | [references/questioning-operator.md](references/questioning-operator.md)         |
| External research or real uncertainty  | [references/research-artifact.md](references/research-artifact.md)               |
| Recording or reviewing decisions       | [references/decision-log.md](references/decision-log.md)                         |
| Starting or ending a work session      | [references/current-feature-state.md](references/current-feature-state.md)       |
| Decomposing feature work into phases   | [references/phased-roadmap.md](references/phased-roadmap.md)                     |
| Writing feature or phase PRDs          | [references/prd.md](references/prd.md)                                           |
| Checking vertical-slice stack coverage | [references/implementation-buckets.md](references/implementation-buckets.md)     |
| Creating phase tasks and waves         | [references/phase-tasks.md](references/phase-tasks.md)                           |
| Before claiming completion             | [references/verification-gates.md](references/verification-gates.md)             |
| After implementation — doc updates     | [references/maintenance-rules.md](references/maintenance-rules.md)               |

## Entry Points

- `/feature-new <name>` — scaffold a new workspace and start the new-feature workflow
- `/feature-resume <slug>` — resume an existing workspace created by this skill

## New Feature Workflow

1. Check whether `docs/features/<feature-slug>/` already exists. If it does and was **not** created by this skill, stop and ask — do not overwrite legacy feature docs.
2. Scaffold deterministically with the workspace script — do not hand-create the files:

```bash
bun .agents/feature-development/scripts/create-feature-workspace.ts "<feature name>"
```

This creates five framing files under `docs/features/<slug>/`, including a `README.md` that states the workspace was created with the `/feature-development` skill. If the workspace already exists, resume it — the script does not overwrite. If Bun is unavailable, create the layout manually per [feature-folder-structure.md](references/feature-folder-structure.md).

3. Read root `CONTEXT.md` and skim relevant `docs/adr/` entries ([domain-context.md](references/domain-context.md)). Use glossary terms from the start.
4. Load [questioning-operator.md](references/questioning-operator.md). Ask high-impact questions; provide a default and consequence for each. If the operator does not respond, proceed with recommended defaults and record them as assumptions in `current-feature-state.md`.
5. Update `current-feature-state.md` and `decision-log.md` with framing results (assumptions, decisions, open questions). Update `CONTEXT.md` when new terms crystallize; offer an ADR only when the three ADR criteria hold.
6. Create `prds/feature.prd.md` with durable product intent.
7. Produce an outcome-based phased roadmap in `roadmap.md`. Phase 1 must be the smallest useful **vertical slice**. Add Phase 0 only when genuine discovery is needed (see [phased-roadmap.md](references/phased-roadmap.md)).
8. Create the active phase PRD (`prds/phase-XX.prd.md`) — detailed PRDs only for the active or next phase, not all future phases.
9. Load [implementation-buckets.md](references/implementation-buckets.md), then decompose the active phase into wave-grouped `phase-XX-task-YY-<slug>.md` tasks. Do not create phase subfolders.
10. Run the planning verification checklist (below).

## Resume Feature Workflow

1. Check `git status` and note uncommitted changes.
2. Read `docs/features/<feature-slug>/current-feature-state.md` **first** — do not reread full history unless needed.
3. Read root `CONTEXT.md` (and any ADRs linked from the active phase / decision log).
4. If the folder lacks skill markers (`current-feature-state.md` / skill README note), treat it as legacy and ask before applying this workflow.
5. Inspect active phase in `roadmap.md`.
6. Load only the active phase PRD, active/incomplete tasks, relevant research, and decision entries.
7. Confirm task statuses and file scopes against current code.
8. Resume the current execution wave one wave at a time; within a wave, dispatch all same-wave tasks in parallel when subagents are used. Do not start the next phase before the current phase exit criteria pass.

## Implementation Workflow

For each sequential phase:

1. **Contract** — active phase PRD defines the combined vertical outcome and any cross-task interfaces
2. **Coverage** — implementation buckets are all assigned to tasks or explicitly out of scope
3. **Waves** — tasks grouped by execution wave; same-wave tasks are dependency-free and file-disjoint
4. **Dispatch** — start all tasks in the current wave in one parallel batch; complete the wave integration gate before the next wave
5. **Build** — each task implements only its scoped workstream; horizontal tasks are valid (ask before Drizzle schema/migrations, new deps, routes, auth, env)
6. **Evidence** — each task records targeted checks, acceptance coverage, and remaining risks
7. **Phase exit** — integrate task results and verify the phase PRD acceptance contract
8. **Update** — task/phase status, roadmap, `current-feature-state.md`, and other docs per [maintenance-rules.md](references/maintenance-rules.md)

**Discourage:** coding an entire phase before verification, layer-by-layer delivery with no usable outcome, giant speculative abstractions, silently changing requirements, marking roadmap items complete based only on code existence.

## Operator Questioning Rules

- Ask only when the answer changes architecture, data model, public UX, security, permissions, external contracts, cost, timeline, or irreversible choices.
- Provide: question, why it matters, recommended default, consequence of accepting the default.
- Do not ask about naming, obvious defaults, small UI copy, or choices safely adjusted later — follow repo convention and `CONTEXT.md`.
- Challenge glossary conflicts; prefer ubiquitous language in questions and docs.
- Distinguish **facts**, **assumptions**, **decisions**, **risks**, and **open questions**.
- Ask as many high-impact questions as the feature needs — no fixed count; prefer defaults over inventing filler questions.
- If the operator does not respond, proceed with recommended defaults and record them as assumptions.
- Respect `AGENTS.md` **Boundaries — Ask before doing** (Drizzle/migrations, deps, routes, auth, env).

## Documentation Rules

- Docs are working artifacts, not ceremony. Prefer useful defaults over excessive questions.
- Keep `current-feature-state.md` short and accurate — readable in under 2 minutes.
- Decision log is append-only; mark entries superseded, never rewrite history.
- Do not create research artifacts without meaningful uncertainty.
- Prefer `CONTEXT.md` terms; challenge conflicts; update the glossary when terms crystallize ([domain-context.md](references/domain-context.md)).
- On ship (or domain re-baseline), set status `Shipped` when done, keep `docs/features/<slug>/` as history, and graduate durable terms into `CONTEXT.md` plus qualifying ADRs — nothing else.

## Source Control

See [maintenance-rules.md](references/maintenance-rules.md) **Source Control** — the authoritative session-start/end and commit rules.

## Anti-Bureaucracy Rules

- Do not create large empty documents or detailed PRDs for every future phase upfront.
- Do not mechanically rewrite every document after every code change.
- Do not spend a session maintaining docs instead of building.
- Do not claim completion without evidence.

## Planning Verification Checklist

Before finishing feature-planning work:

- [ ] Feature folder exists under `docs/features/<feature-slug>/`
- [ ] Current state is readable in under 2 minutes
- [ ] Roadmap has outcome-based phases, status, and active-phase task links
- [ ] Active phase has a PRD
- [ ] Active phase has flat task files with phase + task numbers and wave assignments
- [ ] Implementation buckets are assigned to tasks or out of scope
- [ ] Same-wave tasks have no hard dependencies or overlapping file scopes
- [ ] Tasks include test coverage and verification
- [ ] Open questions and assumptions are explicit
- [ ] Decisions recorded only when actually decided
- [ ] New/changed domain terms reflected in `CONTEXT.md` (if any)
- [ ] Qualifying hard decisions offered as ADRs (or explicitly skipped)

## Implementation Verification Checklist

Before finishing implementation work, load [verification-gates.md](references/verification-gates.md) and confirm evidence was collected. At minimum:

- [ ] Relevant tests/lint/types/build run or skipped with reason
- [ ] Current feature state updated
- [ ] Roadmap phase status updated if changed
- [ ] New decisions appended to decision log (if any)
- [ ] `CONTEXT.md` / ADRs updated when terms or durable decisions changed
- [ ] Remaining risks listed
- [ ] Offered to commit workspace + code changes to git (see Source Control)
