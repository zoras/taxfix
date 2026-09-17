import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CHECK_IN_QUESTIONS,
  groupCheckInsByYear,
  isCompleteAnswers,
  isCurrentMonthComplete,
  monthName,
  summarizeMonth,
  upsertCheckIn,
  type CheckInAnswers,
  type MonthCheckIn,
} from "@/lib/check-in";

const STORAGE_KEY = "taxfix:month-check-ins";

function loadCheckIns(): MonthCheckIn[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as MonthCheckIn[];
  } catch {
    return [];
  }
}

function persistCheckIns(checkIns: MonthCheckIn[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checkIns));
}

export function CalendarDashboard() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const [checkIns, setCheckIns] = useState<MonthCheckIn[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setCheckIns(loadCheckIns());
  }, []);

  const currentDone = isCurrentMonthComplete(checkIns, now);
  const yearSections = groupCheckInsByYear(checkIns);
  const monthLabel = monthName(month);

  function saveCheckIn(answers: CheckInAnswers) {
    const next = upsertCheckIn(checkIns, { year, month, answers });
    setCheckIns(next);
    persistCheckIns(next);
  }

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
              ? "Past months stay on this page. Nothing is due."
              : "A short check-in about how this month passed. Nothing to catch up on unless you want to."}
          </p>
        </div>
        {!currentDone ? (
          <Button onClick={() => setDialogOpen(true)}>Check in</Button>
        ) : null}
      </header>

      {yearSections.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No years on file yet. Check in when something happens — or when nothing does.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {yearSections.map((section) => (
            <section
              key={section.year}
              className="rounded-xl border bg-card p-5"
              aria-labelledby={`year-${section.year}`}
            >
              <h2 id={`year-${section.year}`} className="mb-1 text-lg font-medium">
                {section.year}
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                {section.months.length === 1
                  ? "1 month on file"
                  : `${section.months.length} months on file`}
              </p>
              <ul className="divide-y">
                {section.months.map((entry) => (
                  <li
                    key={`${entry.year}-${entry.month}`}
                    className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <span className="font-medium">{monthName(entry.month)}</span>
                    <span className="text-right text-sm text-muted-foreground">
                      {summarizeMonth(entry.answers)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <CheckInDialog
        monthLabel={monthLabel}
        year={year}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onComplete={saveCheckIn}
      />
    </div>
  );
}

function CheckInDialog({
  monthLabel,
  year,
  open,
  onOpenChange,
  onComplete,
}: {
  monthLabel: string;
  year: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (answers: CheckInAnswers) => void;
}) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Partial<CheckInAnswers>>({});

  const finished = step >= CHECK_IN_QUESTIONS.length;
  const question = CHECK_IN_QUESTIONS[step];

  function reset() {
    setStep(0);
    setDraft({});
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      reset();
    }
  }

  function answer(value: boolean) {
    if (!question) {
      return;
    }

    const nextDraft = { ...draft, [question.id]: value };
    setDraft(nextDraft);

    if (step === CHECK_IN_QUESTIONS.length - 1 && isCompleteAnswers(nextDraft)) {
      onComplete(nextDraft);
    }

    setStep((current) => current + 1);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={!finished}>
        {finished ? (
          <>
            <DialogHeader>
              <DialogTitle>You're caught up.</DialogTitle>
              <DialogDescription>
                {monthLabel} {year} is on file. July can wait.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {monthLabel} {year}
              </DialogTitle>
              <DialogDescription>
                Question {step + 1} of {CHECK_IN_QUESTIONS.length}
              </DialogDescription>
            </DialogHeader>
            <p className="text-base text-foreground">{question.prompt}</p>
            <DialogFooter className="sm:justify-between">
              {step > 0 ? (
                <Button
                  variant="ghost"
                  onClick={() => setStep((current) => Math.max(0, current - 1))}
                >
                  Back
                </Button>
              ) : (
                <span />
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => answer(false)}>
                  No
                </Button>
                <Button onClick={() => answer(true)}>Yes</Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
