"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notification-bell";
import { EnsoMark } from "@/components/enso-mark";
import type { User } from "@supabase/supabase-js";

type Profile = {
  full_name: string | null;
  username: string;
  avatar_url: string | null;
  is_admin: boolean;
  role: string;
};

const ROLE_STYLES: Record<string, string> = {
  founder: "bg-sky-900/30 text-sky-300 ring-1 ring-sky-700/40",
  investor: "bg-violet-900/30 text-violet-300 ring-1 ring-violet-700/40",
  user: "bg-muted text-muted-foreground",
  admin: "bg-primary/10 text-primary ring-1 ring-primary/25",
};

function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "lg" }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className={`rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center select-none shrink-0 ${
        size === "lg" ? "w-10 h-10 text-sm" : "w-7 h-7 text-[10px]"
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
  people: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.7]">
      <circle cx="9" cy="7" r="3.5" />
      <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round" />
      <circle cx="18" cy="7" r="2.5" />
      <path d="M22 20c0-2.8-2-5-4.5-5.5" strokeLinecap="round" />
    </svg>
  ),
  about: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.7]">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6" strokeLinecap="round" />
      <circle cx="12" cy="8" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  pricing: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.7]">
      <path d="M13 2L4.09 12.26c-.26.31-.39.46-.38.59a.4.4 0 0 0 .15.29c.1.09.3.09.7.09H12l-1 9 8.91-10.26c.26-.31.39-.46.38-.59a.4.4 0 0 0-.15-.29c-.1-.09-.3-.09-.7-.09H12l1-9z" strokeLinecap="round" strokeLinejoin="round" />
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
  signin: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.7]">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" strokeLinecap="round" />
      <polyline points="10 17 15 12 10 7" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="15" y1="12" x2="3" y2="12" strokeLinecap="round" />
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
    const loadProfile = (userId: string) => {
      supabase
        .from("profiles")
        .select("full_name, username, avatar_url, is_admin, role")
        .eq("id", userId)
        .single()
        .then(({ data: p }) => { if (p) setProfile(p as Profile); });
    };

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) loadProfile(data.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser) loadProfile(nextUser.id);
      else setProfile(null);
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
  const roleKey = profile?.is_admin ? "admin" : (profile?.role ?? "user");
  const ROLE_LABELS: Record<string, string> = { user: "Collaborator", founder: "Founder", investor: "Investor", admin: "Admin" };
  const roleLabel = ROLE_LABELS[roleKey] ?? roleKey.charAt(0).toUpperCase() + roleKey.slice(1);
  const roleStyle = ROLE_STYLES[roleKey] ?? ROLE_STYLES.user;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    startSearch(() => {
      router.push(q ? `/projects?q=${encodeURIComponent(q)}` : "/projects");
    });
  };

  if (pathname === "/") return null;
  if (!user) return null;

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const NavLink = ({ href, icon, label, exact = false }: { href: string; icon: React.ReactNode; label: string; exact?: boolean }) => (
    <Link
      href={href}
      className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-150 ${
        isActive(href, exact)
          ? "bg-primary/8 text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="w-full px-5 sm:px-8 h-16 flex items-center gap-4">
          <div className="flex items-center gap-3 shrink-0">
            {user && (
              <button
                onClick={() => setOpen(true)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Open menu"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.8]">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                </svg>
              </button>
            )}

            <Link href="/" className="shrink-0">
              <span className="font-heading font-bold text-xl tracking-tight text-foreground hover:text-primary transition-colors duration-150 inline-flex items-center">
                ensombly<EnsoMark className="w-[0.62em] h-[0.62em] text-accent ml-0.5" />
              </span>
            </Link>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-sm">
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 fill-none stroke-current stroke-[2] text-muted-foreground pointer-events-none"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects…"
                className="w-full h-10 pl-10 pr-9 rounded-xl border border-border bg-secondary text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50 transition-all placeholder:text-muted-foreground/55"
              />
              {searching ? (
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
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
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-[2.5]">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              ) : null}
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <NotificationBell userId={user.id} />
                <Link
                  href="/pricing"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ring-1 ring-primary/30 text-primary hover:bg-primary/8 transition-colors"
                >
                  {ICONS.pricing}
                  Upgrade
                </Link>
                {displayName && (
                  <Link
                    href="/profile"
                    className="hidden sm:flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <div className="leading-tight text-right">
                      <p className="text-sm font-medium leading-none mb-1">
                        {displayName}
                      </p>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${roleStyle}`}>
                        {roleLabel}
                      </span>
                    </div>
                    <Avatar name={displayName} />
                  </Link>
                )}
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" className="rounded-lg px-5 font-semibold">Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {user && <div
        className={`fixed inset-0 z-50 bg-foreground/15 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />}

      {user && <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-card border-r border-border shadow-xl shadow-black/40 flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
          <span className="font-heading font-bold text-lg tracking-tight text-foreground inline-flex items-center">
            ensombly<EnsoMark className="w-[0.62em] h-[0.62em] text-accent ml-0.5" />
          </span>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[2]">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {user && displayName && (
          <div className="px-3 pt-4 pb-3 border-b border-border shrink-0">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary transition-colors group"
            >
              <Avatar name={displayName} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{displayName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-xs text-muted-foreground truncate">@{profile?.username}</p>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${roleStyle}`}>
                    {roleLabel}
                  </span>
                </div>
              </div>
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[2] text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <NavLink href="/projects" icon={ICONS.projects} label="Projects" />
          <NavLink href="/users" icon={ICONS.people} label="People" />
          {user && <NavLink href="/dashboard" icon={ICONS.dashboard} label="Dashboard" exact />}
          {user && <NavLink href="/profile" icon={ICONS.profile} label="Profile" exact />}
          {profile?.role === "founder" && <NavLink href="/projects/new" icon={ICONS.newProject} label="New project" exact />}
          {profile?.is_admin && <NavLink href="/admin" icon={ICONS.admin} label="Admin" />}
        </nav>

        <div className="px-3 pb-6 pt-2 border-t border-border shrink-0 space-y-0.5">
          <NavLink href="/pricing" icon={ICONS.pricing} label="Pricing" exact />
          <NavLink href="/about" icon={ICONS.about} label="About" exact />
          {user ? (
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-950/30 hover:text-red-400 transition-colors"
            >
              {ICONS.signout}
              Sign out
            </button>
          ) : (
            <NavLink href="/login" icon={ICONS.signin} label="Sign in" exact />
          )}
        </div>
      </aside>}
    </>
  );
}
