import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CHECK_IN_QUESTIONS,
  isCheckInReady,
  isExpenseDraftComplete,
  readReceiptFile,
  type CheckInAnswers,
  type ExpenseDraft,
  type FollowUps,
  type JobChange,
  type QuestionId,
  type YearBaseline,
} from "@/lib/check-in";
import { ReceiptThumbnail } from "@/components/receipt-viewer";

function YesNo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex gap-2" role="group" aria-label={label}>
      <Button
        type="button"
        variant={value === false ? "default" : "outline"}
        aria-pressed={value === false}
        onClick={() => onChange(false)}
      >
        No
      </Button>
      <Button
        type="button"
        variant={value === true ? "default" : "outline"}
        aria-pressed={value === true}
        onClick={() => onChange(true)}
      >
        Yes
      </Button>
    </div>
  );
}

function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | undefined;
  options: { id: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((option) => (
        <Button
          key={option.id}
          type="button"
          size="sm"
          variant={value === option.id ? "default" : "outline"}
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function CheckInForm({
  monthLabel,
  year,
  needsBaseline,
  answers,
  followUps,
  baseline,
  onAnswersChange,
  onFollowUpsChange,
  onBaselineChange,
  onSubmit,
}: {
  monthLabel: string;
  year: number;
  needsBaseline: boolean;
  answers: Partial<CheckInAnswers>;
  followUps: FollowUps;
  baseline: YearBaseline | undefined;
  onAnswersChange: (answers: Partial<CheckInAnswers>) => void;
  onFollowUpsChange: (followUps: FollowUps) => void;
  onBaselineChange: (baseline: YearBaseline) => void;
  onSubmit: () => void;
}) {
  const ready = isCheckInReady(answers, followUps, baseline, needsBaseline);

  function setAnswer(id: QuestionId, value: boolean) {
    onAnswersChange({ ...answers, [id]: value });

    if (value) {
      return;
    }

    const next = { ...followUps };
    delete next[id];
    onFollowUpsChange(next);
  }

  return (
    <form
      className="flex min-h-0 flex-1 flex-col gap-0"
      onSubmit={(event) => {
        event.preventDefault();

        if (ready) {
          onSubmit();
        }
      }}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto pr-1">
        {needsBaseline ? (
          <section className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3">
            <div>
              <h3 className="font-medium">Already true this year</h3>
              <p className="text-sm text-muted-foreground">
                So July is not a memory test. One-way kilometres, not round
                trip.
              </p>
            </div>
            <Choice
              label="Commute"
              value={baseline?.fullyRemote ? "remote" : "commute"}
              options={[
                { id: "commute", label: "I commute" },
                { id: "remote", label: "Fully remote" },
              ]}
              onChange={(value) =>
                onBaselineChange({
                  year,
                  fullyRemote: value === "remote",
                  km: value === "remote" ? null : (baseline?.km ?? null),
                  wfhDaysPerWeek: baseline?.wfhDaysPerWeek ?? 0,
                })
              }
            />
            {baseline && !baseline.fullyRemote ? (
              <Field label="One-way km to work">
                <Input
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  value={baseline.km ?? ""}
                  onChange={(event) =>
                    onBaselineChange({
                      ...baseline,
                      year,
                      fullyRemote: false,
                      km:
                        event.target.value === ""
                          ? null
                          : Number(event.target.value),
                      wfhDaysPerWeek: baseline.wfhDaysPerWeek ?? 0,
                    })
                  }
                />
              </Field>
            ) : null}
            <Field label="Typical home-office days per week">
              <Choice
                label="Home-office days per week"
                value={String(baseline?.wfhDaysPerWeek ?? "")}
                options={["0", "1", "2", "3", "4", "5"].map((day) => ({
                  id: day,
                  label: day,
                }))}
                onChange={(value) =>
                  onBaselineChange({
                    year,
                    fullyRemote: baseline?.fullyRemote ?? false,
                    km: baseline?.km ?? null,
                    wfhDaysPerWeek: Number(value),
                  })
                }
              />
            </Field>
          </section>
        ) : null}

        <p className="text-sm text-muted-foreground">
          How {monthLabel} passed. No is a complete answer — extra fields only
          appear if something changed.
        </p>

        {CHECK_IN_QUESTIONS.map((question) => (
          <section key={question.id} className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <p className="text-sm font-medium">{question.prompt}</p>
              <YesNo
                label={question.prompt}
                value={answers[question.id]}
                onChange={(value) => setAnswer(question.id, value)}
              />
            </div>
            {answers[question.id] ? (
              <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3">
                <FollowUpFields
                  id={question.id}
                  followUps={followUps}
                  onChange={onFollowUpsChange}
                />
              </div>
            ) : null}
          </section>
        ))}
      </div>
      <div className="-mx-4 mt-4 flex justify-end border-t bg-muted/50 px-4 pt-4">
        <Button type="submit" disabled={!ready}>
          Save {monthLabel}
        </Button>
      </div>
    </form>
  );
}

function FollowUpFields({
  id,
  followUps,
  onChange,
}: {
  id: QuestionId;
  followUps: FollowUps;
  onChange: (followUps: FollowUps) => void;
}) {
  if (id === "job") {
    return (
      <>
        <Choice
          label="Job change"
          value={followUps.job?.change}
          options={[
            { id: "started" satisfies JobChange, label: "Started" },
            { id: "left" satisfies JobChange, label: "Left" },
            { id: "changed" satisfies JobChange, label: "Changed" },
          ]}
          onChange={(change) =>
            onChange({
              ...followUps,
              job: { change, employer: followUps.job?.employer ?? "" },
            })
          }
        />
        <Field label="Employer (optional)">
          <Input
            value={followUps.job?.employer ?? ""}
            onChange={(event) =>
              onChange({
                ...followUps,
                job: {
                  change: followUps.job?.change ?? "changed",
                  employer: event.target.value,
                },
              })
            }
          />
        </Field>
      </>
    );
  }

  if (id === "move") {
    return (
      <>
        <Choice
          label="Commute after the move"
          value={followUps.move?.fullyRemote ? "remote" : "commute"}
          options={[
            { id: "commute", label: "I still commute" },
            { id: "remote", label: "No commute / fully remote" },
          ]}
          onChange={(value) =>
            onChange({
              ...followUps,
              move: {
                fullyRemote: value === "remote",
                km: value === "remote" ? null : (followUps.move?.km ?? null),
              },
            })
          }
        />
        {!followUps.move?.fullyRemote ? (
          <Field label="New one-way km">
            <Input
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={followUps.move?.km ?? ""}
              onChange={(event) =>
                onChange({
                  ...followUps,
                  move: {
                    fullyRemote: false,
                    km:
                      event.target.value === ""
                        ? null
                        : Number(event.target.value),
                  },
                })
              }
            />
          </Field>
        ) : null}
      </>
    );
  }

  if (id === "wfh") {
    return (
      <Field label="Typical home-office days per week from now">
        <Choice
          label="Home-office days per week"
          value={
            followUps.wfh != null
              ? String(followUps.wfh.daysPerWeek)
              : undefined
          }
          options={["0", "1", "2", "3", "4", "5"].map((day) => ({
            id: day,
            label: day,
          }))}
          onChange={(value) =>
            onChange({ ...followUps, wfh: { daysPerWeek: Number(value) } })
          }
        />
      </Field>
    );
  }

  if (id === "expense") {
    return (
      <ExpenseFields
        draft={{
          label: followUps.expense?.label ?? "",
          amount: followUps.expense?.amount ?? 0,
          kind: followUps.expense?.kind ?? "work_it",
        }}
        onChange={(draft) =>
          onChange({
            ...followUps,
            expense: {
              label: draft.label,
              amount: draft.amount,
              kind: draft.kind === "donation" ? "work_other" : draft.kind,
            },
          })
        }
        kinds={[
          { id: "work_it", label: "Computer / software" },
          { id: "work_other", label: "Other work thing" },
        ]}
      />
    );
  }

  return (
    <>
      <Choice
        label="What kind of extra"
        value={followUps.extra?.kind}
        options={[
          { id: "donation", label: "Donation" },
          { id: "family", label: "Family / status" },
        ]}
        onChange={(kind) =>
          onChange({
            ...followUps,
            extra: {
              kind,
              amount: followUps.extra?.amount ?? 0,
              note: followUps.extra?.note ?? "",
            },
          })
        }
      />
      {followUps.extra?.kind === "donation" ? (
        <Field label="Amount (€)">
          <Input
            type="number"
            min={1}
            step={1}
            inputMode="decimal"
            value={followUps.extra.amount || ""}
            onChange={(event) =>
              onChange({
                ...followUps,
                extra: {
                  kind: "donation",
                  amount: Number(event.target.value),
                  note: followUps.extra?.note ?? "",
                },
              })
            }
          />
        </Field>
      ) : null}
      {followUps.extra?.kind === "family" ? (
        <Field label="What changed (optional)">
          <Input
            value={followUps.extra.note}
            onChange={(event) =>
              onChange({
                ...followUps,
                extra: {
                  kind: "family",
                  amount: 0,
                  note: event.target.value,
                },
              })
            }
          />
        </Field>
      ) : null}
    </>
  );
}

export function ExpenseFields({
  draft,
  onChange,
  kinds,
}: {
  draft: ExpenseDraft;
  onChange: (draft: ExpenseDraft) => void;
  kinds: { id: ExpenseDraft["kind"]; label: string }[];
}) {
  return (
    <>
      <Field label="What">
        <Input
          placeholder="Laptop"
          value={draft.label}
          onChange={(event) =>
            onChange({ ...draft, label: event.target.value })
          }
        />
      </Field>
      <Field label="Amount (€)">
        <Input
          type="number"
          min={1}
          step={1}
          inputMode="decimal"
          value={draft.amount || ""}
          onChange={(event) =>
            onChange({ ...draft, amount: Number(event.target.value) })
          }
        />
      </Field>
      <Choice
        label="Kind of cost"
        value={draft.kind}
        options={kinds}
        onChange={(kind) => onChange({ ...draft, kind })}
      />
    </>
  );
}

export function ExpenseForm({
  monthLabel,
  draft,
  onChange,
  onSubmit,
  onDelete,
  submitLabel,
}: {
  monthLabel: string;
  draft: ExpenseDraft;
  onChange: (draft: ExpenseDraft) => void;
  onSubmit: () => void;
  onDelete?: () => void;
  submitLabel?: string;
}) {
  const ready = isExpenseDraftComplete(draft);

  async function attachReceipt(file: File | undefined) {
    if (!file) {
      return;
    }

    const receipt = await readReceiptFile(file);

    if (receipt) {
      onChange({ ...draft, receipt });
    }
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();

        if (ready) {
          onSubmit();
        }
      }}
    >
      <p className="text-sm text-muted-foreground">
        {onDelete
          ? "Update what you filed, or remove it from this year."
          : "Drop it on this year. You can do this after the month is already caught up."}
      </p>
      <ExpenseFields
        draft={draft}
        onChange={onChange}
        kinds={[
          { id: "work_it", label: "Computer / software" },
          { id: "work_other", label: "Other work thing" },
          { id: "donation", label: "Donation" },
        ]}
      />
      <div className="flex flex-col gap-2">
        <Field label="Receipt (optional)">
          {draft.receipt ? (
            <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
              <ReceiptThumbnail
                receipt={draft.receipt}
                onReplace={(receipt) => onChange({ ...draft, receipt })}
                onRemove={() => {
                  const { receipt: _removed, ...rest } = draft;
                  onChange(rest);
                }}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {draft.receipt.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Tap thumbnail to preview, download, or replace
                </p>
              </div>
            </div>
          ) : (
            <Input
              type="file"
              accept="image/*,application/pdf"
              onChange={(event) => {
                void attachReceipt(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          )}
        </Field>
        {!draft.receipt ? (
          <p className="text-xs text-muted-foreground">
            Image or PDF, up to 2 MB. Not required to save.
          </p>
        ) : null}
      </div>
      <div className="-mx-4 mt-2 flex flex-wrap items-center justify-between gap-2 border-t bg-muted/50 px-4 pt-4">
        {onDelete ? (
          <Button type="button" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={!ready}>
          {submitLabel ?? `Save expense · ${monthLabel}`}
        </Button>
      </div>
    </form>
  );
}
