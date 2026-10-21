import { redirect } from "next/navigation";

// The admin home used to be the marketplace leads list. OT enquiries are
// the only admin data now, so /admin goes straight there.
export default function AdminHomePage() {
  redirect("/admin/ot-enquiries");
}
