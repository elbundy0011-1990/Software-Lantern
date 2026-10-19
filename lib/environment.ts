// VERCEL_ENV is set by Vercel itself: "production" on the production
// deployment, "preview" on every preview deployment, "development" when
// running `vercel dev`. It's unset entirely outside Vercel (plain `next
// dev`, this repo's local dev). Treating anything other than the literal
// string "production" as non-production means local dev and every preview
// deployment, which all share the same production Supabase/Stripe/Resend
// credentials per .env.local, default to the safe (dry-run) path without
// needing a separate set of preview-only credentials.
export function isProductionDeploy(): boolean {
  return process.env.VERCEL_ENV === "production";
}
