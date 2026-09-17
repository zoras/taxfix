# User flows and product stories

How **This Month** and **the File** work together. This is the product loop, not pixel UI.

**Working names**

- **The File** — the tax-year page: expenses, life changes, and what is currently true.
- **This Month** — the optional five-question check-in that writes into the File.

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

## Add contracts (what we actually collect)

Keep follow-ups tiny. If a field is not needed to make the File true, skip it.

### Expense

- Label (what)
- Amount (€)
- Date (default: today / this month)
- Light category, inferred from the question or a short list: work / donation / health / other  
  User-facing: “What kind of cost?” not Anlage names.

### Life change — moved / commute

- Date (month)
- Commute km **or** “no commute / fully remote”
- Optional one-line place (“Berlin → Hamburg”)

### Life change — job

- Date
- Optional employer name
- Started / left / changed — one choice

### Life change — home office

- Typical days per week from this month
- Or “no home office”

### Life change — family / extra costs

- Either a family-status note (moved in with partner, child) **or** an expense-shaped extra cost (donation, medical). Prefer splitting: family as life change, donation/medical as expense, if the user picked “extra costs” from the quiz.

Hackathon default: **moved, job, home office, expense** are enough. Family can be one extra life-change type or wait.

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
