"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlanLimitBadge } from "@/components/plan-limit-badge";
import type { PlanLimitInfo } from "@/components/plan-limit-badge";

export function NewProjectButton({ limitInfo }: { limitInfo: PlanLimitInfo }) {
  return (
    <div className="flex flex-col items-end gap-1.5">
      {limitInfo.allowed ? (
        <Link href="/projects/new">
          <Button className="rounded-lg px-5 font-semibold shrink-0">+ New project</Button>
        </Link>
      ) : (
        <Button disabled className="rounded-lg px-5 font-semibold shrink-0 opacity-50 cursor-not-allowed">
          + New project
        </Button>
      )}
      <PlanLimitBadge info={limitInfo} />
    </div>
  );
}
