import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { ensureLearnerRecord } from "@/lib/learnerRecord";
import { getCourseCertificateDesign } from "@/lib/courseCertificateDesign";

type RouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

// The last part is 8 random characters from a secure source (about a
// trillion possibilities), so a code can't be guessed from another one.
// No 0/O or 1/I/L, which are easy to misread when typing a code in.
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function generateCertificateCode(courseSlug: string) {
  const courseCode = courseSlug.toUpperCase().replace(/-/g, "").slice(0, 10);
  const randomCode = Array.from(
    randomBytes(8),
    (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]
  ).join("");

  return `KWCF-${courseCode}-${new Date().getFullYear()}-${randomCode}`;
}

export async function GET(request: NextRequest, { params }: RouteProps) {
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

    // Each course has its own savanna scene behind the certificate.
    const certificateDesign = await getCourseCertificateDesign(course);

    const user = await prisma.user.findUnique({
      where: {
        email: verifiedUser.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Learner not found in database." },
        { status: 404 }
      );
    }

    const certificate = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });

    return NextResponse.json({
      course,
      certificateDesign,
      user,
      certificate,
    });
  } catch (error) {
    console.error("Fetch certificate error:", error);

    return NextResponse.json(
      { error: "Something went wrong while fetching the certificate." },
      { status: 500 }
    );
  }
}

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

    // Each course has its own savanna scene behind the certificate.
    const certificateDesign = await getCourseCertificateDesign(course);

    const user = await ensureLearnerRecord(verifiedUser);

    const passedFinalQuiz = await prisma.quizResult.findFirst({
      where: {
        userId: user.id,
        courseId: course.id,
        quizType: "FINAL",
        passed: true,
      },
    });

    if (!passedFinalQuiz) {
      return NextResponse.json(
        {
          error:
            "You must pass the final quiz for this course before a certificate can be issued.",
        },
        { status: 403 }
      );
    }

    const existingCertificate = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });

    if (existingCertificate) {
      return NextResponse.json({
        message: "Certificate already exists.",
        course,
        certificateDesign,
        user,
        certificate: existingCertificate,
      });
    }

    const certificate = await prisma.certificate.create({
      data: {
        userId: user.id,
        courseId: course.id,
        certificateCode: generateCertificateCode(course.slug),
      },
    });

    return NextResponse.json(
      {
        message: "Certificate issued successfully.",
        course,
        certificateDesign,
        user,
        certificate,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create certificate error:", error);

    return NextResponse.json(
      { error: "Something went wrong while issuing the certificate." },
      { status: 500 }
    );
  }
}