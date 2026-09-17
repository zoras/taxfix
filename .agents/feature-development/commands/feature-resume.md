---
description: Resume an existing skill-created feature workspace under docs/features/<slug>/
argument-hint: "<feature slug>"
---

# Resume Feature

Resume an existing feature using the feature-development skill.

1. Read `.agents/feature-development/SKILL.md`.
2. If `$ARGUMENTS` is empty, list skill-created workspaces in `docs/features/` (folders with a `current-feature-state.md` and skill README note) and ask which feature to resume.
3. If the folder looks like a legacy (pre-skill) workspace, ask before applying this workflow — do not rewrite it.
4. Read `docs/features/$ARGUMENTS/current-feature-state.md` **first** — this is the session entry point. Also read root `CONTEXT.md` (and relevant `docs/adr/` entries).
5. Follow the **Resume Feature Workflow** in `SKILL.md`: inspect the active phase in `roadmap.md`, load only its PRD, active/incomplete tasks, relevant research, and decision entries, then resume the current execution wave.
6. Do not reread the full feature history unless necessary.
