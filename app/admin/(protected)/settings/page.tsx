import { ChangePasswordForm } from "@/components/change-password-form";

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="mb-1 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">Admin</p>
        <h1 className="font-sans font-semibold text-[30px]">Settings</h1>
      </div>
      <ChangePasswordForm />
    </div>
  );
}
