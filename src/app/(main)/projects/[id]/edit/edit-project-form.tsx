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

import { COLOR_PRESETS, HERO_PATTERNS, ROLES_STYLES, type HeroPattern, type RolesStyle } from "../theme-config";

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
  accent_color_2?: string | null;
  hero_pattern?: string | null;
  roles_style?: string | null;
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
    accent_color:   project.accent_color   ?? "#7c3aed",
    accent_color_2: project.accent_color_2 ?? "#4f46e5",
    hero_pattern:   (project.hero_pattern  ?? "none") as HeroPattern,
    roles_style:    (project.roles_style   ?? "border_left") as RolesStyle,
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

      <div className="space-y-6 border border-border/50 rounded-xl p-5 bg-secondary/20">
        <p className="text-sm font-medium">Project theme</p>

        {/* Hidden inputs submitted with form */}
        <input type="hidden" name="accent_color"   value={form.accent_color} />
        <input type="hidden" name="accent_color_2" value={form.accent_color_2} />
        <input type="hidden" name="hero_pattern"   value={form.hero_pattern} />
        <input type="hidden" name="roles_style"    value={form.roles_style} />

        {/* Color pair */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">Colors</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <p className="text-xs font-medium">Primary</p>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <input type="color" value={form.accent_color} onChange={(e) => setForm((f) => ({ ...f, accent_color: e.target.value }))} className="sr-only" />
                  <span className="block w-9 h-9 rounded-xl ring-1 ring-border/60" style={{ background: form.accent_color }} />
                </label>
                <span className="text-[11px] font-mono text-muted-foreground">{form.accent_color}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-medium">Secondary</p>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <input type="color" value={form.accent_color_2} onChange={(e) => setForm((f) => ({ ...f, accent_color_2: e.target.value }))} className="sr-only" />
                  <span className="block w-9 h-9 rounded-xl ring-1 ring-border/60" style={{ background: form.accent_color_2 }} />
                </label>
                <span className="text-[11px] font-mono text-muted-foreground">{form.accent_color_2}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {COLOR_PRESETS.map((p) => (
              <button key={p.label} type="button"
                onClick={() => setForm((f) => ({ ...f, accent_color: p.color, accent_color_2: p.color2 }))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-[10px] text-muted-foreground hover:border-border/80 transition-all"
              >
                <span className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                <span className="w-3 h-3 rounded-full" style={{ background: p.color2 }} />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hero pattern */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">Hero background pattern</p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {(Object.keys(HERO_PATTERNS) as HeroPattern[]).map((key) => {
              const p = HERO_PATTERNS[key];
              const active = form.hero_pattern === key;
              return (
                <button key={key} type="button"
                  onClick={() => setForm((f) => ({ ...f, hero_pattern: key }))}
                  className={`flex flex-col items-center gap-1 transition-all ${active ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
                >
                  <div
                    className={`w-full aspect-square rounded-lg border ${active ? "border-primary" : "border-border"}`}
                    style={{
                      backgroundImage: p.previewBg === "none" ? undefined : p.previewBg,
                      backgroundSize: p.size,
                      backgroundColor: "var(--secondary)",
                      backgroundRepeat: "repeat",
                    }}
                  />
                  <span className="text-[8px] text-muted-foreground">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Role card style */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">Role card style</p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(ROLES_STYLES) as RolesStyle[]).map((key) => {
              const active = form.roles_style === key;
              return (
                <button key={key} type="button"
                  onClick={() => setForm((f) => ({ ...f, roles_style: key }))}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-[10px] text-muted-foreground transition-all ${active ? "border-primary bg-primary/5" : "border-border hover:border-border/80"}`}
                >
                  <div className="w-full h-8 rounded-lg overflow-hidden" style={getRolePreviewStyle(key, form.accent_color)}>
                    <div className="h-1.5 w-2/3 rounded-full bg-white/20 mt-2.5 ml-2" />
                  </div>
                  {ROLES_STYLES[key].label}
                </button>
              );
            })}
          </div>
        </div>
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

function getRolePreviewStyle(key: string, accent: string): React.CSSProperties {
  switch (key) {
    case "filled":    return { background: `color-mix(in srgb, ${accent} 15%, oklch(0.16 0.020 262))`, border: `1px solid color-mix(in srgb, ${accent} 25%, oklch(0.36 0.028 262))` };
    case "gradient":  return { background: `linear-gradient(to right, color-mix(in srgb, ${accent} 20%, transparent), transparent)`, borderLeft: `3px solid ${accent}`, borderTop: "1px solid oklch(0.36 0.028 262)", borderBottom: "1px solid oklch(0.36 0.028 262)", borderRight: "1px solid oklch(0.36 0.028 262)" };
    case "glow":      return { border: "1px solid oklch(0.36 0.028 262)", boxShadow: `0 0 12px color-mix(in srgb, ${accent} 25%, transparent)` };
    case "outline":   return { border: `1.5px solid color-mix(in srgb, ${accent} 55%, transparent)` };
    case "minimal":   return { borderTop: `2px solid ${accent}`, background: "oklch(0.205 0.020 262)" };
    default:          return { borderLeft: `3px solid ${accent}`, borderTop: "1px solid oklch(0.36 0.028 262)", borderBottom: "1px solid oklch(0.36 0.028 262)", borderRight: "1px solid oklch(0.36 0.028 262)" };
  }
}
