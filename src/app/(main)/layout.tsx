import { Navbar } from "@/components/navbar";
import { EnsoBackground } from "@/components/enso-background";
import { AnalyticsGate } from "@/components/analytics-gate";
import { CookieConsent } from "@/components/cookie-consent";
import { SiteFooter } from "@/components/site-footer";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const admin = createAdminClient();
  const { data: settings } = await admin.from("platform_settings").select("beta_mode").single();
  const isBeta = settings?.beta_mode ?? false;

  return (
    <>
      <EnsoBackground />
      <Navbar />
      {isBeta && (
        <div className="sticky top-16 z-30 w-full bg-amber-950/80 border-b border-amber-800/50 backdrop-blur-sm">
          <p className="text-center text-xs font-medium text-amber-300 py-2 px-4">
            🚧 Ensombly è attualmente in fase di <strong>beta testing</strong> — alcune funzionalità potrebbero non essere disponibili o comportarsi in modo inatteso.
          </p>
        </div>
      )}
      <main className="flex-1 relative z-10">{children}</main>
      <SiteFooter />
      <CookieConsent />
      <AnalyticsGate />
    </>
  );
}
