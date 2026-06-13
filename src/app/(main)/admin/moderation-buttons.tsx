"use client";

import { useTransition } from "react";
import { clearProjectFlag, deleteProject } from "./actions";

export function ClearFlagButton({ projectId }: { projectId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      onClick={() => startTransition(() => clearProjectFlag(projectId))}
      disabled={isPending}
      className="text-xs font-medium text-emerald-300 border border-emerald-700/40 px-2.5 py-0.5 rounded-full hover:bg-emerald-900/20 transition-colors disabled:opacity-50"
    >
      {isPending ? "…" : "Clear flag"}
    </button>
  );
}

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      onClick={() => {
        if (!confirm("Permanently delete this project?")) return;
        startTransition(() => deleteProject(projectId));
      }}
      disabled={isPending}
      className="text-xs font-medium text-red-300 border border-red-700/40 px-2.5 py-0.5 rounded-full hover:bg-red-900/20 transition-colors disabled:opacity-50"
    >
      {isPending ? "…" : "Delete"}
    </button>
  );
}
