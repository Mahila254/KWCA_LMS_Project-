import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { quizChoicesProblem } from "@/lib/quizChoices";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

type BulkQuestion = {
  question?: unknown;
  optionA?: unknown;
  optionB?: unknown;
  optionC?: unknown;
  optionD?: unknown;
  correctAnswer?: unknown;
  explanation?: unknown;
  /** From a "Practice Quiz" / "Final Quiz" heading in the paste. */
  quizType?: unknown;
};

type QuizType = "PRACTICE" | "FINAL";

const MAX_QUESTIONS = 100;

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

// Adds many questions at once (the "Paste questions" box on the admin quiz
// page). All or nothing: if any question is incomplete, none are added.
// True/False questions arrive with optionC and optionD empty.
export async function POST(request: NextRequest, { params }: RouteProps) {
  const admin = await requireAdmin(request);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body = (await request.json()) as {
      quizType?: unknown;
      questions?: unknown;
    };

    if (!Array.isArray(body.questions) || body.questions.length === 0) {
      return NextResponse.json(
        { error: "There are no questions to add." },
        { status: 400 }
      );
    }

    if (body.questions.length > MAX_QUESTIONS) {
      return NextResponse.json(
        { error: `Add up to ${MAX_QUESTIONS} questions at a time.` },
        { status: 400 }
      );
    }

    // Each question can name its quiz; the rest go to the one chosen.
    const defaultQuizType: QuizType = body.quizType === "FINAL" ? "FINAL" : "PRACTICE";

    const questions = (body.questions as BulkQuestion[]).map((item) => ({
      quizType: (item?.quizType === "FINAL" || item?.quizType === "PRACTICE"
        ? item.quizType
        : defaultQuizType) as QuizType,
      question: text(item?.question, 1000),
      optionA: text(item?.optionA, 500),
      optionB: text(item?.optionB, 500),
      optionC: text(item?.optionC, 500),
      optionD: text(item?.optionD, 500),
      correctAnswer: text(item?.correctAnswer, 1).toUpperCase(),
      explanation: text(item?.explanation, 2000),
    }));

    // Four choices, or two (True/False) with C and D empty.
    for (const [index, item] of questions.entries()) {
      const problem = item.question
        ? quizChoicesProblem(
            [item.optionA, item.optionB, item.optionC, item.optionD],
            item.correctAnswer
          )
        : "The question text is missing.";

      if (problem) {
        return NextResponse.json(
          { error: `Question ${index + 1}: ${problem}` },
          { status: 400 }
        );
      }
    }

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

    // New questions go after the ones already there, in the pasted order.
    const created = await prisma.$transaction(async (tx) => {
      const existingCount = await tx.quizQuestion.count({
        where: {
          courseId: course.id,
        },
      });

      return tx.quizQuestion.createMany({
        data: questions.map((item, index) => ({
          courseId: course.id,
          ...item,
          order: existingCount + index + 1,
        })),
      });
    });

    return NextResponse.json(
      {
        message: `${created.count} questions added.`,
        count: created.count,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bulk create quiz questions error:", error);

    return NextResponse.json(
      { error: "Something went wrong while adding the questions." },
      { status: 500 }
    );
  }
}
