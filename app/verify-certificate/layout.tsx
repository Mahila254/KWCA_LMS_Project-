import type { Metadata } from "next";

// The page itself is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Verify a Certificate",
  description:
    "Check that a KWCA Learning Hub certificate is genuine by entering its certificate code.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
