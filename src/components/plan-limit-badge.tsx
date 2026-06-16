import Link from "next/link";

export interface PlanLimitInfo {
  used: number;
  limit: number | null;
  allowed: boolean;
}

export function PlanLimitBadge({ info }: { info: PlanLimitInfo }) {
  if (info.limit === null) return null;

  const atLimit = !info.allowed;
  const nearLimit = !atLimit && info.limit > 1 && info.used >= info.limit - 1;

  if (!atLimit && !nearLimit) return null;

  return (
    <div
      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full w-fit ${
        atLimit
          ? "bg-destructive/10 text-destructive border border-destructive/20"
          : "bg-amber-900/20 text-amber-400 border border-amber-700/30"
      }`}
    >
      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-[2] shrink-0">
        <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>
        {info.used}/{info.limit} this month
        {atLimit && (
          <>
            {" · "}
            <Link href="/pricing" className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">
              Upgrade
            </Link>
          </>
        )}
      </span>
    </div>
  );
}
