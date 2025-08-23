"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import useAuth from "../auth/auth_context";
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
    <Button
      onClick={handleLogout}
      disabled={loading}
      variant="destructive"
      className={clsx(
        "hover:scale-105 transition-all duration-300 bond",
        className,
      )}
    >
      {loading ? "Logging out…" : "Logout"}
    </Button>
  );
}
