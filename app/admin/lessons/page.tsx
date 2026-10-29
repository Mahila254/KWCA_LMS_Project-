import { redirect } from "next/navigation";

// This used to be a placeholder page that never saved anything (a static list of sample lessons).
// The real tools are per course: Admin -> Courses -> Lessons / Quiz
// Questions / Edit.
export default function LegacyLessonsPage() {
  redirect("/admin/courses");
}
