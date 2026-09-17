import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "bun:test";

import {
  buildFiles,
  findRepoRoot,
  parseArgs,
  slugify,
} from "./create-feature-workspace";

const SCRIPT = join(import.meta.dir, "create-feature-workspace.ts");

const PLACEHOLDER_PATTERN = /<[A-Z]/;

function createTempRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), "feature-workspace-test-"));
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ name: "taxfix-hack", workspaces: { packages: [] } }),
  );
  return dir;
}

function runCli(args: string[], cwd: string) {
  return spawnSync("bun", [SCRIPT, ...args], {
    cwd,
    encoding: "utf8",
  });
}

describe("parseArgs", () => {
  it.each([
    ["--help", { help: true, slug: "", rawName: "" }],
    ["-h", { help: true, slug: "", rawName: "" }],
  ])("returns help without requiring a feature name (%s)", (flag, expected) => {
    expect(parseArgs([flag])).toMatchObject({
      ...expected,
    });
  });

  it("derives slug and title from the feature name", () => {
    expect(parseArgs(["Email Verification"])).toEqual({
      rawName: "Email Verification",
      slug: "email-verification",
      title: "Email Verification",
      help: false,
    });
  });

  it.each([
    [
      ["Ignored Name", "--slug", "custom-slug", "--title", "Custom Title"],
      {
        rawName: "Ignored Name",
        slug: "custom-slug",
        title: "Custom Title",
        help: false,
      },
    ],
    [
      ["", "--slug", "slug-only", "--title", "Slug Only Title"],
      {
        rawName: "",
        slug: "slug-only",
        title: "Slug Only Title",
        help: false,
      },
    ],
  ])("applies --slug and --title overrides %#", (argv, expected) => {
    expect(parseArgs(argv)).toEqual(expected);
  });

  it.each([
    ["!!!", "Derived slug is empty"],
    [["--slug", "my-feature"], "Title is empty"],
    [["--slugg", "foo"], "Unknown option: --slugg"],
    [["My Feature", "--slug"], "Missing value for --slug"],
    [["My Feature", "--title"], "Missing value for --title"],
  ])("throws for invalid input %#", (argv, message) => {
    const args = Array.isArray(argv) ? argv : [argv];
    expect(() => parseArgs(args)).toThrow(message);
  });
});

describe("slugify", () => {
  it.each([
    ["Email Verification", "email-verification"],
    ["  Multiple   Spaces  ", "multiple-spaces"],
    ["café-renewal", "cafe-renewal"],
    ["foo/bar", "foo-bar"],
  ])("normalizes %j to %j", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });
});

describe("buildFiles", () => {
  const scaffold = buildFiles({
    rawName: "Test Feature",
    slug: "test-feature",
    title: "Test Feature",
    help: false,
  });

  it.each([
    "README.md",
    "current-feature-state.md",
    "decision-log.md",
    "roadmap.md",
    "research/README.md",
  ])("creates framing file %s", (path) => {
    expect(scaffold[path]).toBeDefined();
  });

  it.each([
    "prds/feature.prd.md",
    "prds/phase-01.prd.md",
    "tasks/phase-01-task-01-first-workstream.md",
    "plans/phase-01.plan.md",
    "implementation/buckets.md",
  ])("does not create post-framing or obsolete file %s", (path) => {
    expect(scaffold[path]).toBeUndefined();
  });

  it("creates exactly five framing files", () => {
    expect(Object.keys(scaffold)).toEqual([
      "README.md",
      "current-feature-state.md",
      "decision-log.md",
      "roadmap.md",
      "research/README.md",
    ]);
  });

  it.each(Object.entries(scaffold))(
    "%s has no placeholder markers",
    (_path, content) => {
      expect(content).not.toMatch(PLACEHOLDER_PATTERN);
    },
  );

  it.each([
    ["README.md", "/feature-development"],
    ["current-feature-state.md", "## Assumptions"],
    ["current-feature-state.md", "## Active tasks"],
    ["current-feature-state.md", "Framing:"],
    ["roadmap.md", "To be defined during framing"],
    ["research/README.md", "research-artifact.md"],
  ])("%s includes %s", (path, expected) => {
    expect(scaffold[path]).toContain(expected);
  });
});

describe("findRepoRoot", () => {
  it("finds the workspace package.json in a nested directory", () => {
    const repo = createTempRepo();
    const nested = join(repo, "docs", "features");
    mkdirSync(nested, { recursive: true });

    expect(findRepoRoot(join(repo, "docs", "features"))).toBe(repo);

    rmSync(repo, { recursive: true, force: true });
  });
});

describe("create-feature-workspace CLI", () => {
  const repos: string[] = [];

  afterEach(() => {
    for (const repo of repos.splice(0)) {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  function tempRepo(): string {
    const repo = createTempRepo();
    repos.push(repo);
    return repo;
  }

  it.each([
    [["--help"], 0, "stdout", "Usage:"],
    [["-h"], 0, "stdout", "Usage:"],
  ])("prints help and exits 0 %#", (args, code, stream, snippet) => {
    const result = runCli(args, tempRepo());
    expect(result.status).toBe(code);
    expect(result[stream]).toContain(snippet);
  });

  it("exits 1 without a feature name", () => {
    const result = runCli([], tempRepo());
    expect(result.status).toBe(1);
  });

  it("scaffolds five framing files with slug/title overrides", () => {
    const repo = tempRepo();
    const slug = "cli-test-feature";
    const featureDir = join(repo, "docs", "features", slug);
    const result = runCli(
      ["Ignored", "--slug", slug, "--title", "CLI Test Feature"],
      repo,
    );

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(`docs/features/${slug}/`);
    expect(result.stdout).toContain("Created 5 files");
    expect(existsSync(join(featureDir, "README.md"))).toBe(true);
    expect(existsSync(join(featureDir, "research", "README.md"))).toBe(true);
    expect(existsSync(join(featureDir, "prds"))).toBe(false);
    expect(existsSync(join(featureDir, "tasks"))).toBe(false);
    expect(existsSync(join(featureDir, "plans"))).toBe(false);
  });

  it("refuses to create when workspace already exists", () => {
    const repo = tempRepo();
    const slug = "existing-feature";
    const first = runCli(["Feature", "--slug", slug], repo);
    const second = runCli(["Feature", "--slug", slug], repo);

    expect(first.status).toBe(0);
    expect(second.status).toBe(1);
    expect(second.stderr).toContain("already exists");
    expect(second.stderr).toContain("/feature-resume");
  });

  it("mentions questioning-operator in next steps", () => {
    const repo = tempRepo();
    const result = runCli(["Wave Feature", "--slug", "wave-feature"], repo);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("questioning-operator.md");
    expect(result.stdout).toContain("wave-grouped tasks");
  });
});
