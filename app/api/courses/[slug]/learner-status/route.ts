import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

type RouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

// Returns the current learner's saved progress for a single course: their
// enrollment (lesson progress + completion), their best passed final-quiz
// result (if any), and their certificate (if one has been issued).
//
// Pages call this so a learner who reopens a course, or the final quiz,
// sees what they already did instead of being dropped back into a blank
// "start from scratch" flow every time — and so the final quiz isn't
// resubmitted (creating a new QuizResult row) by accident once it has
// already been passed.
export async function GET(request: NextRequest, { params }: RouteProps) {
  const verifiedUser = await requireUser(request);

  if (!verifiedUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { slug } = await params;

    const course = await prisma.course.findUnique({
      where: {
        slug,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: verifiedUser.email,
      },
    });

    if (!user) {
      return NextResponse.json({
        enrolled: false,
        enrollment: null,
        finalQuizResult: null,
        certificate: null,
      });
    }

    const [enrollment, finalQuizResult, certificate] = await Promise.all([
      prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
      }),
      prisma.quizResult.findFirst({
        where: {
          userId: user.id,
          courseId: course.id,
          quizType: "FINAL",
          passed: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.certificate.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
      }),
    ]);

    return NextResponse.json({
      enrolled: Boolean(enrollment),
      enrollment,
      finalQuizResult,
      certificate,
    });
  } catch (error) {
    console.error("Fetch learner status error:", error);

    return NextResponse.json(
      { error: "Something went wrong while fetching learner status." },
      { status: 500 }
    );
  }
}
