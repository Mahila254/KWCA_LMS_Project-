import { cache } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { toPlainText } from "@/components/FormattedText";
import { toDescription } from "@/lib/site";

/**
 * Just enough of a course for page titles and link previews. Wrapped in
 * React's cache so the title, the preview image and the page itself can
 * all ask for it during one request without repeating the query.
 */
export const getCourseMeta = cache(async (slug: string) => {
  return prisma.course.findUnique({
    where: { slug },
    select: {
      title: true,
      description: true,
      category: true,
      status: true,
      lessons: {
        select: { title: true, slug: true, order: true },
        orderBy: { order: "asc" },
      },
    },
  });
});

export type CourseMeta = NonNullable<Awaited<ReturnType<typeof getCourseMeta>>>;

export function courseDescription(course: CourseMeta) {
  return course.description
    ? toDescription(toPlainText(course.description))
    : `A ${course.category ? `${course.category.toLowerCase()} ` : ""}course from the KWCA Learning Hub.`;
}

/** Title, description and preview text for a page inside a course. */
export async function courseMetadata(
  slug: string,
  pageTitle?: (course: CourseMeta) => string
): Promise<Metadata> {
  const course = await getCourseMeta(slug);

  if (!course) {
    return { title: "Course not found", robots: { index: false } };
  }

  const title = pageTitle ? pageTitle(course) : course.title.trim();
  const description = courseDescription(course);

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    // Drafts are only reachable by admins previewing them.
    robots: course.status === "PUBLISHED" ? undefined : { index: false },
  };
}
