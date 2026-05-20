import Courses from "@/components/Courses";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CoursesPage() {
  return (
    <main>
      <Navbar />

      <section className="bg-[#F2FBF8] py-20 px-6 text-center">
        <h1 className="text-5xl font-extrabold text-[#101828] mb-4">
          All Courses
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore practical modules designed to help conservancy leaders build,
          manage, and strengthen wildlife conservancies across Kenya.
        </p>
      </section>

      <Courses />
      <Footer />
    </main>
  );
}