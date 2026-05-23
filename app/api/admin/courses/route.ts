import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  try {
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

    const baseSlug = createSlug(title);

    const existingCourse = await prisma.course.findUnique({
      where: {
        slug: baseSlug,
      },
    });

    const finalSlug = existingCourse
      ? `${baseSlug}-${Date.now().toString().slice(-5)}`
      : baseSlug;

    const course = await prisma.course.create({
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

    return NextResponse.json(
      {
        message: "Course created successfully.",
        course,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create course error:", error);

    return NextResponse.json(
      { error: "Something went wrong while creating the course." },
      { status: 500 }
    );
  }
}