"use client";

import { openCookieSettings } from "@/lib/consent";

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      Cookie preferences
    </button>
  );
}
