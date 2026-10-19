import { isProductionDeploy } from "./environment";

// Single flag controlling whether the OT cybersecurity pages are
// indexable. Flip NEXT_PUBLIC_OT_INDEXABLE=true in Vercel's production
// environment variables when ready to go live in search — even then,
// this only evaluates true on an actual production deploy, never a
// preview or local build, so there is no way to accidentally index a
// preview by setting the env var too broadly. Defaults to false (noindex)
// until explicitly flipped.
export const OT_SITE_INDEXABLE =
  process.env.NEXT_PUBLIC_OT_INDEXABLE === "true" && isProductionDeploy();
