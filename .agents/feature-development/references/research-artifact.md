# Research Artifact

## Purpose

Evidence-oriented research that supports decisions. Not an unstructured essay. Create only when there is **meaningful uncertainty**.

## When to Create

- Unknown technical approach with multiple viable options
- External API or integration behavior unclear
- Performance or scale questions without repo precedent
- Product tradeoffs requiring evidence

## When NOT to Create

- Answer is obvious from repo conventions or existing code
- Single obvious approach with no real alternatives
- "Research" as procrastination before building Phase 1 vertical slice

## File Location

```
docs/features/<feature-slug>/research/<topic>.md
```

Add an entry to `research/README.md` index when creating a file.

## Template

```markdown
# Research: <topic>

## Research question

<Single clear question>

## Context

<Why this matters for the feature; link to phase/PRD if relevant>

## Summary

<2–4 sentences — bottom line>

## Findings

| Claim   | Evidence                               |   Confidence | Impact              |
| ------- | -------------------------------------- | -----------: | ------------------- |
| <claim> | <source: code path, doc, external ref> | High/Med/Low | <on implementation> |

## Options considered

### Option A — <name>

**Pros:**

- ...

**Cons:**

- ...

**Risks:**

- ...

### Option B — <name>

...

## Recommendation

<Chosen direction and rationale>

## Open questions

- <Unresolved after research>

## Impact on implementation

- **Buckets affected:** <list>
- **Phase impact:** <which phase, scope change if any>
- **Decision needed:** <yes/no — if yes, link to decision log entry when made>
```

## Rules

- Cite evidence: file paths, docs, or external sources — not vibes
- Confidence must match evidence quality
- Recommendation should be actionable for the active phase PRD or phase tasks
- When findings change later, **add a correction section** at the bottom — do not silently rewrite findings

## Correction Section (when needed)

```markdown
## Correction (YYYY-MM-DD)

**Previous recommendation:** ...

**Updated finding:** ...

**New recommendation:** ...
```
