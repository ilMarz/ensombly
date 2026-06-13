"use client";

import { useTransition } from "react";
import { refreshGithubStats } from "./actions";

export function RefreshGithubButton({
  projectId,
  lastRefreshed,
}: {
  projectId: string;
  lastRefreshed: string | null;
}) {
  const [isPending, startTransition] = useTransition();

  const handle = () => {
    startTransition(() => refreshGithubStats(projectId));
  };

  return (
    <button
      onClick={handle}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground border border-border px-3 py-1 rounded-full hover:border-primary/40 transition-colors disabled:opacity-50"
    >
      <svg
        viewBox="0 0 24 24"
        className={`w-3 h-3 fill-none stroke-current stroke-[2] ${isPending ? "animate-spin" : ""}`}
      >
        <path d="M1 4v6h6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.51 15a9 9 0 1 0 .49-4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {isPending
        ? "Refreshing…"
        : lastRefreshed
          ? `Last synced ${new Date(lastRefreshed).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
          : "Refresh stats"}
    </button>
  );
}
