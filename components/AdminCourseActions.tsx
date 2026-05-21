"use client";

import Link from "next/link";

type Props = {
  status: string;
};

export default function AdminCourseActions({
  status,
}: Props) {
  return (
    <div className="flex items-center gap-4">

      <span
        className={`rounded-full px-4 py-2 text-sm font-medium ${
          status === "Published"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {status}
      </span>

      <Link
        href="/admin/courses/edit"
        className="rounded-xl border border-gray-300 px-5 py-2 font-bold text-[#101828] hover:bg-gray-100 transition"
      >
        Edit
      </Link>

    </div>
  );
}