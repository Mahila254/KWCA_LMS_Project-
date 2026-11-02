import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  LEGACY_ADMIN_EMAIL_COOKIE,
  adminCookieOptions,
  createAdminSessionToken,
} from "@/lib/adminSession";
import {
  clearLoginFailures,
  clientIp,
  loginBlockedMinutes,
  recordLoginFailure,
} from "@/lib/loginThrottle";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Admin email is required." },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "Admin password is required." },
        { status: 400 }
      );
    }

    // Checked before the password is even tried, so a blocked guesser
    // learns nothing, even by trying the right password.
    const ip = clientIp(request);
    const blockedMinutes = await loginBlockedMinutes(email, ip);

    if (blockedMinutes > 0) {
      return NextResponse.json(
        {
          error: `Too many failed attempts. Please wait ${blockedMinutes} minute${
            blockedMinutes === 1 ? "" : "s"
          } and try again.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(blockedMinutes * 60) },
        }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Supabase environment variables are missing." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.user) {
      await recordLoginFailure(email, ip);

      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const adminUser = await prisma.user.findUnique({
      where: {
        email: data.user.email || email.trim(),
      },
    });

    if (!adminUser) {
      await recordLoginFailure(email, ip);

      return NextResponse.json(
        { error: "This account is not registered in the LMS database." },
        { status: 403 }
      );
    }

    if (adminUser.role !== "ADMIN") {
      await recordLoginFailure(email, ip);

      return NextResponse.json(
        { error: "Access denied. This account is not an admin." },
        { status: 403 }
      );
    }

    const sessionToken = createAdminSessionToken(adminUser.email);

    if (!sessionToken) {
      console.error(
        "Admin login error: ADMIN_SESSION_SECRET is missing or shorter than 32 characters."
      );

      return NextResponse.json(
        { error: "Admin login is not configured on the server." },
        { status: 500 }
      );
    }

    await clearLoginFailures(email, ip);

    const response = NextResponse.json({
      message: "Admin login successful.",
      admin: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });

    response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, {
      ...adminCookieOptions,
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    });

    response.cookies.set(LEGACY_ADMIN_EMAIL_COOKIE, "", {
      ...adminCookieOptions,
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { error: "Something went wrong during admin login." },
      { status: 500 }
    );
  }
}