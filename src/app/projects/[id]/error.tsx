"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ProjectPage] error:", error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <p className="text-4xl mb-4">⚠️</p>
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-sm text-muted-foreground mb-6">{error.message}</p>
      <div className="flex gap-3 justify-center">
        <Button variant="outline" className="rounded-full" onClick={reset}>Try again</Button>
        <Link href="/projects"><Button className="rounded-full">Browse projects</Button></Link>
      </div>
    </div>
  );
}
