"use client";

import { useState } from "react";
import { RemoteAccessSituationCheck } from "./remote-access-situation-check";
import { OtEnquiryForm } from "./ot-enquiry-form";
import { EMPTY_REMOTE_ACCESS_ANSWERS, saveRemoteAccessAnswers, type RemoteAccessAnswers } from "@/lib/remote-access-session";

// Same pairing as components/ot-cyber-interactive.tsx: the tool lifts
// its answers up for the form below, and mirrors every change into
// sessionStorage so the result still shows up on /enquiry if the
// visitor leaves and comes back later in the same browser session.
export function RemoteAccessCheckInteractive() {
  const [answers, setAnswers] = useState<RemoteAccessAnswers>(EMPTY_REMOTE_ACCESS_ANSWERS);

  const onAnswersChange = (next: RemoteAccessAnswers) => {
    setAnswers(next);
    saveRemoteAccessAnswers(next);
  };

  return (
    <>
      <RemoteAccessSituationCheck onAnswersChange={onAnswersChange} />
      <div className="py-16 px-5">
        <OtEnquiryForm remoteAccessAnswers={answers} showCheckerNudge={false} />
      </div>
    </>
  );
}
