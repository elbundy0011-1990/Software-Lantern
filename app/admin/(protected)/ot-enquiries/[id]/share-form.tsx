"use client";

import { useState, useTransition } from "react";
import { recordOtEnquiryShare } from "../actions";

export function ShareForm({
  id,
  initialSharedWith,
  initialAdminNotes,
}: {
  id: string;
  initialSharedWith: string | null;
  initialAdminNotes: string | null;
}) {
  const [sharedWith, setSharedWith] = useState(initialSharedWith || "");
  const [adminNotes, setAdminNotes] = useState(initialAdminNotes || "");
  const [confirmed, setConfirmed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const canSave = sharedWith.trim() === "" || confirmed;

  return (
    <div className="bg-white rounded-2xl border border-[#0d1117]/[0.08] p-6">
      <h3 className="font-sans font-semibold text-[17px] mb-1">Manual share record</h3>
      <p className="text-[13px] text-[#79818f] mb-4">
        This form does not send anything anywhere. It only records that you, personally, separately
        asked this person whether their details could go to a named company, and they said yes to
        that specific ask. Leave this blank unless that conversation has already happened.
      </p>

      <label className="block text-[13px] font-semibold text-[#3d4653] mb-1">
        Shared with (company name), if any
      </label>
      <input
        value={sharedWith}
        onChange={(e) => {
          setSharedWith(e.target.value);
          setSaved(false);
        }}
        placeholder="e.g. Acme Industrial Security BV"
        className="w-full rounded-lg border border-[#0d1117]/[0.14] px-3 py-2 text-[14px] mb-4"
      />

      <label className="block text-[13px] font-semibold text-[#3d4653] mb-1">Admin notes</label>
      <textarea
        value={adminNotes}
        onChange={(e) => {
          setAdminNotes(e.target.value);
          setSaved(false);
        }}
        rows={3}
        className="w-full rounded-lg border border-[#0d1117]/[0.14] px-3 py-2 text-[14px] mb-4"
      />

      {sharedWith.trim() !== "" && (
        <label className="flex items-start gap-2 mb-4 text-[13px] text-[#3d4653]">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-[2px]"
          />
          I separately asked this person whether I could share their details with the company
          named above, and they said yes to that specific ask.
        </label>
      )}

      <button
        disabled={!canSave || isPending}
        onClick={() =>
          startTransition(async () => {
            await recordOtEnquiryShare(id, sharedWith, adminNotes);
            setSaved(true);
          })
        }
        className="bg-[#4f46e5] text-white rounded-full px-5 py-2 text-[14px] font-semibold disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Save"}
      </button>
      {saved && <span className="ml-3 text-[13px] text-[#047857] font-semibold">Saved</span>}
    </div>
  );
}
