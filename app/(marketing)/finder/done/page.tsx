"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { categoryInfoLink } from "@/lib/finder-config";

interface DoneState {
  category: string | null;
  summary: { label: string; value: string }[];
}

export default function FinderDonePage() {
  const [state, setState] = useState<DoneState | null>(null);

  useEffect(() => {
    // Reads the one-shot summary written by the finder wizard right before
    // it navigated here; not derivable from props/URL, so this has to be an
    // effect rather than a lazy useState initializer (which would run during
    // SSR too and mismatch the hydrated HTML).
    const raw = sessionStorage.getItem("sl_finder_done");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing one-time browser storage into state on mount, not a derived/cascading update
      setState(parsed);
    } catch {
      // malformed sessionStorage payload — leave state as null
    }
  }, []);

  const doneCategory = state?.category || "software";
  const summary = state?.summary || [];
  const infoLink = categoryInfoLink(state?.category ?? null);

  return (
    <main
      data-screen-label="Brief submitted"
      className="max-w-[780px] mx-auto px-5 sm:px-8 pt-20 pb-[120px]"
    >
      <span className="w-[54px] h-[54px] rounded-full bg-[#10b981]/[0.10] grid place-items-center mb-7 font-sans font-semibold text-[22px] text-[#047857]">
        ✓
      </span>
      <h2 className="font-sans font-semibold text-[clamp(31px,4.2vw,44px)] leading-[1.08] tracking-[-0.03em] mb-4">
        Your brief is with us
      </h2>
      <p className="mb-[30px] text-[19px] text-[#3d4653] max-w-[44ch]">
        We&apos;ll come back within 24 hours with up to 3 {doneCategory} providers that believe they can
        meet your requirements.
      </p>
      {summary.length > 0 && (
        <div className="bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl p-[30px] mb-[34px]">
          <p className="mb-4 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
            What you told us
          </p>
          {summary.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-1 sm:grid-cols-[200px_minmax(0,1fr)] gap-2 sm:gap-5 py-3 border-t border-[#0d1117]/[0.05] text-[16px]"
            >
              <span className="text-[#79818f] font-semibold">{row.label}</span>
              <span className="font-semibold">{row.value}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-[14px]">
        <Link
          href="/"
          className="bg-[#4f46e5] text-white rounded-full px-7 py-[15px] font-sans font-semibold text-[17px] hover:bg-[#4338ca]"
        >
          Back to homepage
        </Link>
        <Link
          href={infoLink.href}
          className="border border-[#0d1117]/[0.14] rounded-full px-[26px] py-[14px] font-sans font-semibold text-[16px] text-[#0d1117] hover:bg-[#0d1117]/[0.05]"
        >
          {infoLink.label}
        </Link>
      </div>
    </main>
  );
}
