import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Jost } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0f",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const DESCRIPTION =
  "Founders publish projects. Collaborators, advisors and investors find them. The circle is complete when you find your team.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ensombly — Find your ensemble, build together",
    template: "%s — Ensombly",
  },
  description: DESCRIPTION,
  keywords: ["startup projects", "co-founder", "collaborators", "investors", "team building", "startup network"],
  authors: [{ name: "Ensombly", url: SITE_URL }],
  creator: "Ensombly",
  openGraph: {
    type: "website",
    siteName: "Ensombly",
    title: "Ensombly — Find your ensemble, build together",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Ensombly — Find your ensemble, build together",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${jost.variable} h-full antialiased bg-background`}
    >
      <body className="min-h-full flex flex-col" style={{ background: "transparent" }}>
        {children}
      </body>
    </html>
  );
}
