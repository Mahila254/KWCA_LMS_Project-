import type { Metadata } from "next";

// The page itself is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to continue your conservancy courses.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
