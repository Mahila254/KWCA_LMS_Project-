"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LearnersAdminPage() {
  const learners = [
    {
      name: "Mary Njeri",
      email: "mary@kwca.org",
      course: "What is a Conservancy?",
      progress: "100%",
      status: "Active",
    },
    {
      name: "John Otieno",
      email: "john@conservancy.org",
      course: "How to establish a strong Conservancy",
      progress: "45%",
      status: "Active",
    },
    {
      name: "Amina Hassan",
      email: "amina@community.org",
      course: "Managing a Conservancy effectively",
      progress: "20%",
      status: "Pending",
    },
  ];

  function viewLearner() {
    alert("👤 Learner profile opened.");
  }

  function removeLearner() {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this learner?"
    );

    if (confirmRemove) {
      alert("🗑️ Learner removed successfully!");
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h1 className="text-6xl font-bold text-[#07122E]">
              Learner Management
            </h1>

            <p className="mt-4 text-xl text-gray-600">
              View learners, enrollments, course progress, and account status.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">Search Learners</h2>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <input
                type="text"
                placeholder="Search by name or email"
                className="rounded-xl border px-4 py-3"
              />

              <select className="rounded-xl border px-4 py-3">
                <option>All Courses</option>
                <option>What is a Conservancy?</option>
                <option>How to establish a strong Conservancy</option>
                <option>Managing a Conservancy effectively</option>
              </select>

              <select className="rounded-xl border px-4 py-3">
                <option>All Statuses</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          <h2 className="mb-8 text-4xl font-bold">Learners</h2>

          <div className="space-y-6">
            {learners.map((learner, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-3xl border bg-white p-8 shadow-sm"
              >
                <div>
                  <h3 className="text-2xl font-bold">{learner.name}</h3>

                  <p className="mt-2 text-gray-500">
                    {learner.email} • {learner.course}
                  </p>

                  <div className="mt-4 h-3 w-80 rounded-full bg-gray-200">
                    <div
                      className="h-3 rounded-full bg-[#007F73]"
                      style={{ width: learner.progress }}
                    />
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    {learner.progress} complete
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      learner.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {learner.status}
                  </span>

                  <button
                    type="button"
                    onClick={viewLearner}
                    className="rounded-xl border px-5 py-2 font-bold hover:bg-gray-100"
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={removeLearner}
                    className="rounded-xl bg-red-600 px-5 py-2 font-bold text-white"
                  >
                    Remove
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