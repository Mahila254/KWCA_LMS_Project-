import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Learner email is required." },
        { status: 400 }
      );
    }

    const learner = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        enrollments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            course: true,
          },
        },
        quizResults: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            course: true,
          },
        },
        certificates: {
          orderBy: {
            issuedAt: "desc",
          },
          include: {
            course: true,
          },
        },
        payments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            course: true,
          },
        },
      },
    });

    if (!learner) {
      return NextResponse.json(
        { error: "Learner profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      learner,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);

    return NextResponse.json(
      { error: "Something went wrong while fetching the learner profile." },
      { status: 500 }
    );
  }
}