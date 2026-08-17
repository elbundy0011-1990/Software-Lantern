import { ChangePasswordForm } from "@/components/change-password-form";

export default function PortalAccountPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="mb-1 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
          Provider portal
        </p>
        <h1 className="font-sans font-semibold text-[30px]">Account</h1>
      </div>
      <ChangePasswordForm />
    </div>
  );
}
