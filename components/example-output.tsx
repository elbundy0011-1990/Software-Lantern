// Collapsed by default so it never gets mistaken for the visitor's own result.
// Content passed in as children is generic, invented sample content, never a real
// visitor's answers.
export function ExampleOutput({ children }: { children: React.ReactNode }) {
  return (
    <details className="rounded border border-[#3f4b52]/[0.2] bg-white mb-10">
      <summary className="cursor-pointer px-5 py-4 font-sans font-semibold text-[15px] text-[#1a1d22]">
        Example output <span className="font-normal text-[#3f4b52]">(not your result)</span>
      </summary>
      <div className="px-5 pb-5 pt-1 text-[14px] leading-[1.6] text-[#3f4b52] border-t border-[#3f4b52]/[0.12]">
        {children}
      </div>
    </details>
  );
}
