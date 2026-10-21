// A bare route group with no header, footer, or nav: the opposite of app/(ot)/
// layout.tsx on purpose. Every page under here is a print/PDF source meant to
// be navigated to directly by a renderer (Playwright), never browsed as a
// normal page, so it gets nothing beyond the root layout's fonts and html/body
// shell. See app/(print)/reports/remote-access-belgium-netherlands/print/
// page.tsx for why this exists: app/(ot)/layout.tsx's header/footer would
// otherwise appear in the generated PDF, and there'd be no way to opt a nested
// route out of an ancestor layout within the same route group.
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
