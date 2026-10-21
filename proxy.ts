import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Legacy EUDR / Fashion PLM / Battery Passport marketplace, removed
// 2026-10-21. Every URL under these prefixes answers 410 Gone (not 404) so
// search engines drop them quickly instead of retrying.
const GONE_PREFIXES = [
  "/eudr",
  "/plm",
  "/battery-passport",
  "/providers",
  "/finder",
  "/resources",
  "/portal",
  "/api/leads",
  "/api/stripe",
  "/api/unlocks",
];

function isGone(pathname: string): boolean {
  return GONE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

const GONE_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Page removed</title></head><body style="font-family:sans-serif;max-width:560px;margin:80px auto;padding:0 20px;color:#1a1d22"><h1>This page has been removed</h1><p>It is no longer part of this site.</p><p><a href="/">Go to the homepage</a></p></body></html>`;

export async function proxy(request: NextRequest) {
  if (isGone(request.nextUrl.pathname)) {
    return new NextResponse(GONE_HTML, {
      status: 410,
      headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" },
    });
  }

  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // This runs on nearly every request (see matcher below) — a missing env
  // var here must not take down the entire site. Log loudly and let the
  // request through unauthenticated rather than 500ing every route;
  // requireAdmin() still redirects correctly since they'll
  // see no session, and routes that actually need Supabase will fail with
  // a clear error scoped to just that route instead of the whole app.
  if (!url || !anonKey) {
    console.error(
      "proxy.ts: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in this environment — skipping session refresh.",
    );
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Refresh the session if needed — keeps server components' auth.uid() valid.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
