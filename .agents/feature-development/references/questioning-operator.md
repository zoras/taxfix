# Questioning Operator

## Purpose

High-value questions only. Agent workflows fail when they ask too many abstract questions. Prefer useful defaults and proceed.

## When to Ask

Ask only when the answer materially affects:

- Architecture or system boundaries
- Data model or persistence shape
- Public UX or user-visible behavior
- Security, permissions, or session/auth boundaries
- External contracts or integrations
- Cost, billing, or infrastructure
- Timeline or scope tradeoffs
- **Irreversible** implementation choices

## When NOT to Ask — Choose a Default

- File or class naming (follow repo conventions)
- File placement within `apps/web`, `packages/db`, or `packages/auth` (follow `AGENTS.md`)
- Small UI copy
- Formatting, import order, lint-fixable choices
- Reversible details adjustable in a follow-up PR
- Obvious stack choices already documented in `AGENTS.md`
- Choices covered by **Boundaries — Ask before doing** only when the operator has already set a standing preference
- Terminology already defined in root `CONTEXT.md` — use those words; do not re-ask what they mean

## Domain language

Before questioning, read `CONTEXT.md`. During questioning:

- If the operator uses a word that conflicts with the glossary, call it out and resolve
- Prefer glossary terms in the question text itself (use `CONTEXT.md` words, not overloaded synonyms)
- After answers, update `CONTEXT.md` when a **new** term crystallizes; offer an ADR only when the three criteria hold (see [domain-context.md](./domain-context.md))

## Required Question Format

Each question must include all four parts:

```markdown
### <Question title>

**Question:** <Clear, single question>

**Why it matters:** <What changes if answered differently>

**Recommended default:** <What you will do if the operator does not respond>

**Consequence of default:** <Tradeoff or risk of accepting the default>
```

## Limits

- Ask only the high-impact questions needed for this feature — no fixed count. One may be enough; five may be warranted when several irreversible choices are open
- Prefer useful defaults over inventing questions to fill a quota
- Do not block progress on reversible details
- Batch related questions; do not drip one question per message
- If the operator says "use defaults" or does not respond, proceed with all recommended defaults and record them as assumptions in `current-feature-state.md` **Assumptions**

## Good Example

```markdown
### Should sign-up require email verification before the first session?

**Question:** Can a new User use the app immediately after sign-up, or only after verifying email?

**Why it matters:** Changes Better Auth config, session gating in middleware, and the first-run UX.

**Recommended default:** Email/password sign-up creates a usable Session immediately (verification later if needed).

**Consequence of default:** Faster Phase 1, but unverified emails can create Sessions.
```

## Bad Examples

- "Should this file be called `auth.ts` or `auth-client.ts`?" — follow repo naming.
- "What color should the button be?" — follow existing Tailwind / Astro UI patterns.
- "Should we use Zod for validation?" — yes, per project convention.
- "Do you want tests?" — yes for pure functions; follow `AGENTS.md` (`bun:test`, `it.each`).

## After Answers

- Record **decisions** in `decision-log.md` when the operator chooses explicitly
- Record **assumptions** in `current-feature-state.md` when using defaults without confirmation
- Move resolved items out of open questions
- Update `CONTEXT.md` if terms crystallized; offer ADR when criteria met
