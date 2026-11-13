import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  certificateLookupBlockedMinutes,
  clientIp,
  recordWrongCertificateCode,
} from "@/lib/loginThrottle";

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

    // Too many wrong codes from one address: stop it guessing its way
    // through certificates.
    const ip = clientIp(request);
    const blockedMinutes = await certificateLookupBlockedMinutes(ip);

    if (blockedMinutes > 0) {
      return NextResponse.json(
        {
          valid: false,
          error: `Too many wrong codes. Please wait ${blockedMinutes} minute${
            blockedMinutes === 1 ? "" : "s"
          } and try again.`,
        },
        { status: 429, headers: { "Retry-After": String(blockedMinutes * 60) } }
      );
    }

    const certificate = await prisma.certificate.findUnique({
      where: {
        certificateCode: code.trim(),
      },
      // This route is public: anyone holding a code can look it up, so
      // only what is printed on the certificate itself goes back.
      include: {
        user: { select: { name: true } },
        course: { select: { title: true, category: true } },
      },
    });

    if (!certificate) {
      await recordWrongCertificateCode(ip);

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