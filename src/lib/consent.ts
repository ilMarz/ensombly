export const CONSENT_KEY = "ensombly.cookie-consent";
export const CONSENT_VERSION = 1;
export const CONSENT_EVENT = "ensombly:consent-change";
export const OPEN_SETTINGS_EVENT = "ensombly:open-cookie-settings";

export interface ConsentState {
  version: number;
  necessary: true;
  analytics: boolean;
  timestamp: string;
}

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (parsed.version !== CONSENT_VERSION) return null;
    return {
      version: CONSENT_VERSION,
      necessary: true,
      analytics: parsed.analytics === true,
      timestamp: typeof parsed.timestamp === "string" ? parsed.timestamp : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function writeConsent({ analytics }: { analytics: boolean }): ConsentState {
  const state: ConsentState = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics,
    timestamp: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_EVENT, { detail: state }));
  }
  return state;
}

export function acceptAll(): ConsentState {
  return writeConsent({ analytics: true });
}

export function rejectAll(): ConsentState {
  return writeConsent({ analytics: false });
}

export function openCookieSettings(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT));
  }
}
