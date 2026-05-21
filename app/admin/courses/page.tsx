import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CoursesAdminPage() {
  const courses = [
    {
      title: "What is a Conservancy?",
      lessons: 4,
      learners: 25,
      status: "Published",
    },
    {
      title: "How to establish a strong Conservancy",
      lessons: 6,
      learners: 15,
      status: "Draft",
    },
    {
      title: "Managing a Conservancy effectively",
      lessons: 8,
      learners: 10,
      status: "Published",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">

        {/* Hero */}
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h1 className="text-6xl font-bold text-[#07122E]">
              Course Management
            </h1>

            <p className="mt-4 text-xl text-gray-600">
              Create and manage LMS courses.
            </p>
          </div>
        </section>

        {/* Courses */}
        <section className="mx-auto max-w-6xl px-6 py-16">

          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-4xl font-bold">
              Courses
            </h2>

            <a
              href="/admin/courses/create"
              className="rounded-xl bg-[#007F73] px-8 py-4 font-bold text-white hover:opacity-90"
            >
              + Add Course
            </a>
          </div>

          <div className="space-y-8">
            {courses.map((course, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-3xl border bg-white p-8 shadow-sm"
              >
                <div>
                  <h3 className="text-3xl font-bold">
                    {course.title}
                  </h3>

                  <p className="mt-3 text-gray-500">
                    {course.lessons} lessons • {course.learners} learners
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-5 py-3 text-sm font-semibold ${
                      course.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {course.status}
                  </span>

                  <a
                    href="/admin/courses/edit"
                    className="rounded-xl border px-6 py-3 font-semibold hover:bg-gray-100"
                  >
                    Edit
                  </a>

                </div>
              </div>
            ))}
          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}