import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

function generateCertificateCode(courseSlug: string) {
  const courseCode = courseSlug.toUpperCase().replace(/-/g, "").slice(0, 10);
  const randomCode = Math.floor(10000 + Math.random() * 90000);

  return `KWCA-${courseCode}-${new Date().getFullYear()}-${randomCode}`;
}

export async function GET(_request: Request, { params }: RouteProps) {
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

    const user = await prisma.user.upsert({
      where: {
        email: "learner@kwca.local",
      },
      update: {},
      create: {
        name: "Learner Name",
        email: "learner@kwca.local",
        role: "STUDENT",
      },
    });

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

export async function POST(_request: Request, { params }: RouteProps) {
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

    const user = await prisma.user.upsert({
      where: {
        email: "learner@kwca.local",
      },
      update: {},
      create: {
        name: "Learner Name",
        email: "learner@kwca.local",
        role: "STUDENT",
      },
    });

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