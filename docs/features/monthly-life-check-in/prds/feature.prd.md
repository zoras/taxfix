# PRD: Monthly life check-in (This Month)

Durable product intent. This document is the idea, the loop, and the contract with the brief. It is not a UI spec and not an implementation plan.

**Working product name:** This Month  
**Feature name:** Monthly life check-in

---

## Problem

Taxfix is valuable all year (optimise tax, reduce stress) but used as a **once-a-year panic button**. Germany’s hard filing deadline compresses peak activity into a few weeks, then silence.

Silence is expensive:

- Life events that change tax (job, move, home office, commute, family, donations, extra costs) happen off-season.
- Users reconstruct the year under time pressure. Anxiety goes up. Data quality goes down.
- There is no honest reason to open the app in November.

The brief forbids solving this with reminders, fake urgency, streaks, or filing-season-only features.

---

## Users

**Primary:** A Taxfix user in Germany, typically employed, who files (or intends to file) with Taxfix but has no reason to return between seasons.

**Secondary (hackathon judges / Taxfix):** Need a year-round loop that still looks like Taxfix — calm, competent, not a game.

**Not primary:** Tax advisors running a full mandate; users who want a complete ELSTER wizard in November.

---

## Desired outcome

A user **wants** to open Taxfix in a random month, answers a short check-in about their life, and leaves feeling **caught up** — in control, financially savvy, a little clever.

Over a year, Taxfix already knows the facts that usually get hunted in July. Filing becomes confirmation. Stress at deadline drops because the work was never a deadline problem.

Success at full delivery (product, not metrics dashboard):

- The check-in is understandable without tax vocabulary.
- “No” is a valid, complete month.
- **The File** is the artifact people return to (expenses, life changes, what is true today).
- The File is fully usable without finishing This Month (e.g. drop in a laptop, log a move).
- Nothing in the flow borrows panic from the statutory deadline.

Flows and stories: [user-flows.md](../user-flows.md).

---

## The idea

Two objects, one truth:

- **The File** — the tax-year page. Standing facts (“true today”) plus a timeline of **life changes** (moved, new job, WFH) and **expenses** (laptop, donation). Writable any day of the year.
- **This Month** — a voluntary conversation: “Did anything in your life change that taxes should know?” Each answer writes the same File entries as Add on the File.

People open Taxfix because something happened. The File is where it lives. This Month is how we catch what they would forget. Not a form, not a countdown, not a wallet of fake points.

---

## How it works

### Cadence

- One check-in **per calendar month** for the current tax year.
- Opening the app in a month where the check-in is not done presents **this month**, not “you’re late for March.”
- Missed months are available as optional catch-up, never as debt or a red badge.
- The first session may offer **catch up the year so far** so a November demo still feels complete.

### Two ways in

- **Guided:** Home → This Month → yes/no → follow-up forms that are the same as File → Add.
- **Direct:** Home → File → Add expense or Add life change (move, job, home office, …). Does **not** by itself mark the month complete.

If the File already has a matching entry in this calendar month, the check-in skips that question.

### The conversation (shape, not screens)

1. **Invite** — Named by month: “November is ready.” Tone: opportunity, not obligation. File stays reachable.
2. **Five yes/no life questions** — About the person’s life this month, in plain language. Tax categories stay backstage.
3. **Follow-up only on yes** — Same mini-forms as File Add (move, expense, WFH days, …). No interrogation after a no.
4. **Write the File** — Timeline row + updated standing facts when the change is a life event.
5. **Close** — “You’re caught up.” Explicit permission to leave. July is mentioned only as something that will be easier, never as a ticking clock.

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

### The File (the return object)

The File is the tax-year home:

- **True today** — standing facts in life language (“WFH 3 days — home-office lump sum, already noted”; “14 km commute”).
- **Timeline** — life changes and expenses, mixed, newest first.
- **Add** — expense or life change, anytime, including November, with no submit-return CTA.

This is the reason to come back: **keep the File true**, not to protect a streak.

A running euro refund **is not the hero** of this product. If a later phase shows a rough “this might matter in euros,” it is a footnote, labeled as an estimate, never a score to grind.

### Why they open in November

Not because we pushed. Because:

- They bought a work laptop, changed desks, moved, or switched jobs — and this is the place that remembers.
- They like the feeling of being caught up.
- The File is _theirs_.

If they never come in November, we did not manufacture urgency. We left value on the table honestly.

---

## Scope (feature-level)

### In scope

- Monthly yes/no life check-in for the current tax year.
- **The File:** true-today standing facts, timeline, add expense, add life change (including moving).
- Check-in follow-ups reuse the same add contracts as the File.
- Optional catch-up of past months without guilt UX.
- Tone: control, savvy, slightly clever. German tax concepts in the engine; human questions on the surface.
- Auth-gated: a User owns their check-ins and facts (session required).

### Out of scope

- Push notifications, email nagging, streaks, badges-as-goals, deadline countdowns.
- Full Steuererklärung / ELSTER submission.
- Bank/PSD2, OCR, Lohnsteuerbescheinigung parsing (unless a later phase is explicitly opened).
- Precise legally binding tax calculation.
- Fake urgency copy (“only X days left”, “don’t lose your streak”).
- Engagement mechanics whose only job is to produce opens.

---

## User stories (summary)

- As a Taxfix user, I want to answer a few questions about my life this month, so that I do not have to remember July’s details in July.
- As a Taxfix user, I want “nothing changed” to be a complete answer, so that I do not feel dutiful when life was quiet.
- As a Taxfix user, I want a File of my year (moves, job, WFH, expenses), so that I feel in control when I open the app off-season.
- As a Taxfix user, I want to log a move or an expense on the File without the monthly quiz, so that knowing what happened is enough.
- As a Taxfix user, I want missed months to stay optional, so that I never feel I failed the product.
- As Taxfix, we want better year-round facts, so that filing season is less frantic and data quality is higher.

---

## Non-functional requirements

- **Performance:** A full “all no” month should feel instant (seconds, not a wizard).
- **Accessibility:** Questions and yes/no must work with keyboard and screen readers; no information in color alone.
- **Trust:** Copy must not present estimates or stored facts as official Finanzamt truth.
- **Tone:** Serious domain, light feeling. No guilt, no scolding for skipped months.
- **Privacy:** Life facts are personal financial-adjacent data; owned by the User; not playful public content.

---

## Permissions (feature-level)

- Unauthenticated visitors do not see another person’s check-in or File.
- Authenticated User: create/update **their** monthly check-ins, expenses, and life changes only.
- No shared household / partner filing in this feature unless explicitly added later.

---

## Data implications (feature-level)

Conceptual only (no schema work in this document):

- **Monthly check-in:** User, calendar month, tax year, status (not started / completed), answers.
- **Expense:** dated amount + label + light category, owned by User, belongs to a tax year.
- **Life change:** typed event (moved, job, WFH, …) with date; updates standing facts from that date.
- **Standing facts / File view:** read model over life changes + expenses + check-in status.

Retention: keep for the tax year at least through filing; exact retention is an implementation decision later.

---

## External integrations

None required for the product idea. Translation from life → tax category is a **rules table we write**, not an authority API.

---

## Alignment with the brief

| Brief                                       | This Month                                         |
| ------------------------------------------- | -------------------------------------------------- |
| Voluntary, recurring, outside filing season | Monthly check-in + File you can add to any day     |
| Not reminders / nudges                      | No notification theatre; pull, not push            |
| Real value                                  | Facts captured while true; July gets easier        |
| Return loop                                 | Next month’s check-in + keeping the File true      |
| Buzz                                        | “They asked about my life”                         |
| Emotional outcome                           | Caught up, savvy — not anxious                     |
| No fake urgency                             | No clocks, streaks, or manufactured deadlines      |
| No filing-only                              | Completely usable in November with zero submit CTA |

---

## Risks

- **Weak pull without notifications.** If the File is not emotionally rewarding, people will not return. Mitigation: close feeling must be pride/control; File add works even when they skip the quiz.
- **Feels like a chore disguised as wellness.** Mitigation: five questions max; no is complete; never scold.
- **Looks like a worse filing wizard.** Mitigation: no form-layout, no Anlage names in the questions.
- **Judges expect euro impact (Option A).** Mitigation: pitch the insight (life vs forms); optional later footnote estimate, never the identity of the product.
- **Hackathon time.** The idea is small on purpose so a later build can stay a vertical slice of _File (add move + expense) + one month check-in_.
- **Two concepts (File vs This Month).** Mitigation: check-in is clearly “a way to fill the File”; skip questions already on file this month.

---

## Open questions

Product-level, not build-level:

1. **Hero object:** File only vs a small labeled euro footnote. Default: File only.
2. **Language:** English UI for speed vs German copy for brand authenticity. Default: English UI, German tax terms in the engine/File translations.
3. **First-run:** Empty File vs “catch up the year so far” as the default first visit. Default: offer catch-up, do not force it.
4. **Does File-add complete the month?** Default: no — only finishing This Month does.

---

## Explicitly deferred

UI, routes, Drizzle schema, phase roadmap, and implementation tasks stay deferred until this PRD and pitch are accepted.
