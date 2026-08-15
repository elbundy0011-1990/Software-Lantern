import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Ensures the signed-in Supabase Auth user has a matching partners row,
// creating it on first access using the company_name captured at signup
// (stored in user_metadata) — covers both "email confirmation off" (row
// created right after signUp) and "email confirmation on" (row created here,
// the first time the confirmed user actually loads the portal).
export async function requirePartner() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/portal/login");

  const { data: existing } = await supabase
    .from("partners")
    .select("id, company_name, contact_email")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (existing) return { user, partner: existing };

  const companyName = (user.user_metadata?.company_name as string | undefined) || "New partner";
  const contactEmail = user.email || "";

  const { data: created, error } = await supabase.rpc("create_partner", {
    p_company_name: companyName,
    p_contact_email: contactEmail,
  });

  if (error || !created) redirect("/portal/login");

  return { user, partner: created };
}
