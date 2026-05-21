import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LessonsAdminPage() {
  const lessons = [
    {
      title: "Definition of a wildlife conservancy",
      course: "What is a Conservancy?",
      type: "Video + Notes",
      status: "Published",
    },
    {
      title: "Why conservancies matter in Kenya",
      course: "What is a Conservancy?",
      type: "Reading",
      status: "Draft",
    },
    {
      title: "Types of conservancies",
      course: "What is a Conservancy?",
      type: "Video + Quiz",
      status: "Published",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h1 className="text-6xl font-bold text-[#07122E]">
              Lesson Management
            </h1>

            <p className="mt-4 text-xl text-gray-600">
              Manage lesson videos, notes, activities, and quizzes.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-4xl font-bold">Lessons</h2>

            <a
              href="/admin/lessons/create"
              className="rounded-xl bg-[#007F73] px-8 py-4 font-bold text-white hover:opacity-90"
            >
              + Add Lesson
            </a>
          </div>

          <div className="space-y-8">
            {lessons.map((lesson, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-3xl border bg-white p-8 shadow-sm"
              >
                <div>
                  <h3 className="text-3xl font-bold">{lesson.title}</h3>

                  <p className="mt-3 text-gray-500">
                    {lesson.course} • {lesson.type}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-5 py-3 text-sm font-semibold ${
                      lesson.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {lesson.status}
                  </span>

                  <a
                    href="/admin/lessons/edit"
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