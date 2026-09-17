# Decision Log

## Purpose

Preserve **why** choices were made. Hybrid format: fast current summary + append-only history.

## File Location

`docs/features/<feature-slug>/decision-log.md`

## Template

```markdown
# Decision Log

## Current accepted decisions

- <Short bullet — decision title and outcome>
- <Another>

## Log

### YYYY-MM-DD — <Decision title>

**Status:** Accepted | Superseded | Rejected

**Context:**
<What problem or constraint led to this decision>

**Decision:**
<What was chosen>

**Alternatives considered:**

- <Option A — why not>
- <Option B — why not>

**Consequences:**
<What this enables or constrains going forward>

**Supersedes:** <Link to prior entry title, or "none">
```

## Rules

1. **Append-only history** — never delete or rewrite old entries
2. When a decision changes, add a new entry with `Status: Accepted` and mark the old entry `Status: Superseded`
3. Update **Current accepted decisions** summary when adding/changing accepted decisions
4. Record decisions only when a **real choice** was made — not every assumption
5. Include alternatives considered when the choice was non-obvious

## When to Append

- Operator explicitly chose between options
- Team agreed on an architectural approach
- A research artifact recommendation was accepted
- A default was chosen with significant consequence (note in consequences)

## When NOT to Append

- Following obvious repo convention (Zod, Astro pages, Tailwind, Drizzle, Better Auth)
- Reversible implementation details
- Temporary workarounds — note in current state risks instead

## Relationship to CONTEXT.md and ADRs

Feature decision logs are the **working** record. Most entries stay here forever.

After accepting a decision:

1. If it introduces or changes a **domain term**, update root `CONTEXT.md` in the same session ([domain-context.md](./domain-context.md)).
2. If it meets all three ADR criteria (hard to reverse, surprising, real trade-off), **offer** an ADR under `docs/adr/` — do not auto-create for every entry.
3. When an ADR is written, link it from the log entry (e.g. `**ADR:** [0006-…](../../../adr/0006-….md)`).

Do not duplicate full ADR bodies into the feature log; do not move routine feature choices into `docs/adr/`.

## Superseding Example

```markdown
### 2026-06-20 — Skip email verification in Phase 1

**Status:** Superseded

...

### 2026-07-01 — Require email verification before dashboard access

**Status:** Accepted

**Supersedes:** Skip email verification in Phase 1
```

Update summary:

```markdown
## Current accepted decisions

- Email/password Users must verify email before using the dashboard
```
