import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { quizChoicesProblem } from "@/lib/quizChoices";

type RouteProps = {
  params: Promise<{
    slug: string;
    questionId: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteProps) {
  const admin = await requireAdmin(request);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { slug, questionId } = await params;

    const course = await prisma.course.findUnique({
      where: { slug },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    const quizQuestion = await prisma.quizQuestion.findFirst({
      where: {
        id: questionId,
        courseId: course.id,
      },
    });

    if (!quizQuestion) {
      return NextResponse.json(
        { error: "Quiz question not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      course,
      quizQuestion,
    });
  } catch (error) {
    console.error("Fetch quiz question error:", error);

    return NextResponse.json(
      { error: "Something went wrong while fetching the quiz question." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteProps) {
  const admin = await requireAdmin(request);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { slug, questionId } = await params;
    const body = await request.json();

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
      where: { slug },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    const existingQuestion = await prisma.quizQuestion.findFirst({
      where: {
        id: questionId,
        courseId: course.id,
      },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { error: "Quiz question not found." },
        { status: 404 }
      );
    }

    const updatedQuestion = await prisma.quizQuestion.update({
      where: {
        id: existingQuestion.id,
      },
      data: {
        quizType: quizType === "FINAL" ? "FINAL" : "PRACTICE",
        question,
        optionA: optionA!.trim(),
        optionB: optionB!.trim(),
        optionC: optionC?.trim() ?? "",
        optionD: optionD?.trim() ?? "",
        correctAnswer: correctAnswer!.trim().toUpperCase(),
        explanation: explanation || "",
        order: Number(order) || existingQuestion.order,
      },
    });

    return NextResponse.json({
      message: "Quiz question updated successfully.",
      quizQuestion: updatedQuestion,
    });
  } catch (error) {
    console.error("Update quiz question error:", error);

    return NextResponse.json(
      { error: "Something went wrong while updating the quiz question." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteProps) {
  const admin = await requireAdmin(request);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { slug, questionId } = await params;

    const course = await prisma.course.findUnique({
      where: { slug },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    const quizQuestion = await prisma.quizQuestion.findFirst({
      where: {
        id: questionId,
        courseId: course.id,
      },
    });

    if (!quizQuestion) {
      return NextResponse.json(
        { error: "Quiz question not found." },
        { status: 404 }
      );
    }

    await prisma.quizQuestion.delete({
      where: {
        id: quizQuestion.id,
      },
    });

    return NextResponse.json({
      message: "Quiz question deleted successfully.",
    });
  } catch (error) {
    console.error("Delete quiz question error:", error);

    return NextResponse.json(
      { error: "Something went wrong while deleting the quiz question." },
      { status: 500 }
    );
  }
}