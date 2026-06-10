import Link from "next/link";
import { Button } from "@/components/ui/button";

const FEATURES = [
  { icon: "🚀", title: "Publish your project", desc: "Share what you're building with the world" },
  { icon: "🤝", title: "Find collaborators", desc: "Connect with engineers, designers, and domain experts" },
  { icon: "💡", title: "Attract investors", desc: "Get on the radar of people looking to back ideas" },
  { icon: "🌐", title: "Build in public", desc: "Grow your network while building your startup" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/8 blur-[130px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-violet-500/6 blur-[100px]" />
          <div className="absolute top-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-purple-500/5 blur-[80px]" />
        </div>

        <span className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 text-primary text-xs font-medium px-4 py-1.5 rounded-full mb-8 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          alterum alterius auxilio eget
        </span>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
          Find your team,{" "}
          <span className="bg-gradient-to-r from-primary via-violet-500 to-purple-600 bg-clip-text text-transparent">
            build together
          </span>
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg max-w-lg mb-10 leading-relaxed">
          Publish your project. Attract collaborators, co-founders, and advisors.
          The place where startup ideas find their team.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-16">
          <Link href="/projects/new">
            <Button size="lg" className="w-full sm:w-auto rounded-full px-8 h-12 text-base shadow-lg shadow-primary/25">
              Publish your project
            </Button>
          </Link>
          <Link href="/projects">
            <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 h-12 text-base">
              Browse projects
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
          {["100% free", "No payments", "Network only", "Open source ready"].map((f) => (
            <span key={f} className="border border-border/60 rounded-full px-3 py-1 bg-muted/40 text-xs">{f}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Everything you need to grow</h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            From idea to team — alteriux connects founders with the people they need.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="border border-border/60 rounded-2xl p-6 bg-card hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 group"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold mb-1.5 group-hover:text-primary transition-colors">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto text-center border border-border/60 rounded-3xl p-12 bg-card relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5" />
          <h2 className="text-3xl font-bold tracking-tight mb-3">Ready to start?</h2>
          <p className="text-muted-foreground mb-8">
            Join founders who are already building with their dream team.
          </p>
          <Link href="/projects/new">
            <Button size="lg" className="rounded-full px-10 shadow-lg shadow-primary/20">
              Publish your project — it&apos;s free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
