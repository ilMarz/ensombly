import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Ensombly — Find your ensemble, build together" },
  description:
    "Founders publish projects. Collaborators, advisors and investors find them. The circle is complete when you find your team.",
  openGraph: {
    title: "Ensombly — Find your ensemble, build together",
    description: "Founders publish projects. Collaborators, advisors and investors find them.",
    url: "/",
    type: "website",
  },
  alternates: { canonical: "/" },
};

const FEATURES = [
  {
    num: "01",
    title: "Founders",
    desc: "Publish your project, define open roles, and build the team you need to ship.",
    icon: "◎",
  },
  {
    num: "02",
    title: "Collaborators",
    desc: "Find early-stage projects worth your time and contribute your best work.",
    icon: "◈",
  },
  {
    num: "03",
    title: "Investors",
    desc: "Discover pre-seed opportunities and connect directly with the people building them.",
    icon: "◇",
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ensombly.com";

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Ensombly",
            url: siteUrl,
            description:
              "LinkedIn for startup projects. Founders publish projects, others join as collaborators, advisors, or investors.",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteUrl}/projects?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[100vh] overflow-hidden px-6">

        {/* Dot grid */}
        <div className="landing-dot-grid absolute inset-0 opacity-55 pointer-events-none" />

        {/* Central radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 46%, oklch(0.22 0.055 272 / 0.65) 0%, transparent 70%)",
          }}
        />

        {/* Ambient blobs */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "12%",
            left: "8%",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "oklch(0.55 0.22 282 / 0.07)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "18%",
            right: "6%",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "oklch(0.72 0.17 198 / 0.06)",
            filter: "blur(65px)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full pt-20 pb-24">

          {/* Eyebrow */}
          <p
            className="animate-fade-up text-[10px] font-semibold tracking-[0.24em] uppercase mb-10"
            style={{ animationDelay: "80ms", color: "oklch(0.72 0.17 198 / 0.7)" }}
          >
            ensō · ensemble · together
          </p>

          {/* ── Ensō Circle ── */}
          <div
            className="relative mb-10 animate-float"
            style={{ width: 260, height: 260 }}
          >
            {/* Glow halo */}
            <div
              className="absolute inset-0 rounded-full animate-enso-glow pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.55 0.22 282 / 0.18) 40%, transparent 72%)",
              }}
            />

            <svg viewBox="0 0 260 260" className="w-full h-full" aria-hidden>
              <defs>
                <linearGradient
                  id="enso-grad"
                  x1="0"
                  y1="0"
                  x2="260"
                  y2="260"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="oklch(0.68 0.22 282)" />
                  <stop offset="50%" stopColor="oklch(0.60 0.24 298)" />
                  <stop offset="100%" stopColor="oklch(0.74 0.18 198)" />
                </linearGradient>

                <linearGradient
                  id="enso-outer-grad"
                  x1="0"
                  y1="0"
                  x2="260"
                  y2="260"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="oklch(0.68 0.22 282 / 0.08)" />
                  <stop offset="100%" stopColor="oklch(0.74 0.18 198 / 0.08)" />
                </linearGradient>

                {/* Orbit dots gradient */}
                <filter id="enso-blur">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Outer faint ring */}
              <circle
                cx="130"
                cy="130"
                r="125"
                fill="none"
                stroke="url(#enso-outer-grad)"
                strokeWidth="1"
              />

              {/* Inner faint ring */}
              <circle
                cx="130"
                cy="130"
                r="105"
                fill="none"
                stroke="oklch(0.22 0.03 262 / 0.25)"
                strokeWidth="0.5"
                strokeDasharray="4 8"
              />

              {/* Orbit ring — slow spin */}
              <g className="animate-orbit">
                <circle cx="130" cy="5" r="2.5" fill="oklch(0.72 0.17 198 / 0.7)" />
                <circle cx="255" cy="130" r="1.8" fill="oklch(0.68 0.22 282 / 0.5)" />
                <circle cx="130" cy="255" r="2" fill="oklch(0.72 0.17 198 / 0.4)" />
              </g>

              {/* Main ensō stroke */}
              <circle
                cx="130"
                cy="130"
                r="120"
                fill="none"
                stroke="url(#enso-grad)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeDasharray="754"
                strokeDashoffset="754"
                transform="rotate(-90 130 130)"
                className="animate-enso-draw"
                style={{
                  filter:
                    "drop-shadow(0 0 6px oklch(0.58 0.22 282 / 0.8)) drop-shadow(0 0 18px oklch(0.72 0.17 198 / 0.35))",
                }}
              />
            </svg>

            {/* Center brand text */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in"
              style={{ animationDelay: "2400ms" }}
            >
              <span
                className="font-heading font-extrabold tracking-tight"
                style={{
                  fontSize: "1.5rem",
                  color: "oklch(0.96 0.005 262)",
                }}
              >
                ensombly
              </span>
              <span
                className="text-[9px] font-medium tracking-[0.3em] uppercase mt-1"
                style={{ color: "oklch(0.78 0.008 262)" }}
              >
                円相
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up font-heading font-extrabold leading-[1.04] tracking-tight mb-5"
            style={{
              fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)",
              animationDelay: "1900ms",
            }}
          >
            <span style={{ color: "oklch(0.96 0.005 262)" }}>
              Find your ensemble.
            </span>
            <br />
            <span style={{ color: "oklch(0.94 0.006 262)" }}>
              Build something that matters.
            </span>
          </h1>

          {/* Tagline */}
          <p
            className="animate-fade-up text-base leading-relaxed max-w-sm mb-10"
            style={{
              animationDelay: "2100ms",
              color: "oklch(0.93 0.005 262)",
            }}
          >
            Founders publish projects. Collaborators, advisors and investors
            find them. The circle is complete when you find your team.
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-up flex flex-col sm:flex-row items-center gap-3 mb-14"
            style={{ animationDelay: "2300ms" }}
          >
            <Link href="/login?mode=signup">
              <button
                className="btn-gradient px-8 h-11 rounded-xl text-sm font-semibold text-white"
                style={{ minWidth: 180 }}
              >
                Get started free
              </button>
            </Link>
            <Link href="/login">
              <button
                className="px-8 h-11 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-px"
                style={{
                  minWidth: 140,
                  background: "oklch(0.12 0.022 262 / 0.7)",
                  border: "1px solid oklch(0.34 0.03 262)",
                  color: "oklch(0.93 0.006 262)",
                }}
              >
                Sign in →
              </button>
            </Link>
          </div>

          {/* Scroll hint */}
          <div
            className="animate-fade-in flex flex-col items-center gap-1.5"
            style={{ animationDelay: "3200ms" }}
          >
            <span
              className="text-[10px] font-medium tracking-[0.2em] uppercase"
              style={{ color: "oklch(0.73 0.008 262)" }}
            >
              scroll
            </span>
            <div
              className="w-px h-8 rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom, oklch(0.73 0.008 262), transparent)",
              }}
            />
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ──────────────────────────────────────── */}
      <section className="relative px-6 py-24 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 100%, oklch(0.10 0.025 272 / 0.5) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.28 0.028 262)" }}
            />
            <span
              className="text-[10px] font-semibold tracking-[0.22em] uppercase"
              style={{ color: "oklch(0.76 0.008 262)" }}
            >
              Who it&apos;s for
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.28 0.028 262)" }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="glass-card rounded-2xl p-6 group transition-all duration-300 hover:-translate-y-1"
                style={{
                  animationDelay: `${i * 80}ms`,
                  boxShadow: "0 1px 30px oklch(0.58 0.22 282 / 0.04)",
                }}
              >
                <div
                  className="text-2xl mb-4"
                  style={{ color: "oklch(0.62 0.22 282 / 0.7)" }}
                >
                  {f.icon}
                </div>
                <p
                  className="text-[10px] font-bold tracking-[0.18em] uppercase mb-2"
                  style={{ color: "oklch(0.72 0.17 198 / 0.7)" }}
                >
                  {f.num}
                </p>
                <h3
                  className="font-heading font-semibold text-sm mb-2 transition-colors duration-200"
                  style={{ color: "oklch(0.97 0.004 262)" }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "oklch(0.91 0.005 262)" }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="relative px-6 py-24 overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.28 0.028 262)" }}
            />
            <span
              className="text-[10px] font-semibold tracking-[0.22em] uppercase"
              style={{ color: "oklch(0.76 0.008 262)" }}
            >
              How it works
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.28 0.028 262)" }}
            />
          </div>

          <div className="space-y-5">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="glass-card rounded-2xl p-5 flex gap-5 items-start group transition-all duration-300 hover:border-opacity-80">
                <div
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ring-1 mt-0.5 transition-all duration-300"
                  style={{
                    background: "oklch(0.20 0.04 282 / 0.6)",
                    color: "oklch(0.80 0.18 282)",
                    border: "1px solid oklch(0.40 0.12 282 / 0.5)",
                  }}
                >
                  {item.step}
                </div>
                <div>
                  <p
                    className="font-semibold text-sm mb-1"
                    style={{ color: "oklch(0.97 0.004 262)" }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "oklch(0.91 0.005 262)" }}
                  >
                    {item.desc}
                  </p>
                </div>
                <div
                  className="shrink-0 ml-auto self-center text-xs font-mono opacity-20"
                  style={{ color: "oklch(0.62 0.22 282)" }}
                >
                  0{i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT IT'S NOT ────────────────────────────────────── */}
      <section className="relative px-6 py-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, oklch(0.10 0.025 272 / 0.4) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div
            className="glass-card rounded-2xl p-7"
            style={{
              borderStyle: "dashed",
            }}
          >
            <p
              className="text-[10px] font-semibold tracking-[0.22em] uppercase mb-5"
              style={{ color: "oklch(0.76 0.008 262)" }}
            >
              What it&apos;s not
            </p>
            <div className="space-y-3">
              {[
                "Not a job board — projects, not positions.",
                "Not a fundraising platform — no payments or equity deals.",
                "Not a social feed — no algorithm, no noise. Signal only.",
              ].map((line) => (
                <p
                  key={line}
                  className="text-sm flex items-start gap-3"
                  style={{ color: "oklch(0.91 0.005 262)" }}
                >
                  <span style={{ color: "oklch(0.72 0.008 262)" }}>—</span>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="relative px-6 py-32 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 50% 50%, oklch(0.12 0.042 272 / 0.5) 0%, transparent 70%)",
          }}
        />
        <div className="landing-dot-grid absolute inset-0 opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center text-center">
          {/* Small ensō */}
          <svg
            viewBox="0 0 60 60"
            className="w-12 h-12 mb-8 opacity-60"
            aria-hidden
          >
            <defs>
              <linearGradient id="cta-enso" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="oklch(0.68 0.22 282)" />
                <stop offset="100%" stopColor="oklch(0.74 0.18 198)" />
              </linearGradient>
            </defs>
            <circle
              cx="30" cy="30" r="25"
              fill="none"
              stroke="url(#cta-enso)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="157"
              strokeDashoffset="20"
              transform="rotate(-90 30 30)"
            />
          </svg>

          <h2
            className="font-heading font-extrabold leading-[1.06] tracking-tight mb-5"
            style={{
              fontSize: "clamp(1.8rem, 4.5vw, 3rem)",
              color: "oklch(0.96 0.005 262)",
            }}
          >
            The circle is complete
            <br />
            <span className="text-gradient">when you find your team.</span>
          </h2>

          <p
            className="text-sm leading-relaxed max-w-xs mb-10"
            style={{ color: "oklch(0.91 0.005 262)" }}
          >
            Every project needs its ensemble. Start building yours today.
          </p>

          <Link href="/login?mode=signup">
            <button
              className="btn-gradient px-10 h-12 rounded-xl text-sm font-semibold text-white"
            >
              Start building →
            </button>
          </Link>

          <p
            className="mt-5 text-[11px]"
            style={{ color: "oklch(0.73 0.008 262)" }}
          >
            Free to join · No payments · No recruiter noise
          </p>

          <div className="mt-16 flex items-center gap-4 w-full max-w-xs">
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.26 0.02 262)" }}
            />
            <Link
              href="/about"
              className="text-[11px] font-medium transition-colors duration-200"
              style={{ color: "oklch(0.78 0.008 262)" }}
            >
              Read the full story →
            </Link>
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.26 0.02 262)" }}
            />
          </div>
        </div>
      </section>

    </div>
  );
}
