import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import type { ReactNode } from "react";

import { PostHogProvider } from "@/components/PostHogProvider";
import { PublicShell } from "@/components/PublicShell";

import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://www.arhamdiamonds.in";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-KLY5WJ05VM";

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

// Brand wordmark face — matches the AMI logo. Use sparingly for wordmark-style headlines.
const brandFace = localFont({
  src: "../../public/fonts/BayerTypeArchiType-Regular.otf",
  variable: "--font-brand-face",
  display: "swap",
});

const description =
  "AMI by Arham turns saved jewellery references into custom fine jewellery through Arham's 50-year Delhi jewellery heritage, trusted craftsmen, and guided online consultation.";

const keywords = [
  "AMI by Arham",
  "custom jewellery from photo India",
  "bespoke jewellery India",
  "custom engagement rings Delhi",
  "custom polki jewellery",
  "custom jadau jewellery",
  "lab grown diamonds India",
  "heritage gold jewellery",
  "commissioned fine jewelry",
  "Arham Diamonds",
  "modern Indian fine jewelry",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AMI by Arham — Your Family Jeweller, Online",
    template: "%s — AMI by Arham",
  },
  description,
  keywords,
  applicationName: "AMI by Arham",
  category: "jewelry",
  authors: [{ name: "AMI by Arham" }, { name: "Arham Diamonds" }],
  creator: "AMI by Arham",
  publisher: "Arham Diamonds",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/brand/ami-mark-ink.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/brand/ami-mark-ink.svg",
  },
  openGraph: {
    type: "website",
    siteName: "AMI by Arham",
    title: "AMI by Arham — Your Family Jeweller, Online",
    description,
    url: SITE_URL,
    locale: "en_IN",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "AMI by Arham — custom jewellery from your references",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AMI by Arham — Your Family Jeweller, Online",
    description,
    images: ["/brand/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#181715" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Schema.org JSON-LD — surfaces brand, atelier, and site search in Google + AI crawlers.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "AMI by Arham",
      legalName: "Arham Diamonds",
      url: SITE_URL,
      logo: `${SITE_URL}/brand/ami-mark-ink.svg`,
      description,
      slogan: "Your family jeweller, online.",
      areaServed: { "@type": "Country", name: "India" },
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
        addressLocality: "Delhi",
      },
      sameAs: [
        "https://www.linkedin.com/company/arham-diamond",
        "https://www.instagram.com/amibyarham/",
        "https://www.facebook.com/profile.php?id=61590698912033",
      ],
    },
    {
      "@type": "JewelryStore",
      "@id": `${SITE_URL}/#atelier`,
      name: "AMI by Arham Atelier",
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
      url: SITE_URL,
      image: `${SITE_URL}/brand/ami-mark-ink.svg`,
      priceRange: "₹₹₹",
      description:
        "Bespoke fine jewellery from saved references, guided by Arham's jewellery legacy and trusted craftsmen.",
      makesOffer: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Custom fine jewellery from references",
            category: "Fine Jewelry",
            material: ["Gold", "Diamond", "Lab-grown diamond", "Polki"],
          },
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "AMI by Arham",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-IN",
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${displaySerif.variable} ${sansHumanist.variable} ${monoCode.variable} ${brandFace.variable}`}
    >
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-canvas text-ink antialiased">
        <PostHogProvider>
          <PublicShell>{children}</PublicShell>
          {GA_ID && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
              />
              <Script id="ga-init" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `}
              </Script>
            </>
          )}
        </PostHogProvider>
      </body>
    </html>
  );
}
