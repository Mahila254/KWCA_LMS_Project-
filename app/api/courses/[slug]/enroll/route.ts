import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

type RouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function POST(request: NextRequest, { params }: RouteProps) {
  const verifiedUser = await requireUser(request);

  if (!verifiedUser) {
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

    if (course.accessType !== "FREE_PREVIEW") {
      const paidPayment = await prisma.payment.findFirst({
        where: {
          status: "PAID",
          user: { email: verifiedUser.email },
          OR: [
            { courseId: course.id },
            { paymentType: { in: ["MONTHLY_SUBSCRIPTION", "ANNUAL_SUBSCRIPTION"] } },
          ],
        },
      });

      if (!paidPayment) {
        return NextResponse.json(
          { error: "Payment is required before enrolling in this course." },
          { status: 403 }
        );
      }
    }

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

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        courseId: course.id,
        progress: 0,
        completed: false,
      },
    });

    return NextResponse.json({
      message: "Enrollment successful.",
      course,
      user,
      enrollment,
    });
  } catch (error) {
    console.error("Enrollment error:", error);

    return NextResponse.json(
      { error: "Something went wrong while enrolling in this course." },
      { status: 500 }
    );
  }
}