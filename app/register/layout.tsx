import type { Metadata } from "next";

// The page itself is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Create a free learner account to start the KWCA conservancy courses, track your progress and earn certificates.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
