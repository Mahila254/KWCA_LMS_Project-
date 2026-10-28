import { redirect } from "next/navigation";

// This used to be a placeholder edit form that never saved anything (it
// only showed "Course updated successfully!"). Real editing lives at
// /admin/courses/[slug]/edit, reached from each course in the list.
export default function LegacyEditCoursePage() {
  redirect("/admin/courses");
}
