import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
};

// A stray copy of the lesson editor that ended up under /api. The real
// editor is /admin/courses/[slug]/lessons/[lessonSlug]/edit, which is
// also behind the admin login (proxy.ts only guards /admin/**).
export default async function StrayLessonEditPage({ params }: PageProps) {
  const { slug, lessonSlug } = await params;
  redirect(`/admin/courses/${slug}/lessons/${lessonSlug}/edit`);
}
