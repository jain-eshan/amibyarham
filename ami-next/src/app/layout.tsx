import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import CommissionModal from "@/components/commission/CommissionModal";
import { ModalProvider } from "@/context/ModalContext";
import {
  Bodoni_Moda,
  EB_Garamond,
  DM_Sans,
  Caveat,
  Noto_Serif_Devanagari,
} from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const notoDevanagari = Noto_Serif_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ami by arham — The beloved, made by hand.",
  description:
    "A jewellery house with no catalogue. You bring the design you love — a Pinterest save, a sketch — and our master karigars handcraft it in lab-grown diamonds. IGI certified, BIS hallmarked, priced in full.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={[
        bodoni.variable,
        garamond.variable,
        dmSans.variable,
        caveat.variable,
        notoDevanagari.variable,
      ].join(" ")}
    >
      <body className="min-h-full">
        <ModalProvider>
          <NavBar />
          {children}
          <Footer />
          <CommissionModal />
        </ModalProvider>
      </body>
    </html>
  );
}
