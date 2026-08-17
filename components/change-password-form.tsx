"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Shared by /admin/settings and /portal/(protected)/account. No "current
// password" re-entry: updateUser() only needs the session already required
// to reach either page, it doesn't take or need one.
export function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
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
      setPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-[#0d1117]/[0.08] rounded-2xl p-7 max-w-[420px]"
    >
      <h2 className="font-sans font-semibold text-[20px] mb-5">Change password</h2>
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
          Confirm new password
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
      {success && <p className="mb-4 text-[14px] font-semibold text-[#047857]">Password updated.</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-[#4f46e5] text-white rounded-full px-6 py-[12px] font-sans font-semibold text-[15px] hover:bg-[#4338ca] disabled:opacity-60"
      >
        {loading ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
