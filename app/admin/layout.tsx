import type { Metadata } from "next";
import AdminGuard from "@/components/AdminGuard";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminGuard>{children}</AdminGuard>;
}