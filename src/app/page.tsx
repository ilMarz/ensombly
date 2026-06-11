import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: "🚀",
    title: "Founders",
    desc: "Publish your project, define open roles, and build your dream team.",
  },
  {
    icon: "🤝",
    title: "Collaborators",
    desc: "Find exciting early-stage projects and contribute your skills.",
  },
  {
    icon: "💼",
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
    <div className="relative flex flex-col items-center justify-center min-h-[88vh] px-6 text-center overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-2/3 w-[700px] h-[500px] rounded-full bg-primary/8 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[250px] rounded-full bg-violet-600/6 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[300px] h-[200px] rounded-full bg-purple-900/10 blur-[80px] pointer-events-none" />

      <div className="relative max-w-3xl space-y-8 z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 text-[11px] font-medium px-4 py-1.5 rounded-full border border-primary/25 bg-primary/8 text-primary/90 tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
          alterum alterius auxilio eget
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-[70px] font-bold tracking-tight leading-[1.04]">
          <span className="text-foreground/85">The platform for</span>
          <br />
          <span className="bg-gradient-to-r from-primary via-violet-400 to-purple-400 bg-clip-text text-transparent">
            startup builders
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-lg mx-auto">
          Founders publish projects. Collaborators, advisors and investors find
          them. Build your team or find your next venture.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/login">
            <Button
              size="lg"
              className="rounded-full px-10 h-12 text-base font-semibold glow-primary transition-all duration-300 hover:-translate-y-0.5"
            >
              Get started free
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-10 h-12 text-base border-white/12 bg-white/3 hover:bg-white/7 hover:border-white/25 transition-all duration-200"
            >
              Sign in
            </Button>
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 pt-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          <span className="text-xs text-muted-foreground/50 tracking-widest uppercase">Features</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-5 bg-white/3 border border-white/8 backdrop-blur-sm hover:bg-white/5 hover:border-primary/20 transition-all duration-200 group"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-sm text-foreground/90 mb-1.5 group-hover:text-primary transition-colors">
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
