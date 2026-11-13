"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { notify } from "@/lib/notify";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (!response.ok) {
        notify("Something went wrong while logging out.");
        return;
      }

      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error(error);
      notify("Something went wrong while logging out.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loggingOut}
      className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-bold text-ink hover:bg-surface/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut size={18} />
      {loggingOut ? "Logging Out..." : "Logout"}
    </button>
  );
}