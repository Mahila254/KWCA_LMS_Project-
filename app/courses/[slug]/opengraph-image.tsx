import { getCourseMeta } from "@/lib/courseMeta";
import { renderShareCard, shareCardContentType, shareCardSize } from "@/lib/shareCard";

// Shown when a course (or any lesson, quiz or certificate inside it) is
// shared: the course's own name on the platform's card.
export const alt = "A course on the KWCA Conservancies Learning Hub";
export const size = shareCardSize;
export const contentType = shareCardContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseMeta(slug);

  if (!course) {
    return renderShareCard({
      eyebrow: "Kenya Wildlife Conservancies Association",
      title: "Years of conservancy wisdom.",
      accent: "Now one click away.",
      footnote: "Free to start · Learn on any phone",
    });
  }

  const lessons = course.lessons.length;

  return renderShareCard({
    eyebrow: course.category || "Conservancy course",
    title: course.title.trim(),
    footnote: `${lessons} ${lessons === 1 ? "lesson" : "lessons"} · Practice quizzes · Certificate`,
  });
}
