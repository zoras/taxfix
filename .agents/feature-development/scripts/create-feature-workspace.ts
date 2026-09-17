#!/usr/bin/env bun

import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

const SKILL_REFERENCES = ".agents/feature-development/references";

export interface ScaffoldOptions {
  rawName: string;
  slug: string;
  title: string;
  help: boolean;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help || !options.rawName) {
    printHelp();
    process.exit(options.help ? 0 : 1);
  }

  const root = findRepoRoot(process.cwd());
  const featureDir = join(root, "docs", "features", options.slug);

  if (existsSync(featureDir)) {
    process.stderr.write(
      `Feature workspace already exists: docs/features/${options.slug}\n` +
        `Resume with /feature-resume ${options.slug} or repair missing files manually.\n` +
        `If this is a legacy folder (not created by this skill), do not overwrite without operator approval.\n`,
    );
    process.exit(1);
  }

  const files = buildFiles(options);

  for (const [relativePath, content] of Object.entries(files)) {
    const absolute = join(featureDir, relativePath);
    await mkdir(dirname(absolute), { recursive: true });
    await writeFile(absolute, content, "utf8");
  }

  const created = Object.keys(files).length;
  process.stdout.write(
    `Created ${created} files in docs/features/${options.slug}/\n\n` +
      `Next steps:\n` +
      `  1. Ask high-impact questions as needed (${SKILL_REFERENCES}/questioning-operator.md)\n` +
      `  2. Define Phase 1 as a vertical slice in roadmap.md\n` +
      `  3. Create prds/feature.prd.md and the active phase PRD\n` +
      `  4. Decompose Phase 1 into wave-grouped tasks/phase-01-task-YY-<slug>.md files\n`,
  );
}

export function parseArgs(argv: string[]): ScaffoldOptions {
  const positional: string[] = [];
  let slugOverride = "";
  let titleOverride = "";
  let help = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "--help" || arg === "-h") {
      help = true;
    } else if (arg === "--slug") {
      const value = argv[++i];
      if (!value || value.startsWith("-")) {
        throw new Error("Missing value for --slug");
      }
      slugOverride = value;
    } else if (arg === "--title") {
      const value = argv[++i];
      if (!value || value.startsWith("-")) {
        throw new Error("Missing value for --title");
      }
      titleOverride = value;
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      positional.push(arg);
    }
  }

  const rawName = positional.join(" ").trim();

  if (help) {
    return { rawName, slug: "", title: "", help: true };
  }

  const slug = slugify(slugOverride || rawName);
  if (!slug) {
    throw new Error(
      "Derived slug is empty. Provide a valid feature name or --slug.",
    );
  }

  const title = titleOverride.trim() || toTitleCase(rawName);
  if (!title) {
    throw new Error("Title is empty. Provide a feature name or --title.");
  }

  return { rawName, slug, title, help };
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function toTitleCase(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function isWorkspaceRoot(dir: string): boolean {
  const pkgPath = join(dir, "package.json");
  if (!existsSync(pkgPath)) {
    return false;
  }

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as {
      name?: string;
      workspaces?: unknown;
    };
    return pkg.name === "taxfix-hack" || Boolean(pkg.workspaces);
  } catch {
    return false;
  }
}

export function findRepoRoot(start: string): string {
  let current = resolve(start);

  while (true) {
    if (existsSync(join(current, ".git")) || isWorkspaceRoot(current)) {
      return current;
    }

    const parent = dirname(current);

    if (parent === current) {
      throw new Error(
        "Could not find repository root (missing .git or workspace package.json in parent chain). Run this from within the repo.",
      );
    }

    current = parent;
  }
}

export function buildFiles(options: ScaffoldOptions): Record<string, string> {
  const { title } = options;
  const date = new Date().toISOString().slice(0, 10);

  return {
    "README.md": `# ${title}

> This feature workspace was created with the \`/feature-development\` skill
> (\`.agents/feature-development\`). It holds the operating docs for this
> feature — roadmap, PRDs, tasks, decisions, and current state.

Feature workspace for ${title}.

**Status:** See [current-feature-state.md](./current-feature-state.md)
`,

    "current-feature-state.md": `# Current Feature State

## Status

Planning

## One-paragraph summary

Workspace scaffolded for ${title}. Framing in progress.

## What is currently true

- Feature workspace scaffolded on ${date}

## Active phase

**Framing:** define outcome and Phase 1 vertical slice

## Active tasks

none

## Assumptions

none

## Last completed work

- ${date}: Workspace scaffolded

## Next recommended action

- Answer framing questions, then create PRDs and Phase 1 tasks

## Blockers

- None

## Open questions

- none

## Known risks

- none

## Last verification

- Not yet verified

## Entry points

- Docs: \`roadmap.md\`
- Code: none yet
`,

    "decision-log.md": `# Decision Log

## Current accepted decisions

- No decisions yet

## Log

<!-- Append-only. Add a dated entry per real decision; mark superseded, never rewrite. -->
`,

    "roadmap.md": `# Roadmap: ${title}

## Feature outcome

To be defined during framing.

## Phase 1 — To be defined

**Goal:** Smallest useful end-to-end outcome (define during framing)

**User/system outcome:** To be defined during framing

**Dependencies:** none

**Status:** Not started

---

Future phases at headline level only until Phase 1 ships.
`,

    "research/README.md": `# Research

Index of research artifacts for ${title}. Create a topic file only when there is **real uncertainty** (see \`${SKILL_REFERENCES}/research-artifact.md\`).

| Topic | File | Summary |
| --- | --- | --- |
| _none yet_ | | |
`,
  };
}

function printHelp() {
  process.stdout.write(
    `Scaffold a feature workspace under docs/features/<slug>/\n\n` +
      `Usage:\n` +
      `  bun .agents/feature-development/scripts/create-feature-workspace.ts <feature name> [options]\n\n` +
      `Options:\n` +
      `  --slug <slug>    Override the derived kebab-case slug\n` +
      `  --title <title>  Override the derived display title\n` +
      `  --help, -h       Show this help\n\n` +
      `Example:\n` +
      `  bun .agents/feature-development/scripts/create-feature-workspace.ts "Email verification"\n` +
      `  -> docs/features/email-verification/\n`,
  );
}

if (import.meta.main) {
  void main();
}
