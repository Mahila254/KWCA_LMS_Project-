import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const verifiedUser = await requireUser(request);

  if (!verifiedUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { paymentType, amount, courseId } = body;

    if (!paymentType) {
      return NextResponse.json(
        { error: "Payment type is required." },
        { status: 400 }
      );
    }

    if (!amount) {
      return NextResponse.json(
        { error: "Payment amount is required." },
        { status: 400 }
      );
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
        courseId: courseId || null,
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