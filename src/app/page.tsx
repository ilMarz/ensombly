import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    num: "01",
    title: "Founders",
    desc: "Publish your project, define open roles, and build the team you need to ship.",
  },
  {
    num: "02",
    title: "Collaborators",
    desc: "Find early-stage projects worth your time and contribute your best work.",
  },
  {
    num: "03",
    title: "Investors",
    desc: "Discover pre-seed opportunities and connect directly with the people building them.",
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
      {/* Subtle top radial */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-72 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% -10%, oklch(0.232 0.078 258 / 0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-2xl w-full z-10 pt-16 pb-20">

        {/* Eyebrow */}
        <p
          className="animate-fade-up text-[11px] font-semibold tracking-[0.18em] uppercase text-accent mb-8"
          style={{ animationDelay: "0ms" }}
        >
          alterum alterius auxilio eget
        </p>

        {/* Line 1 */}
        <h1
          className="animate-fade-up font-heading font-extrabold leading-[1.04] tracking-tight mb-2"
          style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)", animationDelay: "60ms" }}
        >
          Find your team.
        </h1>

        {/* Line 2 + amber underline animation */}
        <div
          className="animate-fade-up relative inline-block mb-8"
          style={{ animationDelay: "120ms" }}
        >
          <span
            className="font-heading font-extrabold leading-[1.04] tracking-tight text-primary/28 block"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)" }}
          >
            Build together.
          </span>
          <div
            className="animate-line absolute -bottom-1 left-0 h-[3px] rounded-full bg-accent"
            style={{ animationDelay: "640ms" }}
          />
        </div>

        {/* Tagline */}
        <p
          className="animate-fade-up text-muted-foreground text-lg leading-relaxed max-w-md mb-10"
          style={{ animationDelay: "200ms" }}
        >
          Founders publish projects. Collaborators, advisors and investors find
          them. No noise — just the right people.
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-up flex flex-col sm:flex-row items-start gap-3 mb-16"
          style={{ animationDelay: "280ms" }}
        >
          <Link href="/login">
            <Button
              size="lg"
              className="px-8 h-11 text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 hover:-translate-y-px transition-all duration-200"
            >
              Get started free
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="px-8 h-11 text-sm font-semibold rounded-lg border-border hover:border-primary/40 hover:bg-secondary transition-all duration-200"
            >
              Sign in →
            </Button>
          </Link>
        </div>

        {/* Divider */}
        <div
          className="animate-fade-up flex items-center gap-4 mb-8"
          style={{ animationDelay: "360ms" }}
        >
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/55">
            Who it&apos;s for
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Feature rows */}
        <div
          className="animate-fade-up grid grid-cols-1 sm:grid-cols-3 gap-6"
          style={{ animationDelay: "420ms" }}
        >
          {FEATURES.map((f) => (
            <div key={f.title} className="group">
              <p className="text-accent text-xs font-bold tracking-[0.15em] uppercase mb-2.5">
                {f.num}
              </p>
              <h3 className="font-heading font-semibold text-sm text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
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
