import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Ensombly — Find your ensemble, build together",
  description:
    "Founders publish projects. Collaborators, advisors and investors find them. The circle is complete when you find your team.",
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
