import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { getPremiumAccess } from "@/lib/premiumAccess";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
};

/**
 * Returns a lesson's video, notes and reading link. The lesson page no
 * longer puts these in the HTML for premium lessons (it used to, and only
 * hid them in the browser), so this is the one place premium material is
 * handed out — and only to a verified learner who has paid.
 */
export async function GET(request: NextRequest, { params }: RouteProps) {
  const verifiedUser = await requireUser(request);

  if (!verifiedUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { slug, lessonSlug } = await params;

    const lesson = await prisma.lesson.findFirst({
      where: {
        slug: lessonSlug,
        course: {
          slug,
        },
      },
      select: {
        courseId: true,
        accessType: true,
        content: true,
        notes: true,
        videoUrl: true,
        readingUrl: true,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found." },
        { status: 404 }
      );
    }

    if (lesson.accessType === "PREMIUM") {
      const { hasAccess } = await getPremiumAccess(
        verifiedUser.email,
        lesson.courseId
      );

      if (!hasAccess) {
        return NextResponse.json(
          { error: "Premium access required." },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({
      material: {
        content: lesson.content,
        notes: lesson.notes,
        videoUrl: lesson.videoUrl,
        readingUrl: lesson.readingUrl,
      },
    });
  } catch (error) {
    console.error("Lesson material error:", error);

    return NextResponse.json(
      { error: "Something went wrong while loading the lesson." },
      { status: 500 }
    );
  }
}
