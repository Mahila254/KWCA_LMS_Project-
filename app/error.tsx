"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, TriangleAlert } from "lucide-react";

// Shown when a page hits an unexpected error, instead of a blank screen.
export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center bg-gray-50 px-6 py-20 text-ink">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-700">
          <TriangleAlert size={38} />
        </div>

        <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
          Something went wrong
        </h1>

        <p className="mx-auto mt-4 max-w-md text-lg leading-8 text-gray-600">
          The page couldn&apos;t load. Your progress is safe. Try again, and if
          it keeps happening, come back in a few minutes.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-4 font-bold text-white hover:bg-primary-hover"
          >
            <RefreshCw size={18} />
            Try again
          </button>

          <Link
            href="/"
            className="rounded-full border border-line bg-surface px-6 py-4 font-bold hover:bg-gray-50"
          >
            Go to the homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
