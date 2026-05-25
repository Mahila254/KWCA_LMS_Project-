import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

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
      return NextResponse.json(
        { error: "This account is not registered in the LMS database." },
        { status: 403 }
      );
    }

    if (adminUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. This account is not an admin." },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      message: "Admin login successful.",
      admin: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });

    response.cookies.set("kwca_admin_session", "active", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    response.cookies.set("kwca_admin_email", adminUser.email, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
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