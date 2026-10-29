import { redirect } from "next/navigation";

// This used to be a placeholder page that never saved anything (it only showed "Resource uploaded successfully!").
// The real tools are per course: Admin -> Courses -> Lessons / Quiz
// Questions / Edit.
export default function LegacyResourcesPage() {
  redirect("/admin/courses");
}
