import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;

    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        quizQuestions: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      course,
      quizQuestions: course.quizQuestions,
    });
  } catch (error) {
    console.error("Fetch quiz questions error:", error);

    return NextResponse.json(
      { error: "Something went wrong while fetching quiz questions." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;
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

    if (!optionA || !optionB || !optionC || !optionD) {
      return NextResponse.json(
        { error: "All four answer options are required." },
        { status: 400 }
      );
    }

    if (!correctAnswer) {
      return NextResponse.json(
        { error: "Correct answer is required." },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        quizQuestions: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    const questionOrder = Number(order) || course.quizQuestions.length + 1;

    const quizQuestion = await prisma.quizQuestion.create({
      data: {
        courseId: course.id,
        quizType: quizType === "FINAL" ? "FINAL" : "PRACTICE",
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
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