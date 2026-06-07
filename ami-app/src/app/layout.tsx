import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

import "./globals.css";

// Display serif (Copernicus / Tiempos Headline substitute per DESIGN.md).
const displaySerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-display-serif",
  display: "swap",
});

// Humanist sans (StyreneB substitute per DESIGN.md).
const sansHumanist = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-humanist",
  display: "swap",
});

const monoCode = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AMI by Arham",
    template: "%s — AMI by Arham",
  },
  description:
    "Bespoke lab-grown diamond and gold jewelry. A modern royal heirloom, made for you.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${displaySerif.variable} ${sansHumanist.variable} ${monoCode.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-canvas text-ink antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
