"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Role = "admin" | "partner";

function ResetPasswordConfirmForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role: Role = searchParams.get("role") === "admin" ? "admin" : "partner";
  const loginHref = role === "admin" ? "/admin/login" : "/portal/login";
  const requestHref = `/reset-password/request?role=${role}`;

  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // The callback route's code exchange already set the auth cookies
    // before redirecting here — this just confirms that actually happened
    // (an expired or already-used reset link lands here with no session).
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setChecking(false);
    });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      // Sign out so they log in fresh with the new password, rather than
      // silently continuing on the session the reset link itself created.
      await supabase.auth.signOut();
      router.push(loginHref);
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
        <h1 className="font-sans font-semibold text-[26px] mb-6">Set a new password</h1>

        {checking ? (
          <p className="text-[15px] text-[#5c6573]">Checking your reset link…</p>
        ) : !hasSession ? (
          <>
            <p className="mb-4 text-[15px] leading-[1.5] text-[#3d4653]">
              This reset link is invalid or has expired.
            </p>
            <Link href={requestHref} className="text-[14px] font-semibold text-[#4f46e5]">
              Request a new link
            </Link>
          </>
        ) : (
          <form onSubmit={onSubmit}>
            <label className="block mb-4">
              <span className="block text-[13px] font-bold text-[#5c6573] mb-[7px]">New password</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#f6f7fb] border border-[#0d1117]/[0.12] rounded-full px-5 py-[12px] text-[15px] outline-none focus:border-[#4f46e5]"
              />
            </label>
            <label className="block mb-6">
              <span className="block text-[13px] font-bold text-[#5c6573] mb-[7px]">
                Confirm password
              </span>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#f6f7fb] border border-[#0d1117]/[0.12] rounded-full px-5 py-[12px] text-[15px] outline-none focus:border-[#4f46e5]"
              />
            </label>

            {error && <p className="mb-4 text-[14px] font-semibold text-[#c0451f]">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4f46e5] text-white rounded-full py-[13px] font-sans font-semibold text-[16px] hover:bg-[#4338ca] disabled:opacity-60"
            >
              {loading ? "Saving…" : "Set new password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordConfirmForm />
    </Suspense>
  );
}
