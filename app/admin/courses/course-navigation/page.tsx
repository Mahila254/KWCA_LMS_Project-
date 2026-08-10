import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CourseNavigationPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-[#F8F4F4] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-5xl font-extrabold text-[#1E1D59]">
            Course Admin Navigation
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Use this page to access course admin actions.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          <a
            href="/admin/courses/edit"
            className="rounded-3xl bg-white p-8 shadow-sm border hover:shadow-md"
          >
            <h2 className="text-2xl font-bold text-[#1E1D59]">
              Add New Course
            </h2>

            <p className="mt-3 text-gray-600">
              Open the course form to create a new course.
            </p>
          </a>

          <a
            href="/admin/courses/edit"
            className="rounded-3xl bg-white p-8 shadow-sm border hover:shadow-md"
          >
            <h2 className="text-2xl font-bold text-[#1E1D59]">
              Edit Existing Course
            </h2>

            <p className="mt-3 text-gray-600">
              Open the edit course form.
            </p>
          </a>

          <a
            href="/admin/courses"
            className="rounded-3xl bg-white p-8 shadow-sm border hover:shadow-md"
          >
            <h2 className="text-2xl font-bold text-[#1E1D59]">
              Back to Course Management
            </h2>

            <p className="mt-3 text-gray-600">
              Return to the course list.
            </p>
          </a>

          <a
            href="/admin"
            className="rounded-3xl bg-white p-8 shadow-sm border hover:shadow-md"
          >
            <h2 className="text-2xl font-bold text-[#1E1D59]">
              Back to Admin Dashboard
            </h2>

            <p className="mt-3 text-gray-600">
              Return to the main admin dashboard.
            </p>
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}