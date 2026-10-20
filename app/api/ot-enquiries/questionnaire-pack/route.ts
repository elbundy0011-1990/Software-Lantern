import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { verifyDownloadToken } from "@/lib/download-token";

// Serves the questionnaire-pack .xlsx from private/ (never /public, so
// it's never reachable without a valid token) after verifying the
// short-lived signed token issued by /api/ot-enquiries on a successful
// "pack" submission. The file is never attached to or linked from any
// email — this route is the only way to get it.
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!token || !verifyDownloadToken(token)) {
    return NextResponse.json(
      { error: "This download link has expired or is invalid. Please request the pack again." },
      { status: 403 },
    );
  }

  const filePath = join(process.cwd(), "private", "customer-security-questionnaire-pack.xlsx");
  let file: Buffer;
  try {
    file = readFileSync(filePath);
  } catch {
    return NextResponse.json({ error: "The file could not be found." }, { status: 500 });
  }

  return new NextResponse(new Uint8Array(file), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="customer-security-questionnaire-pack.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
