import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireUser } from "@/lib/requireUser";
import { getPremiumAccess } from "@/lib/premiumAccess";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const verifiedUser = await requireUser(request);

  if (!verifiedUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();

    const courseId = body.courseId as string | undefined;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required." },
        { status: 400 }
      );
    }

    const access = await getPremiumAccess(verifiedUser.email, courseId);

    return NextResponse.json(access);
  } catch (error) {
    console.error("Check premium access error:", error);

    return NextResponse.json(
      { error: "Something went wrong while checking premium access." },
      { status: 500 }
    );
  }
}
