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

export async function GET(_request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;

    const course = await prisma.course.findUnique({
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

    return NextResponse.json({ course });
  } catch (error) {
    console.error("Fetch course error:", error);

    return NextResponse.json(
      { error: "Something went wrong while fetching the course." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const {
      title,
      category,
      description,
      imageUrl,
      introVideoUrl,
      learningOutcomes,
      numberOfLessons,
      status,
      accessType,
    } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json(
        { error: "Course title is required." },
        { status: 400 }
      );
    }

    const existingCourse = await prisma.course.findUnique({
      where: {
        slug,
      },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    const newSlug = createSlug(title);

    const slugOwner = await prisma.course.findUnique({
      where: {
        slug: newSlug,
      },
    });

    const finalSlug =
      slugOwner && slugOwner.id !== existingCourse.id
        ? `${newSlug}-${Date.now().toString().slice(-5)}`
        : newSlug;

    const updatedCourse = await prisma.course.update({
      where: {
        id: existingCourse.id,
      },
      data: {
        title,
        slug: finalSlug,
        category: category || "General",
        description: description || "",
        imageUrl: imageUrl || "",
        introVideoUrl: introVideoUrl || "",
        learningOutcomes: learningOutcomes || "",
        numberOfLessons: Number(numberOfLessons) || 0,
        status: status === "Published" ? "PUBLISHED" : "DRAFT",
        accessType:
          accessType === "Premium"
            ? "PREMIUM"
            : accessType === "Subscription Only"
            ? "SUBSCRIPTION_ONLY"
            : "FREE_PREVIEW",
      },
    });

    return NextResponse.json({
      message: "Course updated successfully.",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Update course error:", error);

    return NextResponse.json(
      { error: "Something went wrong while updating the course." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;

    const existingCourse = await prisma.course.findUnique({
      where: {
        slug,
      },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    await prisma.course.delete({
      where: {
        id: existingCourse.id,
      },
    });

    return NextResponse.json({
      message: "Course deleted successfully.",
    });
  } catch (error) {
    console.error("Delete course error:", error);

    return NextResponse.json(
      { error: "Something went wrong while deleting the course." },
      { status: 500 }
    );
  }
}