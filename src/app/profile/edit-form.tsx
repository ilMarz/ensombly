"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { updateProfile } from "./actions";
import type { Database } from "@/lib/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function EditForm({ profile }: { profile: Profile }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSaved(false);
    setError(null);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) setError(result.error);
      else setSaved(true);
    });
  };

  return (
    <section>
      <h2 className="font-semibold text-base mb-4">Edit profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Full name</label>
            <input
              name="full_name"
              defaultValue={profile.full_name ?? ""}
              className="w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Username</label>
            <input
              name="username"
              defaultValue={profile.username}
              required
              className="w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bio</label>
          <textarea
            name="bio"
            defaultValue={profile.bio ?? ""}
            rows={3}
            placeholder="Tell the community about yourself..."
            className="w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Skills <span className="normal-case font-normal">(comma separated)</span></label>
          <input
            name="skills"
            defaultValue={(profile.skills ?? []).join(", ")}
            placeholder="React, TypeScript, Product Design..."
            className="w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Looking for</label>
            <select
              name="looking_for"
              defaultValue={profile.looking_for ?? "both"}
              className="w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
            >
              <option value="both">Both</option>
              <option value="project_to_join">A project to join</option>
              <option value="team_for_my_project">Team for my project</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Availability (h/week)</label>
            <input
              name="availability_hours"
              type="number"
              min={0}
              max={80}
              defaultValue={profile.availability_hours ?? 0}
              className="w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "github_url", label: "GitHub URL", value: profile.github_url },
            { name: "linkedin_url", label: "LinkedIn URL", value: profile.linkedin_url },
            { name: "website_url", label: "Website URL", value: profile.website_url },
          ].map(({ name, label, value }) => (
            <div key={name} className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
              <input
                name={name}
                defaultValue={value ?? ""}
                placeholder="https://"
                className="w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" disabled={pending} className="rounded-full px-5">
            {pending ? "Saving…" : "Save changes"}
          </Button>
          {saved && <span className="text-sm text-green-600 dark:text-green-400">Saved ✓</span>}
          {error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
        </div>
      </form>
    </section>
  );
}
