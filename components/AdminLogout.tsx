"use client";

import { useRouter } from "next/navigation";

export default function AdminLogout() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("kwca-admin-login");
    alert("You have been logged out.");
    router.push("/admin-login");
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-xl border px-5 py-2 font-bold hover:bg-gray-100"
    >
      Logout
    </button>
  );
}