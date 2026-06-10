"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notification-bell";
import type { User } from "@supabase/supabase-js";

type Profile = { full_name: string | null; username: string; avatar_url: string | null; is_admin: boolean };

function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "lg" }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className={`rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center select-none shrink-0 ${
        size === "lg" ? "w-12 h-12 text-lg" : "w-7 h-7 text-[11px]"
      }`}
    >
      {initials}
    </div>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  projects: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.7]">
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  dashboard: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.7]">
      <path d="M3 12L12 3l9 9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21V12h6v9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  newProject: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.7]">
      <circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.7]">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
  ),
  admin: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.7]">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  signout: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.7]">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" />
      <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
    </svg>
  ),
};

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [open, setOpen] = useState(false);
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase
          .from("profiles")
          .select("full_name, username, avatar_url, is_admin")
          .eq("id", data.user.id)
          .single()
          .then(({ data: p }) => { if (p) setProfile(p as Profile); });
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setProfile(null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searching, startSearch] = useTransition();
  const displayName = profile?.full_name ?? profile?.username ?? "";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    startSearch(() => {
      router.push(q ? `/projects?q=${encodeURIComponent(q)}` : "/projects");
    });
  };

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const NavLink = ({ href, icon, label, exact = false }: { href: string; icon: React.ReactNode; label: string; exact?: boolean }) => (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        isActive(href, exact)
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <>
      {/* Top bar */}
      <nav className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.8]">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>

          <Link href="/">
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              alteriux
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-2 sm:mx-4">
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 fill-none stroke-current stroke-[1.8] text-muted-foreground pointer-events-none"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects, tech, sector…"
                className="w-full h-9 pl-10 pr-8 rounded-xl border border-border/60 bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50 focus:bg-background transition-all placeholder:text-muted-foreground/50"
              />
              {searching ? (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-3.5 h-3.5 animate-spin text-muted-foreground" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                </span>
              ) : search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[2]">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              ) : null}
            </div>
          </form>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <NotificationBell userId={user.id} />
                <Link href="/projects/new" className="hidden sm:block">
                  <Button size="sm" className="rounded-full px-4">+ New project</Button>
                </Link>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" className="rounded-full px-4">Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-background border-r border-border/60 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-border/60 shrink-0">
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            alteriux
          </span>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[2]">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Profile card */}
        {user && displayName && (
          <div className="px-3 pt-4 pb-3 border-b border-border/60 shrink-0">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-muted/60 transition-colors group"
            >
              <Avatar name={displayName} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">@{profile?.username}</p>
              </div>
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[2] text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <NavLink href="/projects" icon={ICONS.projects} label="Projects" />
          {user && <NavLink href="/dashboard" icon={ICONS.dashboard} label="Dashboard" exact />}
          {user && <NavLink href="/profile" icon={ICONS.profile} label="Profile" exact />}
          {user && <NavLink href="/projects/new" icon={ICONS.newProject} label="New project" exact />}
          {profile?.is_admin && (
            <NavLink href="/admin" icon={ICONS.admin} label="Admin" />
          )}
        </nav>

        {/* Footer */}
        {user && (
          <div className="px-3 pb-6 pt-2 border-t border-border/60 shrink-0">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors"
            >
              {ICONS.signout}
              Sign out
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
