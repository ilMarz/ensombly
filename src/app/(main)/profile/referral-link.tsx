"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

export function ReferralLink({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);

  const refUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${username}`;

  const copy = async () => {
    await navigator.clipboard.writeText(refUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section>
      <h2 className="font-semibold text-base mb-3">Referral link</h2>
      <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-sm shadow-black/20">
        <p className="text-xs text-muted-foreground mb-2">
          Share this link. Anyone who signs up via it will be linked to your profile.
        </p>
        <div className="flex items-center gap-2">
          <span className="flex-1 text-xs font-mono text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 truncate">
            {refUrl}
          </span>
          <button
            onClick={copy}
            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 border border-border rounded-lg hover:border-primary/40 hover:text-primary transition-colors"
          >
            {copied
              ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!</>
              : <><Link2 className="w-3.5 h-3.5" /> Copy</>
            }
          </button>
        </div>
      </div>
    </section>
  );
}
