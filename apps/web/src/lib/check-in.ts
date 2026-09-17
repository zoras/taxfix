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
    prompt: "Did you donate, have unusual health or family costs, or a family change?",
    summary: "Family or extra costs",
  },
] as const;

export type QuestionId = (typeof CHECK_IN_QUESTIONS)[number]["id"];

export type CheckInAnswers = Record<QuestionId, boolean>;

export type MonthCheckIn = {
  year: number;
  month: number;
  answers: CheckInAnswers;
};

export type YearSection = {
  year: number;
  months: MonthCheckIn[];
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
  return CHECK_IN_QUESTIONS.every((question) => typeof draft[question.id] === "boolean");
}

export function summarizeMonth(answers: CheckInAnswers): string {
  const happened = CHECK_IN_QUESTIONS.filter((question) => answers[question.id]).map(
    (question) => question.summary,
  );

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
  return checkIns.find((checkIn) => checkIn.year === year && checkIn.month === month);
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
      (checkIn) => !(checkIn.year === next.year && checkIn.month === next.month),
    ),
    next,
  ];
}
