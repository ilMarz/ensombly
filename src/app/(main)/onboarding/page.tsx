"use client";

import { useState } from "react";
import Link from "next/link";
import { EnsoMark } from "@/components/enso-mark";
import { Button } from "@/components/ui/button";
import { setOnboardingRole } from "./actions";

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

export default function OnboardingPage() {
  const [selected, setSelected] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");
    const result = await setOnboardingRole(selected);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
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
            Who are you?
          </h1>
          <p className="text-muted-foreground text-sm">
            Choose your role — this shapes your experience on Ensombly.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
          <div className="space-y-2">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setSelected(r.value)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all duration-150 ${
                  selected === r.value
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border hover:border-foreground/20 hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className={selected === r.value ? "text-primary" : ""}>{r.icon}</span>
                <div>
                  <p className="text-sm font-semibold leading-none mb-0.5">{r.label}</p>
                  <p className="text-xs text-muted-foreground">{r.description}</p>
                </div>
                {selected === r.value && (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-primary stroke-[2.5] ml-auto shrink-0">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-sm text-destructive border border-destructive/20 bg-destructive/5 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!selected || loading}
            className="w-full h-10 rounded-lg font-semibold shadow-sm shadow-primary/15 hover:shadow-md hover:shadow-primary/20 hover:-translate-y-px transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Setting up…
              </span>
            ) : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
