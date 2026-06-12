"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updateApplicationStatus } from "./actions";

type Application = {
  id: string;
  status: string | null;
  message: string | null;
  created_at: string | null;
  profiles: { username: string | null; full_name: string | null } | null;
  project_roles: { title: string | null } | null;
};

export function ApplicationsPanel({
  applications,
  projectId,
}: {
  applications: Application[];
  projectId: string;
}) {
  const pending = applications.filter((a) => a.status === "pending");
  const decided = applications.filter((a) => a.status !== "pending");

  if (!applications.length) return null;

  return (
    <section className="border-t border-border/60 pt-8">
      <h2 className="font-semibold text-base mb-1">
        Applications
        {pending.length > 0 && (
          <span className="ml-2 text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
            {pending.length} pending
          </span>
        )}
      </h2>
      <p className="text-sm text-muted-foreground mb-5">Visible only to you as founder</p>

      <div className="space-y-3">
        {[...pending, ...decided].map((app) => (
          <ApplicationCard key={app.id} app={app} projectId={projectId} />
        ))}
      </div>
    </section>
  );
}

function ApplicationCard({
  app,
  projectId,
}: {
  app: Application;
  projectId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useState(app.status);

  const handle = (status: "accepted" | "rejected") => {
    setOptimisticStatus(status);
    startTransition(async () => {
      try {
        await updateApplicationStatus(app.id, status, projectId);
      } catch {
        setOptimisticStatus(app.status);
      }
    });
  };

  const name = app.profiles?.full_name ?? app.profiles?.username ?? "Unknown";
  const roleTitle = app.project_roles?.title ?? "Role";

  const statusStyle =
    optimisticStatus === "accepted"
      ? "bg-emerald-900/25 text-emerald-300 ring-1 ring-emerald-700/40"
      : optimisticStatus === "rejected"
        ? "bg-red-900/25 text-red-300 ring-1 ring-red-700/40"
        : "bg-amber-900/25 text-amber-300 ring-1 ring-amber-700/40";

  return (
    <div className={`bg-card border border-border rounded-xl p-4 shadow-sm shadow-black/20 transition-opacity ${isPending ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-sm">{name}</p>
            <span className="text-xs text-muted-foreground">→ {roleTitle}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle}`}>
              {optimisticStatus}
            </span>
          </div>
          {app.message && (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{app.message}</p>
          )}
          {app.created_at && (
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(app.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          )}
        </div>
        {optimisticStatus === "pending" && (
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="rounded-full text-xs border-red-800 text-red-300 hover:bg-red-900/20"
              onClick={() => handle("rejected")}
              disabled={isPending}
            >
              Reject
            </Button>
            <Button
              size="sm"
              className="rounded-full text-xs bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handle("accepted")}
              disabled={isPending}
            >
              Accept
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
