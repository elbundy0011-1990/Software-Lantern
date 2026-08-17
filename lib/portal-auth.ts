import "server-only";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/resend";
import { buildNewPartnerAdminEmail } from "@/lib/email-templates";

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
    .select("id, company_name, contact_email, categories, status")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (existing) return { user, partner: existing };

  const companyName = (user.user_metadata?.company_name as string | undefined) || "New partner";
  const contactEmail = user.email || "";
  const categories = (user.user_metadata?.categories as string[] | undefined) || [];

  const { data: created, error } = await supabase.rpc("create_partner", {
    p_company_name: companyName,
    p_contact_email: contactEmail,
    p_categories: categories,
  });

  if (error || !created) redirect("/portal/login");

  // New partner row, lands in 'pending' by the table's own default. Same
  // scheduled-via-after() reasoning as Trigger 1: a slow or down Resend
  // must never fail or delay the redirect into the portal that already
  // succeeded above.
  if (process.env.ADMIN_EMAIL) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const partnerId = created.id;
    const partnerCompanyName = created.company_name;
    const partnerContactEmail = created.contact_email;
    const partnerCategories = created.categories as string[];
    after(async () => {
      try {
        const { subject, html } = buildNewPartnerAdminEmail({
          partnerId,
          companyName: partnerCompanyName,
          contactEmail: partnerContactEmail,
          categories: partnerCategories,
        });
        await sendEmail({ to: adminEmail, subject, html });
      } catch (err) {
        console.error("Failed to send new-partner admin notification", err);
      }
    });
  }

  return { user, partner: created };
}
