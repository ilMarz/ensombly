import Link from "next/link";
import { CookiePreferencesButton } from "@/components/cookie-preferences-button";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-border mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Ensombly</p>
        <nav className="flex items-center gap-5">
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link href="/projects" className="hover:text-foreground transition-colors">Projects</Link>
          <Link href="/cookies" className="hover:text-foreground transition-colors">Cookie &amp; privacy</Link>
          <CookiePreferencesButton />
        </nav>
      </div>
    </footer>
  );
}
