"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function QuizzesAdminPage() {
  const quizzes = [
    {
      title: "What is a Conservancy Quiz",
      course: "What is a Conservancy?",
      questions: 2,
      status: "Published",
    },
    {
      title: "Governance Basics Quiz",
      course: "How to establish a strong Conservancy",
      questions: 5,
      status: "Draft",
    },
    {
      title: "Management Systems Quiz",
      course: "Managing a Conservancy effectively",
      questions: 4,
      status: "Published",
    },
  ];

  function createQuiz() {
    alert("✅ Quiz created successfully!");
  }

  function editQuiz() {
    alert("✏️ Quiz opened for editing.");
  }

  function deleteQuiz() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz?"
    );

    if (confirmDelete) {
      alert("🗑️ Quiz deleted successfully!");
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h1 className="text-6xl font-bold text-[#07122E]">
              Quiz Management
            </h1>

            <p className="mt-4 text-xl text-gray-600">
              Create, edit, and manage course assessments.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">Create Quiz</h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <input
                type="text"
                placeholder="Quiz title"
                className="rounded-xl border px-4 py-3"
              />

              <select className="rounded-xl border px-4 py-3">
                <option>What is a Conservancy?</option>
                <option>How to establish a strong Conservancy</option>
                <option>Managing a Conservancy effectively</option>
              </select>

              <input
                type="text"
                placeholder="Question"
                className="rounded-xl border px-4 py-3 md:col-span-2"
              />

              <input
                type="text"
                placeholder="Option A"
                className="rounded-xl border px-4 py-3"
              />

              <input
                type="text"
                placeholder="Option B"
                className="rounded-xl border px-4 py-3"
              />

              <input
                type="text"
                placeholder="Option C"
                className="rounded-xl border px-4 py-3"
              />

              <input
                type="text"
                placeholder="Correct Answer"
                className="rounded-xl border px-4 py-3"
              />
            </div>

            <button
              type="button"
              onClick={createQuiz}
              className="mt-6 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white"
            >
              Create Quiz
            </button>
          </div>

          <h2 className="mb-8 text-4xl font-bold">Quizzes</h2>

          <div className="space-y-6">
            {quizzes.map((quiz, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-3xl border bg-white p-8 shadow-sm"
              >
                <div>
                  <h3 className="text-2xl font-bold">{quiz.title}</h3>

                  <p className="mt-2 text-gray-500">
                    {quiz.course} • {quiz.questions} questions
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      quiz.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {quiz.status}
                  </span>

                  <button
                    type="button"
                    onClick={editQuiz}
                    className="rounded-xl border px-5 py-2 font-bold hover:bg-gray-100"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={deleteQuiz}
                    className="rounded-xl bg-red-600 px-5 py-2 font-bold text-white"
                  >
                    Delete
                  </button>
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