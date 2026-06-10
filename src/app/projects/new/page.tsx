"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const STAGES = ["idea", "prototype", "mvp", "growth"];
const SECTORS = [
  "AI / ML", "SaaS", "Fintech", "Healthtech", "Edtech", "Legaltech",
  "Gaming", "Open Source", "Hardware", "E-commerce", "Other",
];

export default function NewProjectPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const stack = form.stack.split(",").map((s) => s.trim()).filter(Boolean);

    const { data, error } = await supabase
      .from("projects")
      .insert({ ...form, stack, founder_id: user.id })
      .select()
      .single();

    if (error) { setError(error.message); setLoading(false); return; }

    // Add founder as member
    await supabase.from("project_members").insert({
      project_id: data.id,
      user_id: user.id,
      role: "founder",
    });

    router.push(`/projects/${data.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Publish a project</h1>
      <p className="text-muted-foreground mb-8">Tell the world what you're building</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Project name *">
          <input
            required
            value={form.title}
            onChange={set("title")}
            className="input"
            placeholder="e.g. AI Contract Analyzer"
          />
        </Field>

        <Field label="Tagline *">
          <input
            required
            value={form.tagline}
            onChange={set("tagline")}
            className="input"
            placeholder="One sentence that explains your project"
            maxLength={120}
          />
        </Field>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={set("description")}
            className="input min-h-[120px] resize-y"
            placeholder="What are you building? What problem does it solve?"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Stage">
            <select value={form.stage} onChange={set("stage")} className="input">
              {STAGES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </Field>

          <Field label="Sector">
            <select value={form.sector} onChange={set("sector")} className="input">
              <option value="">Select sector</option>
              {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Tech stack" hint="Comma-separated: Next.js, Python, Supabase">
          <input
            value={form.stack}
            onChange={set("stack")}
            className="input"
            placeholder="React, Node.js, PostgreSQL"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Website">
            <input value={form.website_url} onChange={set("website_url")} className="input" placeholder="https://" />
          </Field>
          <Field label="GitHub">
            <input value={form.github_url} onChange={set("github_url")} className="input" placeholder="https://github.com/..." />
          </Field>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Publishing..." : "Publish project"}
        </Button>
      </form>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}
