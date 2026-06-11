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

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "A founder publishes a project",
    desc: "They describe what they're building, the stage it's at, and the roles they need to fill.",
  },
  {
    step: "2",
    title: "Others discover and connect",
    desc: "Collaborators apply to open roles. Investors send interest messages. Everyone follows the projects they care about.",
  },
  {
    step: "3",
    title: "The right people find each other",
    desc: "No noise, no recruiters, no fees. Just a direct line between builders and the people who want to help them ship.",
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
          <Link href="/login?mode=signup">
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

      {/* About section */}
      <div className="relative max-w-2xl w-full z-10 pb-24 space-y-14">

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/55">
            What is Alterio
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Pitch */}
        <div className="space-y-4">
          <p className="text-foreground font-medium leading-relaxed">
            Alterio is a professional network for startup projects — not for job titles, not for polished CVs.
            Founders publish what they&apos;re building. Collaborators, advisors and investors find them.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The name comes from the Latin phrase{" "}
            <em className="text-foreground font-medium not-italic">alterum alterius auxilio eget</em>{" "}
            — &ldquo;each needs the other&apos;s help.&rdquo; No project is built alone,
            and no talent should go to waste on the wrong opportunity.
          </p>
        </div>

        {/* How it works */}
        <div className="space-y-5">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/55">How it works</p>
          <div className="space-y-4">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="shrink-0 w-7 h-7 rounded-full bg-primary/8 text-primary text-[10px] font-bold flex items-center justify-center ring-1 ring-primary/15 mt-0.5">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-sm mb-0.5">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Not a job board */}
        <div className="border border-dashed border-border rounded-xl p-5 space-y-2.5">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/55 mb-3">What it&apos;s not</p>
          {[
            "Not a job board — projects, not positions.",
            "Not a fundraising platform — no payments or equity deals.",
            "Not a social feed — no algorithm, no noise. Signal only.",
          ].map((line) => (
            <p key={line} className="text-xs text-muted-foreground flex items-start gap-2">
              <span className="text-border font-bold shrink-0 mt-0.5">—</span>
              {line}
            </p>
          ))}
        </div>

        <div className="flex items-center justify-center">
          <Link href="/about" className="text-xs text-primary hover:underline font-medium">
            Read the full story →
          </Link>
        </div>

      </div>
    </div>
  );
}
