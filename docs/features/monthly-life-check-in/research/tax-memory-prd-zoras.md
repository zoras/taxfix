> **Source (archived, not product identity).** Original PRD from Saroj Maharjan (zoras), GitHub PR [#3](https://github.com/yarychh/taxfix/pull/3) commit `8796a85`. Folded into This Month as related vision; conflicts resolved in [feature.prd.md](../prds/feature.prd.md) and [decision-log.md](../decision-log.md). What we took vs parked: [tax-memory-absorption.md](./tax-memory-absorption.md).

# Taxfix Hackathon PRD — Tax Memory / Year-Round Tax Companion

**Hackathon:** Cursor Berlin Hackathon at Taxfix — September 17, 2026  
**Working product name:** Tax Memory  
**Tagline:** **Don't remember your tax year. Build it.**

---

## 1. Executive Summary

Tax filing is fundamentally a **memory and organization problem**.

People spend money, change jobs, move homes, travel, study, work remotely, buy equipment, and experience other life changes throughout the year. By filing season, they may have forgotten what happened, where the receipts are, why an expense occurred, or which information could be relevant to their tax return.

The proposed product is a year-round AI companion for Taxfix that builds a user's **Tax Memory** throughout the year.

Users can:

- Photograph or upload receipts and documents.
- Forward documents to their Tax Memory inbox.
- Let AI extract and classify information.
- Record important life events through a short conversational check-in.
- Have AI connect life events with related expenses and documents.
- Detect patterns that the user may have missed.
- Identify missing evidence or information.
- Maintain a year-long tax timeline.
- See a continuously updated **Tax Readiness** status.
- Receive a personalized monthly check-in rather than a generic tax reminder.
- Generate a year-end, filing-ready summary.

The core product loop is:

> **Capture → Understand → Connect → Ask → Remember → Prepare**

The goal is not to replace Taxfix's filing experience. The goal is to create a reason for users to open Taxfix throughout the year, especially during Q4, so that filing season becomes easier and less stressful.

---

# 2. Hackathon Context

The hackathon jury evaluates submissions across four equally weighted dimensions:

1. **Innovation — 25%**
   - How original, sharp, and memorable the idea is.
   - Whether it feels inevitable in hindsight.

2. **Multi-agent Orchestration — 25%**
   - How effectively the team uses Cursor, agents, MCP, SDK, CLI, and AI-native workflows.
   - Whether the solution is difficult or significantly faster to build manually.

3. **Taxfix Scope — 25%**
   - How well the solution addresses the challenge of making users open Taxfix outside filing season, especially around Q4.
   - Strong solutions create voluntary recurring value, reduce anxiety, improve tax readiness, or help users feel financially clever.
   - The solution should not depend on empty reminders or fake urgency.

4. **Demo Quality — 25%**
   - A clear working prototype/MVP.
   - The problem, solution, and value should be understandable within a 2–3 minute presentation.

The product should therefore be designed around **year-round value**, not simply receipt OCR.

---

# 3. Problem

## 3.1 Current behavior

A typical user:

1. Earns and spends money throughout the year.
2. Receives receipts, invoices, travel documents, medical bills, course invoices, etc.
3. Experiences life changes.
4. Does not necessarily know which things will matter for their taxes.
5. Eventually opens Taxfix around tax season.
6. Tries to reconstruct an entire year from memory, email, bank statements, paper receipts, and scattered files.

This creates:

- Anxiety.
- Forgotten expenses.
- Missing documents.
- Poor organization.
- Last-minute work.
- Uncertainty about what information is relevant.

## 3.2 Key insight

**Receipts are only one part of the tax story.**

A life event can be just as important as a receipt.

For example:

> "I started working from home."

can lead to questions about work arrangements and related purchases.

> "I changed jobs."

can lead to a cluster of potentially relevant information.

> "I moved."

can lead to questions about relocation and changes in work/home circumstances.

Therefore the product should combine two sources of information:

### Evidence

What the user spent, received, or documented.

### Life context

What happened in the user's life.

The AI connects the two.

---

# 4. Product Vision

## Tax Memory

> **Your tax return starts the day something happens — not the day you file.**

Tax Memory quietly builds a structured representation of the user's tax year.

Instead of asking users to remember everything later, the system captures information as life happens.

The product should feel like:

> **A tiny AI accountant that remembers the year for you.**

It should not feel like:

> "Another tax form."

---

# 5. Target User

Primary target:

- German Taxfix users.
- People who currently file taxes manually or only interact with Taxfix during filing season.
- Employees with potentially tax-relevant work, travel, education, home-office, medical, or other expenses.
- People who find tax preparation stressful because documents are scattered.

The prototype can use a fictional/demo user rather than implementing full production identity and tax infrastructure.

---

# 6. Core Product Experience

## 6.1 Capture

The primary action should be extremely simple:

> **What did you spend money on?**

### Options

- 📸 Scan receipt
- 📄 Upload document
- ✉️ Forward document
- 💬 Tell Tax Memory what happened

The user should not need to understand German tax terminology.

---

# 7. Receipt / Document AI

When the user uploads a document, the Document Agent extracts:

- Merchant/provider.
- Date.
- Amount.
- Currency.
- Document type.
- Relevant textual information.
- Potential category.
- Confidence.

Example:

```text
Dentist Praxis Müller

12.03.2026
€480.00

Category:
Medical expense

Potential tax relevance:
Potentially relevant

Confidence:
92%

[Save to 2026 Tax Memory]
```

The prototype should clearly distinguish **potential relevance** from guaranteed tax treatment.

Avoid presenting uncertain tax conclusions as facts.

---

# 8. Monthly Life & Tax Check-in

This is a core feature, not simply a reminder.

## 8.1 Monthly notification

Example:

> **Your October tax check-in is ready 👋**
>
> Did anything change in your life this month that might matter for your taxes?
>
> **[Check in — 2 min]**

An email can provide the same entry point.

Example:

> **October Tax Check-in**
>
> A few things may be worth recording before you forget them.
>
> **[Start check-in]**

## 8.2 Important product principle

Do **not** ask the same generic questionnaire every month.

The check-in should be personalized using the user's Tax Memory.

---

# 9. Conversational Check-in

Opening the monthly check-in:

> **How was October?**
>
> Anything new at work, home, family, education or travel?

Options:

- Nothing changed
- Something changed
- I'll tell you

If the user says:

> "I started working from home three days a week."

The Life Event Agent responds:

> Got it. That could be worth recording for your 2026 Tax Memory.
>
> A few quick questions:
>
> **When did this start?**
>
> October 1
>
> **Did you buy anything specifically for working from home?**
>
> Yes / No
>
> **Do you have a dedicated workspace?**
>
> Yes / No

The system then stores the life event and links relevant evidence.

---

# 10. Life Event Categories

The initial taxonomy can include:

## Work

- New job.
- Job change.
- Unemployment.
- Remote work.
- Work location change.
- Freelance/business activity.
- Professional training.

## Home

- Moving.
- New apartment.
- Home office.
- Relevant household changes.

## Travel

- Business trips.
- Commuting changes.
- Work-related travel.
- Relocation.

## Family

- Marriage.
- Separation.
- Child.
- Childcare changes.
- Dependent changes.

## Education

- Course.
- Degree.
- Certification.
- Professional training.

## Health

- Medical expenses.
- Dental expenses.
- Prescriptions.
- Glasses/hearing-related expenses.
- Other potentially relevant expenses.

## Purchases

- Laptop.
- Monitor.
- Phone.
- Desk.
- Software.
- Professional equipment.

## Donations / Volunteering

- Charitable donations.
- Relevant memberships.

The hackathon MVP does not need to implement every category.

---

# 11. Tax Memory Timeline

The user gets a persistent timeline:

```text
2026

JAN
💼 Started new job

FEB
💻 Bought monitor

MAR
🚆 Business trip to Hamburg

APR
🎓 Started professional course

MAY
🏠 Moved apartment

JUN
🏥 Dental treatment

JUL
...

OCT
🏠 Started working from home
```

The fundamental promise:

> **You live your life. We remember the tax-relevant parts.**

---

# 12. AI Pattern Detection

This should be one of the product's "wow" features.

The system should proactively identify relationships between documents.

Example:

User uploads:

- Train ticket — €39.
- Hotel — €120.
- Restaurant receipt — €64.

The Pattern Agent detects:

> These expenses appear to belong to the same trip.

It creates:

## Berlin → Munich Business Trip

**14–16 May 2026**

| Expense | Amount |
|---|---:|
| Train | €39 |
| Hotel | €120 |
| Meal | €64 |
| **Total** | **€223** |

The user can confirm or correct the interpretation.

---

# 13. "AI Noticed Something"

A dedicated feed can surface observations.

Example:

> **We noticed something**
>
> You uploaded 5 train tickets and 2 hotel invoices around the same dates.
>
> They may be related to work travel.
>
> **Is this correct?**
>
> Yes / No / Tell me more

Another example:

> You uploaded three invoices from the same professional training provider.
>
> **Were these part of a course?**

This is more valuable than simply categorizing receipts because the AI is actively helping the user reconstruct their year.

---

# 14. Missing Evidence Agent

The system should identify gaps.

Example:

> You uploaded several train tickets to Hamburg but no hotel receipt for those dates.

Or:

> You recorded that you started a professional course, but we don't have the course invoice.

Or:

> You uploaded a work equipment receipt, but we need more information about its use.

The UI:

```text
⚠️ 4 items need attention

1. Munich business trip
   Missing trip context

2. Professional course
   Missing invoice

3. Laptop
   Usage information needed

4. Home office
   More information needed
```

The product should ask for information rather than pretend to know the answer.

---

# 15. Tax Readiness Dashboard

Homepage:

```text
┌─────────────────────────────────────┐
│          2026 TAX READINESS         │
│                                     │
│              78%                    │
│         ████████████░░░              │
│                                     │
│  143 documents                       │
│  €4,281 tracked                      │
│                                     │
│  🟢 128 organized                    │
│  🟡 11 need attention               │
│  🔴 4 need information              │
└─────────────────────────────────────┘
```

The exact score should be treated as a product/prototype metric representing organization/readiness, not a claim about tax refund size.

---

# 16. Tax Readiness Score

Possible inputs:

- Documents captured.
- Documents classified.
- Documents needing review.
- Missing evidence.
- Unresolved life events.
- User confirmations completed.
- Year-end review completed.

Example:

> **2026 Tax Readiness — 78%**

Then:

> You're in good shape.
>
> 143 documents captured.
>
> 128 organized.
>
> 11 need attention.
>
> 4 need additional information.

The goal is to create a sense of progress without using artificial urgency.

---

# 17. "What Am I Missing?"

A high-value AI action:

> **What expenses or information might I have forgotten?**

The system analyzes Tax Memory.

Example response:

> We found a few things worth checking:
>
> **1. Work travel**
> You uploaded several train tickets but no hotel receipt for one trip.
>
> **2. Work equipment**
> You mentioned working remotely and uploaded a monitor invoice.
>
> **3. Professional education**
> You recorded a course but haven't uploaded supporting documentation.

This turns the system from a passive storage system into an assistant.

---

# 18. Email / Tax Inbox

Users can forward documents to a dedicated Tax Memory address.

Example:

```text
taxmemory@...
```

When an invoice arrives:

1. Document Agent processes it.
2. Tax Agent categorizes it.
3. Evidence Agent checks it.
4. Tax Memory Agent stores it.
5. Pattern Agent considers whether it relates to existing events.

Example:

> **New document detected**
>
> Deutsche Bahn — €89
>
> Possible work-related travel.
>
> **Save to Tax Memory**

This feature can be simulated in the hackathon rather than fully productionized.

---

# 19. Q4 Experience

Q4 is especially important because the hackathon challenge explicitly emphasizes increasing Taxfix engagement outside filing season and particularly around Q4.

## October

> **Your 2026 tax year is taking shape.**

> We've collected 97 documents and identified 8 life events.

## November

> **You're getting tax-ready.**

> We found 7 things worth checking.

## December

> **Let's close your 2026 Tax Memory.**

> Your year-end review takes about two minutes.

---

# 20. Year-End AI Interview

The user clicks:

> **Prepare my 2026 tax year**

The AI conducts a short review.

Example:

> Did you change jobs?

**Yes**

> Did you move?

**Yes**

> Did you work from home?

**Yes**

> Did you purchase equipment for work?

**Yes**

Then:

```text
Your 2026 Tax Memory is ready.

✓ 143 documents
✓ 18 life events
✓ 11 expense groups
✓ 6 potential gaps
✓ 4 items need confirmation
```

CTA:

> **[Review my tax year]**

Ultimately:

> **[Continue with Taxfix]**

The product is therefore a year-round layer feeding into the filing experience.

---

# 21. Tax Time Machine

A polished year-end presentation can be called:

## Tax Time Machine

When activated:

```text
Scanning 143 documents...

✓ Documents classified
✓ Duplicate candidates checked
✓ Expense groups detected
✓ Life events analyzed
✓ Missing evidence identified
✓ Tax Memory updated
```

Then:

# 2026 Tax Year Review

**€4,281 potentially tax-relevant expenses tracked**

**6 things may need attention**

**4 items need confirmation**

**Tax readiness: 92%**

Again, the amounts and classifications in the prototype should be clearly presented as potential/illustrative unless supported by appropriate tax logic.

---

# 22. Multi-Agent Architecture

The multi-agent architecture should be visible in the demo because multi-agent orchestration represents 25% of the judging criteria.

```text
                         USER
                           │
                           ▼
                  ┌─────────────────┐
                  │  ORCHESTRATOR   │
                  └────────┬────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   Document Agent    Life Event Agent   Tax Context Agent
          │                │                │
          └────────────────┼────────────────┘
                           ▼
                    Pattern Agent
                           │
                           ▼
                    Evidence Agent
                           │
                           ▼
                   Tax Memory Agent
                           │
                           ▼
                  Tax Readiness Engine
```

## Document Agent

Responsible for:

- OCR.
- Extraction.
- Document type.
- Amount/date/merchant.
- Confidence.

## Life Event Agent

Responsible for:

- Monthly conversations.
- Identifying life changes.
- Asking follow-up questions.
- Recording structured events.

## Tax Context Agent

Responsible for:

- Mapping events/documents to potentially relevant tax concepts.
- Explaining why something may matter.
- Avoiding unsupported certainty.

## Pattern Agent

Responsible for:

- Connecting receipts.
- Detecting trips.
- Detecting repeated purchases.
- Connecting life events with expenses.

## Evidence Agent

Responsible for:

- Missing information.
- Incomplete documents.
- Contradictions.
- Follow-up questions.

## Tax Memory Agent

Responsible for:

- Maintaining the timeline.
- Connecting events and evidence.
- Year-level summaries.

## Orchestrator

Responsible for:

- Deciding which agent should act.
- Passing structured context.
- Coordinating multi-step workflows.

---

# 23. MCP Layer

Expose Tax Memory through an MCP interface.

Potential tools:

```text
get_tax_memory(year)

get_life_events(year)

get_expenses(year)

search_documents(query)

find_related_expenses(event_id)

find_missing_evidence(year)

get_tax_readiness(year)

get_year_end_summary(year)
```

This gives the demo an AI-native interface rather than a simple web application with a chatbot.

Example:

> "What changed in my tax year?"

Agent calls:

```text
get_life_events(2026)
```

Response:

> You changed jobs in January, started a professional course in April, moved in May, and began working remotely in October.

---

# 24. Data Model — MVP

A simple data model is sufficient.

## User

```text
id
name
tax_year
```

## Document

```text
id
user_id
type
merchant
date
amount
currency
category
confidence
status
raw_text
```

## LifeEvent

```text
id
user_id
type
date
description
confidence
status
```

## ExpenseGroup

```text
id
user_id
type
description
date_start
date_end
total_amount
```

## EvidenceIssue

```text
id
user_id
document_id
life_event_id
description
status
```

## MonthlyCheckIn

```text
id
user_id
month
status
responses
identified_events
```

---

# 25. MVP Scope

Given the hackathon time constraint, the MVP should focus on a small number of high-impact capabilities.

## Must have

### 1. Receipt upload

- Image/PDF upload.
- AI extraction.

### 2. AI categorization

Show:

- Merchant.
- Date.
- Amount.
- Category.
- Potential tax relevance.
- Confidence.

### 3. Tax Memory timeline

Show documents and life events chronologically.

### 4. Monthly check-in

At least one working example.

### 5. Pattern detection

Demonstrate related receipts being grouped.

### 6. "AI Noticed Something"

Demonstrate proactive insight.

### 7. Missing evidence

Demonstrate the agent asking for missing information.

### 8. Tax Readiness dashboard

Show:

- Documents.
- Events.
- Issues.
- Readiness.

### 9. Year-end review

One-click generated summary.

---

# 26. Do NOT Build for the Hackathon

Avoid:

- Full ELSTER integration.
- Full German tax calculation engine.
- Production authentication.
- Production payment system.
- Native iOS/Android apps.
- Every German tax rule.
- Full tax filing.
- Complicated notification infrastructure.
- Complete email infrastructure.

The prototype should prove the product concept, not productionize an entire tax platform.

---

# 27. Recommended Demo Data

Prepare approximately 15 realistic documents:

- Deutsche Bahn ticket.
- Hotel invoice.
- Restaurant/business meal receipt.
- Dentist invoice.
- Laptop invoice.
- Monitor invoice.
- Office supplies.
- Professional course invoice.
- Software subscription.
- Commute ticket.
- Home-office equipment.
- Additional travel receipts.

Prepare several life events:

```text
January
Started new job.

April
Started professional course.

May
Moved apartment.

September
Several work trips.

October
Started working from home three days/week.
```

This gives the agents enough context to demonstrate relationships.

---

# 28. Two-Minute Demo Script

## 0:00–0:20 — Problem

Show scattered receipts.

> "It's September. I've spent money on work travel, medical expenses, education and equipment. I have no idea what I'll need when tax season arrives."

## 0:20–0:40 — Capture

Upload a receipt.

> "I don't need to know whether this matters for my taxes. I just take a picture."

AI extracts the information.

## 0:40–1:00 — Agents

Show:

```text
Document Agent
       ↓
Tax Context Agent
       ↓
Evidence Agent
```

Then show the structured receipt.

## 1:00–1:20 — Pattern detection

Upload several travel receipts.

AI:

> "We noticed these documents appear to belong to the same business trip."

Show the generated trip.

## 1:20–1:40 — Monthly check-in

Open:

> **October Tax Check-in**

User:

> "I started working from home."

AI asks two relevant questions.

The event appears on the Tax Memory timeline.

## 1:40–1:55 — AI noticed something

Show:

> "You bought a monitor shortly after starting remote work. Is it related?"

Then:

> "You have 4 other things worth checking."

## 1:55–2:00 — Punchline

Show:

# 2026 Tax Readiness — 78%

Then:

> **"Instead of trying to remember my tax year next April, Taxfix helped me build it all year."**

---

# 29. Product Positioning

Do not position this as:

> "AI receipt scanner."

That is too generic.

Position it as:

# Tax Memory

### **Don't remember your tax year. Build it.**

The receipt scanner is just the capture mechanism.

The actual product is:

> **A persistent AI memory of the user's tax-relevant year.**

---

# 30. Key Differentiator

The system has two dimensions:

```text
             TAX MEMORY

      ┌──────────────────────┐
      │                      │
      │    LIFE EVENTS       │
      │                      │
      │  New job             │
      │  Moving              │
      │  Remote work         │
      │  Course              │
      │  Travel              │
      │                      │
      └──────────┬───────────┘
                 │
                 │ AI connects
                 ▼
      ┌──────────────────────┐
      │                      │
      │      EVIDENCE        │
      │                      │
      │  Receipts            │
      │  Invoices            │
      │  Tickets             │
      │  Documents           │
      │                      │
      └──────────────────────┘
```

The AI creates connections between them.

That is the product's central innovation.

---

# 31. Retention Loop

The product should create recurring value:

```text
                    USER LIFE
                       │
                       ▼
                 Life happens
                       │
                       ▼
                  Capture it
                       │
                       ▼
                 AI remembers
                       │
                       ▼
              More context builds
                       │
                       ▼
             AI finds connections
                       │
                       ▼
             User gets useful insight
                       │
                       ▼
              User returns next month
                       │
                       ▼
                Tax readiness ↑
                       │
                       ▼
              Q4 year-end review
                       │
                       ▼
                Taxfix filing
```

This is much stronger than:

> "Come back next month because we sent you a reminder."

The reason to return is that the product has accumulated useful context.

---

# 32. Notification Strategy

Notifications should be:

- Personalized.
- Low frequency.
- Useful.
- Contextual.
- Easy to dismiss.

Avoid:

> "Don't forget your taxes!"

Prefer:

> **"We noticed you had several travel expenses this month. Want to check whether they're connected to a work trip?"**

Or:

> **"Your October Tax Check-in is ready. Anything change at work, home, or in your studies?"**

Or:

> **"Your 2026 Tax Memory has 97 documents. We found 3 things worth checking."**

---

# 33. Success Metrics

For the real product, useful metrics could include:

### Engagement

- Monthly check-in completion rate.
- Monthly active users outside filing season.
- Number of document captures per user.
- Q4 return rate.

### Tax readiness

- Percentage of users with organized documents.
- Number of missing-evidence issues resolved.
- Percentage completing year-end review.

### User value

- User-reported reduction in filing anxiety.
- Number of potentially relevant forgotten expenses identified.
- Number of life events captured before filing season.

### Product funnel

```text
Monthly user
     ↓
Check-in
     ↓
Life event captured
     ↓
Document uploaded
     ↓
Evidence connected
     ↓
Tax year reviewed
     ↓
Taxfix filing
```

---

# 34. Risks & Mitigations

## Risk: Incorrect tax advice

**Mitigation:**

Use language such as:

- "Potentially relevant."
- "Worth checking."
- "May apply depending on your circumstances."

Avoid unsupported definitive tax conclusions.

## Risk: Notification fatigue

**Mitigation:**

Personalize notifications and only surface meaningful events.

## Risk: User privacy

**Mitigation:**

The production product would require strong protection for financial and personal information. The hackathon prototype should use synthetic/demo data.

## Risk: Too much complexity

**Mitigation:**

Keep the core loop simple:

> Capture → Connect → Ask → Remember.

---

# 35. Final Product Concept

## Tax Memory

### **Don't remember your tax year. Build it.**

A year-round AI companion that:

**Captures** your receipts.

**Understands** your documents.

**Asks** about meaningful changes in your life.

**Connects** life events with expenses.

**Notices** things you might have missed.

**Remembers** your tax year.

**Prepares** you before filing season.

The monthly notification is not the product.

**The accumulated Tax Memory is the product.**

The notification is simply the mechanism that keeps the conversation alive.

---

# 36. Final Pitch

> **Tax season starts too late.**
>
> People don't suddenly develop tax expenses in April. Their tax-relevant life happens throughout the year.
>
> They change jobs. They move. They travel. They study. They work from home. They buy equipment. They receive medical bills.
>
> But by filing season, they've forgotten half of it.
>
> **Tax Memory changes that.**
>
> Every receipt becomes part of a persistent memory of the user's tax year. Once a month, AI asks what changed in their life, connects those events with their documents, identifies missing evidence, and tells them what may be worth checking.
>
> By Q4, instead of starting from zero, the user already has a structured memory of their year.
>
> **Don't remember your tax year. Build it.**
