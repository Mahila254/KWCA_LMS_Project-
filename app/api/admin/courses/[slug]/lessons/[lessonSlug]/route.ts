import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type RouteProps = {
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  try {
    const { slug, lessonSlug } = await params;

    const course = await prisma.course.findUnique({
      where: { slug },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: {
        courseId_slug: {
          courseId: course.id,
          slug: lessonSlug,
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ lesson, course });
  } catch (error) {
    console.error("Fetch lesson error:", error);

    return NextResponse.json(
      { error: "Something went wrong while fetching the lesson." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteProps) {
  try {
    const { slug, lessonSlug } = await params;
    const body = await request.json();

    const {
      title,
      content,
      videoUrl,
      readingUrl,
      notes,
      order,
      accessType,
    } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json(
        { error: "Lesson title is required." },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { slug },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    const existingLesson = await prisma.lesson.findUnique({
      where: {
        courseId_slug: {
          courseId: course.id,
          slug: lessonSlug,
        },
      },
    });

    if (!existingLesson) {
      return NextResponse.json(
        { error: "Lesson not found." },
        { status: 404 }
      );
    }

    const newSlug = createSlug(title);

    const slugOwner = await prisma.lesson.findUnique({
      where: {
        courseId_slug: {
          courseId: course.id,
          slug: newSlug,
        },
      },
    });

    const finalSlug =
      slugOwner && slugOwner.id !== existingLesson.id
        ? `${newSlug}-${Date.now().toString().slice(-5)}`
        : newSlug;

    const updatedLesson = await prisma.lesson.update({
      where: { id: existingLesson.id },
      data: {
        title,
        slug: finalSlug,
        content: content || "",
        videoUrl: videoUrl || "",
        readingUrl: readingUrl || "",
        notes: notes || "",
        order: Number(order) || existingLesson.order,
        accessType: accessType === "Premium" ? "PREMIUM" : "PREVIEW",
      },
    });

    return NextResponse.json({
      message: "Lesson updated successfully.",
      lesson: updatedLesson,
    });
  } catch (error) {
    console.error("Update lesson error:", error);

    return NextResponse.json(
      { error: "Something went wrong while updating the lesson." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  try {
    const { slug, lessonSlug } = await params;

    const course = await prisma.course.findUnique({
      where: { slug },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: {
        courseId_slug: {
          courseId: course.id,
          slug: lessonSlug,
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found." },
        { status: 404 }
      );
    }

    await prisma.lesson.delete({
      where: { id: lesson.id },
    });

    const lessonCount = await prisma.lesson.count({
      where: { courseId: course.id },
    });

    await prisma.course.update({
      where: { id: course.id },
      data: {
        numberOfLessons: lessonCount,
      },
    });

    return NextResponse.json({
      message: "Lesson deleted successfully.",
    });
  } catch (error) {
    console.error("Delete lesson error:", error);

    return NextResponse.json(
      { error: "Something went wrong while deleting the lesson." },
      { status: 500 }
    );
  }
}