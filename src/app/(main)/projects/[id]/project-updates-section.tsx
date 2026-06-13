"use client";

import { useState, useTransition } from "react";
import { postProjectUpdate, deleteProjectUpdate } from "./actions";

type Update = {
  id: string;
  title: string;
  body: string | null;
  created_at: string | null;
};

export function ProjectUpdatesSection({
  projectId,
  updates,
  isFounder,
}: {
  projectId: string;
  updates: Update[];
  isFounder: boolean;
}) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPending, startTransition] = useTransition();

  const handlePost = () => {
    if (!title.trim()) return;
    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("body", body.trim());
    startTransition(async () => {
      await postProjectUpdate(projectId, fd);
      setTitle("");
      setBody("");
      setShowForm(false);
    });
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-base">
          Updates
          {updates.length > 0 && (
            <span className="text-xs font-normal text-muted-foreground ml-1">({updates.length})</span>
          )}
        </h2>
        {isFounder && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            + Post update
          </button>
        )}
      </div>

      {isFounder && showForm && (
        <div className="bg-card border border-border rounded-xl p-4 mb-3 space-y-3 shadow-sm shadow-black/20">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input text-sm"
            placeholder="Update title"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="input text-sm min-h-[80px] resize-y"
            placeholder="What's new? Milestones, pivots, launches…"
          />
          <div className="flex gap-2">
            <button
              onClick={handlePost}
              disabled={isPending || !title.trim()}
              className="text-xs font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isPending ? "Posting…" : "Post"}
            </button>
            <button
              onClick={() => { setShowForm(false); setTitle(""); setBody(""); }}
              className="text-xs font-medium text-muted-foreground hover:text-foreground px-3 py-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {updates.length === 0 && !showForm ? (
        <div className="border border-dashed border-border rounded-xl p-6 text-center">
          <p className="text-sm text-muted-foreground">No updates posted yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {updates.map((u) => (
            <UpdateCard key={u.id} update={u} projectId={projectId} isFounder={isFounder} />
          ))}
        </div>
      )}
    </section>
  );
}

function UpdateCard({
  update,
  projectId,
  isFounder,
}: {
  update: Update;
  projectId: string;
  isFounder: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(() => { void deleteProjectUpdate(update.id, projectId); });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{update.title}</p>
          {update.body && (
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed whitespace-pre-wrap">{update.body}</p>
          )}
          {update.created_at && (
            <p className="text-[11px] text-muted-foreground mt-2">
              {new Date(update.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          )}
        </div>
        {isFounder && (
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-[11px] text-muted-foreground hover:text-destructive transition-colors shrink-0 mt-0.5"
          >
            {isPending ? "…" : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
}
