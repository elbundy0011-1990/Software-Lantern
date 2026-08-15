import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Verifies the current Supabase Auth session belongs to the admin email.
// Redirects to /admin/login if not signed in or not the admin — call this
// at the top of every protected admin server component / action.
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!user || !adminEmail || user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
    redirect("/admin/login");
  }

  return user;
}
