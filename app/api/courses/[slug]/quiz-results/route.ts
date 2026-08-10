import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

type RouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

const PASS_THRESHOLD = 70;

type SubmittedAnswer = {
  questionId?: string;
  selectedAnswer?: string | null;
};

// Grades the quiz server-side instead of trusting a client-reported
// score/passed value. The browser only ever sends which option it picked
// per question; the correct answers never leave the server for a FINAL
// quiz (see quiz-questions/route.ts), and the score/pass result computed
// here is the one that gets saved and that gates certificate issuance.
export async function POST(request: NextRequest, { params }: RouteProps) {
  const verifiedUser = await requireUser(request);

  if (!verifiedUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body = await request.json();

    const quizType = body?.quizType === "PRACTICE" ? "PRACTICE" : "FINAL";
    const submittedAnswers = Array.isArray(body?.answers)
      ? (body.answers as SubmittedAnswer[])
      : null;

    if (!submittedAnswers || submittedAnswers.length === 0) {
      return NextResponse.json(
        { error: "Quiz answers are required." },
        { status: 400 }
      );
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

    const questions = await prisma.quizQuestion.findMany({
      where: {
        courseId: course.id,
        quizType,
      },
      orderBy: {
        order: "asc",
      },
    });

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "This course has no quiz questions to grade against." },
        { status: 400 }
      );
    }

    const answerByQuestionId = new Map(
      submittedAnswers
        .filter((answer) => typeof answer?.questionId === "string")
        .map((answer) => [answer.questionId as string, answer.selectedAnswer ?? null])
    );

    let correctCount = 0;

    const results = questions.map((question) => {
      const selectedAnswer = answerByQuestionId.get(question.id) ?? null;
      const isCorrect = selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        correctCount += 1;
      }

      return {
        questionId: question.id,
        question: question.question,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        isCorrect,
      };
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage >= PASS_THRESHOLD;

    const user = await prisma.user.upsert({
      where: {
        email: verifiedUser.email,
      },
      update: {
        name: verifiedUser.name || undefined,
      },
      create: {
        id: verifiedUser.id,
        email: verifiedUser.email,
        name: verifiedUser.name,
        role: "STUDENT",
      },
    });

    const quizResult = await prisma.quizResult.create({
      data: {
        userId: user.id,
        courseId: course.id,
        quizType,
        score: percentage,
        passed,
      },
    });

    return NextResponse.json(
      {
        message: "Quiz result saved successfully.",
        course,
        user,
        quizResult,
        score: percentage,
        passed,
        correctCount,
        totalQuestions: questions.length,
        results,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save quiz result error:", error);

    return NextResponse.json(
      { error: "Something went wrong while saving the quiz result." },
      { status: 500 }
    );
  }
}
