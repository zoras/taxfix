import { describe, expect, it } from "bun:test";

import {
  CHECK_IN_QUESTIONS,
  appendExpense,
  buildYearFileExport,
  draftFromExpense,
  factsForYear,
  findCheckIn,
  groupCheckInsByYear,
  isAllowedReceiptFile,
  isBaselineComplete,
  isCheckInReady,
  isCompleteAnswers,
  isCurrentMonthComplete,
  isExpenseDraftComplete,
  isFollowUpComplete,
  monthName,
  normalizeFiledExpense,
  readReceiptFile,
  removeExpense,
  summarizeMonth,
  updateExpense,
  upsertCheckIn,
  yearsOnFile,
  type CheckInAnswers,
  type FiledExpense,
  type FollowUps,
  type MonthCheckIn,
  type QuestionId,
} from "./check-in";

function answers(overrides: Partial<CheckInAnswers> = {}): CheckInAnswers {
  return {
    job: false,
    move: false,
    wfh: false,
    expense: false,
    extra: false,
    ...overrides,
  };
}

function checkIn(
  year: number,
  month: number,
  overrides: Partial<CheckInAnswers> = {},
  followUps: MonthCheckIn["followUps"] = {},
): MonthCheckIn {
  return { year, month, answers: answers(overrides), followUps };
}

describe("monthName", () => {
  it.each([
    [1, "January"],
    [2, "February"],
    [3, "March"],
    [4, "April"],
    [5, "May"],
    [6, "June"],
    [7, "July"],
    [8, "August"],
    [9, "September"],
    [10, "October"],
    [11, "November"],
    [12, "December"],
  ] as const)("month %i is %s", (month, name) => {
    expect(monthName(month)).toBe(name);
  });

  it.each([[0], [13], [-1], [1.5]] as const)(
    "returns empty for out-of-range month %s",
    (month) => {
      expect(monthName(month)).toBe("");
    },
  );
});

describe("isCompleteAnswers", () => {
  it.each([
    { name: "empty draft", draft: {}, complete: false },
    { name: "one answer", draft: { job: true }, complete: false },
    {
      name: "four answers",
      draft: { job: false, move: false, wfh: false, expense: true },
      complete: false,
    },
    {
      name: "all five nos",
      draft: answers(),
      complete: true,
    },
    {
      name: "all five mixed",
      draft: answers({ job: true, extra: true }),
      complete: true,
    },
  ])("$name", ({ draft, complete }) => {
    expect(isCompleteAnswers(draft)).toBe(complete);
  });
});

describe("summarizeMonth", () => {
  it.each([
    {
      name: "all no",
      input: answers(),
      summary: "Quiet month",
    },
    {
      name: "job only",
      input: answers({ job: true }),
      summary: "Job changed",
    },
    {
      name: "move only",
      input: answers({ move: true }),
      summary: "Moved or commute changed",
    },
    {
      name: "wfh only",
      input: answers({ wfh: true }),
      summary: "Home office changed",
    },
    {
      name: "expense only",
      input: answers({ expense: true }),
      summary: "Extra work spend",
    },
    {
      name: "extra only",
      input: answers({ extra: true }),
      summary: "Family or extra costs",
    },
    {
      name: "job and expense keep question order",
      input: answers({ job: true, expense: true }),
      summary: "Job changed · Extra work spend",
    },
    {
      name: "move and extra keep question order",
      input: answers({ extra: true, move: true }),
      summary: "Moved or commute changed · Family or extra costs",
    },
    {
      name: "all yes",
      input: answers({
        job: true,
        move: true,
        wfh: true,
        expense: true,
        extra: true,
      }),
      summary:
        "Job changed · Moved or commute changed · Home office changed · Extra work spend · Family or extra costs",
    },
  ])("$name", ({ input, summary }) => {
    expect(summarizeMonth(input)).toBe(summary);
  });

  it("covers every question id in a single-yes summary", () => {
    const ids = CHECK_IN_QUESTIONS.map((question) => question.id);

    expect(ids).toEqual([
      "job",
      "move",
      "wfh",
      "expense",
      "extra",
    ] satisfies QuestionId[]);

    for (const question of CHECK_IN_QUESTIONS) {
      expect(summarizeMonth(answers({ [question.id]: true }))).toBe(
        question.summary,
      );
    }
  });
});

describe("findCheckIn", () => {
  const catalog = [checkIn(2026, 9), checkIn(2025, 11, { move: true })];

  it.each([
    { name: "current month", year: 2026, month: 9, found: true },
    { name: "previous year", year: 2025, month: 11, found: true },
    { name: "same year other month", year: 2026, month: 8, found: false },
    { name: "same month other year", year: 2025, month: 9, found: false },
    {
      name: "empty list",
      year: 2026,
      month: 9,
      found: false,
      source: [] as MonthCheckIn[],
    },
  ])("$name", ({ year, month, found, source = catalog }) => {
    expect(Boolean(findCheckIn(source, year, month))).toBe(found);
  });
});

describe("isCurrentMonthComplete", () => {
  it.each([
    {
      name: "empty file in September",
      checkIns: [] as MonthCheckIn[],
      now: new Date(2026, 8, 17),
      complete: false,
    },
    {
      name: "September 2026 is on file",
      checkIns: [checkIn(2026, 9)],
      now: new Date(2026, 8, 17),
      complete: true,
    },
    {
      name: "only August 2026 is on file",
      checkIns: [checkIn(2026, 8)],
      now: new Date(2026, 8, 17),
      complete: false,
    },
    {
      name: "September of another year",
      checkIns: [checkIn(2025, 9)],
      now: new Date(2026, 8, 17),
      complete: false,
    },
    {
      name: "January complete",
      checkIns: [checkIn(2026, 1, { job: true })],
      now: new Date(2026, 0, 2),
      complete: true,
    },
    {
      name: "December missing",
      checkIns: [checkIn(2026, 11)],
      now: new Date(2026, 11, 31),
      complete: false,
    },
  ])("$name", ({ checkIns, now, complete }) => {
    expect(isCurrentMonthComplete(checkIns, now)).toBe(complete);
  });
});

describe("groupCheckInsByYear", () => {
  it("returns no sections when nothing has been submitted", () => {
    expect(groupCheckInsByYear([])).toEqual([]);
  });

  it.each([
    {
      name: "one month becomes one year section",
      input: [checkIn(2026, 9)],
      years: [2026],
      monthsByYear: { 2026: [9] },
    },
    {
      name: "same year stays one section",
      input: [checkIn(2026, 3), checkIn(2026, 9)],
      years: [2026],
      monthsByYear: { 2026: [9, 3] },
    },
    {
      name: "years are newest first",
      input: [checkIn(2024, 6), checkIn(2026, 1), checkIn(2025, 12)],
      years: [2026, 2025, 2024],
      monthsByYear: { 2026: [1], 2025: [12], 2024: [6] },
    },
    {
      name: "months inside a year are newest first",
      input: [checkIn(2026, 2), checkIn(2026, 11), checkIn(2026, 5)],
      years: [2026],
      monthsByYear: { 2026: [11, 5, 2] },
    },
  ])("$name", ({ input, years, monthsByYear }) => {
    const sections = groupCheckInsByYear(input);

    expect(sections.map((section) => section.year)).toEqual(years);

    for (const section of sections) {
      expect(section.months.map((month) => month.month)).toEqual(
        monthsByYear[section.year],
      );
    }
  });
});

describe("upsertCheckIn", () => {
  it.each([
    {
      name: "inserts a new month",
      existing: [checkIn(2026, 8)],
      next: checkIn(2026, 9, { job: true }),
      yearsAndMonths: [
        [2026, 8],
        [2026, 9],
      ],
    },
    {
      name: "replaces the same year and month",
      existing: [checkIn(2026, 9, { job: true })],
      next: checkIn(2026, 9),
      yearsAndMonths: [[2026, 9]],
    },
    {
      name: "does not touch another year",
      existing: [checkIn(2025, 9)],
      next: checkIn(2026, 9),
      yearsAndMonths: [
        [2025, 9],
        [2026, 9],
      ],
    },
  ])("$name", ({ existing, next, yearsAndMonths }) => {
    const result = upsertCheckIn(existing, next);

    expect(
      result
        .map((item) => [item.year, item.month])
        .sort((left, right) => {
          if (left[0] !== right[0]) {
            return left[0] - right[0];
          }

          return left[1] - right[1];
        }),
    ).toEqual(yearsAndMonths);

    expect(findCheckIn(result, next.year, next.month)?.answers).toEqual(
      next.answers,
    );
  });
});

describe("isFollowUpComplete", () => {
  it.each([
    { id: "job" as const, followUps: {} satisfies FollowUps, complete: false },
    {
      id: "job" as const,
      followUps: { job: { change: "started" as const, employer: "" } },
      complete: true,
    },
    { id: "move" as const, followUps: {}, complete: false },
    {
      id: "move" as const,
      followUps: { move: { fullyRemote: true, km: null } },
      complete: true,
    },
    {
      id: "move" as const,
      followUps: { move: { fullyRemote: false, km: 14 } },
      complete: true,
    },
    {
      id: "move" as const,
      followUps: { move: { fullyRemote: false, km: 0 } },
      complete: false,
    },
    {
      id: "wfh" as const,
      followUps: { wfh: { daysPerWeek: 3 } },
      complete: true,
    },
    {
      id: "wfh" as const,
      followUps: { wfh: { daysPerWeek: 6 } },
      complete: false,
    },
    {
      id: "expense" as const,
      followUps: {
        expense: { label: "Laptop", amount: 1200, kind: "work_it" as const },
      },
      complete: true,
    },
    {
      id: "expense" as const,
      followUps: {
        expense: { label: "  ", amount: 1200, kind: "work_it" as const },
      },
      complete: false,
    },
    {
      id: "extra" as const,
      followUps: { extra: { kind: "donation" as const, amount: 50, note: "" } },
      complete: true,
    },
    {
      id: "extra" as const,
      followUps: { extra: { kind: "donation" as const, amount: 0, note: "" } },
      complete: false,
    },
    {
      id: "extra" as const,
      followUps: { extra: { kind: "family" as const, amount: 0, note: "" } },
      complete: true,
    },
  ])("$id $complete $followUps", ({ id, followUps, complete }) => {
    expect(isFollowUpComplete(id, followUps)).toBe(complete);
  });
});

describe("isBaselineComplete", () => {
  it.each([
    { name: "not needed", needed: false, baseline: undefined, complete: true },
    {
      name: "needed but missing",
      needed: true,
      baseline: undefined,
      complete: false,
    },
    {
      name: "remote",
      needed: true,
      baseline: { year: 2026, km: null, fullyRemote: true, wfhDaysPerWeek: 5 },
      complete: true,
    },
    {
      name: "km without remote",
      needed: true,
      baseline: { year: 2026, km: 14, fullyRemote: false, wfhDaysPerWeek: 0 },
      complete: true,
    },
    {
      name: "commute with no km",
      needed: true,
      baseline: { year: 2026, km: null, fullyRemote: false, wfhDaysPerWeek: 0 },
      complete: false,
    },
  ])("$name", ({ needed, baseline, complete }) => {
    expect(isBaselineComplete(baseline, needed)).toBe(complete);
  });
});

describe("isCheckInReady", () => {
  it.each([
    {
      name: "five nos without required baseline",
      answers: answers(),
      followUps: {},
      baseline: undefined,
      needsBaseline: true,
      ready: false,
    },
    {
      name: "five nos with baseline",
      answers: answers(),
      followUps: {},
      baseline: { year: 2026, km: 14, fullyRemote: false, wfhDaysPerWeek: 0 },
      needsBaseline: true,
      ready: true,
    },
    {
      name: "yes on move without km",
      answers: answers({ move: true }),
      followUps: {},
      baseline: undefined,
      needsBaseline: false,
      ready: false,
    },
    {
      name: "yes on move with km",
      answers: answers({ move: true }),
      followUps: { move: { fullyRemote: false, km: 12 } },
      baseline: undefined,
      needsBaseline: false,
      ready: true,
    },
    {
      name: "unanswered question",
      answers: { job: false, move: false, wfh: false, expense: false },
      followUps: {},
      baseline: undefined,
      needsBaseline: false,
      ready: false,
    },
  ])("$name", ({ answers, followUps, baseline, needsBaseline, ready }) => {
    expect(isCheckInReady(answers, followUps, baseline, needsBaseline)).toBe(
      ready,
    );
  });
});

describe("factsForYear", () => {
  it("applies baseline from January and a September move as a new segment", () => {
    const facts = factsForYear(
      2026,
      { year: 2026, km: 10, fullyRemote: false, wfhDaysPerWeek: 0 },
      [
        checkIn(
          2026,
          9,
          { move: true, expense: true },
          {
            move: { fullyRemote: false, km: 20 },
            expense: { label: "Laptop", amount: 900, kind: "work_it" },
          },
        ),
      ],
    );

    expect(facts.commuteSegments).toEqual([
      { fromMonth: 1, km: 10 },
      { fromMonth: 9, km: 20 },
    ]);
    expect(facts.wfhSegments).toEqual([{ fromMonth: 1, daysPerWeek: 0 }]);
    expect(facts.expenses).toEqual([
      {
        month: 9,
        label: "Laptop",
        amount: 900,
        kind: "work_it",
        usePercent: 100,
      },
    ]);
  });

  it("keeps donations out of work tools", () => {
    const facts = factsForYear(2026, undefined, [
      checkIn(
        2026,
        3,
        { extra: true },
        {
          extra: { kind: "donation", amount: 40, note: "DRK" },
        },
      ),
    ]);

    expect(facts.expenses).toEqual([
      { month: 3, label: "DRK", amount: 40, kind: "donation", usePercent: 100 },
    ]);
  });

  it("keeps later expenses after a completed check-in", () => {
    const completed = checkIn(2026, 9);
    const later: FiledExpense = {
      id: "later-1",
      year: 2026,
      month: 9,
      label: "Monitor",
      amount: 300,
      kind: "work_it",
      usePercent: 100,
    };

    expect(isCurrentMonthComplete([completed], new Date(2026, 8, 17))).toBe(
      true,
    );
    expect(
      factsForYear(2026, undefined, [completed], appendExpense([], later))
        .expenses,
    ).toEqual([
      {
        month: 9,
        label: "Monitor",
        amount: 300,
        kind: "work_it",
        usePercent: 100,
      },
    ]);
  });
});

describe("isExpenseDraftComplete", () => {
  it.each([
    {
      name: "empty",
      draft: { label: "", amount: 0, kind: "work_it" as const },
      complete: false,
    },
    {
      name: "whitespace label",
      draft: { label: "  ", amount: 10, kind: "work_it" as const },
      complete: false,
    },
    {
      name: "zero amount",
      draft: { label: "Laptop", amount: 0, kind: "work_it" as const },
      complete: false,
    },
    {
      name: "work IT",
      draft: { label: "Laptop", amount: 1200, kind: "work_it" as const },
      complete: true,
    },
    {
      name: "donation",
      draft: { label: "DRK", amount: 50, kind: "donation" as const },
      complete: true,
    },
    {
      name: "receipt optional",
      draft: {
        label: "Laptop",
        amount: 900,
        kind: "work_it" as const,
        receipt: {
          name: "receipt.pdf",
          mimeType: "application/pdf",
          dataUrl: "data:application/pdf;base64,YQ==",
        },
      },
      complete: true,
    },
  ])("$name", ({ draft, complete }) => {
    expect(isExpenseDraftComplete(draft)).toBe(complete);
  });
});

describe("isAllowedReceiptFile", () => {
  it.each([
    {
      name: "png",
      file: new File(["x"], "a.png", { type: "image/png" }),
      allowed: true,
    },
    {
      name: "pdf",
      file: new File(["x"], "a.pdf", { type: "application/pdf" }),
      allowed: true,
    },
    {
      name: "too large",
      file: new File([new Uint8Array(2 * 1024 * 1024 + 1)], "a.png", {
        type: "image/png",
      }),
      allowed: false,
    },
    {
      name: "wrong type",
      file: new File(["x"], "a.txt", { type: "text/plain" }),
      allowed: false,
    },
  ])("$name", ({ file, allowed }) => {
    expect(isAllowedReceiptFile(file)).toBe(allowed);
  });
});

describe("readReceiptFile", () => {
  it("reads an allowed image into a receipt", async () => {
    const file = new File(["hello"], "receipt.png", { type: "image/png" });
    const receipt = await readReceiptFile(file);

    expect(receipt).toEqual({
      name: "receipt.png",
      mimeType: "image/png",
      dataUrl: expect.stringMatching(/^data:image\/png;base64,/),
    });
  });

  it("rejects disallowed files", async () => {
    const file = new File(["hello"], "notes.txt", { type: "text/plain" });

    expect(await readReceiptFile(file)).toBeNull();
  });
});

describe("appendExpense", () => {
  it("does not replace a check-in expense, it adds another row", () => {
    const first: FiledExpense = {
      id: "first-1",
      year: 2026,
      month: 9,
      label: "Laptop",
      amount: 900,
      kind: "work_it",
      usePercent: 100,
    };
    const second: FiledExpense = {
      id: "second-1",
      year: 2026,
      month: 9,
      label: "Course",
      amount: 200,
      kind: "work_it",
      usePercent: 100,
    };

    expect(appendExpense([first], second)).toEqual([first, second]);
  });
});

describe("updateExpense / removeExpense", () => {
  const first: FiledExpense = {
    id: "first-1",
    year: 2026,
    month: 9,
    label: "Laptop",
    amount: 900,
    kind: "work_it",
    usePercent: 100,
  };
  const second: FiledExpense = {
    id: "second-1",
    year: 2026,
    month: 9,
    label: "Course",
    amount: 200,
    kind: "work_it",
    usePercent: 100,
  };

  it("updates only the matching expense and keeps its id", () => {
    const next = updateExpense([first, second], "first-1", {
      year: 2026,
      month: 9,
      label: "Laptop Pro",
      amount: 1200,
      kind: "work_it",
      usePercent: 100,
    });

    expect(next).toEqual([
      {
        id: "first-1",
        year: 2026,
        month: 9,
        label: "Laptop Pro",
        amount: 1200,
        kind: "work_it",
        usePercent: 100,
      },
      second,
    ]);
  });

  it("removes only the matching expense", () => {
    expect(removeExpense([first, second], "first-1")).toEqual([second]);
    expect(removeExpense([first, second], "missing")).toEqual([first, second]);
  });

  it("round-trips through draft and normalize", () => {
    const draft = draftFromExpense(first);

    expect(draft).toEqual({
      label: "Laptop",
      amount: 900,
      kind: "work_it",
    });
    expect(normalizeFiledExpense({ ...first, id: undefined }).id).toEqual(
      expect.any(String),
    );
    expect(normalizeFiledExpense(first).id).toBe("first-1");
  });
});

describe("yearsOnFile", () => {
  it.each([
    {
      name: "empty",
      checkIns: [] as MonthCheckIn[],
      expenses: [] as FiledExpense[],
      years: [] as number[],
    },
    {
      name: "check-in only",
      checkIns: [checkIn(2026, 9)],
      expenses: [] as FiledExpense[],
      years: [2026],
    },
    {
      name: "expense without a check-in still opens a year",
      checkIns: [] as MonthCheckIn[],
      expenses: [
        {
          id: "exp-1",
          year: 2026,
          month: 9,
          label: "Laptop",
          amount: 900,
          kind: "work_it" as const,
          usePercent: 100,
        },
      ],
      years: [2026],
    },
    {
      name: "newest year first",
      checkIns: [checkIn(2025, 11)],
      expenses: [
        {
          id: "exp-2",
          year: 2026,
          month: 1,
          label: "Mouse",
          amount: 40,
          kind: "work_it" as const,
          usePercent: 100,
        },
      ],
      years: [2026, 2025],
    },
  ])("$name", ({ checkIns, expenses, years }) => {
    expect(yearsOnFile(checkIns, expenses)).toEqual(years);
  });
});

describe("buildYearFileExport", () => {
  it("names the download with the export date and writes CSV rows", () => {
    const store = {
      checkIns: [checkIn(2026, 9)],
      baselines: [
        {
          year: 2026,
          km: 14,
          fullyRemote: false,
          wfhDaysPerWeek: 2,
        },
      ],
      expenses: [
        {
          id: "exp-3",
          year: 2026,
          month: 9,
          label: 'Work "laptop"',
          amount: 900,
          kind: "work_it" as const,
          usePercent: 100,
        },
      ],
    };

    const { filename, body } = buildYearFileExport(
      store,
      new Date("2026-09-17T12:00:00.000Z"),
    );

    expect(filename).toBe("taxfix-year-file-2026-09-17.csv");
    expect(body).toBe(
      [
        "type,year,month,job,move,wfh,expense,extra,label,amount,kind,km,fully_remote,wfh_days_per_week,summary,receipt_name",
        "baseline,2026,,,,,,,,,,14,false,2,,",
        "check_in,2026,9,false,false,false,false,false,,,,,,,Quiet month,",
        'expense,2026,9,,,,,,"Work ""laptop""",900,work_it,,,,,',
        "",
      ].join("\n"),
    );
  });
});
