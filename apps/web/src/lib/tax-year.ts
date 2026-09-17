export const LUMP_SUM_EUR = 1230;
export const COMMUTE_EUR_PER_KM_2026 = 0.38;
export const HOME_OFFICE_EUR_PER_DAY = 6;
export const HOME_OFFICE_DAY_CAP = 210;
export const DEFAULT_WORKDAYS = 220;
export const COMMUTE_CAP_EUR = 4500;

export type CommuteSegment = {
  fromMonth: number;
  km: number | null;
};

export type WfhSegment = {
  fromMonth: number;
  daysPerWeek: number;
};

export type ExpenseKind = "work_it" | "work_other" | "donation";

export type YearExpense = {
  month: number;
  label: string;
  amount: number;
  kind: ExpenseKind;
  usePercent: number;
};

export type YearFacts = {
  year: number;
  workdays: number;
  commuteSegments: CommuteSegment[];
  wfhSegments: WfhSegment[];
  expenses: YearExpense[];
};

export type MeterState = "empty" | "under" | "over";

export type YearSummary = {
  commuteEur: number;
  homeOfficeEur: number;
  workToolsEur: number;
  werbungskosten: number;
  donationsEur: number;
  lumpSumEur: number;
  overLumpSumBy: number;
  underLumpSumBy: number;
  officeDays: number;
  homeOfficeDays: number;
  standingKm: number | null | undefined;
  standingWfhDaysPerWeek: number | undefined;
  meterState: MeterState;
};

function valueAtMonth<T extends { fromMonth: number }>(
  segments: T[],
  month: number,
): T | undefined {
  return segments
    .filter((segment) => segment.fromMonth <= month)
    .sort((left, right) => right.fromMonth - left.fromMonth)[0];
}

function roundEur(value: number): number {
  return Math.round(value);
}

export function standingCommuteKm(
  segments: CommuteSegment[],
  month = 12,
): number | null | undefined {
  return valueAtMonth(segments, month)?.km;
}

export function standingWfhDays(
  segments: WfhSegment[],
  month = 12,
): number | undefined {
  return valueAtMonth(segments, month)?.daysPerWeek;
}

export function summarizeYear(facts: YearFacts): YearSummary {
  const monthShare = facts.workdays / 12;
  let officeDays = 0;
  let homeOfficeDays = 0;
  let commuteRaw = 0;

  for (let month = 1; month <= 12; month += 1) {
    const commute = valueAtMonth(facts.commuteSegments, month);
    const wfh = valueAtMonth(facts.wfhSegments, month);

    if (!commute && !wfh) {
      continue;
    }

    const daysPerWeek = wfh?.daysPerWeek ?? (commute?.km === null ? 5 : 0);
    const remote = commute?.km === null || commute?.km === 0;
    const hoDays = remote ? monthShare : monthShare * (daysPerWeek / 5);
    const office = remote ? 0 : monthShare - hoDays;
    const km = remote ? 0 : (commute?.km ?? 0);

    officeDays += office;
    homeOfficeDays += hoDays;
    commuteRaw += km * office * COMMUTE_EUR_PER_KM_2026;
  }

  const cappedHoDays = Math.min(homeOfficeDays, HOME_OFFICE_DAY_CAP);
  const commuteEur = roundEur(Math.min(commuteRaw, COMMUTE_CAP_EUR));
  const homeOfficeEur = roundEur(cappedHoDays * HOME_OFFICE_EUR_PER_DAY);
  const workToolsEur = roundEur(
    facts.expenses
      .filter((expense) => expense.kind === "work_it")
      .reduce((sum, expense) => sum + expense.amount * (expense.usePercent / 100), 0),
  );
  const donationsEur = roundEur(
    facts.expenses
      .filter((expense) => expense.kind === "donation")
      .reduce((sum, expense) => sum + expense.amount, 0),
  );
  const werbungskosten = commuteEur + homeOfficeEur + workToolsEur;
  const overLumpSumBy = Math.max(0, werbungskosten - LUMP_SUM_EUR);
  const underLumpSumBy = Math.max(0, LUMP_SUM_EUR - werbungskosten);
  const hasFacts =
    facts.commuteSegments.length > 0 ||
    facts.wfhSegments.length > 0 ||
    facts.expenses.some((expense) => expense.kind === "work_it");

  let meterState: MeterState = "empty";
  if (hasFacts && werbungskosten > LUMP_SUM_EUR) {
    meterState = "over";
  } else if (hasFacts) {
    meterState = "under";
  }

  return {
    commuteEur,
    homeOfficeEur,
    workToolsEur,
    werbungskosten,
    donationsEur,
    lumpSumEur: LUMP_SUM_EUR,
    overLumpSumBy,
    underLumpSumBy,
    officeDays: roundEur(officeDays),
    homeOfficeDays: roundEur(cappedHoDays),
    standingKm: standingCommuteKm(facts.commuteSegments),
    standingWfhDaysPerWeek: standingWfhDays(facts.wfhSegments),
    meterState,
  };
}

export function meterCopy(summary: YearSummary): string {
  if (summary.meterState === "empty") {
    return "Nothing that beats the €1,230 lump sum yet.";
  }

  if (summary.meterState === "over") {
    return `€${summary.werbungskosten} documented — €${summary.overLumpSumBy} over the automatic €1,230.`;
  }

  return `€${summary.werbungskosten} documented · €${summary.underLumpSumBy} below the €1,230 the Finanzamt already counts.`;
}
