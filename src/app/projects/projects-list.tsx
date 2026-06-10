"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const STAGES = { idea: "Idea", prototype: "Prototype", mvp: "MVP", growth: "Growth" };
const STAGE_COLORS: Record<string, string> = {
  idea: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  prototype: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  mvp: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  growth: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
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

export function ProjectsList({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");

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
      {/* Search bar */}
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 fill-none stroke-current stroke-[1.8] text-muted-foreground pointer-events-none"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, sector, technology…"
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border/60 bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[2]">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Results count when searching */}
      {query && (
        <p className="text-sm text-muted-foreground -mt-4">
          {filtered.length === 0
            ? "No projects found"
            : `${filtered.length} project${filtered.length === 1 ? "" : "s"} found`}
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="font-semibold text-lg mb-1">No results for &ldquo;{query}&rdquo;</p>
          <p className="text-muted-foreground text-sm">Try a different technology or keyword</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => {
            const openRoles = project.project_roles?.filter((r) => r.is_open === true).length ?? 0;
            const stageColor = STAGE_COLORS[project.stage ?? "idea"] ?? STAGE_COLORS.idea;
            const matchedStack = query
              ? (project.stack ?? []).filter((s) => s.toLowerCase().includes(query.toLowerCase()))
              : [];
            return (
              <Link key={project.id} href={`/projects/${project.id}`} className="group">
                <div className="relative border border-border/60 rounded-2xl p-5 h-full flex flex-col bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h2 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors">
                      {project.title}
                    </h2>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${stageColor}`}>
                      {STAGES[project.stage as keyof typeof STAGES] ?? project.stage}
                    </span>
                  </div>

                  {project.tagline && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3 flex-1">
                      {project.tagline}
                    </p>
                  )}

                  {/* Highlight matched stack tags */}
                  {matchedStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {matchedStack.map((s) => (
                        <span key={s} className="text-xs bg-primary/10 text-primary rounded-full px-2.5 py-0.5 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto pt-3 border-t border-border/50">
                    {project.sector && (
                      <span className="bg-muted rounded-full px-2 py-0.5">{project.sector}</span>
                    )}
                    {openRoles > 0 && (
                      <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full px-2 py-0.5 font-medium">
                        {openRoles} open
                      </span>
                    )}
                    <span className="ml-auto truncate">
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
