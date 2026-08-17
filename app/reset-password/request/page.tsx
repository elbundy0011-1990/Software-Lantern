"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SITE_URL } from "@/lib/site";

type Role = "admin" | "partner";

function ResetPasswordRequestForm() {
  const searchParams = useSearchParams();
  const role: Role = searchParams.get("role") === "admin" ? "admin" : "partner";
  const loginHref = role === "admin" ? "/admin/login" : "/portal/login";

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${SITE_URL}/auth/callback?next=/reset-password/confirm&role=${role}`,
      });
      // Supabase itself never reveals whether the email matched an account,
      // so the same message shows regardless, this only branches on a
      // genuine request failure (network error), not on account existence.
      if (resetError) {
        setError("Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f7fb] flex items-center justify-center px-5">
      <div className="w-full max-w-[380px] bg-white border border-[#0d1117]/[0.08] rounded-2xl p-8 shadow-[0_2px_6px_rgba(13,17,23,0.04)]">
        <p className="mb-1 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
          {role === "admin" ? "Admin" : "Provider portal"}
        </p>
        <h1 className="font-sans font-semibold text-[26px] mb-6">Reset your password</h1>

        {submitted ? (
          <p className="text-[15px] leading-[1.5] text-[#3d4653]">
            If that email exists, a reset link has been sent. Check your inbox and follow the link
            to set a new password.
          </p>
        ) : (
          <form onSubmit={onSubmit}>
            <label className="block mb-6">
              <span className="block text-[13px] font-bold text-[#5c6573] mb-[7px]">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f6f7fb] border border-[#0d1117]/[0.12] rounded-full px-5 py-[12px] text-[15px] outline-none focus:border-[#4f46e5]"
              />
            </label>

            {error && <p className="mb-4 text-[14px] font-semibold text-[#c0451f]">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4f46e5] text-white rounded-full py-[13px] font-sans font-semibold text-[16px] hover:bg-[#4338ca] disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <p className="mt-5 text-center text-[14px] text-[#5c6573]">
          <Link href={loginHref} className="text-[#4f46e5] font-semibold">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function ResetPasswordRequestPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordRequestForm />
    </Suspense>
  );
}
