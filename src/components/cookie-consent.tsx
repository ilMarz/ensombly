"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useConsent } from "@/hooks/use-consent";
import { OPEN_SETTINGS_EVENT } from "@/lib/consent";

export function CookieConsent() {
  const { consent, ready, acceptAll, rejectAll, setAnalytics } = useConsent();
  const [open, setOpen] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState(false);

  useEffect(() => {
    const openSettings = () => {
      setAnalyticsChoice(consent?.analytics ?? false);
      setOpen(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, openSettings);
  }, [consent]);

  if (!ready) return null;

  const showBanner = consent === null && !open;

  const savePreferences = () => {
    setAnalytics(analyticsChoice);
    setOpen(false);
  };

  return (
    <>
      {showBanner && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl px-5 sm:px-8 py-4 shadow-lg shadow-black/20">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use strictly necessary cookies to run Ensombly, and optional analytics
                cookies to understand usage. You decide.{" "}
                <Link href="/cookies" className="text-primary hover:text-primary/80 underline underline-offset-2">
                  Cookie &amp; privacy policy
                </Link>
              </p>
            </div>
            <div className="flex gap-2 shrink-0 flex-wrap">
              <Button variant="outline" className="rounded-full" onClick={rejectAll}>
                Reject all
              </Button>
              <Button
                variant="ghost"
                className="rounded-full"
                onClick={() => {
                  setAnalyticsChoice(false);
                  setOpen(true);
                }}
              >
                Customize
              </Button>
              <Button className="rounded-full" onClick={acceptAll}>
                Accept all
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cookie preferences</DialogTitle>
            <DialogDescription>
              Manage how Ensombly uses cookies. Strictly necessary cookies are always on.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            <div className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
              <div>
                <p className="text-sm font-medium">Strictly necessary</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Authentication, session and your consent choice. Cannot be disabled.
                </p>
              </div>
              <ConsentToggle checked disabled />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
              <div>
                <p className="text-sm font-medium">Analytics</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Vercel Analytics — anonymous usage stats. Loads only if enabled.
                </p>
              </div>
              <ConsentToggle
                checked={analyticsChoice}
                onChange={() => setAnalyticsChoice((v) => !v)}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <Button variant="ghost" className="rounded-full" onClick={() => { rejectAll(); setOpen(false); }}>
              Reject all
            </Button>
            <Button variant="outline" className="rounded-full" onClick={savePreferences}>
              Save preferences
            </Button>
            <Button className="rounded-full" onClick={() => { acceptAll(); setOpen(false); }}>
              Accept all
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ConsentToggle({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
        checked ? "bg-primary" : "bg-border"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-background shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
