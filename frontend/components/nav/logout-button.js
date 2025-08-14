"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import useAuth from "../auth/auth-context";
import clsx from "clsx";

export default function LogoutButton({ className }) {
  const { signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);

    try {
      await signOut();
      router.push("/login");
    } catch {
    } finally {
      setLoading(false);
      router.push("/login");
    }
  }

  return (
    <button
      onClick={handleLogout}
      className={clsx(
        "bg-red-500 hover:bg-red-600 py-1 px-4 rounded-xl text-white transition-colors duration-300 cursor-pointer",
        className,
      )}
      disabled={loading}
    >
      {loading ? "Logging out…" : "Logout"}
    </button>
  );
}
