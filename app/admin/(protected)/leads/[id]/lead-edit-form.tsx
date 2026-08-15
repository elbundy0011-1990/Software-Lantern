"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { Lead } from "@/lib/types";
import { updateLead, setCustomFields, setLeadStatus, type LeadFieldUpdate } from "../../actions";

function Field({
  label,
  value,
  onChange,
  textarea,
  type = "text",
  min,
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  type?: "text" | "number";
  min?: number;
  step?: number;
}) {
  const cls =
    "w-full bg-[#f6f7fb] border border-[#0d1117]/[0.12] rounded-xl px-4 py-[10px] text-[15px] outline-none focus:border-[#4f46e5]";
  return (
    <label className="block">
      <span className="block text-[13px] font-bold text-[#5c6573] mb-[6px]">{label}</span>
      {textarea ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      ) : (
        <input type={type} min={min} step={step} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </label>
  );
}

export function LeadEditForm({ lead }: { lead: Lead }) {
  const [fields, setFields] = useState<LeadFieldUpdate>({
    company_name: lead.company_name || "",
    contact_name: lead.contact_name || "",
    contact_email: lead.contact_email || "",
    contact_phone: lead.contact_phone || "",
    software_need: lead.software_need || "",
    current_vendor: lead.current_vendor || "",
    budget_range: lead.budget_range || "",
    timeline: lead.timeline || "",
    notes: lead.notes || "",
    category: lead.category || "",
    price_per_unlock: lead.price_per_unlock?.toString() || "",
    max_unlocks: lead.max_unlocks?.toString() || "3",
  });
  const [customFields, setCustomFieldsState] = useState<Record<string, string>>(lead.custom_fields || {});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const set = (k: keyof LeadFieldUpdate) => (v: string) => setFields((f) => ({ ...f, [k]: v }));

  const save = () => {
    startTransition(async () => {
      await updateLead(lead.id, fields);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const addCustomField = () => {
    if (!newKey.trim()) return;
    const next = { ...customFields, [newKey.trim()]: newValue };
    setCustomFieldsState(next);
    setNewKey("");
    setNewValue("");
    startTransition(() => setCustomFields(lead.id, next));
  };

  const removeCustomField = (key: string) => {
    const next = { ...customFields };
    delete next[key];
    setCustomFieldsState(next);
    startTransition(() => setCustomFields(lead.id, next));
  };

  return (
    <div>
      <Link href="/admin" className="text-[14px] font-semibold text-[#4f46e5]">
        ← Back to leads
      </Link>

      <div className="flex items-center gap-3 mt-3 mb-6">
        <h1 className="font-sans font-semibold text-[28px]">{lead.company_name || "Untitled lead"}</h1>
        <span className="rounded-full px-3 py-1 text-[13px] font-semibold bg-[#0d1117]/[0.06] capitalize">
          {lead.status}
        </span>
      </div>

      <div className="flex gap-2 mb-8">
        {(["new", "published", "discarded"] as const).map((s) => (
          <button
            key={s}
            disabled={isPending || lead.status === s}
            onClick={() => startTransition(() => setLeadStatus(lead.id, s))}
            className="rounded-full px-4 py-2 text-[14px] font-semibold border disabled:opacity-40"
            style={{
              background: lead.status === s ? "#4f46e5" : "#ffffff",
              color: lead.status === s ? "#ffffff" : "#3d4653",
              borderColor: lead.status === s ? "#4f46e5" : "rgba(13,17,23,0.12)",
            }}
          >
            {s === "new" ? "Mark new" : s === "published" ? "Publish" : "Discard"}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#0d1117]/[0.08] rounded-2xl p-7 grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <Field label="Company name" value={fields.company_name} onChange={set("company_name")} />
        <Field label="Contact name" value={fields.contact_name} onChange={set("contact_name")} />
        <Field label="Contact email" value={fields.contact_email} onChange={set("contact_email")} />
        <Field label="Contact phone" value={fields.contact_phone} onChange={set("contact_phone")} />
        <Field label="Category" value={fields.category} onChange={set("category")} />
        <Field label="Current vendor" value={fields.current_vendor} onChange={set("current_vendor")} />
        <Field label="Budget range" value={fields.budget_range} onChange={set("budget_range")} />
        <Field label="Timeline" value={fields.timeline} onChange={set("timeline")} />
        <Field
          label="Price per unlock (EUR)"
          value={fields.price_per_unlock}
          onChange={set("price_per_unlock")}
          type="number"
          min={0}
          step={0.01}
        />
        <Field
          label="Max unlocks"
          value={fields.max_unlocks}
          onChange={set("max_unlocks")}
          type="number"
          min={1}
          step={1}
        />
        <div className="sm:col-span-2">
          <Field label="Software need" value={fields.software_need} onChange={set("software_need")} textarea />
        </div>
        <div className="sm:col-span-2">
          <Field label="Internal notes (never shown to partners)" value={fields.notes} onChange={set("notes")} textarea />
        </div>
        <div className="sm:col-span-2 flex items-center gap-3">
          <button
            onClick={save}
            disabled={isPending}
            className="bg-[#4f46e5] text-white rounded-full px-6 py-[10px] text-[15px] font-semibold hover:bg-[#4338ca] disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save changes"}
          </button>
          {saved && <span className="text-[14px] font-semibold text-[#047857]">Saved</span>}
        </div>
      </div>

      <div className="bg-white border border-[#0d1117]/[0.08] rounded-2xl p-7 mb-8">
        <h2 className="font-sans font-semibold text-[18px] mb-1">Custom fields</h2>
        <p className="text-[14px] text-[#5c6573] mb-4">
          Ad hoc label/value pairs for this lead only. Internal — never shown to partners.
        </p>
        <div className="grid gap-2 mb-4">
          {Object.entries(customFields).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center gap-3 bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-xl px-4 py-2"
            >
              <span className="font-semibold text-[14px] text-[#0d1117] w-40 shrink-0 truncate">{key}</span>
              <span className="text-[14px] text-[#3d4653] flex-1 truncate">{value}</span>
              <button
                onClick={() => removeCustomField(key)}
                className="text-[13px] font-semibold text-[#c0451f] hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Field name"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="bg-[#f6f7fb] border border-[#0d1117]/[0.12] rounded-xl px-4 py-2 text-[14px] outline-none focus:border-[#4f46e5] w-40"
          />
          <input
            placeholder="Value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="bg-[#f6f7fb] border border-[#0d1117]/[0.12] rounded-xl px-4 py-2 text-[14px] outline-none focus:border-[#4f46e5] flex-1"
          />
          <button
            onClick={addCustomField}
            className="border border-[#0d1117]/[0.14] rounded-xl px-4 py-2 text-[14px] font-semibold hover:bg-[#0d1117]/[0.05]"
          >
            Add field
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#0d1117]/[0.08] rounded-2xl p-7">
        <h2 className="font-sans font-semibold text-[18px] mb-4">Wizard answers (read-only)</h2>
        <div className="grid gap-2">
          {Object.entries(lead.answers || {}).map(([key, value]) => (
            <div key={key} className="grid grid-cols-[160px_1fr] gap-4 py-2 border-t border-[#0d1117]/[0.06] text-[14px]">
              <span className="text-[#79818f] font-semibold">{key}</span>
              <span className="text-[#0d1117]">{Array.isArray(value) ? value.join(", ") : String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
