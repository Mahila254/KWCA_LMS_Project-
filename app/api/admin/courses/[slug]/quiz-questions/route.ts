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

type CreateQuizQuestionBody = {
  quizType?: "PRACTICE" | "FINAL";
  question?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer?: string;
  explanation?: string;
  order?: string | number;
};

export async function GET(request: NextRequest, { params }: RouteProps) {
  const admin = await requireAdmin(request);

  if (!admin) {
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

    const quizQuestions = await prisma.quizQuestion.findMany({
      where: {
        courseId: course.id,
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json({
      course,
      quizQuestions,
    });
  } catch (error) {
    console.error("Fetch quiz questions error:", error);

    return NextResponse.json(
      { error: "Something went wrong while fetching quiz questions." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteProps) {
  const admin = await requireAdmin(request);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body = (await request.json()) as CreateQuizQuestionBody;

    const {
      quizType,
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      explanation,
      order,
    } = body;

    if (!question || question.trim() === "") {
      return NextResponse.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    // Four choices, or two (True/False) with C and D left empty.
    const choicesProblem = quizChoicesProblem(
      [optionA, optionB, optionC, optionD],
      correctAnswer
    );

    if (choicesProblem) {
      return NextResponse.json({ error: choicesProblem }, { status: 400 });
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

    const existingCount = await prisma.quizQuestion.count({
      where: {
        courseId: course.id,
      },
    });

    const questionOrder = Number(order) || existingCount + 1;

    const quizQuestion = await prisma.quizQuestion.create({
      data: {
        courseId: course.id,
        quizType: quizType === "FINAL" ? "FINAL" : "PRACTICE",
        question,
        optionA: optionA!.trim(),
        optionB: optionB!.trim(),
        optionC: optionC?.trim() ?? "",
        optionD: optionD?.trim() ?? "",
        correctAnswer: correctAnswer!.trim().toUpperCase(),
        explanation: explanation || "",
        order: questionOrder,
      },
    });

    return NextResponse.json(
      {
        message: "Quiz question created successfully.",
        quizQuestion,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create quiz question error:", error);

    return NextResponse.json(
      { error: "Something went wrong while creating the quiz question." },
      { status: 500 }
    );
  }
}