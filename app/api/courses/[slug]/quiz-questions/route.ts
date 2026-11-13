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
// FINAL questions never include correctAnswer/explanation, whatever
// ?type= is asked for — the final quiz is graded server-side (see the POST
// handler in quiz-results/route.ts), so the browser never needs to know the
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

    // Draft courses aren't public yet (admins use the admin quiz routes).
    if (!course || course.status !== "PUBLISHED") {
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

    // Decided per question, not from the ?type= in the address: asking for
    // every question (no type) used to return the final quiz's answers too.
    const safeQuestions = quizQuestions.map((question) => {
      if (question.quizType !== "FINAL") {
        return question;
      }

      const { correctAnswer, explanation, ...rest } = question;
      void correctAnswer;
      void explanation;
      return rest;
    });

    // Titles and slugs only (never content), so the quiz screens can link
    // back to the last lesson.
    const lessons = await prisma.lesson.findMany({
      where: {
        courseId: course.id,
      },
      orderBy: {
        order: "asc",
      },
      select: {
        title: true,
        slug: true,
        order: true,
      },
    });

    return NextResponse.json({
      course,
      lessons,
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
