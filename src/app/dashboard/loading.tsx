import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">
      <Skeleton className="h-9 w-40" />
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </section>
      <section className="space-y-4">
        <Skeleton className="h-6 w-36" />
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </section>
    </div>
  );
}
