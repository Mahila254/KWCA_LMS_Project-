import { redirect } from "next/navigation";

// This used to be a placeholder page that never saved anything (it only showed "Lesson saved successfully!").
// The real tools are per course: Admin -> Courses -> Lessons / Quiz
// Questions / Edit.
export default function LegacyEditLessonPage() {
  redirect("/admin/courses");
}
