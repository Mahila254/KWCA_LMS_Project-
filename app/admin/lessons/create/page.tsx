import { redirect } from "next/navigation";

// This used to be a placeholder page that never saved anything (a lesson form with no save).
// The real tools are per course: Admin -> Courses -> Lessons / Quiz
// Questions / Edit.
export default function LegacyCreateLessonPage() {
  redirect("/admin/courses");
}
