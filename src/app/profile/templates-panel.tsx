"use client";

import { useTransition } from "react";
import { deleteApplicationTemplate } from "./actions";

type Template = {
  id: string;
  title: string;
  body: string;
  created_at: string | null;
};

export function TemplatesPanel({ templates }: { templates: Template[] }) {
  if (templates.length === 0) return null;

  return (
    <section>
      <h2 className="font-semibold text-base mb-3">
        Application templates{" "}
        <span className="text-xs font-normal text-muted-foreground ml-1">({templates.length})</span>
      </h2>
      <div className="space-y-2">
        {templates.map((t) => (
          <TemplateRow key={t.id} template={t} />
        ))}
      </div>
    </section>
  );
}

function TemplateRow({ template }: { template: Template }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-start justify-between bg-card border border-border rounded-xl px-4 py-3 shadow-sm shadow-black/20 gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{template.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{template.body}</p>
      </div>
      <button
        onClick={() => startTransition(() => deleteApplicationTemplate(template.id))}
        disabled={isPending}
        className="text-xs text-muted-foreground hover:text-destructive transition-colors shrink-0 mt-0.5"
      >
        {isPending ? "…" : "Delete"}
      </button>
    </div>
  );
}
