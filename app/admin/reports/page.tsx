"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ReportsAdminPage() {
  function exportReport() {
    alert("📊 Report exported successfully!");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h1 className="text-6xl font-bold text-[#07122E]">
              Reports Dashboard
            </h1>

            <p className="mt-4 text-xl text-gray-600">
              Track course performance, learner progress, and platform activity.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-4">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-gray-500">Total Learners</p>
              <h2 className="mt-4 text-5xl font-bold">50</h2>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-gray-500">Active Courses</p>
              <h2 className="mt-4 text-5xl font-bold">9</h2>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-gray-500">Completed Lessons</p>
              <h2 className="mt-4 text-5xl font-bold">124</h2>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-gray-500">Average Progress</p>
              <h2 className="mt-4 text-5xl font-bold">68%</h2>
            </div>
          </div>

          <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Course Performance</h2>

              <button
                type="button"
                onClick={exportReport}
                className="rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white"
              >
                Export Report
              </button>
            </div>

            <div className="mt-8 space-y-6">
              {[
                ["What is a Conservancy?", "100%"],
                ["How to establish a strong Conservancy", "45%"],
                ["Managing a Conservancy effectively", "32%"],
                ["Creating sustainable revenue", "20%"],
              ].map(([course, progress]) => (
                <div key={course}>
                  <div className="mb-2 flex justify-between">
                    <p className="font-bold">{course}</p>
                    <p className="text-gray-500">{progress}</p>
                  </div>

                  <div className="h-3 rounded-full bg-gray-200">
                    <div
                      className="h-3 rounded-full bg-[#007F73]"
                      style={{ width: progress }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">Recent Activity</h2>

            <div className="mt-6 space-y-4">
              <p className="rounded-xl bg-gray-50 p-4">
                Mary Njeri completed “What is a Conservancy?”
              </p>

              <p className="rounded-xl bg-gray-50 p-4">
                John Otieno started “How to establish a strong Conservancy”
              </p>

              <p className="rounded-xl bg-gray-50 p-4">
                Amina Hassan downloaded “AGM Checklist”
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}