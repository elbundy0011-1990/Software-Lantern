import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data: partner } = await supabase
    .from("partners")
    .select("id, company_name, status")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  if (!partner) return NextResponse.json({ error: "No partner account" }, { status: 403 });
  // Independent of the leads list being hidden for a pending/rejected
  // partner (get_partner_leads() returns zero rows for them): a partner
  // who somehow already has a lead_id (an old bookmark, a direct API call)
  // must not be able to start checkout for it either.
  if (partner.status !== "approved") {
    return NextResponse.json(
      { error: "Your provider application has not been approved yet." },
      { status: 403 },
    );
  }

  let leadId: string;
  try {
    const body = await request.json();
    leadId = body.leadId;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!leadId) return NextResponse.json({ error: "Missing leadId" }, { status: 400 });

  const admin = createAdminClient();
  const { data: lead } = await admin
    .from("leads")
    .select("id, status, category, unlock_count, max_unlocks, price_per_unlock")
    .eq("id", leadId)
    .maybeSingle();

  if (!lead || lead.status !== "published") {
    return NextResponse.json({ error: "Lead not available" }, { status: 404 });
  }
  if (lead.unlock_count >= lead.max_unlocks) {
    return NextResponse.json({ error: "This lead is fully allocated" }, { status: 409 });
  }
  const { data: existingUnlock } = await admin
    .from("unlocks")
    .select("id")
    .eq("lead_id", leadId)
    .eq("partner_id", partner.id)
    .maybeSingle();
  if (existingUnlock) {
    return NextResponse.json({ error: "Already unlocked" }, { status: 409 });
  }
  if (!lead.price_per_unlock) {
    return NextResponse.json({ error: "This lead has no price set yet" }, { status: 400 });
  }

  const origin = request.headers.get("origin") || new URL(request.url).origin;
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email || undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(lead.price_per_unlock * 100),
          product_data: {
            name: `${lead.category || "Software"} lead unlock`,
            description: "Company and contact details for one buyer brief",
          },
        },
      },
    ],
    metadata: {
      lead_id: lead.id,
      partner_id: partner.id,
    },
    success_url: `${origin}/portal?unlocked=${lead.id}`,
    cancel_url: `${origin}/portal`,
  });

  return NextResponse.json({ url: session.url });
}
