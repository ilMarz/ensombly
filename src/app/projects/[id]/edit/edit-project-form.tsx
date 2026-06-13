"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateProject } from "../actions";

const STAGES = [
  { value: "idea", label: "Idea", desc: "Just a concept" },
  { value: "prototype", label: "Prototype", desc: "Something to show" },
  { value: "mvp", label: "MVP", desc: "Live & testable" },
  { value: "growth", label: "Growth", desc: "Scaling up" },
];

const SECTORS = [
  "AI / ML", "SaaS", "Fintech", "Healthtech", "Edtech", "Legaltech",
  "Gaming", "Open Source", "Hardware", "E-commerce", "Other",
];

type ProjectData = {
  id: string;
  title: string;
  tagline: string | null;
  description: string | null;
  stage: string | null;
  sector: string | null;
  stack: string[] | null;
  website_url: string | null;
  github_url: string | null;
};

export function EditProjectForm({ project }: { project: ProjectData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: project.title,
    tagline: project.tagline ?? "",
    description: project.description ?? "",
    stage: project.stage ?? "idea",
    sector: project.sector ?? "",
    stack: (project.stack ?? []).join(", "),
    website_url: project.website_url ?? "",
    github_url: project.github_url ?? "",
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    formData.set("stage", form.stage);
    startTransition(async () => {
      const result = await updateProject(project.id, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push(`/projects/${project.id}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-3 block">Stage</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STAGES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, stage: s.value }))}
              className={`border rounded p-3 text-left transition-all ${
                form.stage === s.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <p className="text-sm font-medium">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <Field label="Project name *">
        <input required name="title" value={form.title} onChange={set("title")} className="input" />
      </Field>

      <Field label="Tagline *" hint="One sentence (max 120 chars)">
        <input required name="tagline" value={form.tagline} onChange={set("tagline")} className="input" maxLength={120} />
        <p className="text-xs text-muted-foreground text-right mt-1">{form.tagline.length}/120</p>
      </Field>

      <Field label="Description">
        <textarea name="description" value={form.description} onChange={set("description")} className="input min-h-[120px] resize-y" />
      </Field>

      <Field label="Sector">
        <select name="sector" value={form.sector} onChange={set("sector")} className="input">
          <option value="">Select sector</option>
          {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>

      <Field label="Tech stack" hint="Comma-separated technologies">
        <input name="stack" value={form.stack} onChange={set("stack")} className="input" placeholder="Next.js, Python, Supabase" />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Website">
          <input name="website_url" value={form.website_url} onChange={set("website_url")} className="input" placeholder="https://" />
        </Field>
        <Field label="GitHub">
          <input name="github_url" value={form.github_url} onChange={set("github_url")} className="input" placeholder="https://github.com/..." />
        </Field>
      </div>

      {error && (
        <div className="border border-destructive/30 bg-destructive/5 text-destructive text-sm rounded px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="rounded-full flex-1 sm:flex-none sm:px-8" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="rounded-full flex-1 sm:flex-none sm:px-8 shadow-lg shadow-primary/20">
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Saving…
            </span>
          ) : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}
