import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <h1 className="text-5xl font-bold tracking-tight mb-4">alteriux</h1>
      <p className="text-muted-foreground text-lg mb-2 italic">
        alterum alterius auxilio eget
      </p>
      <p className="text-muted-foreground max-w-md mb-10">
        Publish your project. Find collaborators, co-founders, and advisors.
        Build together.
      </p>
      <div className="flex gap-4">
        <Link href="/projects">
          <Button variant="outline" size="lg">Browse projects</Button>
        </Link>
        <Link href="/projects/new">
          <Button size="lg">Publish your project</Button>
        </Link>
      </div>
    </div>
  );
}
