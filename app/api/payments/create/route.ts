import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { id, email, name, paymentType, amount, courseId } = body;

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