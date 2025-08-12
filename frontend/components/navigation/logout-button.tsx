"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
    } finally {
      setLoading(false);
      router.push("/login");
    }
  }

  return (
    <button
      onClick={handleLogout}
      className={`bg-red-500 hover:bg-red-600 py-1 px-4 rounded-xl text-white  transition-colors duration-300`}
      disabled={loading}
    >
      {loading ? "Logging out…" : "Logout"}
    </button>
  );
}
