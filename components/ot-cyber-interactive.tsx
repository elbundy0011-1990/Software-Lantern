"use client";

import { useState } from "react";
import { Nis2ScopeChecker } from "./nis2-scope-checker";
import { OtEnquiryForm } from "./ot-enquiry-form";
import { EMPTY_CHECKER_ANSWERS, saveCheckerAnswers, type CheckerAnswers } from "@/lib/checker-session";

// Lifts the checker's answers up so the form below can submit exactly
// what the checker showed, without either component needing to know
// about the other's internals. Also mirrors every change into
// sessionStorage (lib/checker-session.ts), so the result still shows up
// if the visitor leaves and opens /enquiry directly later in the same
// browser session.
export function OtCyberInteractive() {
  const [answers, setAnswers] = useState<CheckerAnswers>(EMPTY_CHECKER_ANSWERS);

  const onAnswersChange = (next: CheckerAnswers) => {
    setAnswers(next);
    saveCheckerAnswers(next);
  };

  return (
    <>
      <Nis2ScopeChecker onAnswersChange={onAnswersChange} />
      <div className="py-16 px-5">
        <OtEnquiryForm checkerAnswers={answers} showCheckerNudge={false} />
      </div>
    </>
  );
}
