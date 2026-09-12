import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

// One feedback record per learner per course — resubmitting (e.g. after a
// final quiz retake) updates the existing record instead of creating a
// duplicate, so the admin feedback list doesn't fill up with repeats from
// the same learner.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const verifiedUser = await requireUser(request);

  if (!verifiedUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));

  const rating = Number(body?.rating);
  const comment =
    typeof body?.comment === "string" && body.comment.trim()
      ? body.comment.trim().slice(0, 2000)
      : null;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be a whole number between 1 and 5." },
      { status: 400 }
    );
  }

  const feedback = await prisma.courseFeedback.upsert({
    where: {
      userId_courseId: {
        userId: verifiedUser.id,
        courseId: course.id,
      },
    },
    update: {
      rating,
      comment,
    },
    create: {
      userId: verifiedUser.id,
      courseId: course.id,
      rating,
      comment,
    },
  });

  return NextResponse.json({
    message: "Feedback saved.",
    feedback,
  });
}
