import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  LEGACY_ADMIN_EMAIL_COOKIE,
  adminCookieOptions,
} from "@/lib/adminSession";

export async function POST() {
  const response = NextResponse.json({
    message: "Admin logged out successfully.",
  });

  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...adminCookieOptions,
    maxAge: 0,
  });

  response.cookies.set(LEGACY_ADMIN_EMAIL_COOKIE, "", {
    ...adminCookieOptions,
    maxAge: 0,
  });

  return response;
}
