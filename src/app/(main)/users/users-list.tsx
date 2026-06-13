"use client";

import { useState } from "react";
import Link from "next/link";

const ROLE_LABELS: Record<string, string> = {
  user: "Collaborator",
  founder: "Founder",
  investor: "Investor",
};

const ROLE_STYLES: Record<string, string> = {
  founder: "text-sky-300 bg-sky-900/25 ring-1 ring-sky-700/40",
  investor: "text-violet-300 bg-violet-900/25 ring-1 ring-violet-700/40",
  user: "text-muted-foreground bg-muted",
};

type User = {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: string | null;
  looking_for: string | null;
  is_verified: boolean | null;
  skills: string[] | null;
};

function UserAvatar({ name, avatarUrl, size = 10 }: { name: string; avatarUrl: string | null; size?: number }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`w-${size} h-${size} rounded-full object-cover shrink-0`}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    );
  }
  return (
    <div className={`w-${size} h-${size} rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shrink-0 select-none text-sm`}>
      {initials}
    </div>
  );
}

export function UsersList({ users, initialQuery }: { users: User[]; initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);

  const filtered = query.trim()
    ? users.filter((u) => {
        const q = query.toLowerCase();
        return (
          u.username.toLowerCase().includes(q) ||
          (u.full_name ?? "").toLowerCase().includes(q) ||
          (u.bio ?? "").toLowerCase().includes(q) ||
          (u.skills ?? []).some((s) => s.toLowerCase().includes(q))
        );
      })
    : users;

  return (
    <div>
      <div className="relative mb-8">
        <svg
          viewBox="0 0 24 24"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 fill-none stroke-current stroke-[2] text-muted-foreground pointer-events-none"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, username or skill…"
          className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50 transition-all placeholder:text-muted-foreground/55"
          autoFocus={!!initialQuery}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[2.5]">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-card border border-dashed border-border rounded-xl">
          <p className="font-semibold text-base mb-1">No users found</p>
          <p className="text-muted-foreground text-sm">Try a different name or skill</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((u) => {
            const name = u.full_name ?? u.username;
            const roleKey = u.role ?? "user";
            const roleLabel = ROLE_LABELS[roleKey] ?? roleKey;
            const roleStyle = ROLE_STYLES[roleKey] ?? ROLE_STYLES.user;
            const skills = (u.skills ?? []).slice(0, 3);

            return (
              <Link
                key={u.id}
                href={`/u/${u.username}`}
                className="flex flex-col gap-3 border border-border rounded-xl p-4 bg-card hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-px transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar name={name} avatarUrl={u.avatar_url} size={10} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-semibold text-sm truncate">{name}</p>
                      {u.is_verified && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full text-sky-300 bg-sky-900/25 ring-1 ring-sky-700/40 shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">@{u.username}</p>
                  </div>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${roleStyle}`}>
                    {roleLabel}
                  </span>
                </div>

                {u.bio && (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{u.bio}</p>
                )}

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s) => (
                      <span key={s} className="text-[10px] border border-border rounded-full px-2 py-0.5 bg-secondary/50 text-muted-foreground">
                        {s}
                      </span>
                    ))}
                    {(u.skills ?? []).length > 3 && (
                      <span className="text-[10px] text-muted-foreground">+{(u.skills ?? []).length - 3}</span>
                    )}
                  </div>
                )}

                {u.looking_for && (
                  <p className="text-[10px] text-muted-foreground truncate">
                    Looking for: {u.looking_for}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-8">
        {filtered.length} {filtered.length === 1 ? "person" : "people"}
        {query ? ` matching "${query}"` : " on Ensombly"}
      </p>
    </div>
  );
}
