import { Suspense } from "react";
import { FinderWizard } from "@/components/finder-wizard";

export default function FinderPage() {
  return (
    <Suspense fallback={null}>
      <FinderWizard />
    </Suspense>
  );
}
