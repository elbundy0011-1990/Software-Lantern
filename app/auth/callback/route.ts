import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Handles the redirect Supabase sends the browser to after an email
// confirmation, magic link, or password reset link is clicked — the link
// points here with ?code=..., and this exchanges that PKCE code for a real
// session (setting the auth cookies) before sending the user on.
//
// Only the admin password-reset flow uses this since the legacy partner
// portal was removed (2026-10-21); `role` is passed through to the next page.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const role = searchParams.get("role");
  const rawNext = searchParams.get("next") || "/admin";
  // Only allow same-site relative paths — "next" comes from a query param,
  // so without this a crafted callback link could redirect an authenticated
  // user off-site (e.g. ?next=https://evil.example).
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/admin";
  const failureLoginPath = "/admin/login";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const nextUrl = new URL(next, origin);
      if (role) nextUrl.searchParams.set("role", role);
      return NextResponse.redirect(nextUrl.toString());
    }
  }

  return NextResponse.redirect(`${origin}${failureLoginPath}?error=confirmation_failed`);
}
