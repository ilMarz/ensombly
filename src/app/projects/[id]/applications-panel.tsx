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
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : optimisticStatus === "rejected"
        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";

  return (
    <div className={`border border-border/60 rounded-xl p-4 transition-opacity ${isPending ? "opacity-60" : ""}`}>
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
              className="rounded-full text-xs border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
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
