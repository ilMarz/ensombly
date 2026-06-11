"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Mode = "login" | "signup";

export function LoginForm({ signupEnabled }: { signupEnabled: boolean }) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push("/dashboard");
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) setError(error.message);
      else router.push("/dashboard");
    }

    setLoading(false);
  };

  const handleGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] px-6 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, oklch(0.232 0.078 258 / 0.04) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-sm animate-fade-up">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="font-heading font-bold text-lg tracking-tight text-foreground">
              alterio<span className="text-accent">·</span>
            </span>
          </Link>
          <h1 className="font-heading font-extrabold text-3xl tracking-tight mb-2">
            {mode === "login" ? "Welcome back." : "Join alterio."}
          </h1>
          <p className="text-muted-foreground text-sm">
            {mode === "login"
              ? "Sign in to your account to continue"
              : "Create your account and start building"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
          {signupEnabled && (
            <>
              <Button
                variant="outline"
                className="w-full h-10 rounded-lg font-medium gap-2 border-border hover:border-foreground/25 hover:bg-secondary transition-all"
                onClick={handleGitHub}
                type="button"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Continue with GitHub
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">or</span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive border border-destructive/20 bg-destructive/5 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="w-full h-10 rounded-lg font-semibold shadow-sm shadow-primary/15 hover:shadow-md hover:shadow-primary/20 hover:-translate-y-px transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Loading…
                </span>
              ) : mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>
        </div>

        {signupEnabled && (
          <p className="text-center text-sm text-muted-foreground mt-5">
            {mode === "login" ? (
              <>No account?{" "}
                <button onClick={() => { setMode("signup"); setError(""); }} className="text-primary font-medium hover:underline underline-offset-4">
                  Sign up free
                </button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => { setMode("login"); setError(""); }} className="text-primary font-medium hover:underline underline-offset-4">
                  Sign in
                </button>
              </>
            )}
          </p>
        )}
        {!signupEnabled && (
          <p className="text-center text-xs text-muted-foreground mt-5">
            Registration is currently invite-only.
          </p>
        )}
      </div>
    </div>
  );
}
