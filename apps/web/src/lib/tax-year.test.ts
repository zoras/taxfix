import { describe, expect, it } from "bun:test";

import {
  COMMUTE_CAP_EUR,
  COMMUTE_EUR_PER_KM_2026,
  DEFAULT_WORKDAYS,
  HOME_OFFICE_DAY_CAP,
  HOME_OFFICE_EUR_PER_DAY,
  LUMP_SUM_EUR,
  meterCopy,
  summarizeYear,
  type YearFacts,
} from "./tax-year";

function facts(overrides: Partial<YearFacts> = {}): YearFacts {
  return {
    year: 2026,
    workdays: DEFAULT_WORKDAYS,
    commuteSegments: [],
    wfhSegments: [],
    expenses: [],
    ...overrides,
  };
}

describe("summarizeYear", () => {
  it.each([
    {
      name: "empty year",
      input: facts(),
      commuteEur: 0,
      homeOfficeEur: 0,
      workToolsEur: 0,
      werbungskosten: 0,
      donationsEur: 0,
      meterState: "empty" as const,
      overLumpSumBy: 0,
      underLumpSumBy: LUMP_SUM_EUR,
    },
    {
      name: "14 km all year, no WFH stays under the lump sum",
      input: facts({ commuteSegments: [{ fromMonth: 1, km: 14 }] }),
      commuteEur: Math.round(14 * DEFAULT_WORKDAYS * COMMUTE_EUR_PER_KM_2026),
      homeOfficeEur: 0,
      workToolsEur: 0,
      werbungskosten: Math.round(14 * DEFAULT_WORKDAYS * COMMUTE_EUR_PER_KM_2026),
      donationsEur: 0,
      meterState: "under" as const,
      overLumpSumBy: 0,
      underLumpSumBy:
        LUMP_SUM_EUR - Math.round(14 * DEFAULT_WORKDAYS * COMMUTE_EUR_PER_KM_2026),
    },
    {
      name: "15 km all year, no WFH crosses the lump sum",
      input: facts({ commuteSegments: [{ fromMonth: 1, km: 15 }] }),
      commuteEur: Math.round(15 * DEFAULT_WORKDAYS * COMMUTE_EUR_PER_KM_2026),
      homeOfficeEur: 0,
      workToolsEur: 0,
      werbungskosten: Math.round(15 * DEFAULT_WORKDAYS * COMMUTE_EUR_PER_KM_2026),
      donationsEur: 0,
      meterState: "over" as const,
      overLumpSumBy:
        Math.round(15 * DEFAULT_WORKDAYS * COMMUTE_EUR_PER_KM_2026) - LUMP_SUM_EUR,
      underLumpSumBy: 0,
    },
    {
      name: "fully remote uses home-office days up to the 210 cap",
      input: facts({ commuteSegments: [{ fromMonth: 1, km: null }] }),
      commuteEur: 0,
      homeOfficeEur: HOME_OFFICE_DAY_CAP * HOME_OFFICE_EUR_PER_DAY,
      workToolsEur: 0,
      werbungskosten: HOME_OFFICE_DAY_CAP * HOME_OFFICE_EUR_PER_DAY,
      donationsEur: 0,
      meterState: "over" as const,
      overLumpSumBy: HOME_OFFICE_DAY_CAP * HOME_OFFICE_EUR_PER_DAY - LUMP_SUM_EUR,
      underLumpSumBy: 0,
    },
    {
      name: "3 WFH days splits the year and does not double-count commute",
      input: facts({
        commuteSegments: [{ fromMonth: 1, km: 20 }],
        wfhSegments: [{ fromMonth: 1, daysPerWeek: 3 }],
      }),
      commuteEur: Math.round(20 * (DEFAULT_WORKDAYS * (2 / 5)) * COMMUTE_EUR_PER_KM_2026),
      homeOfficeEur: Math.round(DEFAULT_WORKDAYS * (3 / 5) * HOME_OFFICE_EUR_PER_DAY),
      workToolsEur: 0,
      werbungskosten:
        Math.round(20 * (DEFAULT_WORKDAYS * (2 / 5)) * COMMUTE_EUR_PER_KM_2026) +
        Math.round(DEFAULT_WORKDAYS * (3 / 5) * HOME_OFFICE_EUR_PER_DAY),
      donationsEur: 0,
      meterState: "over" as const,
      overLumpSumBy:
        Math.round(20 * (DEFAULT_WORKDAYS * (2 / 5)) * COMMUTE_EUR_PER_KM_2026) +
        Math.round(DEFAULT_WORKDAYS * (3 / 5) * HOME_OFFICE_EUR_PER_DAY) -
        LUMP_SUM_EUR,
      underLumpSumBy: 0,
    },
    {
      name: "IT laptop counts this year, donation stays out of the meter",
      input: facts({
        commuteSegments: [{ fromMonth: 1, km: 10 }],
        expenses: [
          {
            month: 9,
            label: "Laptop",
            amount: 1200,
            kind: "work_it",
            usePercent: 100,
          },
          {
            month: 9,
            label: "Red Cross",
            amount: 200,
            kind: "donation",
            usePercent: 100,
          },
        ],
      }),
      commuteEur: Math.round(10 * DEFAULT_WORKDAYS * COMMUTE_EUR_PER_KM_2026),
      homeOfficeEur: 0,
      workToolsEur: 1200,
      werbungskosten: Math.round(10 * DEFAULT_WORKDAYS * COMMUTE_EUR_PER_KM_2026) + 1200,
      donationsEur: 200,
      meterState: "over" as const,
      overLumpSumBy:
        Math.round(10 * DEFAULT_WORKDAYS * COMMUTE_EUR_PER_KM_2026) + 1200 - LUMP_SUM_EUR,
      underLumpSumBy: 0,
    },
    {
      name: "furniture / other work tools do not silently hit this year’s meter",
      input: facts({
        expenses: [
          {
            month: 3,
            label: "Desk",
            amount: 900,
            kind: "work_other",
            usePercent: 100,
          },
        ],
      }),
      commuteEur: 0,
      homeOfficeEur: 0,
      workToolsEur: 0,
      werbungskosten: 0,
      donationsEur: 0,
      meterState: "empty" as const,
      overLumpSumBy: 0,
      underLumpSumBy: LUMP_SUM_EUR,
    },
    {
      name: "shared phone only counts the work-use share",
      input: facts({
        expenses: [
          {
            month: 4,
            label: "Phone",
            amount: 800,
            kind: "work_it",
            usePercent: 50,
          },
        ],
      }),
      commuteEur: 0,
      homeOfficeEur: 0,
      workToolsEur: 400,
      werbungskosten: 400,
      donationsEur: 0,
      meterState: "under" as const,
      overLumpSumBy: 0,
      underLumpSumBy: LUMP_SUM_EUR - 400,
    },
  ])(
    "$name",
    ({
      input,
      commuteEur,
      homeOfficeEur,
      workToolsEur,
      werbungskosten,
      donationsEur,
      meterState,
      overLumpSumBy,
      underLumpSumBy,
    }) => {
      const summary = summarizeYear(input);

      expect(summary).toMatchObject({
        commuteEur,
        homeOfficeEur,
        workToolsEur,
        werbungskosten,
        donationsEur,
        lumpSumEur: LUMP_SUM_EUR,
        meterState,
        overLumpSumBy,
        underLumpSumBy,
      });
    },
  );

  it("prorates a June commute so January–May are not invented", () => {
    const summary = summarizeYear(
      facts({ commuteSegments: [{ fromMonth: 6, km: 14 }] }),
    );
    const expectedDays = DEFAULT_WORKDAYS * (7 / 12);

    expect(summary.commuteEur).toBe(
      Math.round(14 * expectedDays * COMMUTE_EUR_PER_KM_2026),
    );
    expect(summary.officeDays).toBe(Math.round(expectedDays));
    expect(summary.meterState).toBe("under");
  });

  it("a later commute segment replaces the earlier km from that month on", () => {
    const summary = summarizeYear(
      facts({
        commuteSegments: [
          { fromMonth: 1, km: 10 },
          { fromMonth: 7, km: 30 },
        ],
      }),
    );
    const firstHalf = DEFAULT_WORKDAYS * (6 / 12);
    const secondHalf = DEFAULT_WORKDAYS * (6 / 12);

    expect(summary.commuteEur).toBe(
      Math.round(
        10 * firstHalf * COMMUTE_EUR_PER_KM_2026 +
          30 * secondHalf * COMMUTE_EUR_PER_KM_2026,
      ),
    );
    expect(summary.standingKm).toBe(30);
  });

  it("caps home-office days at 210 even if the week is fully remote", () => {
    const summary = summarizeYear(
      facts({
        commuteSegments: [{ fromMonth: 1, km: null }],
        wfhSegments: [{ fromMonth: 1, daysPerWeek: 5 }],
      }),
    );

    expect(summary.homeOfficeDays).toBe(HOME_OFFICE_DAY_CAP);
    expect(summary.homeOfficeEur).toBe(HOME_OFFICE_DAY_CAP * HOME_OFFICE_EUR_PER_DAY);
  });

  it("caps commute at €4,500", () => {
    const summary = summarizeYear(
      facts({ commuteSegments: [{ fromMonth: 1, km: 200 }] }),
    );

    expect(summary.commuteEur).toBe(COMMUTE_CAP_EUR);
  });

  it("standing facts come from the latest segment", () => {
    const summary = summarizeYear(
      facts({
        commuteSegments: [
          { fromMonth: 1, km: 8 },
          { fromMonth: 9, km: null },
        ],
        wfhSegments: [
          { fromMonth: 1, daysPerWeek: 0 },
          { fromMonth: 9, daysPerWeek: 5 },
        ],
      }),
    );

    expect(summary.standingKm).toBeNull();
    expect(summary.standingWfhDaysPerWeek).toBe(5);
  });
});

describe("meterCopy", () => {
  it.each([
    {
      name: "empty",
      summary: summarizeYear(facts()),
      copy: "Nothing that beats the €1,230 lump sum yet.",
    },
    {
      name: "under",
      summary: summarizeYear(facts({ commuteSegments: [{ fromMonth: 1, km: 14 }] })),
      copy: `€${Math.round(14 * DEFAULT_WORKDAYS * COMMUTE_EUR_PER_KM_2026)} documented · €${LUMP_SUM_EUR - Math.round(14 * DEFAULT_WORKDAYS * COMMUTE_EUR_PER_KM_2026)} below the €1,230 the Finanzamt already counts.`,
    },
    {
      name: "over",
      summary: summarizeYear(facts({ commuteSegments: [{ fromMonth: 1, km: 15 }] })),
      copy: `€${Math.round(15 * DEFAULT_WORKDAYS * COMMUTE_EUR_PER_KM_2026)} documented — €${Math.round(15 * DEFAULT_WORKDAYS * COMMUTE_EUR_PER_KM_2026) - LUMP_SUM_EUR} over the automatic €1,230.`,
    },
  ])("$name", ({ summary, copy }) => {
    expect(meterCopy(summary)).toBe(copy);
  });
});
