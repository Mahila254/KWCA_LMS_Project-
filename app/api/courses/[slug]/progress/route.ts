import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

type ProgressRequestBody = {
  id?: string;
  email?: string;
  name?: string;
  lessonSlug?: string;
};

type LessonRecord = {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  content: string | null;
  videoUrl: string | null;
  readingUrl: string | null;
  notes: string | null;
  order: number;
  accessType: "PREVIEW" | "PREMIUM";
  createdAt: Date;
  updatedAt: Date;
};

type CourseWithLessons = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  imageUrl: string | null;
  introVideoUrl: string | null;
  learningOutcomes: string | null;
  numberOfLessons: number;
  status: "DRAFT" | "PUBLISHED";
  accessType: "FREE_PREVIEW" | "PREMIUM" | "SUBSCRIPTION_ONLY";
  createdAt: Date;
  updatedAt: Date;
  lessons: LessonRecord[];
};

export async function POST(request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;
    const body = (await request.json()) as ProgressRequestBody;

    const { id, email, name, lessonSlug } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Learner ID is required." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Learner email is required." },
        { status: 400 }
      );
    }

    if (!lessonSlug) {
      return NextResponse.json(
        { error: "Lesson slug is required." },
        { status: 400 }
      );
    }

    const course: CourseWithLessons | null = await prisma.course.findUnique({
      where: {
        slug,
      },
      include: {
        lessons: {
          orderBy: {
            order: "asc",
          },
        },
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
        email,
      },
      update: {
        name: name || null,
      },
      create: {
        id,
        email,
        name: name || null,
        role: "STUDENT",
      },
    });

    const currentLesson = course.lessons.find(
      (lesson: LessonRecord) => lesson.slug === lessonSlug
    );

    if (!currentLesson) {
      return NextResponse.json(
        { error: "Lesson not found." },
        { status: 404 }
      );
    }

    const lessonIndex = course.lessons.findIndex(
      (lesson: LessonRecord) => lesson.slug === lessonSlug
    );

    const completedLessons = lessonIndex + 1;

    const progress =
      course.lessons.length > 0
        ? Math.round((completedLessons / course.lessons.length) * 100)
        : 0;

    const completed = progress >= 100;

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
      update: {
        progress,
        completed,
      },
      create: {
        userId: user.id,
        courseId: course.id,
        progress,
        completed,
      },
    });

    return NextResponse.json({
      message: "Progress updated successfully.",
      course,
      user,
      enrollment,
    });
  } catch (error) {
    console.error("Progress update error:", error);

    return NextResponse.json(
      { error: "Something went wrong while updating progress." },
      { status: 500 }
    );
  }
}