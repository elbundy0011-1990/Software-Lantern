import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { verifyDownloadToken } from "@/lib/download-token";

// Serves the regional report PDF from private/reports/ (never /public), after
// verifying the same short-lived signed token the questionnaire-pack and
// checklist routes use (lib/download-token.ts, issued by app/api/ot-enquiries on
// a "whitepaper" submission). The PDF itself is a pre-rendered, checked-in file
// (scripts/render-whitepaper-pdf.mjs generates it from the print page via
// Playwright); this route never renders anything itself, it only serves the
// already-built file. Never attached to or linked from any email.
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!token || !verifyDownloadToken(token)) {
    return NextResponse.json(
      { error: "This download link has expired or is invalid. Please request the report again." },
      { status: 403 },
    );
  }

  const filePath = join(process.cwd(), "private", "reports", "remote-access-belgium-netherlands.pdf");
  let file: Buffer;
  try {
    file = readFileSync(filePath);
  } catch {
    return NextResponse.json({ error: "The file could not be found." }, { status: 500 });
  }

  return new NextResponse(new Uint8Array(file), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="securing-remote-access-belgium-netherlands.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
