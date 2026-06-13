"use client";

import { useState, useTransition } from "react";
import { reportProject } from "./actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ReportButton({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    startTransition(async () => {
      await reportProject(projectId, reason);
      setDone(true);
      setOpen(false);
    });
  };

  if (done) {
    return <span className="text-xs text-muted-foreground">Report submitted</span>;
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-muted-foreground hover:text-destructive transition-colors"
      >
        Report
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Report this project</DialogTitle>
            <DialogDescription>
              Let us know why this project violates our community guidelines.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-sm border border-border rounded-lg p-3 resize-none h-24 bg-background"
              placeholder="Describe the issue (spam, duplicate, inappropriate content…)"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={submit}
                disabled={isPending}
              >
                {isPending ? "Submitting…" : "Submit report"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
