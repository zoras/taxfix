# PRD: Monthly life check-in (This Month)

Durable product intent. This document is the idea, the loop, and the contract with the brief. It is not a UI spec and not an implementation plan.

**Working product name:** This Month  
**Feature name:** Monthly life check-in  
**Related vision (absorbed):** Tax Memory — “Don’t remember your tax year. Build it.”  
**Source merge:** [PR #3](https://github.com/yarychh/taxfix/pull/3) (zoras). Full source: [tax-memory-prd-zoras.md](../research/tax-memory-prd-zoras.md). Where the two conflict, **This Month** and the decision log win. The live return object is the **calendar dashboard** (year sections), not a second File route.

---

## Problem

Taxfix is valuable all year (optimise tax, reduce stress) but used as a **once-a-year panic button**. Germany’s hard filing deadline compresses peak activity into a few weeks, then silence.

Silence is expensive:

- Life events that change tax (job, move, home office, commute, family, donations, extra costs) happen off-season.
- Users reconstruct the year under time pressure. Anxiety goes up. Data quality goes down.
- There is no honest reason to open the app in November.

Tax filing is fundamentally a **memory and organization problem**. People spend money, change jobs, move, travel, study, work remotely, buy equipment, and get medical bills throughout the year. By filing season they have forgotten what happened, where the receipts are, and which facts matter.

### Key insight (from Tax Memory)

**Receipts are only one part of the tax story.** A life event can matter as much as a receipt.

> “I started working from home.” → work pattern + related purchases  
> “I changed jobs.” → a cluster of potentially relevant facts  
> “I moved.” → commute, home office, relocation context

Two sources of truth, one year:

| Source           | What it is                                                       |
| ---------------- | ---------------------------------------------------------------- |
| **Life context** | What happened (This Month; how the month passed on the calendar) |
| **Evidence**     | What was spent or documented (later: expenses, receipts, docs)   |

The product’s job is to capture life context while it is still true — and, later, to help connect evidence. Connecting evidence with life context is the long-term differentiator; the **monthly life check-in** is the year-round habit that fills the year.

The brief forbids solving silence with reminders, fake urgency, streaks, or filing-season-only features.

---

## Users

**Primary:** A Taxfix user in Germany, typically employed, who files (or intends to file) with Taxfix but has no reason to return between seasons. Often stressed because documents and memories are scattered by April.

**Secondary (hackathon judges / Taxfix):** Need a year-round loop that still looks like Taxfix — calm, competent, not a game. Jury weights (equal): Innovation, Multi-agent Orchestration, Taxfix Scope (voluntary Q4 value, no empty reminders), Demo Quality.

**Not primary:** Tax advisors running a full mandate; users who want a complete ELSTER wizard in November.

---

## Desired outcome

A user **wants** to open Taxfix in a random month, answers a short check-in about their life, and leaves feeling **caught up** — in control, financially savvy, a little clever.

Over a year, Taxfix already knows the facts that usually get hunted in July. Filing becomes confirmation. Stress at deadline drops because the work was never a deadline problem.

Success at full delivery (product, not metrics dashboard):

- The check-in is understandable without tax vocabulary.
- “No” is a valid, complete month.
- **One calendar dashboard** is the artifact people return to: a section per year they have submitted, months listed inside — not a month/week/day grid.
- Check-in is a **dialog** from that page (“how did this month pass?”), not a second route.
- Nothing in the flow borrows panic from the statutory deadline.

Longer-horizon outcome (Tax Memory vision, not MVP identity): the year on the calendar accumulates enough life context — and later, evidence — that Q4 feels like closing a year already built, not starting from zero.

Flows and stories: [user-flows.md](../user-flows.md).

---

## The idea

One page, one truth:

- **Calendar** — the only app page. A section appears for each **year the user has submitted** a month. Inside: the months they checked in, and how those months passed. Not a month/week/day calendar. This is Tax Memory’s “persistent memory of the tax-relevant year,” named for the product we ship.
- **This Month** — a **Check in** button on that page. It opens a dialog: five yes/no questions about how the month passed. Finish writes that month into the year’s section.

People open Taxfix because something happened — or because nothing did, and they want to be caught up. Not a form, not a countdown, not a wallet of fake points.

Product feeling: _a calm companion that remembers the year for you_ — never _another tax form_.

Core loop (life language):

> **Happen → Capture (This Month) → Remember (year on the calendar) → Feel caught up → (later) Connect evidence → Prepare for filing**

Tax Memory’s agent loop (`Capture → Understand → Connect → Ask → Remember → Prepare`) remains a valid **implementation** story for a later AI layer; it does not replace the calendar as the user-facing promise.

---

## How it works

### Cadence

- One check-in **per calendar month** for the current tax year.
- Opening the app in a month where the check-in is not done presents **this month**, not “you’re late for March.”
- Missed months are available as optional catch-up, never as debt or a red badge.
- The first session may offer **catch up the year so far** so a November demo still feels complete.

### One way in

- **Calendar** → **Check in** → dialog of yes/no questions → month lands in that year’s section.

There is no second page. Direct “add a laptop without the quiz” is deferred.

### The conversation (shape, not screens)

1. **Invite** — Named by month: “November is ready.” Tone: opportunity, not obligation. Check in is a button, not a trap.
2. **Five yes/no life questions in a dialog** — About the person’s life this month, in plain language. Tax categories stay backstage.
3. **No interrogation after a no.** Follow-up mini-forms on yes are deferred; a yes still marks how the month passed.
4. **Write the year** — That month appears under the year’s section (created if this is the first submission of the year).
5. **Close** — “You’re caught up.” Explicit permission to leave. July is mentioned only as something that will be easier, never as a ticking clock.

Personalization (Tax Memory principle, kept): do **not** force the same generic questionnaire forever. Prefer skipping topics already captured this month; later phases may order or soft-select questions from context. MVP can still ship a fixed five.

### What the questions cover (content contract)

The set should map to **high-frequency, high-regret German life events**, not the whole EStG. Working set for the product (wording can change; intent cannot):

| Life question (intent)                                              | Why it is tax-relevant later                                 |
| ------------------------------------------------------------------- | ------------------------------------------------------------ |
| New or changed job / employer                                       | Employment facts, Lohnsteuer, first/last month               |
| Moved, or commute changed                                           | Pendlerpauschale, Entfernung                                 |
| Home-office / remote pattern changed                                | Home-office Tagespauschale                                   |
| Spent extra on work (tools, laptop, training)                       | Werbungskosten                                               |
| Donated, had unusual health/family costs, or a family status change | Spenden, außergewöhnliche Belastungen, Kinder / Steuerklasse |

Five is a ceiling for a normal month. Branching after yes must stay tiny. If nothing changed, the whole visit is five taps.

### Life-event map (broader taxonomy)

The five questions are the **ceiling for a visit**. How a month passed can grow from a fuller map (Tax Memory taxonomy). MVP implements a thin vertical slice; the rest is reference:

| Domain    | Examples                                                                                        |
| --------- | ----------------------------------------------------------------------------------------------- |
| Work      | New job, job change, unemployment, remote work, work location, freelance, professional training |
| Home      | Moving, new apartment, home office, household changes                                           |
| Travel    | Business trips, commuting changes, work-related travel, relocation                              |
| Family    | Marriage, separation, child, childcare, dependents                                              |
| Education | Course, degree, certification, training                                                         |
| Health    | Medical, dental, prescriptions, glasses/hearing, other                                          |
| Purchases | Laptop, monitor, phone, desk, software, equipment                                               |
| Donations | Charitable donations, relevant memberships                                                      |

### The calendar (the return object)

The calendar is the tax-year home:

- **Year sections** — only years with at least one submitted month. Newest year first. Not a 12-month grid.
- **Months inside a year** — how that month passed (quiet, moved, new job, …). Same promise as Tax Memory’s year timeline: _you live your life; we remember the tax-relevant parts._
- **Check in** — dialog for the current month, until that month is done.

This is the reason to come back: **see the years you have already put on file**, not to protect a streak.

A running euro refund **is not the hero** of this product. A lump-sum meter vs €1,230 (see research) may later sit on a year section as a footnote, never a score to grind.

A **Tax Readiness %** dashboard (documents organized / issues remaining) was considered in Tax Memory and rejected as product identity (decision log: Option C). If revisited, it stays a footnote metric for organization — never refund size, never fake urgency.

### Why they open in November

Not because we pushed. Because:

- They bought a work laptop, changed desks, moved, or switched jobs — and this is the place that remembers.
- They like the feeling of being caught up.
- The year on the calendar is _theirs_.

If they never come in November, we did not manufacture urgency. We left value on the table honestly.

---

## Scope (feature-level)

### In scope

- One calendar dashboard (no second File / This Month route).
- Year sections for years the user has submitted; months listed inside, not a MWD calendar.
- Monthly yes/no life check-in in a dialog for the current tax year.
- Optional catch-up of past months without guilt UX (later; not a red debt).
- Tone: control, savvy, slightly clever. German tax concepts in the engine; human questions on the surface.
- Auth-gated: a User owns their check-ins (session required when persistence moves off the client).
- Copy that distinguishes **potential** tax relevance from official Finanzamt truth.

### Out of scope

- Push notifications, email nagging, streaks, badges-as-goals, deadline countdowns.
- Full Steuererklärung / ELSTER submission.
- Bank/PSD2, OCR, Lohnsteuerbescheinigung parsing (unless a later phase is explicitly opened).
- Precise legally binding tax calculation.
- Fake urgency copy (“only X days left”, “don’t lose your streak”).
- Engagement mechanics whose only job is to produce opens.
- Tax Readiness score as the product hero.
- Production email inbox / forward-to-Tax-Memory address (demo simulation only if a later phase opens it).

### Deferred (Tax Memory vision — not this PRD’s delivery contract)

Parked until operators explicitly open a phase. Useful for hackathon storytelling / later builds:

- Direct add of an expense or life change without the check-in dialog (the earlier File page).
- Follow-up mini-forms after a yes (amounts, km, WFH days).
- Receipt / document upload with AI extraction (merchant, date, amount, category, confidence).
- Pattern detection (e.g. train + hotel + meal → one trip) and “AI noticed something” confirmations.
- Missing-evidence prompts tied to life events or incomplete trips.
- Multi-agent orchestration (Document, Life Event, Tax Context, Pattern, Evidence, Tax Memory agents + orchestrator).
- MCP tools over the year (`get_life_events`, `get_expenses`, `find_missing_evidence`, …).
- Year-end “prepare my tax year” interview / Tax Time Machine presentation.
- Personalized Q4 copy that reflects calendar depth (still pull-based, not nag theatre).

---

## User stories (summary)

- As a Taxfix user, I want to answer a few questions about my life this month, so that I do not have to remember July’s details in July.
- As a Taxfix user, I want “nothing changed” to be a complete answer, so that I do not feel dutiful when life was quiet.
- As a Taxfix user, I want a calendar of years I have already submitted, so that I feel in control when I open the app off-season.
- As a Taxfix user, I want missed months to stay optional, so that I never feel I failed the product.
- As a Taxfix user, I want life language — not Anlage names — so that I do not need to be a tax expert to stay organized.
- As Taxfix, we want better year-round facts, so that filing season is less frantic and data quality is higher.
- As Taxfix (later), we want life events and expenses connectable, so that forgotten evidence surfaces before filing — without making connection the MVP.

---

## Non-functional requirements

- **Performance:** A full “all no” month should feel instant (seconds, not a wizard).
- **Accessibility:** Questions and yes/no must work with keyboard and screen readers; no information in color alone.
- **Trust:** Copy must not present estimates or stored facts as official Finanzamt truth. Prefer “potentially relevant,” “worth checking,” “may apply depending on your circumstances.”
- **Tone:** Serious domain, light feeling. No guilt, no scolding for skipped months.
- **Privacy:** Life facts are personal financial-adjacent data; owned by the User; not playful public content. Prototypes should prefer synthetic/demo data.

---

## Permissions (feature-level)

- Unauthenticated visitors do not see another person’s check-in or File.
- Authenticated User: create/update **their** monthly check-ins, expenses, and life changes only.
- No shared household / partner filing in this feature unless explicitly added later.

---

## Data implications (feature-level)

Conceptual only (no schema work in this document):

- **Monthly check-in:** User, calendar month, tax year, status (not started / completed), answers; later: identified events.
- **Expense:** dated amount + label + light category, owned by User, belongs to a tax year (deferred until File-add reopens).
- **Life change:** typed event (moved, job, WFH, …) with date; updates standing facts from that date (deferred until follow-ups reopen).
- **Standing facts / year view:** read model over life changes + expenses + check-in status.

Later (deferred Tax Memory entities — not required to accept this PRD): Document, ExpenseGroup, EvidenceIssue, confidence/status fields for AI extraction.

Retention: keep for the tax year at least through filing; exact retention is an implementation decision later.

---

## External integrations

None required for the product idea. Translation from life → tax category is a **rules table we write**, not an authority API.

Deferred optional integrations (not in scope): OCR/document AI, email forward inbox, MCP surface for agents.

---

## Alignment with the brief

| Brief                                       | This Month                                          |
| ------------------------------------------- | --------------------------------------------------- |
| Voluntary, recurring, outside filing season | Monthly check-in dialog + year sections on one page |
| Not reminders / nudges                      | No notification theatre; pull, not push             |
| Real value                                  | Facts captured while true; July gets easier         |
| Return loop                                 | Next month’s check-in + seeing years already filed  |
| Buzz                                        | “They asked about my life”                          |
| Emotional outcome                           | Caught up, savvy — not anxious                      |
| No fake urgency                             | No clocks, streaks, or manufactured deadlines       |
| No filing-only                              | Completely usable in November with zero submit CTA  |

Tax Memory’s retention insight still applies: people return because **context accumulated**, not because a reminder fired.

---

## Risks

- **Weak pull without notifications.** If the year sections are not emotionally rewarding, people will not return. Mitigation: close feeling must be pride/control; a quiet month still creates a year.
- **Feels like a chore disguised as wellness.** Mitigation: five questions max; no is complete; never scold.
- **Looks like a worse filing wizard.** Mitigation: no form-layout, no Anlage names in the questions; not a MWD calendar.
- **Judges expect euro impact or OCR wow (Option A / Tax Memory receipt scanner).** Mitigation: pitch life vs forms; optional later lump-sum footnote on a year section; OCR stays deferred, not the identity.
- **Incorrect tax advice (if AI layers land).** Mitigation: potential/worth-checking language only; never unsupported definitive conclusions.
- **Hackathon time.** The idea is small on purpose: one dashboard + one month dialog. Multi-agent/OCR demos are optional expansions, not prerequisites.
- **Naming collision (This Month vs Tax Memory).** Mitigation: ship This Month; keep Tax Memory as vision/tagline for pitch if useful (“build the year, don’t remember it”).

---

## Open questions

Product-level, not build-level:

1. **Hero object:** year sections only vs a small labeled euro / lump-sum footnote. Default: year sections only.
2. **Language:** English UI for speed vs German copy for brand authenticity. Default: English UI, German tax terms in the engine.
3. **First-run:** Empty calendar vs “catch up the year so far” as the default first visit. Default: empty until the first check-in; do not force catch-up.
4. **How far to show Tax Memory AI in the hackathon demo?** Default: calendar + This Month first; agents/OCR only if time remains after the vertical slice.

---

## Explicitly deferred

- Direct add of an expense or life change without the check-in dialog
- Follow-up mini-forms after a yes (amounts, km, WFH days)
- Lump-sum meter vs €1,230 on a year section
- Drizzle persistence (current UI stores check-ins on the client)
- OCR/document pipeline, multi-agent orchestration, MCP layer, readiness score UI, email inbox, and year-end Tax Time Machine — until this PRD is accepted and a phase is opened.

---

## Pitch fragment (optional stage line)

> Tax season starts too late. Tax-relevant life happens all year. **This Month** asks what changed while it is still true; the **calendar** is where the year lives. Don’t remember your tax year. Build it.
