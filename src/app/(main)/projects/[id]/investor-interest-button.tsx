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
import { PlanLimitBadge } from "@/components/plan-limit-badge";
import type { PlanLimitInfo } from "@/components/plan-limit-badge";

export function InvestorInterestButton({
  projectId,
  alreadySent,
  limitInfo,
}: {
  projectId: string;
  alreadySent: boolean;
  limitInfo?: PlanLimitInfo;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(alreadySent);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") as string).trim();
    const phone = (fd.get("phone") as string).trim();
    const message = (fd.get("message") as string).trim();
    if (!email && !phone) {
      setError("Provide at least an email or a phone number.");
      return;
    }
    const contactInfo = [email && `Email: ${email}`, phone && `Phone: ${phone}`].filter(Boolean).join(" | ");
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
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/25 text-emerald-300 ring-1 ring-emerald-700/40 text-sm font-medium">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[2]">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Interest sent
      </div>
    );
  }

  const atLimit = limitInfo && !limitInfo.allowed;

  return (
    <>
      <div className="flex flex-col items-start gap-1.5">
        <Button
          variant="outline"
          className="rounded-full gap-2"
          onClick={() => !atLimit && setOpen(true)}
          disabled={!!atLimit}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.8]">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          I&apos;m interested as investor
        </Button>
        {limitInfo && <PlanLimitBadge info={limitInfo} />}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Express investor interest</DialogTitle>
            <DialogDescription>
              Leave your contact details. The founder will reach out to you directly.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">At least one contact method required.</p>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="+39 333 000 0000"
                  className="w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
                />
              </div>
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
