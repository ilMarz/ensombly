"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { submitInvestorInterest } from "./actions";

export function InvestorInterestButton({
  projectId,
  alreadySent,
}: {
  projectId: string;
  alreadySent: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(alreadySent);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const contactInfo = (fd.get("contact_info") as string).trim();
    const message = (fd.get("message") as string).trim();
    if (!contactInfo) return;
    setError(null);
    startTransition(async () => {
      const result = await submitInvestorInterest(projectId, contactInfo, message);
      if (result.error) {
        setError(result.error);
      } else {
        setDone(true);
        setOpen(false);
      }
    });
  };

  if (done) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-medium">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[2]">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Interest sent
      </div>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        className="rounded-full gap-2"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.8]">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        I&apos;m interested as investor
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Express investor interest</DialogTitle>
            <DialogDescription>
              Leave your contact details. The founder will reach out to you directly.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Contact info <span className="text-destructive">*</span>
              </label>
              <input
                name="contact_info"
                required
                placeholder="Email, LinkedIn, Telegram…"
                className="w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Message <span className="font-normal normal-case">(optional)</span>
              </label>
              <textarea
                name="message"
                rows={4}
                placeholder="Tell the founder why you're interested, your background, ticket size…"
                className="w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-1">
              <Button type="button" variant="ghost" className="rounded-full" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending} className="rounded-full">
                {pending ? "Sending…" : "Send interest"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
