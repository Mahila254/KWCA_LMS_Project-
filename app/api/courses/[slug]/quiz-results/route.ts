import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function POST(request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const { id, email, name, quizType, score, passed } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Learner ID is required." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Learner email is required." },
        { status: 400 }
      );
    }

    if (typeof score !== "number") {
      return NextResponse.json(
        { error: "Quiz score is required." },
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

    const user = await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        name: name || null,
      },
      create: {
        id,
        email,
        name: name || null,
        role: "STUDENT",
      },
    });

    const quizResult = await prisma.quizResult.create({
      data: {
        userId: user.id,
        courseId: course.id,
        quizType: quizType || "FINAL",
        score,
        passed: Boolean(passed),
      },
    });

    return NextResponse.json(
      {
        message: "Quiz result saved successfully.",
        course,
        user,
        quizResult,
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