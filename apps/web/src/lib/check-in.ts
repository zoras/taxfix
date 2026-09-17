import { DEFAULT_WORKDAYS, type YearExpense, type YearFacts } from "./tax-year";

export const CHECK_IN_QUESTIONS = [
  {
    id: "job",
    prompt: "Did you start a new job, or change employer?",
    summary: "Job changed",
  },
  {
    id: "move",
    prompt: "Did you move, or did the way to work change?",
    summary: "Moved or commute changed",
  },
  {
    id: "wfh",
    prompt: "Did your home-office or remote days change?",
    summary: "Home office changed",
  },
  {
    id: "expense",
    prompt: "Did you spend extra on work — tools, a laptop, training?",
    summary: "Extra work spend",
  },
  {
    id: "extra",
    prompt:
      "Did you donate, have unusual health or family costs, or a family change?",
    summary: "Family or extra costs",
  },
] as const;

export type QuestionId = (typeof CHECK_IN_QUESTIONS)[number]["id"];

export type CheckInAnswers = Record<QuestionId, boolean>;

export type JobChange = "started" | "left" | "changed";

export type FollowUps = {
  job?: { change: JobChange; employer: string };
  move?: { fullyRemote: boolean; km: number | null };
  wfh?: { daysPerWeek: number };
  expense?: { label: string; amount: number; kind: "work_it" | "work_other" };
  extra?: { kind: "donation" | "family"; amount: number; note: string };
};

export type YearBaseline = {
  year: number;
  km: number | null;
  fullyRemote: boolean;
  wfhDaysPerWeek: number;
};

export type MonthCheckIn = {
  year: number;
  month: number;
  answers: CheckInAnswers;
  followUps: FollowUps;
};

export type YearSection = {
  year: number;
  months: MonthCheckIn[];
};

export type FiledExpense = YearExpense & {
  year: number;
};

export type ExpenseDraft = {
  label: string;
  amount: number;
  kind: YearExpense["kind"];
};

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function monthName(month: number): string {
  return MONTH_NAMES[month - 1] ?? "";
}

export function isCompleteAnswers(
  draft: Partial<CheckInAnswers>,
): draft is CheckInAnswers {
  return CHECK_IN_QUESTIONS.every(
    (question) => typeof draft[question.id] === "boolean",
  );
}

export function isFollowUpComplete(
  id: QuestionId,
  followUps: FollowUps,
): boolean {
  switch (id) {
    case "job":
      return followUps.job?.change != null;
    case "move":
      return Boolean(
        followUps.move &&
        (followUps.move.fullyRemote ||
          (followUps.move.km != null &&
            Number.isInteger(followUps.move.km) &&
            followUps.move.km >= 1)),
      );
    case "wfh":
      return (
        followUps.wfh != null &&
        Number.isInteger(followUps.wfh.daysPerWeek) &&
        followUps.wfh.daysPerWeek >= 0 &&
        followUps.wfh.daysPerWeek <= 5
      );
    case "expense":
      return Boolean(
        followUps.expense &&
        followUps.expense.label.trim().length > 0 &&
        followUps.expense.amount > 0,
      );
    case "extra":
      if (followUps.extra?.kind === "donation") {
        return followUps.extra.amount > 0;
      }

      return followUps.extra?.kind === "family";
  }
}

export function isBaselineComplete(
  baseline: YearBaseline | undefined,
  needed: boolean,
) {
  if (!needed) {
    return true;
  }

  if (!baseline) {
    return false;
  }

  if (baseline.fullyRemote) {
    return Number.isInteger(baseline.wfhDaysPerWeek);
  }

  return (
    baseline.km != null &&
    Number.isInteger(baseline.km) &&
    baseline.km >= 1 &&
    Number.isInteger(baseline.wfhDaysPerWeek)
  );
}

export function isCheckInReady(
  answers: Partial<CheckInAnswers>,
  followUps: FollowUps,
  baseline: YearBaseline | undefined,
  needsBaseline: boolean,
): boolean {
  if (
    !isCompleteAnswers(answers) ||
    !isBaselineComplete(baseline, needsBaseline)
  ) {
    return false;
  }

  return CHECK_IN_QUESTIONS.every(
    (question) =>
      !answers[question.id] || isFollowUpComplete(question.id, followUps),
  );
}

export function summarizeMonth(
  answers: CheckInAnswers,
  followUps: FollowUps = {},
): string {
  const happened = CHECK_IN_QUESTIONS.flatMap((question) => {
    if (!answers[question.id]) {
      return [];
    }

    if (question.id === "move" && followUps.move?.fullyRemote) {
      return ["Fully remote"];
    }

    if (question.id === "move" && followUps.move?.km != null) {
      return [`${followUps.move.km} km commute`];
    }

    if (question.id === "wfh" && followUps.wfh) {
      return [`WFH ${followUps.wfh.daysPerWeek} days/week`];
    }

    if (question.id === "expense" && followUps.expense) {
      return [`${followUps.expense.label} €${followUps.expense.amount}`];
    }

    if (question.id === "extra" && followUps.extra?.kind === "donation") {
      return [`Donation €${followUps.extra.amount}`];
    }

    return [question.summary];
  });

  if (happened.length === 0) {
    return "Quiet month";
  }

  return happened.join(" · ");
}

export function findCheckIn(
  checkIns: MonthCheckIn[],
  year: number,
  month: number,
): MonthCheckIn | undefined {
  return checkIns.find(
    (checkIn) => checkIn.year === year && checkIn.month === month,
  );
}

export function isCurrentMonthComplete(
  checkIns: MonthCheckIn[],
  now: Date,
): boolean {
  return Boolean(findCheckIn(checkIns, now.getFullYear(), now.getMonth() + 1));
}

export function groupCheckInsByYear(checkIns: MonthCheckIn[]): YearSection[] {
  const byYear = new Map<number, MonthCheckIn[]>();

  for (const checkIn of checkIns) {
    const months = byYear.get(checkIn.year) ?? [];
    months.push(checkIn);
    byYear.set(checkIn.year, months);
  }

  return [...byYear.entries()]
    .sort(([left], [right]) => right - left)
    .map(([year, months]) => ({
      year,
      months: [...months].sort((left, right) => right.month - left.month),
    }));
}

export function upsertCheckIn(
  checkIns: MonthCheckIn[],
  next: MonthCheckIn,
): MonthCheckIn[] {
  return [
    ...checkIns.filter(
      (checkIn) =>
        !(checkIn.year === next.year && checkIn.month === next.month),
    ),
    next,
  ];
}

export function yearHasStandingFacts(
  year: number,
  baseline: YearBaseline | undefined,
  checkIns: MonthCheckIn[],
): boolean {
  if (baseline?.year === year) {
    return true;
  }

  return checkIns.some(
    (checkIn) =>
      checkIn.year === year &&
      (checkIn.followUps.move != null || checkIn.followUps.wfh != null),
  );
}

export function isExpenseDraftComplete(draft: ExpenseDraft): boolean {
  return (
    draft.label.trim().length > 0 && draft.amount > 0 && Boolean(draft.kind)
  );
}

export function appendExpense(
  expenses: FiledExpense[],
  expense: FiledExpense,
): FiledExpense[] {
  return [...expenses, expense];
}

export function yearsOnFile(
  checkIns: MonthCheckIn[],
  expenses: FiledExpense[],
  baselines: YearBaseline[] = [],
): number[] {
  const years = new Set<number>();

  for (const checkIn of checkIns) {
    years.add(checkIn.year);
  }

  for (const expense of expenses) {
    years.add(expense.year);
  }

  for (const baseline of baselines) {
    years.add(baseline.year);
  }

  return [...years].sort((left, right) => right - left);
}

export function factsForYear(
  year: number,
  baseline: YearBaseline | undefined,
  checkIns: MonthCheckIn[],
  extraExpenses: FiledExpense[] = [],
): YearFacts {
  const commuteSegments = [];
  const wfhSegments = [];
  const expenses: YearExpense[] = [];

  if (baseline?.year === year) {
    commuteSegments.push({
      fromMonth: 1,
      km: baseline.fullyRemote ? null : baseline.km,
    });
    wfhSegments.push({ fromMonth: 1, daysPerWeek: baseline.wfhDaysPerWeek });
  }

  for (const checkIn of [...checkIns]
    .filter((entry) => entry.year === year)
    .sort((left, right) => left.month - right.month)) {
    if (checkIn.followUps.move) {
      commuteSegments.push({
        fromMonth: checkIn.month,
        km: checkIn.followUps.move.fullyRemote
          ? null
          : checkIn.followUps.move.km,
      });
    }

    if (checkIn.followUps.wfh) {
      wfhSegments.push({
        fromMonth: checkIn.month,
        daysPerWeek: checkIn.followUps.wfh.daysPerWeek,
      });
    }

    if (checkIn.followUps.expense) {
      expenses.push({
        month: checkIn.month,
        label: checkIn.followUps.expense.label,
        amount: checkIn.followUps.expense.amount,
        kind: checkIn.followUps.expense.kind,
        usePercent: 100,
      });
    }

    if (
      checkIn.followUps.extra?.kind === "donation" &&
      checkIn.followUps.extra.amount > 0
    ) {
      expenses.push({
        month: checkIn.month,
        label: checkIn.followUps.extra.note || "Donation",
        amount: checkIn.followUps.extra.amount,
        kind: "donation",
        usePercent: 100,
      });
    }
  }

  for (const expense of extraExpenses.filter((entry) => entry.year === year)) {
    expenses.push({
      month: expense.month,
      label: expense.label,
      amount: expense.amount,
      kind: expense.kind,
      usePercent: expense.usePercent,
    });
  }

  return {
    year,
    workdays: DEFAULT_WORKDAYS,
    commuteSegments,
    wfhSegments,
    expenses,
  };
}

export type YearFileExport = {
  checkIns: MonthCheckIn[];
  baselines: YearBaseline[];
  expenses: FiledExpense[];
};

function csvCell(value: string | number | boolean | null | undefined): string {
  if (value == null) {
    return "";
  }

  const text = String(value);

  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

function csvRow(cells: Array<string | number | boolean | null | undefined>): string {
  return cells.map(csvCell).join(",");
}

/** CSV download payload for the year File (baselines, check-ins, expenses). */
export function buildYearFileExport(
  store: YearFileExport,
  exportedAt: Date = new Date(),
): { filename: string; body: string } {
  const stamp = exportedAt.toISOString().slice(0, 10);
  const lines = [
    csvRow([
      "type",
      "year",
      "month",
      "job",
      "move",
      "wfh",
      "expense",
      "extra",
      "label",
      "amount",
      "kind",
      "km",
      "fully_remote",
      "wfh_days_per_week",
      "summary",
    ]),
  ];

  for (const baseline of store.baselines) {
    lines.push(
      csvRow([
        "baseline",
        baseline.year,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        baseline.fullyRemote ? null : baseline.km,
        baseline.fullyRemote,
        baseline.wfhDaysPerWeek,
        "",
      ]),
    );
  }

  for (const entry of store.checkIns) {
    lines.push(
      csvRow([
        "check_in",
        entry.year,
        entry.month,
        entry.answers.job,
        entry.answers.move,
        entry.answers.wfh,
        entry.answers.expense,
        entry.answers.extra,
        "",
        "",
        "",
        "",
        "",
        "",
        summarizeMonth(entry.answers, entry.followUps),
      ]),
    );
  }

  for (const expense of store.expenses) {
    lines.push(
      csvRow([
        "expense",
        expense.year,
        expense.month,
        "",
        "",
        "",
        "",
        "",
        expense.label,
        expense.amount,
        expense.kind,
        "",
        "",
        "",
        "",
      ]),
    );
  }

  return {
    filename: `taxfix-year-file-${stamp}.csv`,
    body: `${lines.join("\n")}\n`,
  };
}
