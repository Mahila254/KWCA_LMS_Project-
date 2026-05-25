import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accessCode } = body;

    if (!accessCode) {
      return NextResponse.json(
        { error: "Admin access code is required." },
        { status: 400 }
      );
    }

    const correctCode = process.env.ADMIN_ACCESS_CODE;

    if (!correctCode) {
      return NextResponse.json(
        { error: "Admin access code is not configured." },
        { status: 500 }
      );
    }

    if (accessCode !== correctCode) {
      return NextResponse.json(
        { error: "Invalid admin access code." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      message: "Admin login successful.",
    });

    response.cookies.set("kwca_admin_session", "active", {
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