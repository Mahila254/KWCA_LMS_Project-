import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

// Rebuilt on request, so a newly published course is listed straight away.
export const dynamic = "force-dynamic";

// The list of public pages for search engines: the fixed pages plus every
// published course. Lesson pages are left out (many need an account).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
    orderBy: { createdAt: "asc" },
  });

  const fixedPages = ["", "/courses", "/pricing", "/verify-certificate", "/login", "/register"];

  return [
    ...fixedPages.map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...courses.map((course) => ({
      url: `${SITE_URL}/courses/${course.slug}`,
      lastModified: course.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
