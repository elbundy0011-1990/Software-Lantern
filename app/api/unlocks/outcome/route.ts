import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Reject unauthenticated requests here, before ever reaching the RPC —
  // update_unlock_outcome()'s own ownership check (auth.uid() resolves to
  // nothing for an anonymous caller, so the update matches zero rows) would
  // also stop this, but this route shouldn't rely on that as its only gate,
  // same pattern as /api/stripe/checkout.
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  let body: { unlockId?: string; outcome?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { unlockId, outcome } = body;
  if (!unlockId || (outcome !== "won" && outcome !== "lost")) {
    return NextResponse.json({ error: "Invalid outcome" }, { status: 400 });
  }

  const { error } = await supabase.rpc("update_unlock_outcome", {
    p_unlock_id: unlockId,
    p_outcome: outcome,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
