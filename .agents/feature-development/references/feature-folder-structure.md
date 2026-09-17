# Feature Folder Structure

## Location

Active feature workspaces created by this skill live at:

```
docs/features/<feature-slug>/
```

These are **feature operating documents** — used by agents and owned by humans. On ship, set status `Shipped` and keep the folder as the historical working record.

**Legacy folders** under `docs/features/` that predate this skill are out of scope. Do not overwrite or restructure them unless the operator explicitly asks to migrate one.

## Slug Rules

- Lowercase kebab-case: `email-verification`, `tax-document-upload`
- Derive from feature name; keep short and stable
- One slug per feature — do not rename mid-flight unless necessary (update all references if you do)

## Scaffolding (Preferred)

Create the workspace deterministically with the Bun CLI instead of hand-writing files:

```bash
bun .agents/feature-development/scripts/create-feature-workspace.ts "<feature name>"
```

- Derives a kebab-case slug (override with `--slug`, title with `--title`).
- Refuses to create when the workspace already exists — resume or repair instead.
- Emits five framing files with factual starter content (the layout below).

Manual creation is the fallback when Bun is unavailable.

## Required Layout (Initial Scaffold)

The scaffold produces **five framing files** only:

```
docs/features/<feature-slug>/
├── README.md                    # Skill-origin note + one-paragraph purpose + link to current state
├── current-feature-state.md     # Session entry point — see references/current-feature-state.md
├── decision-log.md              # Hybrid summary + append-only log
├── roadmap.md                   # Outcome-based phases (headlines until framed)
└── research/
    └── README.md                # Index; add topic files only when uncertainty exists
```

After operator questions (or accepted defaults), create:

```
├── prds/
│   ├── feature.prd.md           # Durable product intent
│   └── phase-01.prd.md          # Buildable contract for active phase
└── tasks/
    └── phase-01-task-01-<scope>.md
                                  # Workstream with wave, verification, evidence
```

## Optional (Create When Needed)

| Path                               | When                                               |
| ---------------------------------- | -------------------------------------------------- |
| `research/<topic>.md`              | Real uncertainty requiring evidence                |
| `prds/phase-XX.prd.md`             | When that phase becomes active or next             |
| `tasks/phase-XX-task-YY-<slug>.md` | Active phase is decomposed into wave-grouped tasks |
| Phase 0 in `roadmap.md`            | Genuine discovery needed before Phase 1            |

## Phase and Task Semantics

- Keep one flat `tasks/` folder — no phase subfolders
- Filename: `phase-XX-task-YY-<short-kebab-scope>.md`
- Task numbering restarts at `01` within each phase
- Phases execute sequentially and must pass their exit criteria before the next starts
- Tasks within a phase are grouped into **execution waves** — same-wave tasks are dependency-free and file-disjoint
- Task numbers are stable identifiers, not execution order
- Task status is authoritative in each task file — do not duplicate in roadmap or current state
- Create detailed tasks only for the active phase (or next phase when preparing a handoff)
- See [implementation-buckets.md](implementation-buckets.md) for stack coverage and [phase-tasks.md](phase-tasks.md) for the task contract

## Do Not Create Prematurely

- Detailed PRDs for Phase 2+ before Phase 1 is defined
- Detailed tasks for speculative future phases
- Research artifacts when the answer is obvious from repo conventions
- Empty sections filled with placeholder bullets
- Separate plans, buckets, stack-impact, or verification files that duplicate phase PRDs and tasks

## Relationship to Other Doc Folders

| Folder                    | Purpose                                                                 |
| ------------------------- | ----------------------------------------------------------------------- |
| `docs/features/<slug>/`   | Active feature workspace (this skill); historical record after ship     |
| `docs/features/README.md` | Index of feature topics (optional; not required on ship)                |
| `docs/features/<legacy>/` | Pre-skill feature docs — leave alone unless operator requests migration |
| `docs/*.md`               | Product/ops docs outside the feature workspace model                    |
| `.cursor/plans/`          | AI scratch plans — not the source of truth                              |

When using this skill's workspace, phase tasks under `docs/features/<slug>/tasks/` replace implementation plans.

## Repair or Extend Existing Workspace

If resuming and files are missing:

1. Read `current-feature-state.md` if it exists
2. Create only missing required files with content reflecting current reality
3. Do not backfill fictional history — note gaps in open questions
4. Align roadmap phase status with actual progress; read task status from task files
5. Do not mechanically convert old plans; extract only still-actionable work into wave-grouped phase tasks

## README.md Template

```markdown
# <Feature Name>

> This feature workspace was created with the `/feature-development` skill
> (`.agents/feature-development`). It holds the operating docs for this
> feature — roadmap, PRDs, tasks, decisions, and current state.

<One sentence: what this feature does and for whom.>

**Status:** See [current-feature-state.md](./current-feature-state.md)
```
