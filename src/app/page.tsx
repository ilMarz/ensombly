import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <div className="max-w-2xl space-y-6">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-2">
          alterum alterius auxilio eget
        </div>
        <h1 className="text-5xl font-bold tracking-tight leading-tight">
          LinkedIn for<br />startup projects
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-lg mx-auto">
          Founders publish projects. Collaborators, advisors and investors find them.
          Build together.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/login">
            <Button size="lg" className="rounded-full px-8">Get started</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="rounded-full px-8">Sign in</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
