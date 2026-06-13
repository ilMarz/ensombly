"use client";

import { useState, useTransition } from "react";
import { archiveProject, unarchiveProject } from "./actions";

export function ArchiveButton({
  projectId,
  isArchived,
}: {
  projectId: string;
  isArchived: boolean;
}) {
  const [confirm, setConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handle = () => {
    startTransition(async () => {
      if (isArchived) {
        await unarchiveProject(projectId);
      } else {
        await archiveProject(projectId);
      }
      setConfirm(false);
    });
  };

  if (isArchived) {
    return (
      <button
        onClick={() => startTransition(() => { void unarchiveProject(projectId); })}
        disabled={isPending}
        className="text-xs font-medium text-muted-foreground border border-border px-4 py-1.5 rounded-full hover:border-primary/40 hover:text-foreground transition-colors disabled:opacity-50"
      >
        {isPending ? "Unarchiving…" : "Unarchive project"}
      </button>
    );
  }

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        className="text-xs font-medium text-muted-foreground border border-border px-4 py-1.5 rounded-full hover:border-destructive/40 hover:text-destructive transition-colors"
      >
        Archive project
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Archive this project?</span>
      <button
        onClick={handle}
        disabled={isPending}
        className="text-xs font-semibold text-destructive border border-destructive/30 px-3 py-1 rounded-full hover:bg-destructive/5 transition-colors disabled:opacity-50"
      >
        {isPending ? "Archiving…" : "Yes, archive"}
      </button>
      <button
        onClick={() => setConfirm(false)}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}
