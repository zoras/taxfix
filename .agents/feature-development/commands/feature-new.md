---
description: Scaffold a new feature workspace under docs/features/<slug>/ and start the feature-development workflow
argument-hint: "<feature name>"
---

# New Feature

Start a new feature using the feature-development skill.

1. Read `.agents/feature-development/SKILL.md`.
2. Derive a kebab-case slug from `$ARGUMENTS` (the feature name). If `$ARGUMENTS` is empty, ask for the feature name first.
3. If `docs/features/<slug>/` already exists, stop and confirm with the user. Do not overwrite legacy (pre-skill) folders. Resume with `/feature-resume <slug>` when it is a skill-created workspace.
4. Scaffold the workspace deterministically (do not hand-create the files):

```bash
bun .agents/feature-development/scripts/create-feature-workspace.ts "$ARGUMENTS"
```

If the folder already exists, the script does not overwrite — resume instead.

5. Follow the **New Feature Workflow** in `SKILL.md`: read root `CONTEXT.md`, ask the high-impact questions this feature needs (`.agents/feature-development/references/questioning-operator.md`), then fill all scaffolded workspace docs and create `prds/feature.prd.md`, the active phase PRD, and wave-grouped `tasks/phase-01-task-YY-<slug>.md` files. Phases are sequential; tasks within a wave run in parallel.
6. Run the planning verification checklist before finishing.
