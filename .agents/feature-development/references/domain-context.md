# Domain Context and ADRs

## Purpose

Keep a durable shared language and a thin set of architectural decisions
outside any single feature workspace — without a second planning system.

| Artifact          | Path                                   | Holds                                              |
| ----------------- | -------------------------------------- | -------------------------------------------------- |
| Glossary          | `CONTEXT.md` (repo root)               | Ubiquitous language only                           |
| ADRs              | `docs/adr/NNNN-slug.md`                | Hard-to-reverse, surprising, traded-off decisions  |
| Feature decisions | `docs/features/<slug>/decision-log.md` | Working feature choices (most decisions stay here) |

## Always load

At the start of `/feature-new`, `/feature-resume`, and whenever framing or
domain language is in play:

1. Read `CONTEXT.md`
2. Skim `docs/adr/README.md` index; open only ADRs relevant to the topic

Use glossary terms in questions, PRDs, tasks, and narration. Prefer linking an
ADR over restating it.

## During the feature

### Challenge language

If the operator (or draft docs) use a term that conflicts with `CONTEXT.md`,
call it out immediately and resolve: update the glossary, or stick to the
existing term.

### Sharpen fuzzy words

When a word is overloaded (`account`, `user`, `session`, `profile`), propose
the canonical glossary term and confirm.

### Record feature decisions first

Continue appending to the feature `decision-log.md` as today (see
[decision-log.md](./decision-log.md)). Do **not** create an ADR for every
feature decision.

### Update CONTEXT.md when terms crystallize

When a **new domain term** is settled (or an existing term’s meaning changes):

1. Update `CONTEXT.md` in the same session — do not batch for “later”
2. Keep definitions to 1–2 sentences; glossary only — no implementation detail
3. Use `_Avoid_:` for rejected synonyms
4. Mention the glossary update in the feature decision log entry when useful

### Offer an ADR sparingly

After a feature decision is accepted, offer (do not auto-write) an ADR **only
if all three** are true:

1. Hard to reverse
2. Surprising without recorded context
3. Result of a real trade-off

If offered and accepted:

1. Add `docs/adr/NNNN-slug.md` (next number after highest existing)
2. Add a row to `docs/adr/README.md` index
3. Link the ADR from the feature decision-log entry
4. Keep the feature log as the working narrative; the ADR is the durable gist

Template and criteria: `docs/adr/README.md`.

## On ship / handoff

When graduating durable knowledge (phase exit, ship, or a domain re-baseline):

- [ ] New/changed glossary terms are in `CONTEXT.md`
- [ ] Qualifying decisions have ADRs (or were explicitly declined as ADR
      candidates)
- [ ] Feature `decision-log.md` still holds the detailed working history

This **is** the light distillation step — glossary + optional ADR only. Do not
copy whole PRDs or task files into `docs/adr/`.

## Anti-bureaucracy

- Do not invent terms ahead of need
- Do not turn `CONTEXT.md` into a second PRD or architecture dump
- Do not ADR reversible or obvious choices
- Do not maintain a parallel issue-tracker map for domain language
