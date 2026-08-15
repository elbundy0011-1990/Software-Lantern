// Canonical production domain. The custom domain may not be DNS-live yet,
// but metadataBase/canonical URLs should declare the *intended* production
// domain so they're already correct the moment DNS cuts over — not the
// Vercel preview URL, which would need to be swapped out later. Override via
// NEXT_PUBLIC_SITE_URL if a different domain is ever needed (staging, etc).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.softwarelantern.com";

export const SITE_NAME = "Software Lantern";
