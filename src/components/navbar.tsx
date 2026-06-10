"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
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

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 group">
        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
          alteriux
        </span>
      </Link>
      <div className="flex items-center gap-5">
        <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Projects
        </Link>
        {user ? (
          <>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                Admin
              </Link>
            )}
            <button onClick={handleSignOut} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign out
            </button>
            <Link href="/projects/new">
              <Button size="sm" className="rounded-full px-4">+ New Project</Button>
            </Link>
          </>
        ) : (
          <Link href="/login">
            <Button size="sm" className="rounded-full px-4">Sign in</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
