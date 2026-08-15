import { NextResponse } from "next/server";

// TEMPORARY diagnostic route — reports which env vars this specific
// deployment/runtime can actually see, without leaking secret values.
// Hit it on your live Vercel URL, then DELETE this file once you've
// confirmed the vars are present (don't leave an env-introspection
// endpoint in production).
export async function GET() {
  const mask = (v: string | undefined) => (v ? `${v.slice(0, 6)}…(${v.length} chars)` : null);

  return NextResponse.json({
    runtime: typeof (globalThis as { EdgeRuntime?: unknown }).EdgeRuntime !== "undefined" ? "edge" : "nodejs",
    vars: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: mask(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      SUPABASE_SERVICE_ROLE_KEY: mask(process.env.SUPABASE_SERVICE_ROLE_KEY),
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || null,
      STRIPE_SECRET_KEY: mask(process.env.STRIPE_SECRET_KEY),
      STRIPE_WEBHOOK_SECRET: mask(process.env.STRIPE_WEBHOOK_SECRET),
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || null,
      TURNSTILE_SECRET_KEY: mask(process.env.TURNSTILE_SECRET_KEY),
    },
  });
}
