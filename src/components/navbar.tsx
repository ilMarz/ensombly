"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", data.user.id)
          .single()
          .then(({ data: p }) => setIsAdmin(p?.is_admin ?? false));
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setIsAdmin(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const navLinks = (
    <>
      <Link
        href="/projects"
        onClick={() => setMenuOpen(false)}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Projects
      </Link>
      {user ? (
        <>
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Admin
            </Link>
          )}
          <button
            onClick={() => { handleSignOut(); setMenuOpen(false); }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
          >
            Sign out
          </button>
          <Link href="/projects/new" onClick={() => setMenuOpen(false)}>
            <Button size="sm" className="rounded-full px-4">+ New Project</Button>
          </Link>
        </>
      ) : (
        <Link href="/login" onClick={() => setMenuOpen(false)}>
          <Button size="sm" className="rounded-full px-4">Sign in</Button>
        </Link>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            alteriux
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-5">
          {navLinks}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-1.5 rounded-md hover:bg-muted transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-foreground transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-foreground transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-foreground transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-border/50 bg-background/95 backdrop-blur-md px-4 py-4 flex flex-col gap-4">
          {navLinks}
        </div>
      )}
    </nav>
  );
}
