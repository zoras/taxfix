import { useEffect, useMemo, useState } from "react";

import { CheckInForm, ExpenseForm } from "@/components/check-in-form";
import { ReceiptThumbnail } from "@/components/receipt-viewer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  appendExpense,
  buildYearFileExport,
  factsForYear,
  groupCheckInsByYear,
  isCurrentMonthComplete,
  monthName,
  summarizeMonth,
  upsertCheckIn,
  yearHasStandingFacts,
  yearsOnFile,
  type CheckInAnswers,
  type ExpenseDraft,
  type ExpenseReceipt,
  type FiledExpense,
  type FollowUps,
  type MonthCheckIn,
  type YearBaseline,
} from "@/lib/check-in";
import { DEFAULT_WORKDAYS, meterCopy, summarizeYear } from "@/lib/tax-year";

const STORAGE_KEY = "taxfix:year-file";
const LEGACY_STORAGE_KEY = "taxfix:month-check-ins";

type FileStore = {
  checkIns: MonthCheckIn[];
  baselines: YearBaseline[];
  expenses: FiledExpense[];
};

const emptyStore: FileStore = {
  checkIns: [],
  baselines: [],
  expenses: [],
};

function normalizeCheckIn(value: MonthCheckIn): MonthCheckIn {
  return {
    ...value,
    followUps: value.followUps ?? {},
  };
}

function loadStore(): FileStore {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem(LEGACY_STORAGE_KEY);

    if (!raw) {
      return emptyStore;
    }

    const parsed: unknown = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return {
        checkIns: parsed.map((entry) =>
          normalizeCheckIn(entry as MonthCheckIn),
        ),
        baselines: [],
        expenses: [],
      };
    }

    const store = parsed as FileStore;

    return {
      checkIns: (store.checkIns ?? []).map(normalizeCheckIn),
      baselines: store.baselines ?? [],
      expenses: store.expenses ?? [],
    };
  } catch {
    return emptyStore;
  }
}

function persistStore(store: FileStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function sameExpense(left: FiledExpense, right: FiledExpense): boolean {
  return (
    left.year === right.year &&
    left.month === right.month &&
    left.label === right.label &&
    left.amount === right.amount &&
    left.kind === right.kind &&
    left.receipt?.dataUrl === right.receipt?.dataUrl
  );
}

const emptyExpense = (): ExpenseDraft => ({
  label: "",
  amount: 0,
  kind: "work_it",
});

export function CalendarDashboard() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const [store, setStore] = useState<FileStore>(emptyStore);
  const [dialog, setDialog] = useState<"check-in" | "expense" | null>(null);
  const [answers, setAnswers] = useState<Partial<CheckInAnswers>>({});
  const [followUps, setFollowUps] = useState<FollowUps>({});
  const [baseline, setBaseline] = useState<YearBaseline | undefined>();
  const [expenseDraft, setExpenseDraft] = useState<ExpenseDraft>(emptyExpense);

  useEffect(() => {
    const loaded = loadStore();
    setStore(loaded);
    setBaseline(loaded.baselines.find((entry) => entry.year === year));
  }, [year]);

  const savedBaseline = store.baselines.find((entry) => entry.year === year);
  const currentDone = isCurrentMonthComplete(store.checkIns, now);
  const monthLabel = monthName(month);
  const needsBaseline = !yearHasStandingFacts(
    year,
    savedBaseline,
    store.checkIns,
  );
  const years = yearsOnFile(store.checkIns, store.expenses, store.baselines);
  const monthsByYear = groupCheckInsByYear(store.checkIns);

  function writeStore(next: FileStore) {
    setStore(next);
    persistStore(next);
  }

  function saveCheckIn() {
    if (
      typeof answers.job !== "boolean" ||
      typeof answers.move !== "boolean" ||
      typeof answers.wfh !== "boolean" ||
      typeof answers.expense !== "boolean" ||
      typeof answers.extra !== "boolean"
    ) {
      return;
    }

    const nextCheckIns = upsertCheckIn(store.checkIns, {
      year,
      month,
      answers: answers as CheckInAnswers,
      followUps,
    });
    const nextBaselines =
      baseline && needsBaseline
        ? [...store.baselines.filter((entry) => entry.year !== year), baseline]
        : store.baselines;

    writeStore({
      checkIns: nextCheckIns,
      baselines: nextBaselines,
      expenses: store.expenses,
    });
    setDialog(null);
    setAnswers({});
    setFollowUps({});
  }

  function saveExpense() {
    writeStore({
      ...store,
      expenses: appendExpense(store.expenses, {
        year,
        month,
        label: expenseDraft.label.trim(),
        amount: expenseDraft.amount,
        kind: expenseDraft.kind,
        usePercent: 100,
        ...(expenseDraft.receipt ? { receipt: expenseDraft.receipt } : {}),
      }),
    });
    setExpenseDraft(emptyExpense());
    setDialog(null);
  }

  function exportFile() {
    const { filename, body } = buildYearFileExport(store);
    const blob = new Blob([body], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function updateExpenseReceipt(
    target: FiledExpense,
    receipt: ExpenseReceipt | undefined,
  ) {
    writeStore({
      ...store,
      expenses: store.expenses.map((expense) => {
        if (!sameExpense(expense, target)) {
          return expense;
        }

        if (!receipt) {
          const { receipt: _removed, ...rest } = expense;
          return rest;
        }

        return { ...expense, receipt };
      }),
    });
  }

  const canExport =
    store.checkIns.length > 0 ||
    store.expenses.length > 0 ||
    store.baselines.length > 0;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            {monthLabel} {year}
          </p>
          <h1 className="text-3xl font-medium tracking-tight">
            {currentDone ? "You're caught up." : `${monthLabel} is ready.`}
          </h1>
          <p className="max-w-md text-muted-foreground">
            {currentDone
              ? "The month is filed. You can still drop in an expense any day."
              : "A short check-in about how this month passed — or add an expense without the quiz."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!currentDone ? (
            <Button
              onClick={() => {
                if (!baseline) {
                  setBaseline({
                    year,
                    km: null,
                    fullyRemote: false,
                    wfhDaysPerWeek: 0,
                  });
                }

                setDialog("check-in");
              }}
            >
              Check in
            </Button>
          ) : null}
          <Button
            variant={currentDone ? "default" : "outline"}
            onClick={() => setDialog("expense")}
          >
            Add expense
          </Button>
          <Button
            variant="outline"
            disabled={!canExport}
            onClick={exportFile}
          >
            Export
          </Button>
        </div>
      </header>

      {years.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No years on file yet. Check in, or add an expense the week it happens.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {years.map((sectionYear) => (
            <YearCard
              key={sectionYear}
              year={sectionYear}
              isCurrentYear={sectionYear === year}
              months={
                monthsByYear.find((section) => section.year === sectionYear)
                  ?.months ?? []
              }
              baseline={store.baselines.find(
                (entry) => entry.year === sectionYear,
              )}
              checkIns={store.checkIns}
              expenses={store.expenses.filter(
                (expense) => expense.year === sectionYear,
              )}
              onAddExpense={() => setDialog("expense")}
              onUpdateReceipt={updateExpenseReceipt}
            />
          ))}
        </div>
      )}

      <Dialog
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDialog(null);
            setAnswers({});
            setFollowUps({});
            setExpenseDraft(emptyExpense());
          }
        }}
      >
        <DialogContent className="flex max-h-[min(90vh,44rem)] flex-col overflow-hidden sm:max-w-lg">
          {dialog === "check-in" ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {monthLabel} {year}
                </DialogTitle>
                <DialogDescription>
                  One form. Extra fields appear only when you say yes.
                </DialogDescription>
              </DialogHeader>
              <CheckInForm
                monthLabel={monthLabel}
                year={year}
                needsBaseline={needsBaseline}
                answers={answers}
                followUps={followUps}
                baseline={baseline}
                onAnswersChange={setAnswers}
                onFollowUpsChange={setFollowUps}
                onBaselineChange={setBaseline}
                onSubmit={saveCheckIn}
              />
            </>
          ) : null}
          {dialog === "expense" ? (
            <>
              <DialogHeader>
                <DialogTitle>Add an expense</DialogTitle>
                <DialogDescription>
                  {monthLabel} {year}
                  {currentDone ? " · this month is already caught up" : ""}
                </DialogDescription>
              </DialogHeader>
              <ExpenseForm
                monthLabel={monthLabel}
                draft={expenseDraft}
                onChange={setExpenseDraft}
                onSubmit={saveExpense}
              />
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function YearCard({
  year,
  isCurrentYear,
  months,
  baseline,
  checkIns,
  expenses,
  onAddExpense,
  onUpdateReceipt,
}: {
  year: number;
  isCurrentYear: boolean;
  months: MonthCheckIn[];
  baseline: YearBaseline | undefined;
  checkIns: MonthCheckIn[];
  expenses: FiledExpense[];
  onAddExpense: () => void;
  onUpdateReceipt: (
    expense: FiledExpense,
    receipt: ExpenseReceipt | undefined,
  ) => void;
}) {
  const facts = useMemo(
    () => factsForYear(year, baseline, checkIns, expenses),
    [year, baseline, checkIns, expenses],
  );
  const summary = summarizeYear(facts);

  return (
    <section
      className="rounded-xl border bg-card p-5"
      aria-labelledby={`year-${year}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 id={`year-${year}`} className="text-lg font-medium">
            {year}
          </h2>
          <p className="text-sm text-muted-foreground">{meterCopy(summary)}</p>
        </div>
        {isCurrentYear ? (
          <Button variant="outline" size="sm" onClick={onAddExpense}>
            Add expense
          </Button>
        ) : null}
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary"
          style={{
            width: `${Math.min(100, (summary.werbungskosten / summary.lumpSumEur) * 100)}%`,
          }}
        />
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        {trueTodayCopy(summary.standingKm, summary.standingWfhDaysPerWeek)} ·{" "}
        {DEFAULT_WORKDAYS} workdays assumed. Estimate, not advice.
      </p>
      {months.length > 0 ? (
        <ul className="divide-y">
          {months.map((entry) => (
            <li
              key={`${entry.year}-${entry.month}-checkin`}
              className="flex items-baseline justify-between gap-4 py-3 first:pt-0"
            >
              <span className="font-medium">{monthName(entry.month)}</span>
              <span className="text-right text-sm text-muted-foreground">
                {summarizeMonth(entry.answers, entry.followUps)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {expenses.length > 0 ? (
        <ul className="mt-2 divide-y border-t">
          {expenses.map((expense) => (
            <li
              key={`${expense.month}-${expense.label}-${expense.amount}-${expense.receipt?.name ?? "none"}`}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                {expense.receipt ? (
                  <ReceiptThumbnail
                    receipt={expense.receipt}
                    size="sm"
                    onReplace={(receipt) => onUpdateReceipt(expense, receipt)}
                    onRemove={() => onUpdateReceipt(expense, undefined)}
                  />
                ) : null}
                <span className="font-medium">
                  {monthName(expense.month)} · {expense.label}
                </span>
              </div>
              <span className="shrink-0 text-sm text-muted-foreground">
                €{expense.amount}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function trueTodayCopy(
  km: number | null | undefined,
  wfh: number | undefined,
): string {
  const bits = [];

  if (km === null) {
    bits.push("Fully remote");
  } else if (km != null) {
    bits.push(`${km} km one way`);
  }

  if (wfh != null) {
    bits.push(`WFH ${wfh} days/week`);
  }

  if (bits.length === 0) {
    return "Nothing standing yet";
  }

  return bits.join(" · ");
}
