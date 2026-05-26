import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminLoginPage = pathname === "/admin/login";

  if (isAdminPage && !isAdminLoginPage) {
    const adminSession = request.cookies.get("kwca_admin_session")?.value;
    const adminEmail = request.cookies.get("kwca_admin_email")?.value;

    if (adminSession !== "active" || !adminEmail) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";

      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};