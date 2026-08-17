"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const URL_ERROR_MESSAGES: Record<string, string> = {
  confirmation_failed: "That confirmation link didn't work. It may have expired. Try signing in, or sign up again.",
};

function PartnerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    urlError ? URL_ERROR_MESSAGES[urlError] || "Something went wrong. Please try again." : null,
  );
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError("Incorrect email or password.");
        return;
      }
      router.push("/portal");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? `Sign-in failed: ${err.message}`
          : "Sign-in failed unexpectedly. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f7fb] flex items-center justify-center px-5">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[380px] bg-white border border-[#0d1117]/[0.08] rounded-2xl p-8 shadow-[0_2px_6px_rgba(13,17,23,0.04)]"
      >
        <p className="mb-1 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
          Provider portal
        </p>
        <h1 className="font-sans font-semibold text-[26px] mb-6">Sign in</h1>

        <label className="block mb-4">
          <span className="block text-[13px] font-bold text-[#5c6573] mb-[7px]">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#f6f7fb] border border-[#0d1117]/[0.12] rounded-full px-5 py-[12px] text-[15px] outline-none focus:border-[#4f46e5]"
          />
        </label>
        <label className="block mb-3">
          <span className="block text-[13px] font-bold text-[#5c6573] mb-[7px]">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#f6f7fb] border border-[#0d1117]/[0.12] rounded-full px-5 py-[12px] text-[15px] outline-none focus:border-[#4f46e5]"
          />
        </label>
        <p className="mb-6 text-right">
          <Link href="/reset-password/request?role=partner" className="text-[13px] font-semibold text-[#4f46e5]">
            Forgot password?
          </Link>
        </p>

        {error && <p className="mb-4 text-[14px] font-semibold text-[#c0451f]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4f46e5] text-white rounded-full py-[13px] font-sans font-semibold text-[16px] hover:bg-[#4338ca] disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="mt-5 text-center text-[14px] text-[#5c6573]">
          New provider?{" "}
          <Link href="/portal/signup" className="text-[#4f46e5] font-semibold">
            Apply here
          </Link>
        </p>
      </form>
    </main>
  );
}

export default function PartnerLoginPage() {
  return (
    <Suspense fallback={null}>
      <PartnerLoginForm />
    </Suspense>
  );
}
