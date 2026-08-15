import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const rawBody = await request.text();

  if (!signature || !secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const stripe = getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { metadata?: Record<string, string>; payment_intent?: string | null };
    const leadId = session.metadata?.lead_id;
    const partnerId = session.metadata?.partner_id;

    if (leadId && partnerId) {
      const admin = createAdminClient();
      const { error } = await admin.from("unlocks").insert({
        lead_id: leadId,
        partner_id: partnerId,
        stripe_payment_id: session.payment_intent || null,
      });
      // Ignore "already unlocked" (unique constraint) so Stripe's automatic
      // webhook retries stay idempotent. Anything else, surface it so Stripe
      // retries the delivery.
      if (error && error.code !== "23505") {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
