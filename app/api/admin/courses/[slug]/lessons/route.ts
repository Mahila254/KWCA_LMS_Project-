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
  }>;
};

export async function POST(request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;
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
      include: { lessons: true },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    const baseSlug = createSlug(title);

    const existingLesson = await prisma.lesson.findUnique({
      where: {
        courseId_slug: {
          courseId: course.id,
          slug: baseSlug,
        },
      },
    });

    const finalSlug = existingLesson
      ? `${baseSlug}-${Date.now().toString().slice(-5)}`
      : baseSlug;

    const lessonOrder =
      Number(order) || course.lessons.length + 1;

    const lesson = await prisma.lesson.create({
      data: {
        courseId: course.id,
        title,
        slug: finalSlug,
        content: content || "",
        videoUrl: videoUrl || "",
        readingUrl: readingUrl || "",
        notes: notes || "",
        order: lessonOrder,
        accessType: accessType === "Premium" ? "PREMIUM" : "PREVIEW",
      },
    });

    await prisma.course.update({
      where: { id: course.id },
      data: {
        numberOfLessons: await prisma.lesson.count({
          where: { courseId: course.id },
        }),
      },
    });

    return NextResponse.json(
      {
        message: "Lesson created successfully.",
        lesson,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create lesson error:", error);

    return NextResponse.json(
      { error: "Something went wrong while creating the lesson." },
      { status: 500 }
    );
  }
}