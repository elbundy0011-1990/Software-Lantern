"use client";

import { useState } from "react";
import { Nis2ScopeChecker } from "./nis2-scope-checker";
import { OtEnquiryForm } from "./ot-enquiry-form";
import type { Nis2Country } from "@/lib/nis2-dates";

// Lifts the checker's answers up so the form below can submit exactly what
// the checker showed, without either component needing to know about the
// other's internals.
export function OtCyberInteractive() {
  const [answers, setAnswers] = useState<{
    country: Nis2Country | null;
    sector: string | null;
    size: string | null;
    remoteAccess: string | null;
  }>({ country: null, sector: null, size: null, remoteAccess: null });

  return (
    <>
      <Nis2ScopeChecker onAnswersChange={setAnswers} />
      <div className="py-16 px-5">
        <OtEnquiryForm country={answers.country} answers={answers} />
      </div>
    </>
  );
}
