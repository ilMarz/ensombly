"use client";

import { Analytics } from "@vercel/analytics/next";
import { useConsent } from "@/hooks/use-consent";

export function AnalyticsGate() {
  const { consent, ready } = useConsent();
  if (!ready || consent?.analytics !== true) return null;
  return <Analytics />;
}
