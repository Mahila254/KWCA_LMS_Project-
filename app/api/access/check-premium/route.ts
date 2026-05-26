import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, courseId } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Learner email is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        payments: {
          where: {
            status: "PAID",
          },
          include: {
            course: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({
        hasAccess: false,
        reason: "Learner not found.",
      });
    }

    const hasSubscriptionAccess = user.payments.some(
      (payment) =>
        payment.paymentType === "MONTHLY_SUBSCRIPTION" ||
        payment.paymentType === "ANNUAL_SUBSCRIPTION"
    );

    const hasCourseAccess = courseId
      ? user.payments.some(
          (payment) =>
            payment.paymentType === "PAY_PER_COURSE" &&
            payment.courseId === courseId
        )
      : false;

    const hasAccess = hasSubscriptionAccess || hasCourseAccess;

    return NextResponse.json({
      hasAccess,
      hasSubscriptionAccess,
      hasCourseAccess,
      paidPayments: user.payments,
    });
  } catch (error) {
    console.error("Check premium access error:", error);

    return NextResponse.json(
      { error: "Something went wrong while checking premium access." },
      { status: 500 }
    );
  }
}