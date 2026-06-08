import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PaymentRecord = {
  id: string;
  courseId: string | null;
  paymentType:
    | "PAY_PER_COURSE"
    | "MONTHLY_SUBSCRIPTION"
    | "ANNUAL_SUBSCRIPTION";
  status: "PENDING" | "PAID" | "FAILED";
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email as string | undefined;
    const courseId = body.courseId as string | undefined;

    if (!email) {
      return NextResponse.json(
        { error: "Learner email is required." },
        { status: 400 }
      );
    }

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required." },
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
          select: {
            id: true,
            courseId: true,
            paymentType: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({
        hasAccess: false,
        hasSubscriptionAccess: false,
        hasCourseAccess: false,
        paidPayments: [],
      });
    }

    const paidPayments = user.payments as PaymentRecord[];

    const hasSubscriptionAccess = paidPayments.some(
      (payment: PaymentRecord) =>
        payment.paymentType === "MONTHLY_SUBSCRIPTION" ||
        payment.paymentType === "ANNUAL_SUBSCRIPTION"
    );

    const hasCourseAccess = paidPayments.some(
      (payment: PaymentRecord) =>
        payment.paymentType === "PAY_PER_COURSE" &&
        payment.courseId === courseId
    );

    const hasAccess = hasSubscriptionAccess || hasCourseAccess;

    return NextResponse.json({
      hasAccess,
      hasSubscriptionAccess,
      hasCourseAccess,
      paidPayments,
    });
  } catch (error) {
    console.error("Check premium access error:", error);

    return NextResponse.json(
      { error: "Something went wrong while checking premium access." },
      { status: 500 }
    );
  }
}