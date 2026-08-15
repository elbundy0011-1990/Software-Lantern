import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Handles the redirect Supabase sends the browser to after an email
// confirmation (or magic link / password reset) link is clicked — the
// link points here with ?code=..., and this exchanges that PKCE code for
// a real session (setting the auth cookies) before sending the user on.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") || "/portal";
  // Only allow same-site relative paths — "next" comes from a query param,
  // so without this a crafted callback link could redirect an authenticated
  // user off-site (e.g. ?next=https://evil.example).
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/portal";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/portal/login?error=confirmation_failed`);
}
