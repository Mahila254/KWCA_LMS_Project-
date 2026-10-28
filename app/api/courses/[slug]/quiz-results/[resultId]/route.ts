import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

type RouteProps = {
  params: Promise<{
    slug: string;
    resultId: string;
  }>;
};

// Review of one past PRACTICE attempt: every question with the learner's
// pick, the correct answer and the explanation. Learners can only open
// their own attempts. FINAL attempts are never reviewable here — their
// stored answers would hand out the graded quiz's answer key.
export async function GET(request: NextRequest, { params }: RouteProps) {
  const verifiedUser = await requireUser(request);

  if (!verifiedUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { slug, resultId } = await params;

    const result = await prisma.quizResult.findUnique({
      where: {
        id: resultId,
      },
      omit: {
        answers: false,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        course: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (
      !result ||
      result.user.email !== verifiedUser.email ||
      result.course.slug !== slug ||
      result.quizType !== "PRACTICE"
    ) {
      return NextResponse.json(
        { error: "Attempt not found." },
        { status: 404 }
      );
    }

    if (!Array.isArray(result.answers)) {
      return NextResponse.json(
        { error: "This attempt was taken before reviews were saved." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      attempt: {
        id: result.id,
        score: result.score,
        passed: result.passed,
        createdAt: result.createdAt,
        results: result.answers,
      },
    });
  } catch (error) {
    console.error("Quiz review error:", error);

    return NextResponse.json(
      { error: "Something went wrong while loading this review." },
      { status: 500 }
    );
  }
}
