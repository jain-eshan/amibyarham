import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import CommissionModal from "@/components/commission/CommissionModal";
import { ModalProvider } from "@/context/ModalContext";
import Preloader from "@/components/layout/Preloader";
import Toast from "@/components/ui/Toast";
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

const SITE_URL = "https://www.amibyarham.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ami by arham — The beloved, made by hand.",
  description:
    "A jewellery house with no catalogue. You bring the design you love — a Pinterest save, a sketch — and our master karigars handcraft it in lab-grown diamonds. IGI certified, BIS hallmarked, priced in full.",
  keywords: [
    "custom jewellery",
    "lab grown diamonds",
    "bespoke jewellery india",
    "IGI certified diamonds",
    "BIS hallmark gold",
    "ami by arham",
    "handcrafted jewellery",
    "commission jewellery",
    "delhi jeweller",
  ],
  authors: [{ name: "ami by arham" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "ami by arham",
    title: "ami by arham — The beloved, made by hand.",
    description:
      "No catalogue. No showroom. Just your vision, our karigars, and lab-grown diamonds certified by IGI and BIS hallmarked.",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "ami by arham — bespoke jewellery house",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ami by arham — The beloved, made by hand.",
    description:
      "No catalogue. No showroom. Just your vision, our karigars, and lab-grown diamonds certified by IGI and BIS hallmarked.",
    images: ["/og"],
  },
  icons: {
    icon: "/assets/ami-logo.svg",
    apple: "/assets/ami-logo.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
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
          <Preloader />
          <NavBar />
          {children}
          <Footer />
          <CommissionModal />
          <Toast />
        </ModalProvider>
      </body>
    </html>
  );
}
