import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page not found",
};

// Shown for any address that doesn't exist (and by notFound()).
export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="flex min-h-[70vh] items-center bg-gray-50 px-6 py-20 text-ink">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-tint text-accent">
            <Compass size={40} />
          </div>

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">
            Page not found
          </p>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
            This path leads{" "}
            <em className="accent text-accent">off the map</em>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-gray-600">
            The page may have moved, or the link may be mistyped. The courses
            are a good place to pick the trail back up.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/courses"
              className="group inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-4 font-bold text-white hover:bg-secondary-hover"
            >
              Browse courses
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/"
              className="rounded-full border border-line bg-surface px-6 py-4 font-bold hover:bg-gray-50"
            >
              Go to the homepage
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
