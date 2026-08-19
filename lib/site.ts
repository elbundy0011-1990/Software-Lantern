// Canonical production domain. The custom domain may not be DNS-live yet,
// but metadataBase/canonical URLs should declare the *intended* production
// domain so they're already correct the moment DNS cuts over — not the
// Vercel preview URL, which would need to be swapped out later. Override via
// NEXT_PUBLIC_SITE_URL if a different domain is ever needed (staging, etc).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.softwarelantern.com";

export const SITE_NAME = "Software Lantern";

// Homepage / sitewide-fallback title and description. Single source of truth
// so the root layout's fallback metadata (used by any future page that
// doesn't set its own) and the homepage's own explicit metadata can't drift
// apart. Title measured at 534.3px in 20px Arial (Google's desktop SERP
// title font approximation, ~600px truncation threshold), comfortably under.
export const SITE_TITLE = "EUDR, PLM & Battery Passport Software | Software Lantern";
export const SITE_DESCRIPTION =
  "Looking for EUDR, Fashion PLM, or Battery Passport software? Tell us what you need and we'll connect you with up to 3 providers that believe they can help.";
