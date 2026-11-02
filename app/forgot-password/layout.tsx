import type { Metadata } from "next";

// The page itself is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Forgot your password",
  description: "Get an email with a link to choose a new password.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
