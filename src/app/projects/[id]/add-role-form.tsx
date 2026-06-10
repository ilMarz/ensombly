"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { addProjectRole } from "./actions";

const COMPENSATION = [
  { value: "equity", label: "Equity" },
  { value: "revenue_share", label: "Revenue share" },
  { value: "voluntary", label: "Voluntary" },
  { value: "paid", label: "Paid" },
];

export function AddRoleForm({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await addProjectRole(projectId, formData);
      if (result.error) {
        setError(result.error);
      } else {
        setOpen(false);
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full border border-dashed border-border/70 rounded-2xl p-4 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/3 transition-all flex items-center justify-center gap-2"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[2]">
          <circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" strokeLinecap="round" />
        </svg>
        Add a role
      </button>
    );
  }

  return (
    <div className="border border-primary/30 rounded-2xl p-5 bg-primary/3 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">New role</h3>
        <button
          type="button"
          onClick={() => { setOpen(false); setError(null); }}
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[2]">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Title *</label>
          <input
            name="title"
            required
            placeholder="e.g. Full-Stack Engineer"
            className="w-full rounded-xl border border-border/60 bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</label>
          <textarea
            name="description"
            rows={2}
            placeholder="What will this person do?"
            className="w-full rounded-xl border border-border/60 bg-background px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Skills <span className="normal-case font-normal">(comma separated)</span></label>
          <input
            name="skills"
            placeholder="React, TypeScript, Node.js…"
            className="w-full rounded-xl border border-border/60 bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">h/week</label>
            <input
              name="commitment_hours"
              type="number"
              min={1}
              max={80}
              placeholder="10"
              className="w-full rounded-xl border border-border/60 bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Compensation</label>
            <select
              name="compensation_type"
              className="w-full rounded-xl border border-border/60 bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
            >
              <option value="">—</option>
              {COMPENSATION.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={() => { setOpen(false); setError(null); }}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={pending} className="rounded-full px-5">
            {pending ? "Adding…" : "Add role"}
          </Button>
        </div>
      </form>
    </div>
  );
}
