"use client";

import { useState } from "react";
import { Check, Code2 } from "lucide-react";

export function EmbedCodeSection({ projectId }: { projectId: string }) {
  const [copied, setCopied] = useState(false);

  const siteUrl = typeof window !== "undefined"
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_SITE_URL ?? "");
  const embedUrl = `${siteUrl}/embed/project/${projectId}`;
  const snippet = `<iframe src="${embedUrl}" width="360" height="120" style="border:none;border-radius:12px;" loading="lazy" title="Ensombly project"></iframe>`;

  const copy = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section>
      <h2 className="font-semibold text-base mb-3 flex items-center gap-2">
        <Code2 className="w-4 h-4 text-muted-foreground" />
        Embed widget
      </h2>
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm shadow-black/20 space-y-3">
        <p className="text-xs text-muted-foreground">Paste this snippet anywhere to embed your project card.</p>
        <div className="relative">
          <pre className="text-[10px] font-mono bg-muted/40 rounded-lg px-3 py-2.5 overflow-x-auto text-muted-foreground whitespace-pre-wrap break-all leading-relaxed">
            {snippet}
          </pre>
          <button
            onClick={copy}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-card border border-border hover:border-primary/40 transition-colors"
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-emerald-400" />
              : <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.8] text-muted-foreground"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" /></svg>
            }
          </button>
        </div>
      </div>
    </section>
  );
}
