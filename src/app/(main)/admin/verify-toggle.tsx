"use client";

import { useTransition } from "react";
import { toggleVerified } from "./actions";

export function VerifyToggle({
  userId,
  isVerified,
}: {
  userId: string;
  isVerified: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => toggleVerified(userId, !isVerified))}
      disabled={isPending}
      className={`text-xs font-medium px-2.5 py-0.5 rounded-full transition-colors disabled:opacity-50 ${
        isVerified
          ? "bg-sky-900/25 text-sky-300 ring-1 ring-sky-700/40 hover:bg-sky-900/40"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {isPending ? "…" : isVerified ? "✓ Verified" : "Verify"}
    </button>
  );
}
