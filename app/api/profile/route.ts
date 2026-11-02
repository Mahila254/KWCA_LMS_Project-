import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { ensureLearnerRecord, parseProfileUpdate } from "@/lib/learnerRecord";

export const dynamic = "force-dynamic";

// Always returns the caller's OWN profile, verified via their session
// token. This used to trust a ?email= query param, which let anyone read
// any learner's enrollments, quiz results, certificates, and full payment
// history just by knowing their email address.
export async function GET(request: NextRequest) {
  const verifiedUser = await requireUser(request);

  if (!verifiedUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const learner = await prisma.user.findUnique({
      where: {
        email: verifiedUser.email,
      },
      include: {
        enrollments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            course: true,
          },
        },
        quizResults: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            course: true,
          },
        },
        certificates: {
          orderBy: {
            issuedAt: "desc",
          },
          include: {
            course: true,
          },
        },
        payments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            course: true,
          },
        },
      },
    });

    if (!learner) {
      return NextResponse.json(
        { error: "Learner profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      learner,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);

    return NextResponse.json(
      { error: "Something went wrong while fetching the learner profile." },
      { status: 500 }
    );
  }
}

// A learner correcting their own name and gender. The account is always the
// verified caller's, whatever the request body says.
export async function PATCH(request: NextRequest) {
  const verifiedUser = await requireUser(request);

  if (!verifiedUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const update = parseProfileUpdate(await request.json().catch(() => null));

    if ("error" in update) {
      return NextResponse.json({ error: update.error }, { status: 400 });
    }

    const learner = await ensureLearnerRecord(verifiedUser);

    // Certificates show the learner's current name, and anyone can look them
    // up by code, so changing it would change what's already been issued.
    if (update.name !== learner.name) {
      const certificates = await prisma.certificate.count({
        where: { userId: learner.id },
      });

      if (certificates > 0) {
        return NextResponse.json(
          {
            error:
              "Your name is on an issued certificate, so it can't be changed here. Please email complaints@kwcakenya.com to correct it.",
          },
          { status: 409 }
        );
      }
    }

    const saved = await prisma.user.update({
      where: { id: learner.id },
      data: { name: update.name, gender: update.gender },
    });

    return NextResponse.json({ name: saved.name, gender: saved.gender });
  } catch (error) {
    console.error("Update profile error:", error);

    return NextResponse.json(
      { error: "Something went wrong while saving your details." },
      { status: 500 }
    );
  }
}
