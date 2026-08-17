import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Handles the redirect Supabase sends the browser to after an email
// confirmation, magic link, or password reset link is clicked — the link
// points here with ?code=..., and this exchanges that PKCE code for a real
// session (setting the auth cookies) before sending the user on.
//
// `role` ("admin" | "partner" | absent) says which surface initiated the
// flow, so both the failure fallback and the success redirect can send the
// person back to the right place — partner-signup confirmation (the only
// flow that existed before password reset) never passes `role`, so it's
// null there and everything below falls through to the exact same
// behavior it already had: no regression for that flow.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const role = searchParams.get("role");
  const rawNext = searchParams.get("next") || "/portal";
  // Only allow same-site relative paths — "next" comes from a query param,
  // so without this a crafted callback link could redirect an authenticated
  // user off-site (e.g. ?next=https://evil.example).
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/portal";
  const failureLoginPath = role === "admin" ? "/admin/login" : "/portal/login";

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
