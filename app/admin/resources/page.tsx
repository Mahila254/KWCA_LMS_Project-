"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ResourcesAdminPage() {
  const resources = [
    {
      title: "Conservancy Introduction Guide",
      type: "PDF",
      category: "Governance",
      status: "Uploaded",
    },
    {
      title: "Annual General Meeting Checklist",
      type: "Template",
      category: "Governance",
      status: "Uploaded",
    },
    {
      title: "Financial Management Tool",
      type: "Excel",
      category: "Finance",
      status: "Draft",
    },
  ];

  function uploadResource() {
    alert("✅ Resource uploaded successfully!");
  }

  function downloadResource() {
    alert("⬇️ Resource download started!");
  }

  function deleteResource() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resource?"
    );

    if (confirmDelete) {
      alert("🗑️ Resource deleted successfully!");
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h1 className="text-6xl font-bold text-[#07122E]">
              Resource Management
            </h1>

            <p className="mt-4 text-xl text-gray-600">
              Upload, organize, download, and manage course resources.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">Upload Resource</h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <input
                type="text"
                placeholder="Resource title"
                className="rounded-xl border px-4 py-3"
              />

              <select className="rounded-xl border px-4 py-3">
                <option>PDF</option>
                <option>Template</option>
                <option>Excel</option>
                <option>Video</option>
              </select>

              <select className="rounded-xl border px-4 py-3">
                <option>Governance</option>
                <option>Finance</option>
                <option>Conservation Management</option>
                <option>Community Engagement</option>
              </select>

              <input
                type="file"
                className="rounded-xl border px-4 py-3"
              />
            </div>

            <button
              type="button"
              onClick={uploadResource}
              className="mt-6 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white"
            >
              Upload Resource
            </button>
          </div>

          <h2 className="mb-8 text-4xl font-bold">Resources</h2>

          <div className="space-y-6">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-3xl border bg-white p-8 shadow-sm"
              >
                <div>
                  <h3 className="text-2xl font-bold">{resource.title}</h3>

                  <p className="mt-2 text-gray-500">
                    {resource.type} • {resource.category}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      resource.status === "Uploaded"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {resource.status}
                  </span>

                  <button
                    type="button"
                    onClick={downloadResource}
                    className="rounded-xl border px-5 py-2 font-bold hover:bg-gray-100"
                  >
                    Download
                  </button>

                  <button
                    type="button"
                    onClick={deleteResource}
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