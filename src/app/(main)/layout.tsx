import { Navbar } from "@/components/navbar";
import { EnsoBackground } from "@/components/enso-background";
import { AnalyticsGate } from "@/components/analytics-gate";
import { CookieConsent } from "@/components/cookie-consent";
import { SiteFooter } from "@/components/site-footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EnsoBackground />
      <Navbar />
      <main className="flex-1 relative z-10">{children}</main>
      <SiteFooter />
      <CookieConsent />
      <AnalyticsGate />
    </>
  );
}
