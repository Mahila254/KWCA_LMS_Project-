import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

export async function POST(request: NextRequest) {
  const verifiedUser = await requireUser(request);

  if (!verifiedUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));

    const allowedGenders = ["MALE", "FEMALE", "PREFER_NOT_TO_SAY"];
    const requestedGender = body?.gender;
    const normalizedGender = allowedGenders.includes(requestedGender)
      ? requestedGender
      : verifiedUser.gender && allowedGenders.includes(verifiedUser.gender)
      ? verifiedUser.gender
      : undefined;

    const name = verifiedUser.name || body?.name || null;

    // Consent is captured once at registration (see app/register/page.tsx)
    // and never overwritten on later syncs, so a resync can't accidentally
    // clear or backdate an existing consent record.
    const consentedAtDate = verifiedUser.consentedAt
      ? new Date(verifiedUser.consentedAt)
      : new Date();

    const user = await prisma.user.upsert({
      where: {
        email: verifiedUser.email,
      },
      update: {
        name,
        ...(normalizedGender ? { gender: normalizedGender } : {}),
      },
      create: {
        id: verifiedUser.id,
        email: verifiedUser.email,
        name,
        gender: normalizedGender ?? null,
        role: "STUDENT",
        consentGiven: verifiedUser.consentGiven,
        consentedAt: verifiedUser.consentGiven ? consentedAtDate : null,
      },
    });

    return NextResponse.json({
      message: "User synced successfully.",
      user,
    });
  } catch (error) {
    console.error("Sync user error:", error);

    return NextResponse.json(
      { error: "Something went wrong while syncing the user." },
      { status: 500 }
    );
  }
}
