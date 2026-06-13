"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { EnsoMark } from "@/components/enso-mark";
import { useRouter } from "next/navigation";

type Mode = "login" | "signup" | "confirm";
type SignupStep = 1 | 2;
type Role = "user" | "founder" | "investor";

const ROLES: { value: Role; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: "user",
    label: "Collaborator",
    description: "I want to join projects and contribute my skills",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.7]">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "founder",
    label: "Founder",
    description: "I have a project and I'm looking for a team",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.7]">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    value: "investor",
    label: "Investor",
    description: "I want to discover and support promising projects",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.7]">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function LoginForm({ initialMode = "login", referredBy = null }: { initialMode?: Mode; referredBy?: string | null }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [step, setStep] = useState<SignupStep>(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState<Role>("user");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();
  const router = useRouter();

  const resetSignup = () => {
    setStep(1);
    setFullName("");
    setUsername("");
    setBio("");
    setRole("user");
    setError("");
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError("");
    if (m === "signup") resetSignup();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push("/dashboard");
    setLoading(false);
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: fullName, username, bio, role, ...(referredBy ? { referred_by: referredBy } : {}) },
      },
    });
    if (error) setError(error.message);
    else setMode("confirm");
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
            "radial-gradient(ellipse 60% 50% at 50% 0%, oklch(0.62 0.22 282 / 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-sm animate-fade-up">
        <div className="mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="font-heading font-bold text-lg tracking-tight text-foreground inline-flex items-center">
              ensombly<EnsoMark className="w-[0.62em] h-[0.62em] text-accent ml-0.5" />
            </span>
          </Link>
          <h1 className="font-heading font-extrabold text-3xl tracking-tight mb-2">
            {mode === "login"
              ? "Welcome back."
              : step === 1
              ? "Join Ensombly."
              : "Your profile."}
          </h1>
          <p className="text-muted-foreground text-sm">
            {mode === "login"
              ? "Sign in to your account to continue"
              : step === 1
              ? "Create your account and start building"
              : "Tell us a bit about yourself"}
          </p>
        </div>

        {/* LOGIN */}
        {mode === "login" && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
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
            <form onSubmit={handleLogin} className="space-y-4">
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
                ) : "Sign in"}
              </Button>
            </form>
          </div>
        )}

        {/* SIGNUP STEP 1 */}
        {mode === "signup" && step === 1 && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
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
            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block" htmlFor="signup-email">
                  Email address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block" htmlFor="signup-password">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-10 rounded-lg font-semibold shadow-sm shadow-primary/15 hover:shadow-md hover:shadow-primary/20 hover:-translate-y-px transition-all duration-200"
              >
                Continue
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[2] ml-1">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
            </form>
          </div>
        )}

        {/* SIGNUP STEP 2 */}
        {mode === "signup" && step === 2 && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <form onSubmit={handleStep2} className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block" htmlFor="full-name">
                    Full name
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block" htmlFor="username">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    className="input"
                    placeholder="janedoe"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                  I am a…
                </label>
                <div className="space-y-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all duration-150 ${
                        role === r.value
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border hover:border-foreground/20 hover:bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className={role === r.value ? "text-primary" : ""}>{r.icon}</span>
                      <div>
                        <p className="text-sm font-semibold leading-none mb-0.5">{r.label}</p>
                        <p className="text-xs text-muted-foreground">{r.description}</p>
                      </div>
                      {role === r.value && (
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-primary stroke-[2.5] ml-auto shrink-0">
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block" htmlFor="bio">
                  Bio <span className="font-normal">(optional)</span>
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="input resize-none h-20 py-2"
                  placeholder="A few words about you…"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive border border-destructive/20 bg-destructive/5 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-lg px-4"
                  onClick={() => { setStep(1); setError(""); }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[2]">
                    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-10 rounded-lg font-semibold shadow-sm shadow-primary/15 hover:shadow-md hover:shadow-primary/20 hover:-translate-y-px transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Creating account…
                    </span>
                  ) : "Create account"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* CONFIRM EMAIL */}
        {mode === "confirm" && (
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-primary/8 flex items-center justify-center mx-auto">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-primary stroke-[1.7]">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl tracking-tight mb-1">Check your inbox</h2>
              <p className="text-sm text-muted-foreground">
                We sent a confirmation link to{" "}
                <span className="font-medium text-foreground">{email}</span>.
                <br />Click it to activate your account.
              </p>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Wrong email?{" "}
              <button
                onClick={() => { setMode("signup"); setStep(1); setError(""); }}
                className="text-primary font-medium hover:underline underline-offset-4"
              >
                Go back
              </button>
            </p>
          </div>
        )}

        {mode !== "confirm" && (
          <p className="text-center text-sm text-muted-foreground mt-5">
            {mode === "login" ? (
              <>No account?{" "}
                <button onClick={() => switchMode("signup")} className="text-primary font-medium hover:underline underline-offset-4">
                  Sign up free
                </button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => switchMode("login")} className="text-primary font-medium hover:underline underline-offset-4">
                  Sign in
                </button>
              </>
            )}
          </p>
        )}

      </div>
    </div>
  );
}
