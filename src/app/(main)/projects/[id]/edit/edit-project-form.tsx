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

const THEME_PRESETS = [
  { label: "Cosmic",  color: "#7c3aed" },
  { label: "Ember",   color: "#d97706" },
  { label: "Tide",    color: "#0891b2" },
  { label: "Grove",   color: "#059669" },
  { label: "Rose",    color: "#db2777" },
  { label: "Steel",   color: "#475569" },
  { label: "Solar",   color: "#dc2626" },
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
  accent_color?: string | null;
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
    accent_color: project.accent_color ?? "#7c3aed",
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

      <Field label="Project theme" hint="Sets the accent colour on your public project page">
        <input type="hidden" name="accent_color" value={form.accent_color} />
        <div className="flex flex-wrap gap-3 mt-1">
          {THEME_PRESETS.map((p) => (
            <button
              key={p.color}
              type="button"
              onClick={() => setForm((f) => ({ ...f, accent_color: p.color }))}
              title={p.label}
              className="flex flex-col items-center gap-1.5 group"
            >
              <span
                className="block w-9 h-9 rounded-full transition-all duration-150"
                style={{
                  background: p.color,
                  boxShadow: form.accent_color === p.color
                    ? `0 0 0 3px var(--background), 0 0 0 5px ${p.color}`
                    : "none",
                  transform: form.accent_color === p.color ? "scale(1.1)" : "scale(1)",
                }}
              />
              <span className="text-[9px] text-muted-foreground">{p.label}</span>
            </button>
          ))}
          <div className="flex flex-col items-center gap-1.5">
            <label
              className="block w-9 h-9 rounded-full cursor-pointer border border-border/60 bg-secondary/30 flex items-center justify-center text-muted-foreground text-xs"
              title="Custom colour"
              style={{
                boxShadow: !THEME_PRESETS.some(p => p.color === form.accent_color)
                  ? `0 0 0 3px var(--background), 0 0 0 5px ${form.accent_color}`
                  : "none",
                background: !THEME_PRESETS.some(p => p.color === form.accent_color)
                  ? form.accent_color
                  : undefined,
              }}
            >
              <input
                type="color"
                value={form.accent_color}
                onChange={(e) => setForm((f) => ({ ...f, accent_color: e.target.value }))}
                className="sr-only"
              />
              {THEME_PRESETS.some(p => p.color === form.accent_color) && "＋"}
            </label>
            <span className="text-[9px] text-muted-foreground">Custom</span>
          </div>
        </div>
        <p className="text-xs font-mono text-muted-foreground mt-2">{form.accent_color}</p>
      </Field>

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
