"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { connectGithubRepo } from "../actions";

type Repo = {
  id: number;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  default_branch: string;
  private: boolean;
};

type State =
  | { kind: "loading" }
  | { kind: "no-token" }
  | { kind: "error"; message: string }
  | { kind: "ready"; repos: Repo[] };

export default function ConnectGithubPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const supabase = createClient();

  const [state, setState] = useState<State>({ kind: "loading" });
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.provider_token;
      if (!token) {
        if (active) setState({ kind: "no-token" });
        return;
      }
      try {
        const res = await fetch(
          "https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner",
          { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } }
        );
        if (!res.ok) {
          if (active) setState({ kind: "error", message: `GitHub returned ${res.status}. Try reconnecting.` });
          return;
        }
        const repos = (await res.json()) as Repo[];
        if (active) setState({ kind: "ready", repos });
      } catch {
        if (active) setState({ kind: "error", message: "Could not reach GitHub. Try again." });
      }
    })();
    return () => { active = false; };
  }, [supabase]);

  const handleSelect = async (repo: Repo) => {
    setSaving(repo.id);
    setSaveError(null);
    const result = await connectGithubRepo(projectId, {
      full_name: repo.full_name,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count,
      description: repo.description,
      default_branch: repo.default_branch,
    });
    if (result.error) {
      setSaveError(result.error);
      setSaving(null);
      return;
    }
    router.push(`/projects/${projectId}`);
  };

  const reconnect = async () => {
    sessionStorage.setItem("connect-github-project", projectId);
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        scopes: "read:user public_repo",
        redirectTo: `${window.location.origin}/projects/${projectId}/connect-github`,
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Connect a GitHub repository</h1>
        <p className="text-sm text-muted-foreground">
          Pick one of your public repositories to link to this project.
        </p>
      </div>

      {state.kind === "loading" && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading your repositories…
        </div>
      )}

      {state.kind === "no-token" && (
        <div className="border border-border rounded-xl p-6 bg-card space-y-4">
          <p className="text-sm text-muted-foreground">
            The GitHub connection expired or was not granted. Reconnect to pick a repository.
          </p>
          <Button className="rounded-full" onClick={reconnect}>Reconnect GitHub</Button>
        </div>
      )}

      {state.kind === "error" && (
        <div className="border border-border rounded-xl p-6 bg-card space-y-4">
          <p className="text-sm text-destructive">{state.message}</p>
          <Button className="rounded-full" onClick={reconnect}>Reconnect GitHub</Button>
        </div>
      )}

      {state.kind === "ready" && (
        <>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search repositories…"
            className="w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
          />
          {saveError && <p className="text-sm text-destructive">{saveError}</p>}
          {state.repos.length === 0 ? (
            <p className="text-sm text-muted-foreground">No repositories found on your account.</p>
          ) : (
            <ul className="space-y-2">
              {state.repos
                .filter((r) => r.full_name.toLowerCase().includes(query.toLowerCase()))
                .map((repo) => (
                  <li key={repo.id}>
                    <button
                      type="button"
                      disabled={saving !== null}
                      onClick={() => handleSelect(repo)}
                      className="w-full text-left border border-border rounded-xl p-4 bg-card hover:border-primary/40 hover:bg-primary/5 transition-colors duration-150 disabled:opacity-50"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-sm truncate">{repo.full_name}</span>
                        <span className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
                          {repo.private && (
                            <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] uppercase tracking-wide">Private</span>
                          )}
                          <span className="flex items-center gap-1">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.8]">
                              <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6L12 2z" strokeLinejoin="round" />
                            </svg>
                            {repo.stargazers_count}
                          </span>
                          {saving === repo.id && (
                            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          )}
                        </span>
                      </div>
                      {repo.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{repo.description}</p>
                      )}
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
