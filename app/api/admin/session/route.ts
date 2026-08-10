import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const adminSession = request.cookies.get("kwca_admin_session")?.value;
  const adminEmail = request.cookies.get("kwca_admin_email")?.value;

  const authenticated = adminSession === "active" && Boolean(adminEmail);

  return NextResponse.json({ authenticated });
}
