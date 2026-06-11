"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

const STAGES = { idea: "Idea", prototype: "Prototype", mvp: "MVP", growth: "Growth" };
const STAGE_STYLES: Record<string, string> = {
  idea: "text-amber-700 bg-amber-50 ring-1 ring-amber-200",
  prototype: "text-sky-700 bg-sky-50 ring-1 ring-sky-200",
  mvp: "text-violet-700 bg-violet-50 ring-1 ring-violet-200",
  growth: "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200",
};

type Project = {
  id: string;
  title: string;
  tagline: string | null;
  stage: string | null;
  sector: string | null;
  stack: string[] | null;
  profiles: { username: string | null; full_name: string | null } | null;
  project_roles: { id: string; is_open: boolean | null }[] | null;
};

export function ProjectsList({ projects, initialQuery = "" }: { projects: Project[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => { setQuery(initialQuery); }, [initialQuery]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => {
      const textMatch =
        p.title.toLowerCase().includes(q) ||
        (p.tagline ?? "").toLowerCase().includes(q) ||
        (p.sector ?? "").toLowerCase().includes(q);
      const stackMatch = (p.stack ?? []).some((s) => s.toLowerCase().includes(q));
      return textMatch || stackMatch;
    });
  }, [query, projects]);

  return (
    <div className="space-y-8">
      {query && (
        <p className="text-sm text-muted-foreground -mt-4">
          {filtered.length === 0
            ? "No projects found"
            : `${filtered.length} project${filtered.length === 1 ? "" : "s"} found`}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-border rounded-xl bg-card">
          <p className="text-3xl mb-4">—</p>
          <p className="font-heading font-semibold text-base mb-1">No results for &ldquo;{query}&rdquo;</p>
          <p className="text-muted-foreground text-sm">Try a different technology or keyword</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => {
            const openRoles = project.project_roles?.filter((r) => r.is_open === true).length ?? 0;
            const stageStyle = STAGE_STYLES[project.stage ?? "idea"] ?? STAGE_STYLES.idea;
            const matchedStack = query
              ? (project.stack ?? []).filter((s) => s.toLowerCase().includes(query.toLowerCase()))
              : [];
            return (
              <Link key={project.id} href={`/projects/${project.id}`} className="group">
                <div className="relative border border-border rounded-xl p-5 h-full flex flex-col bg-card hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-px transition-all duration-200">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h2 className="font-heading font-semibold text-base leading-snug group-hover:text-primary transition-colors">
                      {project.title}
                    </h2>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${stageStyle}`}>
                      {STAGES[project.stage as keyof typeof STAGES] ?? project.stage}
                    </span>
                  </div>

                  {project.tagline && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3 flex-1">
                      {project.tagline}
                    </p>
                  )}

                  {matchedStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {matchedStack.map((s) => (
                        <span key={s} className="text-[10px] bg-primary/8 text-primary rounded-full px-2.5 py-0.5 font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto pt-3 border-t border-border">
                    {project.sector && (
                      <span className="bg-secondary rounded-full px-2.5 py-0.5 text-[10px] font-medium">
                        {project.sector}
                      </span>
                    )}
                    {openRoles > 0 && (
                      <span className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 rounded-full px-2.5 py-0.5 text-[10px] font-semibold">
                        {openRoles} open
                      </span>
                    )}
                    <span className="ml-auto truncate text-muted-foreground/60 text-[10px]">
                      {project.profiles?.full_name ?? project.profiles?.username}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
