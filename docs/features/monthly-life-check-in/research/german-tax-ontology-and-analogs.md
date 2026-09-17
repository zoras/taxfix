# Research: German tax ontology, analog products, usefulness requirements

## Research question

What facts must a year-round Taxfix File capture, what must it show back, and which technical rules make that actually useful for a German employee return — given how Taxfix and peers already work?

## Context

Feature: [This Month + the File](../prds/feature.prd.md). Brief: voluntary engagement outside filing season. Risk: building a receipt dump that does not change Anlage N, which is what Taxfix’s own Dokumenten-Manager is today.

Tax year for this hackathon: treat **2026** as current File year (rates differ from 2025).

## Summary

German employee tax is a **calendar-year income overlay**: wages are already withheld; the return mainly adds **Werbungskosten** (Anlage N), **Sonderausgaben** (e.g. Spenden), and life-status (Steuerklasse, Kinder). The Finanzamt already gives every employee **€1,230 Arbeitnehmer-Pauschbetrag**. Extra work costs only help **after that lump sum is beaten**. Commute (Entfernungspauschale) and home-office days (Tagespauschale) are the usual way over the line — and **they cannot both be claimed on the same calendar day**. Competitors all lead with a **live refund estimate**, but a honest File without Lohnsteuerbescheinigung can only output **deductible amounts vs the lump sum**, not euros of refund. Taxfix already stores photos; support says those amounts **do not flow into the return until 2026**. Our File is useful if it stores **structured, date-scoped facts** (km, office days, HO days, expense category + use share) that a later filing interview can paste into Anlage N.

## Findings

| Claim                                                                                                                                                                                                                                                                                 | Evidence                                                                                                                                                                                                         | Confidence | Impact                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| Employee Werbungskosten only matter above **€1,230** Pauschbetrag (auto-applied).                                                                                                                                                                                                     | [Finanztip Anlage N](https://www.finanztip.de/steuererklaerung/steuererklaerung-anlage-n/); [steuern.de Anlage N](https://www.steuern.de/steuererklaerung-anlage-n)                                              | High       | File must show “€X documented vs €1,230”, not a pile of receipts with no threshold.                                |
| Commute is **one-way shortest road km**, **full kilometres**, **days actually at first workplace**. 2025: €0.30 first 20 km, €0.38 from 21. **2026: €0.38 from km 1**. Cap €4,500 unless own car.                                                                                     | [ADAC Pendlerpauschale 2026](https://www.adac.de/rund-ums-fahrzeug/auto-kaufen-verkaufen/autokosten/pendlerpauschale/); BMF LStH 2025 § 9                                                                        | High       | Move capture must store **km + start date**, not only city names. Need **office-day count**, not only “I commute.” |
| Home-office Tagespauschale: **€6/day**, max **210 days / €1,260**. Day must be predominantly at home **and** first workplace not visited. Same calendar day: commute **or** HO, not both (usual rule).                                                                                | ADAC; ELSTER Lohnsteuer-Ermäßigung help; steuern.de                                                                                                                                                              | High       | WFH “3 days/week” is not enough. File must **split days**. A move/WFH change mid-year must **prorate**.            |
| Typical 5-day year ≈ 250 weekdays minus leave/sick; ADAC examples use **~217–220 office days** if no HO. FA may ask proof above **230/280 trips**.                                                                                                                                    | ADAC                                                                                                                                                                                                             | Med        | Default assumptions (e.g. 220 workdays, 30 leave) must be visible and editable.                                    |
| Arbeitsmittel: mixed private/work use → only **beruflicher Anteil**. Computers/software: **1-year Nutzungsdauer** (full amount in purchase year, still × use %). Other furniture: AfA over years (desk ~13). GWG €800 net still matters for non-IT.                                   | [FA NRW Arbeitsmittel](https://www.finanzamt.nrw.de/steuerinfos/privatpersonen/arbeitnehmende/werbungskosten/arbeitsmittel); BMF 26.02.2021 PC/software; VLH laptop                                              | High       | “Laptop €1,200” cannot all be Werbungskosten without **use %**. Desk cannot be 100% this year.                     |
| Spenden are **Sonderausgaben**, not Werbungskosten. Proof: simplified ≤ **€300**/gift; formal Zuwendungsbestätigung above. Belege not sent with return (**Belegvorhaltepflicht**); keep ≥ ~1 year after Bescheid.                                                                     | VLH; BayLfSt § 50 EStDV; FA NRW                                                                                                                                                                                  | High       | Donation is a different bucket in the File. Photo optional; **keep original** copy.                                |
| Job-related **Umzug** can be Werbungskosten; private move is not. New commute still always matters.                                                                                                                                                                                   | Domain standard (EStG § 9); not fully re-sourced here                                                                                                                                                            | Med        | Move form: commute km required; “job-related move costs” optional later.                                           |
| Marriage / children / Steuerklasse dominate refund math but need partner/child data.                                                                                                                                                                                                  | Taxfix calculator questions; Anlage VA / Kind                                                                                                                                                                    | High       | Out of first File slice. Check-in can note “status changed” without computing.                                     |
| Taxfix product today: interview filing + **live Erstattung**; year-round Abo = docs + KI-chat. Dokumenten-Manager: title, amount, category, scan. **No auto-transfer into return** (planned 2026). Originals still required; no download/send to FA. Software, **not StBerG advice**. | [Taxfix Abo](https://taxfix.de/taxfix-abo/); [Dokumenten-Manager](https://support.taxfix.de/hc/de/articles/26084525031453-Der-Dokumenten-Manager); [AGB](https://taxfix.de/agb/); support “keine Steuerberatung” | High       | Do not clone a photo inbox. Map to **fields**. Never guarantee refund.                                             |
| WISO / smartsteuer / Steuerbot: year picker → personal data → **Lohnsteuerbescheinigung** (or VaSt from ELSTER) → guided questions (commute, HO, Arbeitsmittel, Spenden) → **live result** → ELSTER submit. Docs kept, not attached.                                                  | smartsteuer walkthrough; Steuerbot VaSt; WISO guides                                                                                                                                                             | High       | Our year-round loop supplies the **questions they currently ask in July**. Filing still needs wage document.       |
| US analog Keeper: year-round **deduction ledger** + running estimate; receipts attached to rows; bank connect; export into filing. Mileage is day-level.                                                                                                                              | Keeper help: How it works / Deductions tab                                                                                                                                                                       | Med        | Pattern to copy: **row = fact**, estimate is a view, filing is a later consumer. Bank connect out of scope.        |
| Refund € ≠ deductible €. Pauschalen lower taxable income; only **withheld Lohnsteuer** can be refunded. Needs income, Steuerklasse, already-withheld tax.                                                                                                                             | Taxfix “Erstattung niedriger”; ADAC “nicht den Pauschalbetrag zurück”                                                                                                                                            | High       | Without Lohnsteuerbescheinigung, **do not show a refund**. Show deductible vs lump sum.                            |
| VaSt (pre-filled return) already has employer, wages, many insurances. It does **not** have commute km, HO days, or private receipts.                                                                                                                                                 | Steuerbot VaSt article                                                                                                                                                                                           | High       | File should not duplicate VaSt. Capture what VaSt **cannot**.                                                      |

## Ontology (employee, first slice)

What the Finanzamt will eventually want on **Anlage N** / **Sonderausgaben**, in product language.

```
Tax year (Kalenderjahr)
└─ Person (identity later; not needed to make File useful)
└─ Employment period(s)
│    ├─ Employer (name optional)
│    ├─ First workplace (implicit)
│    ├─ Commute: one-way full km, from date, to date
│    ├─ Day mix: office days vs home-office days (mutually exclusive)
│    └─ Jobticket / tax-free commute subsidy (optional; reduces commute)
└─ Werbungskosten items
│    ├─ Entfernungspauschale (derived from commute × office days × year rates)
│    ├─ Home-office Tagespauschale (HO days × €6, cap 210)
│    └─ Arbeitsmittel / Fortbildung / other: date, amount, use %, asset class
└─ Sonderausgaben
     └─ Spenden: date, amount, recipient (proof class: ≤300 vs >300)
```

**Not first slice:** Arbeitszimmer (strict), double household, Reisekosten, household services, medical außergewöhnliche Belastungen, Kapitalerträge, Selbständigkeit, partner filing.

## How analog products run the loop

| Product                   | Year-round object   | Inputs they ask                             | Output users wait for            | Gap we can own                           |
| ------------------------- | ------------------- | ------------------------------------------- | -------------------------------- | ---------------------------------------- |
| Taxfix filing interview   | None (seasonal Q&A) | Lohnsteuerbescheinigung, commute, HO, costs | Live Erstattung, then ELSTER     | No reason to open in November            |
| Taxfix Dokumenten-Manager | Photo inbox         | File, title, amount, category               | “Stored” — **not** in return yet | No life events, no km/days, no vs-€1,230 |
| Taxfix Abo marketing      | Docs + chat         | Uploads                                     | “Checked for tax relevance”      | Support contradicts full auto-fill       |
| smartsteuer / WISO        | Steuerfall per year | Full form set                               | Live result + ELSTER             | Desktop-seasonal                         |
| Steuerbot                 | Chat + VaSt         | ELSTER unlock + leftovers                   | Fast return                      | Still seasonal                           |
| Keeper (US 1099)          | Deduction ledger    | Bank + receipts + %                         | Running savings + file           | Bank-heavy; not German law               |

**Pattern that works:** capture **while true** → structured ledger → **number that changes** → later filing consumes the ledger.

## Inputs we need vs skip

### Must have (or the File cannot compute anything real)

| Fact                                                                                                             | Why                                                                    |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Tax year                                                                                                         | Rates differ 2025 vs 2026                                              |
| One-way commute **km** (integer) or “fully remote”                                                               | Entfernungspauschale                                                   |
| **Effective date** of commute / job / WFH change                                                                 | Mid-year move cannot apply all 220 days                                |
| Home-office **days** (typical days/week **or** count)                                                            | Tagespauschale + cannot double-count with commute                      |
| Workday baseline (default 220, user-editable later)                                                              | Days = office + HO + leave; we cannot invent office days from km alone |
| Expense: date, amount, **bucket** (work vs donation), **work-use %** (default 50% or 100% if they say work-only) | Mixed-use + Sonderausgaben split                                       |
| Laptop/IT vs other work thing                                                                                    | IT = this year; furniture ≠ this year in full                          |

### Should have (useful, still small)

| Fact                                           | Why                                    |
| ---------------------------------------------- | -------------------------------------- |
| Leave/sick days or “typical week” confirmation | Stops absurd 250 office + 150 HO       |
| Job start/end                                  | Two employers / two commutes           |
| Receipt attached or “I’ll keep the paper”      | Belegvorhaltepflicht; user expectation |
| Donation recipient + amount >300 flag          | Proof class                            |
| “Jobticket / employer pays commute” yes/no     | Otherwise we overstate commute         |

### Must not ask in first slice (low value / high complexity)

Steuer-ID, IBAN, Finanzamt, Lohnsteuerbescheinigung lines, partner income, exact address geocoding, ELSTER, bank connect, OCR, medical zumutbare Belastung, Arbeitszimmer square metres.

## Outputs users expect — and what we can honestly give

| User expects (from Taxfix/WISO/smartsteuer)       | Can the File produce it alone?                    | What to show instead                                                                                                                  |
| ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| “I get €1,240 back”                               | **No** (needs withheld Lohnsteuer, class, income) | Do not fake it                                                                                                                        |
| “Is it worth filing?”                             | Partial                                           | “You’re **€X over** the €1,230 lump sum — filing will see this.” Under lump sum: “Still inside the automatic amount; keep capturing.” |
| Live number that moves when I add a laptop / move | **Yes**                                           | Documented Werbungskosten + Spenden, vs lump sum                                                                                      |
| What Taxfix will ask in July                      | **Yes**                                           | True today: km, office/HO split, expenses on file                                                                                     |
| Receipts sent to Finanzamt                        | No (and Taxfix doesn’t either)                    | “Keep the original. We remembered the amount.”                                                                                        |
| Legal certainty                                   | No (StBerG + FA decides)                          | Unverbindlich, not advice                                                                                                             |
| Prefill next year’s interview                     | Yes if structured                                 | Fields, not PDFs                                                                                                                      |

**Emotional output (brief):** caught up, savvy. **Instrumental output (useful):** _you crossed / have not crossed the lump sum, and here is why._

That is compatible with “euro refund is not the hero.” A **lump-sum meter** is not a refund counter.

## Technical requirements so the feature is actually useful

1. **Tax-year-scoped data** and **rate tables by year** (2025 vs 2026 commute). Hard-code 2026 rates for the demo; do not mix years.
2. **Day allocator:** for each period after a life change, `office_days + ho_days ≤ workdays`. Same day cannot earn both €6 and km. Default: typical WFH days/week × (workdays/5).
3. **Prorating:** a June move creates two commute segments. Sum is the year’s Entfernungspauschale.
4. **Integer km**, one-way, not round-trip. UI must say “one way.”
5. **Lump-sum comparison** is the core derived view: `max(werbungskosten, 1230)` is what the FA uses; show both raw and “amount that beats the lump sum.”
6. **Bucket isolation:** Spenden must not inflate Werbungskosten. Home-office Pauschale must not stack with Arbeitszimmer.
7. **Asset class on work expenses:** `it_hardware` → 100% of (amount × use %) this year; `other` → show “only part counts this year” or exclude from beating-the-lump-sum until we add AfA (hackathon: IT + generic small costs only, warn on furniture).
8. **Use %** default: 100% if labelled work tool they say is for the job; otherwise ask. Never silently take 100% on a phone.
9. **Estimates labelled unverbindlich.** Copy: software, not Steuerberatung. Finanzamt decides. Matches Taxfix AGB.
10. **No refund formula** without wage inputs. If someone adds a “saved tax” footnote later, it needs Steuerklasse + taxable income; until then, only deductible €.
11. **Persistence per User** before this is real: auth is currently off; File rows must not be a shared demo blob in production. GDPR: tax-adjacent; no public sharing; user can delete a row.
12. **Receipts optional.** Capture is valid without a photo (German filing doesn’t attach by default). If we add upload: store metadata; tell them originals still matter; 50 MB / jpg-pdf is Taxfix’s existing bar.
13. **Do not implement ELSTER/ERiC** in this feature. Success = data ready for Taxfix’s interview, not a second tax office.
14. **Plausibility:** flag HO days > 210; office trips > 230; km 0 with “I commute”; HO + full-time office 5 days.
15. **Idempotent month check-in** does not double-count km.
16. **Disclaimer on HO/commute default days** so we are not inventing a Fahrtenbuch.

## Options considered

### Option A — Receipt inbox (clone Dokumenten-Manager)

**Pros:** Matches Taxfix Abo screenshots; easy to demo scans.  
**Cons:** Support already says it does not enter the return; no day/km model; fails “really useful.”  
**Risks:** Judges: “this already exists.”

### Option B — Structured File + lump-sum meter (recommended)

**Pros:** Unique vs current Taxfix; computable from life facts; honest without Lohnsteuerbescheinigung; maps to Anlage N.  
**Cons:** More rules; refund addicts may want a bigger number.  
**Risks:** Wrong day split → wrong usefulness; must show assumptions.

### Option C — Fake refund from assumed 42% rate

**Pros:** Strong dopamine.  
**Cons:** Conflicts with StBerG posture and Taxfix’s own “estimate from your details”; wrong for Steuerklasse 1 vs 4.  
**Risks:** Looks like fake urgency/value.

## Recommendation

Build the File as a **structured year ledger** (commute segments, HO/office day mix, work expenses, donations), with a **lump-sum meter** as the only money UI. This Month only asks for facts that feed that ledger. Do not build refund, ELSTER, OCR, or VaSt in the first slice.

## Open questions

- Demo tax year 2025 vs 2026 (rates change). Default: **2026**.
- Default workdays 220 vs ask once. Default: **220, shown**.
- Work-use % default 100% vs 50%. Default: **ask only when category is mixed (phone); 100% for “work laptop.”**

## Impact on implementation

- **Buckets affected:** product flows, domain rules (pure functions), File UI, check-in follow-ups, later db schema
- **Phase impact:** first vertical slice must include lump-sum meter + commute/HO split, not only a timeline of text
- **Decision needed:** yes — accept “meter vs €1,230” as the File’s output (not refund)
