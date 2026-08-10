import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

// Public, read-only endpoint for the practice/final quiz pages. This is
// intentionally separate from /api/admin/courses/[slug]/quiz-questions,
// which requires an admin session and also allows editing/deleting.
//
// For the FINAL quiz, correctAnswer/explanation are stripped from the
// response — the final quiz is graded server-side (see the POST handler
// in quiz-results/route.ts), so the browser never needs to know the
// answers before submitting. Practice questions still include them, since
// the practice quiz is an ungraded learning tool that shows feedback
// immediately and doesn't gate anything.
export async function GET(request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const quizType = searchParams.get("type");

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

    const quizQuestions = await prisma.quizQuestion.findMany({
      where: {
        courseId: course.id,
        ...(quizType === "PRACTICE" || quizType === "FINAL"
          ? { quizType }
          : {}),
      },
      orderBy: {
        order: "asc",
      },
    });

    const isGraded = quizType === "FINAL";

    const safeQuestions = quizQuestions.map((question) => {
      if (!isGraded) {
        return question;
      }

      const { correctAnswer, explanation, ...rest } = question;
      void correctAnswer;
      void explanation;
      return rest;
    });

    return NextResponse.json({
      course,
      quizQuestions: safeQuestions,
    });
  } catch (error) {
    console.error("Fetch quiz questions error:", error);

    return NextResponse.json(
      { error: "Something went wrong while fetching quiz questions." },
      { status: 500 }
    );
  }
}
