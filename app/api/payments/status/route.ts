import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const verifiedUser = await requireUser(request);

  if (!verifiedUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("paymentId");

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required." },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
      include: {
        course: true,
        user: true,
      },
    });

    if (!payment || payment.user.email !== verifiedUser.email) {
      return NextResponse.json(
        { error: "Payment record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      payment: {
        id: payment.id,
        status: payment.status,
        paymentType: payment.paymentType,
        amount: payment.amount,
        currency: payment.currency,
        courseSlug: payment.course?.slug || null,
      },
    });
  } catch (error) {
    console.error("Check payment status error:", error);

    return NextResponse.json(
      { error: "Something went wrong while checking payment status." },
      { status: 500 }
    );
  }
}