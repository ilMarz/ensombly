import Link from "next/link";
import { Button } from "@/components/ui/button";

const USER_TYPES = [
  {
    num: "01",
    title: "Founders",
    color: "sky",
    ringClass: "ring-sky-200 bg-sky-50 text-sky-700",
    dotClass: "bg-sky-500",
    description:
      "Entrepreneurs with an idea or an early-stage project. They create a project page, define open roles, and use Alterio to recruit the team they need — without job boards or recruiters.",
    actions: [
      "Publish a project with stage, sector and tagline",
      "Define open roles with requirements",
      "Receive and manage applications",
      "View investor interest in their project",
    ],
  },
  {
    num: "02",
    title: "Collaborators",
    color: "emerald",
    ringClass: "ring-emerald-200 bg-emerald-50 text-emerald-700",
    dotClass: "bg-emerald-500",
    description:
      "Developers, designers, marketers, and other professionals looking to join early-stage projects. They browse open roles, apply directly, and track their application status.",
    actions: [
      "Browse all published projects",
      "Filter by stage, sector, or keyword",
      "Apply to open roles with a message",
      "Track application status in the dashboard",
    ],
  },
  {
    num: "03",
    title: "Investors",
    color: "violet",
    ringClass: "ring-violet-200 bg-violet-50 text-violet-700",
    dotClass: "bg-violet-500",
    description:
      "Angels and pre-seed investors looking for deal flow. They browse projects, follow their progress, and send direct interest messages to founders — no intermediaries.",
    actions: [
      "Discover pre-seed and MVP-stage projects",
      "Express interest with a contact and message",
      "Connect directly with the founding team",
      "Follow projects to stay updated",
    ],
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

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 space-y-20">

      {/* Hero */}
      <section className="space-y-5">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-accent">
          alterum alterius auxilio eget
        </p>
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl leading-tight tracking-tight">
          What is Alterio?
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
          Alterio is a professional network for startup projects — a place where
          founders publish what they&apos;re building, and collaborators, advisors, and
          investors find them. Think LinkedIn, but for early-stage projects instead
          of job titles.
        </p>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">
          The name comes from the Latin phrase{" "}
          <em className="text-foreground font-medium">
            alterum alterius auxilio eget
          </em>{" "}
          — &ldquo;each needs the other&apos;s help.&rdquo; That&apos;s the core idea: no project is
          built alone, and no talent should go to waste on the wrong opportunity.
        </p>
      </section>

      {/* How it works */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/55">
            How it works
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="space-y-4">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="flex gap-5 items-start">
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary/8 text-primary text-xs font-bold flex items-center justify-center ring-1 ring-primary/15 mt-0.5">
                {item.step}
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">{item.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* User types */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/55">
            Who it&apos;s for
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="space-y-5">
          {USER_TYPES.map((u) => (
            <div key={u.title} className="border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-accent text-xs font-bold tracking-[0.15em] uppercase">{u.num}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ${u.ringClass}`}>
                  {u.title}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{u.description}</p>
              <ul className="space-y-1.5">
                {u.actions.map((a) => (
                  <li key={a} className="flex items-start gap-2.5 text-sm">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${u.dotClass}`} />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* What it is NOT */}
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/55">
            What it&apos;s not
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="border border-dashed border-border rounded-2xl p-6 space-y-3">
          {[
            "Not a job board — projects, not positions.",
            "Not a fundraising platform — no payments or equity deals happen here.",
            "Not a social feed — no likes, no followers, no algorithm. Signal only.",
          ].map((line) => (
            <p key={line} className="text-sm text-muted-foreground flex items-start gap-2.5">
              <span className="text-border font-bold shrink-0 mt-0.5">—</span>
              {line}
            </p>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-4 pb-4">
        <h2 className="font-heading font-bold text-2xl">Ready to find your people?</h2>
        <p className="text-muted-foreground text-sm">Join Alterio and connect with the startup ecosystem.</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/login?mode=signup">
            <Button size="lg" className="px-8 h-11 text-sm font-semibold rounded-lg">
              Get started free
            </Button>
          </Link>
          <Link href="/projects">
            <Button size="lg" variant="outline" className="px-8 h-11 text-sm font-semibold rounded-lg">
              Browse projects
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
