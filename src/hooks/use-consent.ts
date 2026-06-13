"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CONSENT_EVENT,
  CONSENT_KEY,
  acceptAll as acceptAllConsent,
  readConsent,
  rejectAll as rejectAllConsent,
  writeConsent,
  type ConsentState,
} from "@/lib/consent";

export function useConsent() {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);

    const onChange = () => setConsent(readConsent());
    const onStorage = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY) setConsent(readConsent());
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setAnalytics = useCallback((analytics: boolean) => {
    setConsent(writeConsent({ analytics }));
  }, []);
  const acceptAll = useCallback(() => setConsent(acceptAllConsent()), []);
  const rejectAll = useCallback(() => setConsent(rejectAllConsent()), []);

  return { consent, ready, setAnalytics, acceptAll, rejectAll };
}
