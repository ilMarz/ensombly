import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[88vh] px-6 text-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-violet-500/8 blur-[80px]" />
      </div>

      {/* Latin tag */}
      <span className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 text-primary text-xs font-medium px-3 py-1 rounded-full mb-8 tracking-wide">
        alterum alterius auxilio eget
      </span>

      {/* Heading */}
      <h1 className="text-6xl sm:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
        Find your team,{" "}
        <span className="bg-gradient-to-r from-primary via-violet-500 to-purple-600 bg-clip-text text-transparent">
          build together
        </span>
      </h1>

      <p className="text-muted-foreground text-lg max-w-lg mb-10 leading-relaxed">
        Publish your project. Attract collaborators, co-founders, and advisors.
        The place where startup ideas find their team.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-20">
        <Link href="/projects/new">
          <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/25">
            Publish your project
          </Button>
        </Link>
        <Link href="/projects">
          <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base">
            Browse projects
          </Button>
        </Link>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
        {["Find collaborators", "Connect with investors", "Build your dream team", "100% free"].map((f) => (
          <span key={f} className="border rounded-full px-3 py-1 bg-muted/50">{f}</span>
        ))}
      </div>
    </div>
  );
}
