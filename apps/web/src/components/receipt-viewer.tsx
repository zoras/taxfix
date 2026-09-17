import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { downloadReceipt, readReceiptFile, type ExpenseReceipt } from "@/lib/check-in";
import { cn } from "@/lib/utils";

function ReceiptPreview({ receipt, className }: { receipt: ExpenseReceipt; className?: string }) {
  if (receipt.mimeType.startsWith("image/")) {
    return (
      <img src={receipt.dataUrl} alt={receipt.name} className={cn("object-contain", className)} />
    );
  }

  return (
    <iframe title={receipt.name} src={receipt.dataUrl} className={cn("bg-background", className)} />
  );
}

function ReceiptThumbFace({ receipt, size }: { receipt: ExpenseReceipt; size: "sm" | "md" }) {
  const box = size === "sm" ? "size-10" : "size-16";

  if (receipt.mimeType.startsWith("image/")) {
    return <img src={receipt.dataUrl} alt="" className={cn(box, "object-cover")} />;
  }

  return (
    <span
      className={cn(
        box,
        "flex items-center justify-center text-[9px] font-medium uppercase tracking-wide text-muted-foreground",
        size === "md" && "text-[10px]",
      )}
    >
      PDF
    </span>
  );
}

export function ReceiptThumbnail({
  receipt,
  size = "md",
  onReplace,
  onRemove,
}: {
  receipt: ExpenseReceipt;
  size?: "sm" | "md";
  onReplace: (receipt: ExpenseReceipt) => void;
  onRemove?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function replaceFromInput(file: File | undefined) {
    if (!file) {
      return;
    }

    const next = await readReceiptFile(file);

    if (next) {
      onReplace(next);
    }
  }

  return (
    <>
      <button
        type="button"
        className="shrink-0 overflow-hidden rounded-md border bg-background"
        aria-label={`Open receipt ${receipt.name}`}
        onClick={() => setOpen(true)}
      >
        <ReceiptThumbFace receipt={receipt} size={size} />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="z-[60] flex max-h-[min(90vh,44rem)] flex-col overflow-hidden sm:max-w-lg"
          overlayClassName="z-[60]"
        >
          <DialogHeader>
            <DialogTitle className="pr-8">{receipt.name}</DialogTitle>
            <DialogDescription>Preview, download, or replace this receipt.</DialogDescription>
          </DialogHeader>
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border bg-muted/30 p-2">
            <ReceiptPreview
              receipt={receipt}
              className="max-h-[min(50vh,28rem)] w-full rounded-md"
            />
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,application/pdf"
            className="sr-only"
            onChange={(event) => {
              void replaceFromInput(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <DialogFooter className="sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => downloadReceipt(receipt)}>
                Download
              </Button>
              <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                Replace
              </Button>
              {onRemove ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    onRemove();
                    setOpen(false);
                  }}
                >
                  Remove
                </Button>
              ) : null}
            </div>
            <Button type="button" onClick={() => setOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
