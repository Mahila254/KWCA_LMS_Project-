import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentId, status } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required." },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "Payment status is required." },
        { status: 400 }
      );
    }

    const allowedStatuses = ["PENDING", "PAID", "FAILED"];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid payment status." },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        status,
      },
      include: {
        user: true,
        course: true,
      },
    });

    revalidatePath("/admin/payments");

    return NextResponse.json({
      message: "Payment status updated successfully.",
      payment,
    });
  } catch (error) {
    console.error("Update payment status error:", error);

    return NextResponse.json(
      { error: "Something went wrong while updating payment status." },
      { status: 500 }
    );
  }
}