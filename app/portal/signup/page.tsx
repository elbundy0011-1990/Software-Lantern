"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PartnerSignupPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { company_name: companyName },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/portal`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.session) {
        router.push("/portal");
        router.refresh();
      } else {
        setNotice("Check your email to confirm your account, then sign in.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? `Sign-up failed: ${err.message}`
          : "Sign-up failed unexpectedly. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f7fb] flex items-center justify-center px-5 py-16">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[420px] bg-white border border-[#0d1117]/[0.08] rounded-2xl p-8 shadow-[0_2px_6px_rgba(13,17,23,0.04)]"
      >
        <p className="mb-1 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
          Provider portal
        </p>
        <h1 className="font-sans font-semibold text-[26px] mb-6">Apply as a provider</h1>

        <label className="block mb-4">
          <span className="block text-[13px] font-bold text-[#5c6573] mb-[7px]">Company name</span>
          <input
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full bg-[#f6f7fb] border border-[#0d1117]/[0.12] rounded-full px-5 py-[12px] text-[15px] outline-none focus:border-[#4f46e5]"
          />
        </label>
        <label className="block mb-4">
          <span className="block text-[13px] font-bold text-[#5c6573] mb-[7px]">Work email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#f6f7fb] border border-[#0d1117]/[0.12] rounded-full px-5 py-[12px] text-[15px] outline-none focus:border-[#4f46e5]"
          />
        </label>
        <label className="block mb-6">
          <span className="block text-[13px] font-bold text-[#5c6573] mb-[7px]">Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#f6f7fb] border border-[#0d1117]/[0.12] rounded-full px-5 py-[12px] text-[15px] outline-none focus:border-[#4f46e5]"
          />
        </label>

        {error && <p className="mb-4 text-[14px] font-semibold text-[#c0451f]">{error}</p>}
        {notice && <p className="mb-4 text-[14px] font-semibold text-[#047857]">{notice}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4f46e5] text-white rounded-full py-[13px] font-sans font-semibold text-[16px] hover:bg-[#4338ca] disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
        <p className="mt-5 text-center text-[14px] text-[#5c6573]">
          Already have an account?{" "}
          <Link href="/portal/login" className="text-[#4f46e5] font-semibold">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
