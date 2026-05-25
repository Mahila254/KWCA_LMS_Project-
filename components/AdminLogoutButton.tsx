"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

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
        alert("Something went wrong while logging out.");
        return;
      }

      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while logging out.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loggingOut}
      className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 font-bold text-[#07122E] hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut size={18} />
      {loggingOut ? "Logging Out..." : "Logout"}
    </button>
  );
}