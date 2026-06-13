import type { Metadata } from "next";
import { CookiePreferencesButton } from "@/components/cookie-preferences-button";

export const metadata: Metadata = {
  title: "Cookie & Privacy Policy — Ensombly",
  description: "How Ensombly uses cookies and handles your data, in line with GDPR and the ePrivacy Directive.",
};

const COOKIES = [
  {
    category: "Strictly necessary",
    purpose: "Authentication, session management (Supabase) and storing your cookie-consent choice.",
    optional: "Always on",
  },
  {
    category: "Analytics",
    purpose: "Vercel Analytics — anonymous, aggregated usage and performance statistics. Loaded only after you opt in.",
    optional: "Opt-in",
  },
];

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 space-y-12">
      <section className="space-y-4">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-accent">Legal</p>
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl leading-tight tracking-tight">
          Cookie &amp; Privacy Policy
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          This page explains what cookies and similar technologies Ensombly uses, why, and how you
          can control them. It is provided in line with the EU General Data Protection Regulation
          (GDPR) and the ePrivacy Directive. Non-essential cookies are never set without your prior
          consent.
        </p>
        <p className="text-xs text-muted-foreground">Last updated: 13 June 2026</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading font-bold text-xl">Cookies we use</h2>
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-left">
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Purpose</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Consent</th>
              </tr>
            </thead>
            <tbody>
              {COOKIES.map((c) => (
                <tr key={c.category} className="border-t border-border align-top">
                  <td className="px-4 py-3 font-medium">{c.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.purpose}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{c.optional}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading font-bold text-xl">Your consent &amp; how to withdraw it</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          On your first visit you are asked to accept or reject optional cookies. Analytics does not
          load until you grant consent. Your choice is stored locally in your browser and you can
          change or withdraw it at any time:
        </p>
        <p className="text-sm">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-primary font-medium">
            <CookiePreferencesButton />
          </span>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading font-bold text-xl">Data &amp; your rights</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Account data you provide (profile, projects, applications) is processed to operate the
          platform and stored with our processor Supabase. Analytics data, when enabled, is
          anonymous and aggregated. Under the GDPR you have the right to access, rectify, export and
          erase your data, and to object to or restrict processing.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          To exercise these rights or for any privacy question, contact the data controller at{" "}
          <a href="mailto:privacy@ensombly.com" className="text-primary hover:text-primary/80 underline underline-offset-2">
            privacy@ensombly.com
          </a>.
        </p>
      </section>
    </div>
  );
}
