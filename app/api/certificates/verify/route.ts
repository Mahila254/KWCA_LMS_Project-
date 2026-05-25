import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Certificate code is required." },
        { status: 400 }
      );
    }

    const certificate = await prisma.certificate.findUnique({
      where: {
        certificateCode: code.trim(),
      },
      include: {
        user: true,
        course: true,
      },
    });

    if (!certificate) {
      return NextResponse.json(
        {
          valid: false,
          error: "Certificate not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      certificate: {
        code: certificate.certificateCode,
        issuedAt: certificate.issuedAt,
        learnerName: certificate.user.name || "Unnamed Learner",
        learnerEmail: certificate.user.email,
        courseTitle: certificate.course.title,
        courseCategory: certificate.course.category,
      },
    });
  } catch (error) {
    console.error("Certificate verification error:", error);

    return NextResponse.json(
      { error: "Something went wrong while verifying the certificate." },
      { status: 500 }
    );
  }
}