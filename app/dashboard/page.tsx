import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LearnerDashboard from "@/components/LearnerDashboard";

export const metadata: Metadata = {
  title: "My Learning",
  robots: { index: false },
};

export default function DashboardPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-ink">
        <section className="bg-canvas py-14 md:py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="font-semibold text-accent">My Learning</p>

            <h1 className="mt-3 text-5xl font-bold md:text-6xl">
              Welcome <em className="accent text-accent">back</em>
            </h1>

            <p className="mt-4 max-w-2xl text-xl text-gray-600">
              Your courses, your progress and your certificates, all in one
              place.
            </p>
          </div>
        </section>

        {/* The learner's real data, loaded in the browser with their login. */}
        <LearnerDashboard />
      </main>

      <Footer />
    </>
  );
}
