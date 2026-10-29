import type { Metadata } from "next";
import { courseMetadata } from "@/lib/courseMeta";

// The page itself is a client component, so its title lives here.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return courseMetadata(slug, (course) => `Practice Quiz · ${course.title.trim()}`);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
