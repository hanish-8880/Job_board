import type { Metadata } from "next";
import { Source_Serif_4, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Signalboard — A job board that shows its work",
  description:
    "Every listing carries a transparent Signal Score and a plain-language red-flag check, backed by real accounts and a real database.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-rule">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
            <p className="font-mono text-xs text-ink-faint">
              Signal Score and the red-flag check are transparent heuristics
              computed from a listing&apos;s own text — not AI. Resume Review
              and Cover Letter Generator are real Google Gemini calls, clearly
              labeled as such where they appear.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
