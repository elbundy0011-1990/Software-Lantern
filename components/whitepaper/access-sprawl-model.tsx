"use client";

import { useState } from "react";
import {
  ILLUSTRATIVE_INPUTS,
  MODEL_INPUT_DEFS,
  runModel,
  type ModelInputs,
} from "@/lib/whitepaper-content";

const ACCENT = "#9a3412";

const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });

function toRaw(i: ModelInputs): Record<keyof ModelInputs, string> {
  return Object.fromEntries(Object.entries(i).map(([k, v]) => [k, String(v)])) as Record<keyof ModelInputs, string>;
}

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

// The access-sprawl model (Part 2 of the regional report). Interactive on the
// open web page, where the reader types their own inputs; static in the PDF,
// where it shows the illustrative worked example. Inputs never leave the
// browser: nothing here is sent, stored or tracked.
export function AccessSprawlModel({ interactive }: { interactive: boolean }) {
  // Raw text per field, so a reader can clear a box while typing; the model
  // runs on the clamped numbers.
  const [raw, setRaw] = useState<Record<keyof ModelInputs, string>>(toRaw(ILLUSTRATIVE_INPUTS));
  const inputs = Object.fromEntries(
    MODEL_INPUT_DEFS.map((d) => [d.key, clamp(parseFloat(raw[d.key]), d.min, d.max)]),
  ) as unknown as ModelInputs;
  const r = runModel(inputs);
  const { suppliers: S, sites: T, techniciansPerSupplier: E, sharedShare: h, changesPerSupplierPerYear: c } = inputs;

  const rows: { name: string; formula: string; working: string; result: string }[] = [
    { name: "Person-to-site access paths (P)", formula: "S × T × E", working: `${fmt(S)} × ${fmt(T)} × ${fmt(E)}`, result: fmt(r.paths) },
    { name: "Supplier-site pairs", formula: "S × T", working: `${fmt(S)} × ${fmt(T)}`, result: fmt(r.supplierSitePairs) },
    { name: "Shared credentials in use", formula: "h × S × T", working: `${fmt(h)} × ${fmt(r.supplierSitePairs)}`, result: `${fmt(r.sharedCredentials)}, each known by ${fmt(E)} people` },
    { name: "Shared-credential rotations a year", formula: "h × S × T × c", working: `${fmt(h)} × ${fmt(r.supplierSitePairs)} × ${fmt(c)}`, result: fmt(r.rotationsPerYear) },
    { name: "Named-account changes a year", formula: "(1 − h) × S × T × c", working: `${fmt(1 - h)} × ${fmt(r.supplierSitePairs)} × ${fmt(c)}`, result: fmt(r.namedChangesPerYear) },
  ];

  return (
    <div className="rounded border-2 border-dashed p-4 bg-white" style={{ borderColor: ACCENT }}>
      <p className="text-[12px] font-bold uppercase tracking-[0.07em] mb-1" style={{ color: ACCENT }}>
        Model: arithmetic on {interactive ? "your" : "illustrative"} inputs, not a finding
      </p>
      {!interactive && (
        <p className="text-[12px] text-[#3f4b52] mb-3">
          Worked example. The inputs below are illustrative, not observed, and not typical of anyone. Use
          the open web version of this report to run the model on your own numbers.
        </p>
      )}

      <table className="w-full text-left border-collapse text-[12.5px] mb-3">
        <thead>
          <tr className="border-b border-[#3f4b52]/[0.2]">
            <th className="py-1.5 pr-2 font-semibold text-[#1a1d22] w-[40px]">Input</th>
            <th className="py-1.5 pr-2 font-semibold text-[#1a1d22]">Meaning</th>
            <th className="py-1.5 font-semibold text-[#1a1d22] w-[110px]">{interactive ? "Your value" : "Illustrative"}</th>
          </tr>
        </thead>
        <tbody className="text-[#3f4b52]">
          {MODEL_INPUT_DEFS.map((d) => (
            <tr key={d.key} className="border-b border-[#3f4b52]/[0.1] align-middle">
              <td className="py-1.5 pr-2 font-semibold text-[#1a1d22]">{d.symbol}</td>
              <td className="py-1.5 pr-2">{d.label}</td>
              <td className="py-1.5">
                {interactive ? (
                  <input
                    type="number"
                    inputMode="decimal"
                    min={d.min}
                    max={d.max}
                    step={d.step}
                    value={raw[d.key]}
                    aria-label={d.label}
                    onChange={(e) => setRaw((prev) => ({ ...prev, [d.key]: e.target.value }))}
                    className="w-full max-w-[100px] rounded border border-[#3f4b52]/[0.3] px-2 py-1 text-[14px] text-[#1a1d22]"
                  />
                ) : (
                  <span className="font-semibold text-[#1a1d22]">{fmt(inputs[d.key])}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="w-full text-left border-collapse text-[12.5px]">
        <thead>
          <tr className="border-b border-[#3f4b52]/[0.2]">
            <th className="py-1.5 pr-2 font-semibold text-[#1a1d22]">Output</th>
            <th className="py-1.5 pr-2 font-semibold text-[#1a1d22]">Formula</th>
            <th className="py-1.5 pr-2 font-semibold text-[#1a1d22]">Working</th>
            <th className="py-1.5 font-semibold text-[#1a1d22]">Result</th>
          </tr>
        </thead>
        <tbody className="text-[#3f4b52]">
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-[#3f4b52]/[0.1] align-top">
              <td className="py-1.5 pr-2">{row.name}</td>
              <td className="py-1.5 pr-2 font-mono text-[11.5px] whitespace-nowrap">{row.formula}</td>
              <td className="py-1.5 pr-2 font-mono text-[11.5px]">{row.working}</td>
              <td className="py-1.5 font-semibold text-[#1a1d22]">{row.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {interactive && (
        <button
          type="button"
          onClick={() => setRaw(toRaw(ILLUSTRATIVE_INPUTS))}
          className="mt-3 text-[13px] font-semibold underline"
          style={{ color: "#7c2d12" }}
        >
          Reset to the illustrative example
        </button>
      )}
    </div>
  );
}
