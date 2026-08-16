import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const TITLE = "Software Lantern | Tell us what software you need";
const DESCRIPTION =
  "Tell us what software you need. We'll connect you with up to 3 providers that believe they have the right solution. Free for buyers, no obligation.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  // Deliberately no root-level `alternates.canonical` — this metadata is the
  // fallback every page inherits unless it sets its own, and a canonical
  // here would wrongly point every un-overridden page (e.g. /providers) back
  // at "/". Canonical is set explicitly per-page instead (see /eudr, /plm,
  // /battery-passport, /finder); pages without one simply omit the tag,
  // which is a normal, safe default rather than an error.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: DESCRIPTION,
  email: "info@softwarelantern.com",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSans.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#0d1117] font-sans antialiased selection:bg-[#4f46e5]/[0.18]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
