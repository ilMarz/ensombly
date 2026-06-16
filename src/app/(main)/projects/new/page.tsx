"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { checkDuplicates } from "../actions";
import { createProject } from "./actions";

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

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  type Duplicate = { id: string; title: string; sector: string | null; founderName: string };
  const [duplicates, setDuplicates] = useState<Duplicate[]>([]);
  const [showDupDialog, setShowDupDialog] = useState(false);
  const [form, setForm] = useState({
    title: "",
    tagline: "",
    description: "",
    stage: "idea",
    sector: "",
    stack: "",
    website_url: "",
    github_url: "",
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const doInsert = async () => {
    setLoading(true);
    setError("");
    const stack = form.stack.split(",").map((s) => s.trim()).filter(Boolean);
    const result = await createProject({ ...form, stack });
    if ("error" in result) { setError(result.error); setLoading(false); return; }
    router.push(`/projects/${result.projectId}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const dups = await checkDuplicates(form.title, form.sector);
    setLoading(false);
    if (dups.length > 0) {
      setDuplicates(dups);
      setShowDupDialog(true);
      return;
    }
    await doInsert();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Publish a project</h1>
        <p className="text-muted-foreground">Tell the world what you&apos;re building</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stage selector */}
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
          <input
            required
            value={form.title}
            onChange={set("title")}
            className="input"
            placeholder="e.g. AI Contract Analyzer"
          />
        </Field>

        <Field label="Tagline *" hint="One sentence that captures what you're building (max 120 chars)">
          <input
            required
            value={form.tagline}
            onChange={set("tagline")}
            className="input"
            placeholder="Automate legal review with AI — save 80% of lawyer time"
            maxLength={120}
          />
          <p className="text-xs text-muted-foreground text-right mt-1">{form.tagline.length}/120</p>
        </Field>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={set("description")}
            className="input min-h-[120px] resize-y"
            placeholder="What are you building? What problem does it solve? Who is it for?"
          />
        </Field>

        <Field label="Sector">
          <select value={form.sector} onChange={set("sector")} className="input">
            <option value="">Select sector</option>
            {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>

        <Field label="Tech stack" hint="Comma-separated technologies">
          <input
            value={form.stack}
            onChange={set("stack")}
            className="input"
            placeholder="Next.js, Python, Supabase, OpenAI"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Website">
            <input value={form.website_url} onChange={set("website_url")} className="input" placeholder="https://" />
          </Field>
          <Field label="GitHub">
            <input value={form.github_url} onChange={set("github_url")} className="input" placeholder="https://github.com/..." />
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
          <Button type="submit" disabled={loading} className="rounded-full flex-1 sm:flex-none sm:px-8 shadow-lg shadow-primary/20">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Publishing…
              </span>
            ) : "Publish project"}
          </Button>
        </div>
      </form>

      {/* Duplicate warning dialog */}
      {showDupDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h2 className="font-semibold text-base">Similar projects found</h2>
            <p className="text-sm text-muted-foreground">
              These projects have a similar name. Are you sure you want to publish a new one?
            </p>
            <ul className="space-y-2">
              {duplicates.map((d) => (
                <li key={d.id} className="flex items-center justify-between text-sm border border-border rounded-lg px-3 py-2">
                  <span className="font-medium">{d.title}</span>
                  <span className="text-xs text-muted-foreground">{d.founderName}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 justify-end pt-1">
              <Button variant="outline" onClick={() => setShowDupDialog(false)}>Cancel</Button>
              <Button
                onClick={() => { setShowDupDialog(false); doInsert(); }}
                disabled={loading}
                className="shadow-lg shadow-primary/20"
              >
                Publish anyway
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
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
