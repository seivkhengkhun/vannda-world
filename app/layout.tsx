import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Unbounded, Instrument_Sans, Kantumruy_Pro } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { PlayerProvider } from "@/components/player/PlayerProvider";
import { MiniPlayer } from "@/components/player/MiniPlayer";
import { ExpandedPlayer } from "@/components/player/ExpandedPlayer";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { GrainOverlay } from "@/components/layout/GrainOverlay";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const kantumruy = Kantumruy_Pro({
  variable: "--font-kantumruy",
  subsets: ["khmer", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vannda-fanworld.example"),
  title: {
    default: "VANNDA WORLD — Fan Archive",
    template: "%s — VANNDA WORLD",
  },
  description:
    "An unofficial, fan-made digital archive of Cambodian artist VannDa — his music, journey, and universe. Not affiliated with VannDa or Baramey Production.",
  openGraph: {
    title: "VANNDA WORLD — Fan Archive",
    description:
      "An unofficial, fan-made digital archive of Cambodian artist VannDa — his music, journey, and universe.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${instrument.variable} ${kantumruy.variable}`}
    >
      <body className="min-h-screen bg-void font-sans text-ink antialiased">
        <LanguageProvider>
          <PlayerProvider>
            <GrainOverlay />
            <Nav />
            <main className="pt-16">{children}</main>
            <Footer />
            <MiniPlayer />
            <ExpandedPlayer />
          </PlayerProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
