# Decision Log

## Current accepted decisions

- Product direction is Option B: monthly life check-in (**This Month**), not a refund-pocket hero or a filing-season wizard
- Product docs before UI/implementation
- First UI scaffold is a shadcn sidebar app shell; auth is off until the check-in needs a User
- **Calendar dashboard** is the current return object (year sections + check-in dialog); a second File page is deferred
- File-add does not complete the month (assumption until operator changes it; File-add itself is deferred)
- **Tax Memory** (zoras) is related vision/tagline, not a rename and not the MVP. OCR, agents, readiness %, inbox stay parked

## Log

### 2026-09-17 — Choose monthly life check-in over refund pocket

**Status:** Accepted

**Context:**
Hackathon brief: voluntary recurring engagement outside filing season, real value, return loop, buzz, no notification theatre / fake urgency / filing-only features. Several directions were sketched; operator chose B.

**Decision:**
Build the product concept around a monthly yes/no life conversation plus a year story. Do not make a running refund estimate the identity of the product.

**Alternatives considered:**

- Refund pocket (Option A) — stronger dopamine, weaker “life not forms” story; operator passed
- Filing readiness meter (Option C) — closer to a form completeness UI; easier to look filing-only
- “Was this tax money?” classifier (Option D) — buzzworthy, weaker monthly ritual

**Consequences:**
Pitch and PRD center on cadence, questions, and year story. Euro impact, if any, stays a later optional footnote.

**Supersedes:** none

### 2026-09-17 — Product framing before feature design

**Status:** Accepted

**Context:**
Operator asked to stop before designing screens or implementation and to produce a PRD and product pitch.

**Decision:**
Write pitch + feature PRD only. No phase PRD, no tasks, no schema, no UI.

**Alternatives considered:**

- Full `/feature-development` planning through Phase 1 tasks — skipped until idea is locked

**Consequences:**
Roadmap stays at framing until the operator accepts the idea.

**Supersedes:** none

### 2026-09-17 — The File is the return object; check-in is a writer

**Status:** Accepted

**Context:**
Operator asked to understand user flows and specified a File page where the user submits expenses and life changes such as moving. The original PRD treated the year story as a read model.

**Decision:**
The File is first-class: timeline + standing facts + add expense / add life change. This Month is an optional guided writer into the same File. Direct add does not auto-complete the month. Check-in skips topics already recorded this month.

**Alternatives considered:**

- Check-in only, File read-only — blocks the “I bought a laptop” path
- File only, no monthly ritual — weaker forget-proof loop, weaker “caught up” close
- Direct add marks the month done — simpler, but pretends one laptop means the whole month was reviewed

**Consequences:**
Two surfaces to explain. Flows live in `user-flows.md`. First build slice is File (move + expense) plus one month check-in.

**Supersedes:** year story as read-only artifact in the initial PRD framing

### 2026-09-17 — Scaffold app shell with shadcn sidebar; auth off

**Status:** Accepted

**Context:**
Operator asked to start scaffolding, use shadcn for a sidebar, and disable auth for now.

**Decision:**
Add React + shadcn to `apps/web`, wrap app pages in a sidebar shell (**This Month**, **The File**), and skip session lookup so the UI can be used without login. Leave Better Auth packages in place.

**Alternatives considered:**

- Keep the Better-T-Stack header + auth gate and add UI inside `/dashboard` — blocked by login
- Remove auth packages entirely — too much churn for a temporary hackathon shortcut

**Consequences:**
Login/signup still exist but are unlinked. `/dashboard` redirects to `/`. Auth must be re-enabled before storing File entries per user.

**Supersedes:** “Product framing before feature design” for the “no UI” part only — product docs still stand

### 2026-09-17 — Absorb Tax Memory as related vision, not product identity

**Status:** Accepted

**Context:**
Zoras opened [PR #3](https://github.com/yarychh/taxfix/pull/3) with a Tax Memory PRD (receipt AI, life-event check-in, pattern detection, Tax Readiness %, multi-agent/MCP) and a merge into our feature PRD. His merge rule: This Month and the decision log win on conflict. Code on this branch is already a single calendar dashboard, not a File page. Tax Memory also proposes monthly notifications and a readiness score — both already rejected for this feature.

**Decision:**
Ingest Tax Memory as related vision. Keep the product name **This Month**. Keep the calendar + five-question dialog as the delivery contract. Keep the tagline “Don’t remember your tax year. Build it.” Map “persistent memory of the year” to year sections on the calendar. Park OCR, agents, MCP, readiness % as hero, email inbox, and notification theatre.

**Alternatives considered:**

- Replace This Month with Tax Memory (AI companion + receipt scanner) — fights the brief (reminders), Option C (readiness meter), and ontology research (don’t clone the photo inbox)
- Ignore the PR — loses teammate insight, jury-weight framing, and a parked AI backlog

**Consequences:**
Pitch may use the Tax Memory line. Demo can mention agents only after the calendar slice. A second File route stays deferred unless operators reopen it. GH PR #3 should not be merged as-is (it rewrites the File-era PRD).

**Supersedes:** none — does not undo Option B or the calendar dashboard; parks Tax Memory extras
