import type { Metadata } from "next";
import { Bricolage_Grotesque, Jost } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

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
  title: "Alterio — Find your team, build together",
  description:
    "alterum alterius auxilio eget — publish your project, find collaborators and advisors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${jost.variable} h-full antialiased bg-background`}
    >
      <body className="min-h-full flex flex-col" style={{ background: "transparent" }}>
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
