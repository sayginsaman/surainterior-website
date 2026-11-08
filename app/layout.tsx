import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Encode_Sans_Condensed, Jost } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/content";
import { Attribution } from "@/components/Attribution";
import "./globals.css";

const display = Cormorant_Garamond({ subsets: ["latin", "latin-ext"], weight: ["300", "400", "500"], style: ["normal", "italic"], variable: "--font-display" });
const sans = Jost({ subsets: ["latin", "latin-ext"], weight: ["300", "400", "500"], variable: "--font-sans" });
const brand = Encode_Sans_Condensed({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-brand" });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const description =
  "SURA INTERIOR is a residential interior design studio in Boca Raton, Florida: full-service design, kitchens, bathrooms, custom cabinetry and millwork, renovation coordination and furnishing across South Florida.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "SURA INTERIOR · Interior Design Studio in Boca Raton, Florida", template: "%s · SURA INTERIOR" },
  description,
  keywords: ["interior designer Boca Raton", "kitchen designer Boca Raton", "custom cabinetry Boca Raton", "interior design South Florida", "custom millwork", "media wall"],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "SURA INTERIOR · Thoughtful Design. Exceptional Living.",
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Walnut kitchen with a quartzite waterfall island designed by SURA INTERIOR" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f9f5ef",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  legalName: site.legalName,
  description,
  url: siteUrl,
  telephone: site.phone,
  email: site.email,
  image: `${siteUrl}/og.jpg`,
  address: { "@type": "PostalAddress", addressLocality: "Boca Raton", addressRegion: "FL", addressCountry: "US" },
  areaServed: site.serviceArea.map((name) => ({ "@type": "Place", name })),
  founder: { "@type": "Person", name: "Sura Kilic", hasCredential: "PhD in Interior Architecture" },
  sameAs: [site.instagram],
  knowsAbout: ["Interior design", "Kitchen design", "Custom cabinetry", "Millwork", "Space planning", "FF&E"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${brand.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Attribution />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
