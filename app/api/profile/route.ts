import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

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