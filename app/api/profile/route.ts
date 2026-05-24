import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Learner email is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
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
        enrollments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            course: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Learner not found in database." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user,
      quizResults: user.quizResults,
      certificates: user.certificates,
      enrollments: user.enrollments,
      summary: {
        enrolledCourses: user.enrollments.length,
        quizResults: user.quizResults.length,
        certificates: user.certificates.length,
        passedFinalQuizzes: user.quizResults.filter(
          (result) => result.quizType === "FINAL" && result.passed
        ).length,
      },
    });
  } catch (error) {
    console.error("Profile summary error:", error);

    return NextResponse.json(
      { error: "Something went wrong while loading profile summary." },
      { status: 500 }
    );
  }
}