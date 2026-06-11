import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    num: "01",
    title: "Founders",
    desc: "Publish your project, define open roles, and build your dream team.",
  },
  {
    num: "02",
    title: "Collaborators",
    desc: "Find exciting early-stage projects and contribute your skills.",
  },
  {
    num: "03",
    title: "Investors",
    desc: "Discover early-stage opportunities and connect directly with founders.",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/projects");

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[88vh] px-6 overflow-hidden">
      {/* Warm background wash */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.267 0.083 152 / 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-3xl w-full z-10 py-20">
        {/* Eyebrow */}
        <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground mb-8 font-medium">
          alterum alterius auxilio eget
        </p>

        {/* Heading */}
        <h1
          className="text-5xl sm:text-[68px] leading-[1.02] tracking-tight mb-7"
          style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
        >
          <span className="text-foreground font-black block">Find your team.</span>
          <span
            className="text-primary block"
            style={{ fontStyle: "italic", fontWeight: 300 }}
          >
            Build together.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-10">
          Founders publish projects. Collaborators, advisors and investors find
          them. No noise — just the right people.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-start gap-3 mb-16">
          <Link href="/login">
            <Button
              size="lg"
              className="px-8 h-11 text-sm font-semibold rounded"
            >
              Get started free
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="px-8 h-11 text-sm rounded border-border hover:border-primary/40 hover:bg-secondary"
            >
              Sign in
            </Button>
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] text-muted-foreground/60 tracking-widest uppercase">
            Who it's for
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Feature rows */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border rounded overflow-hidden">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`p-6 ${i < FEATURES.length - 1 ? "sm:border-r border-border border-b sm:border-b-0" : ""}`}
            >
              <p
                className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground/50 mb-3 font-medium"
              >
                {f.num}
              </p>
              <h3
                className="font-semibold text-sm text-foreground mb-2"
                style={{ fontFamily: "var(--font-instrument), system-ui, sans-serif" }}
              >
                {f.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
