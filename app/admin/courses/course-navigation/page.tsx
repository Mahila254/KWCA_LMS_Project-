import { redirect } from "next/navigation";

// This used to be a placeholder page that never saved anything (an early layout mock-up).
// The real tools are per course: Admin -> Courses -> Lessons / Quiz
// Questions / Edit.
export default function LegacyCourseNavigationPage() {
  redirect("/admin/courses");
}
