# Research: Absorb Tax Memory (zoras PR #3)

## Research question

What from Zoras’s Tax Memory PRD should become durable This Month intent, and what must stay parked so we do not fight the brief, Option B, or the calendar dashboard already in code?

## Context

- Incoming: [PR #3](https://github.com/yarychh/taxfix/pull/3) “Add idea” (Saroj Maharjan / zoras). Two commits: original `docs/plans/Taxfix_Tax_Memory_PRD.md`, then a merge into `prds/feature.prd.md`.
- Full source archived: [tax-memory-prd-zoras.md](./tax-memory-prd-zoras.md).
- Zoras’s merge rule: where Tax Memory conflicts with This Month / the File, **our PRD and decision log win**.
- Code on this branch is already a **single calendar dashboard + check-in dialog**, not a second File page. Docs ingest follows the code (anti-drift). Tax Memory’s “persistent memory of the year” maps to **year sections on the calendar**, not a revived File route.

## Summary

Tax Memory is the same year-round problem we already chose (Option B), with a stronger tagline and a larger AI/evidence story. The useful core is: **life events matter as much as receipts; capture while true; accumulate context so Q4 is closing a year, not starting from zero.** Receipt OCR, multi-agent orchestration, Tax Readiness %, email inbox, and notification theatre are vision — not this product’s identity. Jury “wow” for agents can come later if the vertical slice is done.

## Findings

| Claim | Evidence | Confidence | Impact |
| --- | --- | ---: | --- |
| Filing is a memory/organization problem, not a July form problem | Tax Memory §1–3; our pitch/PRD already say this | High | Keep; sharpens the pitch |
| Life events can matter as much as receipts | Tax Memory key insight; German ontology (km/HO days vs photo inbox) | High | Keep as the differentiator; do not become a scanner |
| Two sources of truth: life context + evidence | Tax Memory §3.2 / §30 | High | Life context is the MVP (check-in). Evidence/OCR is deferred |
| Personalized check-in, not the same generic quiz forever | Tax Memory §8.2 | Med | Principle kept; MVP can still ship a fixed five |
| Agent loop Capture → Understand → Connect → Ask → Remember → Prepare | Tax Memory §1 | Med | Valid later implementation story; not the user-facing promise |
| Tax Readiness % as dashboard hero | Tax Memory §25 / demo script; our Option C rejection | High | Reject as identity; optional later footnote for organization |
| Monthly notification / email as the loop | Tax Memory §8, §32; brief forbids reminder theatre | High | Out of scope. Pull, not push |
| Receipt upload + pattern detection as hackathon must-haves | Tax Memory §25; our ontology research (don’t clone Dokumenten-Manager) | High | Deferred. Structured facts beat a photo inbox |
| Multi-agent + MCP as jury dimension | Tax Memory §2, §22–23; jury weights 25% orchestration | Med | Optional expansion after calendar + one month; not a prerequisite |
| Broader life-event taxonomy (work/home/travel/family/education/health/purchases/donations) | Tax Memory §10 | High | Reference map; visit ceiling stays five questions |
| “Potential / worth checking” vs Finanzamt truth | Tax Memory §7, §34 | High | Trust copy; keep |
| Tagline: Don’t remember your tax year. Build it. | Tax Memory throughout | High | Pitch line; product name stays This Month |

## Options considered

### Option A — Replace This Month with Tax Memory

**Pros:** Stronger AI demo; maps to jury orchestration weight.

**Cons:** Receipt scanner is generic; notifications fight the brief; Readiness % is Option C; blows hackathon scope.

**Risks:** Looks like a worse Dokumenten-Manager plus chatbot.

### Option B — Absorb as related vision (chosen)

**Pros:** Keeps Option B identity; keeps calendar slice small; still gets tagline, insight, taxonomy, deferred AI story for the room.

**Cons:** Two names in the pitch (This Month vs Tax Memory).

**Risks:** Judges ask “where is the OCR?” — mitigate by pitching life vs forms, OCR as later.

### Option C — Ignore the PR

**Pros:** Zero merge cost.

**Cons:** Loses teammate insight, tagline, jury-weight framing, and a parked AI backlog we would reinvent.

## Recommendation

Absorb Tax Memory as **related vision**, not a rename. Calendar + five-question dialog remain the delivery contract. Park OCR, agents, MCP, readiness score, inbox, and Time Machine until a phase is opened.

## Open questions

- How far to show Tax Memory AI in the hackathon demo if calendar + one month is already working? Default: not until the vertical slice is done.

## Impact on implementation

- **Buckets affected:** none required now (docs ingest only).
- **Phase impact:** no new phase; deferred list grows.
- **Decision needed:** yes — recorded in the decision log.
