import { isProductionDeploy } from "./environment";

// Single flag controlling whether the OT cybersecurity pages are
// indexable. True by default on an actual production deploy, in code,
// with no Vercel environment variable required — isProductionDeploy()
// checks process.env.VERCEL_ENV === "production" exactly, which Vercel
// sets only on the real production deployment (never a preview, never
// local dev), so there is no way to accidentally index a preview.
// /enquiry (app/(ot)/enquiry/page.tsx) overrides this with a hardcoded
// noindex: true regardless of this flag, since a lead-capture form page
// stays out of search even once the rest of the site is indexable.
export const OT_SITE_INDEXABLE = isProductionDeploy();
