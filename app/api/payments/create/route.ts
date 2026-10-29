import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { PLAN_PRICES_KES, isPlanType } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const verifiedUser = await requireUser(request);

  if (!verifiedUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Any amount in the body is ignored: the price comes from the plan.
    const { paymentType, courseId } = body;

    if (!isPlanType(paymentType)) {
      return NextResponse.json(
        { error: "Please choose a valid payment plan." },
        { status: 400 }
      );
    }

    const amount = PLAN_PRICES_KES[paymentType];

    if (paymentType === "PAY_PER_COURSE") {
      const course =
        typeof courseId === "string"
          ? await prisma.course.findUnique({
              where: { id: courseId },
              select: { id: true },
            })
          : null;

      if (!course) {
        return NextResponse.json(
          { error: "Please choose a course to unlock." },
          { status: 400 }
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

    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        courseId: typeof courseId === "string" && courseId ? courseId : null,
        paymentType,
        amount,
        currency: "KES",
        status: "PENDING",
        provider: "MANUAL_MVP",
        providerRef: `KWCA-MVP-${Date.now()}`,
      },
    });

    return NextResponse.json({
      message: "Payment record created successfully.",
      payment,
    });
  } catch (error) {
    console.error("Create payment error:", error);

    return NextResponse.json(
      { error: "Something went wrong while creating payment record." },
      { status: 500 }
    );
  }
}