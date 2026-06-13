import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
        <Skeleton className="h-5 w-80" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
      <section className="space-y-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </section>
      <section className="space-y-3">
        <Skeleton className="h-5 w-24" />
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </section>
    </div>
  );
}
