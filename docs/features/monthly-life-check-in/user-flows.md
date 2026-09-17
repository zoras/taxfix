# User flows and product stories

How **This Month** writes a year. This is the product loop, not pixel UI.

**Current surface (PRD + code):** one **calendar dashboard** and a check-in dialog. There is no second File page.

**Richer File-add model below** is earlier framing (timeline, standing facts, direct add). It is **deferred** until operators reopen it. Tax Memory (PR #3) connect-evidence / OCR is also deferred.

**Working names**

- **Calendar** — the tax-year home: year sections of months that passed.
- **This Month** — the five-question check-in that writes a month into that year.
- **The File** — deferred writable page (expenses + life changes). Kept in the flows below as the richer model, not the live UI.

---

## Mental model

Two objects, one truth.

```
                    writes into
This Month  ──────────────────────────►  The File
(ritual: “anything new?”)                (artifact: your 2026 tax year)

                                         ▲
                                         │ also writes
                                         │
                              Add on the File itself
                              (I already know: I moved / I bought a laptop)
```

People do not come to “do tax.” They come because **something happened**: they moved, they bought a work laptop, they changed desks. The File is where that lives. This Month is how we catch the things they would otherwise forget.

The year story from the PRD **is the File** — readable and writable, not a recap card with no actions.

---

## What lives in the File

Three kinds of knowledge. Users should not need these words; the product should.

| Kind              | Examples                                               | Behaviour                                                         |
| ----------------- | ------------------------------------------------------ | ----------------------------------------------------------------- |
| **Life change**   | Moved, new job, WFH pattern changed, family status     | Has a date. Updates **standing facts** from that date forward.    |
| **Expense**       | Work laptop, course, donation, extra health cost       | Has a date and an amount. Does not change commute or job.         |
| **Standing fact** | Current commute km, current WFH days, current employer | Derived from the latest life change. Shown as “what is true now.” |

Adding a move in June does not delete January. The File is a timeline plus a “true today” summary.

Evidence for what the Finanzamt actually needs, what Taxfix/WISO/Keeper do, and the usefulness rules: [research/german-tax-ontology-and-analogs.md](./research/german-tax-ontology-and-analogs.md).

---

## What makes the File useful (not a photo inbox)

German employees already get **€1,230 Werbungskosten** for free. Extra work costs only change the return **after that lump sum is beaten**. The usual way over the line is **commute × office days** and **home-office days × €6** — and those two **cannot both apply on the same calendar day**.

Taxfix already has a Dokumenten-Manager (scan + title + amount + category). Support says those rows **do not enter the Steuererklärung yet**. If we only store receipts, we clone a known gap.

So the File’s job is **structured facts VaSt will never prefill**: one-way km, day mix, dated expenses with a tax bucket. The number we show is **documented Werbungskosten vs €1,230**, not a fake refund.

---

## User flows (what they do → what they should see)

### Flow 1 — First commute (the value path)

Alex opens File, empty. Adds life change: moved / commute.

**Must enter:** one-way km (or fully remote), since when.  
**We assume (shown, editable later):** ~220 workdays/year, 0 HO days until they say otherwise.

**Output immediately:** “About €X commute costs on file. The Finanzamt already counts €1,230 automatically — you are Y below / €Z above that line.”  
If 2026 and ~15+ km at 220 office days, they cross the line from commute alone.

### Flow 2 — WFH appears

Alex says This Month: home office changed → 3 days/week.

**We re-split days:** cannot keep 220 office days **and** 3×52 HO days. Office days drop. Commute € down, HO €6 × days up (cap 210). Meter updates.

**Output:** new split in true today + meter moved. Copy: “Office days and home-office days don’t stack on the same day.”

### Flow 3 — November laptop (intent path)

File → Add expense → work laptop → amount, date. Use % defaults to 100% for “work laptop.” IT counts **this tax year**.

**Output:** meter ticks only if they were near/over €1,230 **or** this amount helps get there. If still under, still useful: “Noted. Together with your commute this will count.”

### Flow 4 — Donation

Same add path, bucket **donation** (Sonderausgaben, not Werbungskosten). Meter for lump sum **does not** include it. Separate line: “Donation on file — different box at filing.” If > €300, remind formal receipt.

### Flow 5 — Quiet month

Five nos. Meter unchanged. Output is the feeling: caught up. That is enough.

### Flow 6 — July (boundary, not this feature)

Taxfix interview / VaSt already has wages. File supplies km, day split, expense list. We still **do not** submit ELSTER here.

---

## Surfaces (intent, not layout)

### Home

After login, one of two moods:

- **This month is open** — “November is ready.” Primary: start check-in. Secondary: open the File / add something now.
- **This month is done** — “You’re caught up.” Primary: the File. No scolding, no countdown.

Home never blocks the File. Someone who bought a laptop can skip the quiz.

### The File (the page we need)

Always available for the current tax year.

1. **True today** — standing facts in life language (“14 km commute”, “WFH 3 days”). Empty state: “Nothing on file yet.”
2. **Timeline** — life changes and expenses, newest first, mixed in one list (not two products).
3. **Add** — two destinations, one decision:
   - Add an **expense**
   - Add a **life change** (move, job, home office, family / extra costs)
4. **This Month** — a quiet status: ready / done. Not a progress bar of 12 months.

The File is usable in November with **no Submit tax return** CTA.

### This Month (check-in)

A short conversation. Each “yes” opens a **mini add** that is the same as adding on the File (move form, expense form, …). Each “no” stores “nothing this month for that topic.” Finish → month marked done → back to File with a close line: you’re caught up.

If the File already has a matching entry **in this calendar month**, that question is treated as already answered (skipped or shown as “already on file”).

---

## How the two add paths stay one product

|                      | This Month                          | File → Add                                                                            |
| -------------------- | ----------------------------------- | ------------------------------------------------------------------------------------- |
| When                 | “I opened the app, ask me.”         | “I know what happened.”                                                               |
| Feeling              | Guided, forget-proof                | Direct, in control                                                                    |
| Result               | Same File entries                   | Same File entries                                                                     |
| Completes the month? | Yes, when they finish all questions | **No** by itself. It only fills that topic. Other questions can still be asked later. |

Default: logging a laptop does not pretend the whole month was reviewed. The check-in can still ask about a move. Completing the check-in with all “no” is valid even if they already added something — those questions are skipped.

---

## Product stories

### 1. First open, empty File

Alex creates an account in November. File is empty. Home: November is ready.

Alex can:

- Start This Month (five questions), or
- Open the File and add a move or an expense without the quiz.

We **offer** “catch up earlier months,” we do not require it. Empty File is allowed.

**Story:** As a new user, I want to put one true thing on file immediately, so the product is useful before I commit to a ritual.

### 2. Quiet month (all no)

Alex opens in February. Nothing changed. Five nos. File timeline unchanged. Month = done. Close: you’re caught up.

**Story:** As a user with a quiet month, I want “no” to finish the visit, so I never feel I owe Taxfix a form.

### 3. Check-in → moved

Alex says yes to “Did you move, or did the way to work change?”

Follow-up (same as File → life change → moved):

- When (month is enough)
- New commute distance (km), or “I don’t commute”
- Optional: city / from–to in one line, not a full address form

Save → File shows:

- Timeline: “Moved · November”
- True today: commute updated

Remaining questions continue. Then month done.

**Story:** As someone who moved, I want to tell Taxfix once, while I still know the distance, so July does not become a memory test.

### 4. Check-in → work expense

Alex says yes to extra work spend. Follow-up (same as File → expense):

- What (short label: “Laptop”)
- Amount
- When (defaults to this month)

Save → timeline row. Not a standing fact.

**Story:** As someone who bought a work laptop in November, I want to drop it in the File the week I bought it, so I open Taxfix because I want the thing remembered.

### 5. Intent path: File first (the November laptop)

Alex does not want five questions. Home → File → Add expense → laptop → saved. Leaves.

November check-in stays **ready**. Next time, “Spent extra on work?” is already on file and skipped.

**Story:** As a user who already knows what happened, I want to add it on the File page without a quiz, so the ritual never blocks genuine value.

### 6. Life change from the File (moved, skipped quiz)

Same as 3, entered from Add → life change → moved. Month not auto-completed.

**Story:** As a user, I want moving to be a first-class File action, not hidden inside a questionnaire.

### 7. Correct or undo

Alex entered 40 km by mistake. From the timeline row: edit or remove. Standing commute recalculates from remaining life changes. No shame copy.

**Story:** As a user, I want to fix a wrong fact, so the File stays trustworthy.

### 8. Missed months

March and April were skipped. May check-in does **not** say “you missed two months.” File may offer “Add something from earlier” (expense/life change with a past date). Optional: complete March’s check-in later. Never a red debt.

**Story:** As a user who disappeared, I want to come back without being in arrears.

### 9. Already caught up

Alex opens in November after finishing the check-in. Home is the File. They can still add another expense. No fake “come back tomorrow.”

**Story:** As a caught-up user, I want the File to be the product, so I still have a reason to enter a new laptop the same month.

### 10. Filing season (boundary)

The File is still the File. We do **not** add “Submit return” as the point of this feature. Copy may say July will be easier. That is the whole filing relationship for this product.

---

## End-to-end flows

### A — Guided month

```
Login → Home (month ready)
     → This Month
         → Q: job?        no
         → Q: moved?      yes → add life change (move) → File updated
         → Q: WFH?        no
         → Q: expense?    no  (or skip if expense already this month)
         → Q: family/extra? no
     → You’re caught up
     → File (timeline + true today)
```

### B — Direct add

```
Login → Home
     → File
     → Add expense or Add life change
     → Saved on timeline
     → Leave (month still “ready” unless they also finish This Month)
```

### C — Mixed (most realistic November)

```
Login → File → Add laptop
     → (later or same session) This Month
         → work-spend question already on file → skip
         → other questions…
     → You’re caught up
```

---

## Add contracts (inputs)

Tiny forms. Every field below is there because Anlage N / Sonderausgaben needs it — or because the meter is a lie without it.

### Shared

- **Tax year** (product default: 2026). Not asked every time.
- **Effective month** on every life change (prorate).

### Life change — moved / commute

| Ask                                  | Required               | Maps to                                              |
| ------------------------------------ | ---------------------- | ---------------------------------------------------- |
| One-way km to work, whole kilometres | Yes, or “fully remote” | Entfernungspauschale (shortest road; not round trip) |
| Since when                           | Yes                    | Segment the year                                     |
| Optional: “Berlin → Hamburg”         | No                     | Human timeline only                                  |
| Jobticket / employer pays travel     | Should, default no     | Reduces commute if yes                               |

Do **not** ask full address or route. Do **not** use round-trip.

### Life change — home office

| Ask                                  | Required | Maps to                         |
| ------------------------------------ | -------- | ------------------------------- |
| Typical WFH days per week, or “none” | Yes      | Tagespauschale €6, cap 210 days |
| Since when                           | Yes      | Re-split remaining year         |

Derived, not asked first: office days = workdays − HO days (workdays default **220**, shown in File). Same day cannot be both.

### Life change — job

| Ask                      | Required | Maps to |
| ------------------------ | -------- | ------- |
| Started / left / changed | Yes      | Periods |
| Month                    | Yes      | Prorate |
| Employer name            | No       | Label   |

If they now commute somewhere else, continue into the commute fields.

### Expense

| Ask                                                                     | Required                                    | Maps to                                                                        |
| ----------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------ |
| What (label)                                                            | Yes                                         | Timeline                                                                       |
| Amount €                                                                | Yes                                         | Amount                                                                         |
| Date                                                                    | Yes (default today)                         | Tax year                                                                       |
| Kind: work tool / donation / other                                      | Yes                                         | Werbungskosten vs Sonderausgaben                                               |
| Work-only vs shared (only if work tool that is often mixed, e.g. phone) | When mixed                                  | Use %; laptop work-only → 100%                                                 |
| IT / computer vs other work thing                                       | Infer from kind, confirm if large furniture | IT: full this year × use %; furniture: do not dump 100% into this year’s meter |
| Photo                                                                   | No                                          | Belegvorhaltepflicht stays with the human                                      |

Health/family extra costs: out of first slice (außergewöhnliche Belastungen is a different, messy engine).

### This Month questions → these contracts

Same five intents as the PRD. Yes opens the matching table above. No writes “no change this month” without creating a fake 0 km row.

---

## Outputs (what the user should expect)

On **the File**, always:

1. **True today** — commute km, WFH days/week, implied office vs HO days, assumption “220 workdays” visible.
2. **Lump-sum meter** — documented Werbungskosten vs **€1,230**. States: under / just over / well over. Not a refund.
3. **Timeline** — moves, job, expenses, donations with human labels.
4. **Translation line** — “This is the home-office lump sum / commute allowance / work tool, already noted.”
5. **Honesty** — unverbindlich; Finanzamt decides; not Steuerberatung; keep originals.

Donations listed separately from the meter.

**Do not show:** € refund, days-until-deadline, “submit return”, streaks.

When they add something, the **meter or true-today must change** (or we explain why it did not: still under lump sum, or donation bucket). If the UI does not move, the product is not useful.

---

## Technical requirements (or it is not useful)

See research for sources. Non-negotiable for a first slice:

1. Data scoped to a **tax year**; **2026 rates** (€0.38/km from km 1; HO €6 / max 210).
2. **Day allocator** + **prorate** on life-change dates.
3. **Integer one-way km.**
4. Meter uses `werbungskosten` only; Spenden excluded; HO cap 210.
5. IT work tools can hit this year’s meter; unknown furniture must not silently count 100%.
6. No refund formula without wage/Steuerklasse inputs.
7. Labels: estimate, not advice (StBerG / Taxfix AGB posture).
8. Per-user persistence before this is more than a demo (auth currently off).
9. No ELSTER, no VaSt, no bank OCR in this feature.
10. Plausibility: HO > 210, office trips > 230, commute 0 while not remote.

---

## Empty, mid, done (File)

| State      | User sees                                                                       |
| ---------- | ------------------------------------------------------------------------------- |
| Empty      | True today empty; timeline empty; Add is the loudest action; This Month offered |
| Mid-year   | True today filled; timeline has rows; Add still easy                            |
| Month done | Same File; This Month status done; adding still allowed                         |

Errors: failed save keeps them on the add step with a calm retry. No data loss of other File entries.

---

## What we will not do in these flows

- Notify them to complete November.
- Show 12-month streaks or “2 months behind.”
- Countdown to the statutory deadline.
- Force the check-in before Add.
- Treat the File as a full Steuererklärung.

---

## Open product choices (flow-level)

Defaults we will use unless you change them:

1. **File add does not complete the month** — only finishing This Month does. Consequence: two concepts to explain; more honest.
2. **One timeline** for expenses and life changes, two add types. Consequence: simpler File; mixed list needs clear row labels.
3. **Check-in skips topics already on file this month.** Consequence: the two paths feel like one product.
4. **Family/status** is optional for the first slice; move + job + WFH + expense are the File’s core.

---

## Mapping to PRD stories

| PRD story                                | Flow                         |
| ---------------------------------------- | ---------------------------- |
| Answer a few questions so July is easier | Flow A                       |
| “Nothing changed” is complete            | Story 2                      |
| See what Taxfix already knows            | File → true today + timeline |
| Missed months stay optional              | Story 8                      |
| Open in November because they want to    | Flow B / story 4–5           |
